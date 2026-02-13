// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../contracts/Investment.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/HATToken.sol";
import "../contracts/KYCRegistry.sol";

/*//////////////////////////////////////////////////////////////
                        MOCK USDC
//////////////////////////////////////////////////////////////*/
contract MockUSDC is Test {
    string public constant name = "Mock USDC";
    string public constant symbol = "USDC";
    uint8 public constant decimals = 6;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] -= amount;
        }
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

/*//////////////////////////////////////////////////////////////
                    INVESTMENT TEST
//////////////////////////////////////////////////////////////*/
contract InvestmentTest is Test {
    Investment investment;
    HotelAssetManager manager;
    HATToken hat;
    KYCRegistry kyc;
    MockUSDC usdc;

    address admin = address(this);
    address verifier = address(0x1);
    address operator = address(0x2);
    address treasury = address(0x3);
    address investor = address(0x4);
    address propertyOwner = address(0x5);
    address otherInvestor = address(0x6);

    uint256 constant HOTEL_ID = 1;

    function setUp() public {
        // ─────────────────────────────
        // Deploy base contracts
        // ─────────────────────────────
        usdc = new MockUSDC();
        hat = new HATToken();
        kyc = new KYCRegistry(verifier);
        manager = new HotelAssetManager(address(hat));

        //  Grant MANAGER_ROLE to HotelAssetManager (instead of transferOwnership)
        hat.grantRole(hat.MANAGER_ROLE(), address(manager));

        // Set KYC registry in HATToken
        hat.setKYCRegistry(address(kyc));

        // Deploy Investment
        investment = new Investment(address(usdc), address(kyc), address(manager), treasury);

        //  Grant ASSET_MANAGER_ROLE to Investment contract
        manager.grantRole(manager.ASSET_MANAGER_ROLE(), address(investment));

        //  Grant ASSET_MANAGER_ROLE to operator
        manager.grantRole(manager.ASSET_MANAGER_ROLE(), operator);

        //  Fund the test contract with ETH for revenue distribution
        vm.deal(address(this), 100 ether);

        // Wire Investment ↔ Manager
        manager.setInvestmentContract(address(investment));

        // ─────────────────────────────
        // List & verify hotel
        // ─────────────────────────────
        vm.prank(operator);
        manager.listHotel(
            "Test Hotel",
            "Tokyo",
            "ipfs://image",
            propertyOwner,
            1_000 ether, // total shares (scaled)
            1e6, // price per share (1 USDC)
            100e6, // minimum investment
            7 days
        );

        vm.prank(operator);
        manager.verifyHotel(HOTEL_ID);

        // ─────────────────────────────
        // Prepare investor
        // ─────────────────────────────
        usdc.mint(investor, 1_000e6);

        vm.prank(investor);
        usdc.approve(address(investment), type(uint256).max);

        vm.prank(investor);
        hat.setApprovalForAll(address(investment), true);

        // KYC submit & approve
        vm.prank(investor);
        kyc.submitKYC(KYCRegistry.KYCLevel.ADVANCED, keccak256("investor-doc"));

        vm.prank(verifier);
        kyc.approveKYC(investor, 365 days);

        // ─────────────────────────────
        // Prepare other investor
        // ─────────────────────────────
        usdc.mint(otherInvestor, 1_000e6);

        vm.prank(otherInvestor);
        usdc.approve(address(investment), type(uint256).max);

        vm.prank(otherInvestor);
        hat.setApprovalForAll(address(investment), true);

        vm.prank(otherInvestor);
        kyc.submitKYC(KYCRegistry.KYCLevel.ADVANCED, keccak256("other-investor-doc"));

        vm.prank(verifier);
        kyc.approveKYC(otherInvestor, 365 days);
    }

    /*//////////////////////////////////////////////////////////////
                            INVEST
    //////////////////////////////////////////////////////////////*/

    function test_invest_success() public {
        vm.prank(investor);
        uint256 shares = investment.invest(HOTEL_ID, 500e6);

        // Shares should equal 500 shares (18 decimals)
        assertEq(shares, 500 ether);

        // Investor shares tracked in manager
        uint256 recorded = manager.investorShares(HOTEL_ID, investor);
        assertEq(recorded, 500 ether);

        // Investor should have HAT tokens
        uint256 hatBalance = hat.balanceOf(investor, HOTEL_ID);
        assertEq(hatBalance, 500 ether);
    }

    function test_platform_fee_collected() public {
        vm.prank(investor);
        investment.invest(HOTEL_ID, 500e6);

        // 2% of 500 USDC = 10 USDC
        assertEq(usdc.balanceOf(treasury), 10e6);
        assertEq(investment.totalPlatformFees(), 10e6);
    }

    function test_user_investment_recorded() public {
        vm.prank(investor);
        investment.invest(HOTEL_ID, 200e6);

        (uint256 hotelId, uint256 usdcAmount, uint256 shares, uint256 timestamp) =
            investment.userInvestments(investor, 0);

        assertEq(hotelId, HOTEL_ID);
        assertEq(usdcAmount, 200e6);
        assertEq(shares, 200 ether);
        assertGt(timestamp, 0);
    }

    /*//////////////////////////////////////////////////////////////
                        KYC GUARD
    //////////////////////////////////////////////////////////////*/

    function test_revert_if_not_kyc() public {
        address badUser = address(0x99);
        usdc.mint(badUser, 100e6);

        vm.prank(badUser);
        usdc.approve(address(investment), 100e6);

        vm.prank(badUser);
        vm.expectRevert("KYC not approved");
        investment.invest(HOTEL_ID, 100e6);
    }

    /*//////////////////////////////////////////////////////////////
                        REVENUE FLOW
    //////////////////////////////////////////////////////////////*/

    function test_withdraw_revenue() public {
        // Invest
        vm.prank(investor);
        investment.invest(HOTEL_ID, 500e6);

        //  Distribute revenue in ETH
        investment.receiveRevenue{value: 10 ether}(HOTEL_ID);

        // Check claimable amount
        uint256 claimable = manager.claimableRevenue(HOTEL_ID, investor);
        assertGt(claimable, 0);

        // Withdraw
        uint256 balanceBefore = investor.balance;

        vm.prank(investor);
        investment.withdrawRevenue(HOTEL_ID);

        uint256 balanceAfter = investor.balance;

        //  Check ETH balance increased
        assertEq(balanceAfter, balanceBefore + claimable);
    }

    function test_multiple_investors_revenue_distribution() public {
        // Investor 1 buys 500 shares
        vm.prank(investor);
        investment.invest(HOTEL_ID, 500e6);

        // Investor 2 buys 300 shares
        vm.prank(otherInvestor);
        investment.invest(HOTEL_ID, 300e6);

        // Distribute 10 ETH revenue
        investment.receiveRevenue{value: 10 ether}(HOTEL_ID);

        //  With fees (assuming 5% platform + 15% property owner = 20% total fees)
        // Total revenue: 10 ETH
        // Fees taken: 2 ETH (20%)
        // Investor pool: 8 ETH (80%)

        // Investor 1: 8 ETH * 62.5% = 5 ETH
        // Investor 2: 8 ETH * 37.5% = 3 ETH

        uint256 investorPool = 8 ether; // 80% after fees
        uint256 expectedInvestor1 = (investorPool * 625) / 1000; // 62.5% = 5 ETH
        uint256 expectedInvestor2 = (investorPool * 375) / 1000; // 37.5% = 3 ETH

        uint256 claimable1 = manager.claimableRevenue(HOTEL_ID, investor);
        uint256 claimable2 = manager.claimableRevenue(HOTEL_ID, otherInvestor);

        assertEq(claimable1, expectedInvestor1, "Investor 1 claimable incorrect");
        assertEq(claimable2, expectedInvestor2, "Investor 2 claimable incorrect");

        // Withdraw for investor 1
        uint256 balanceBefore1 = investor.balance;
        vm.prank(investor);
        investment.withdrawRevenue(HOTEL_ID);

        assertEq(investor.balance, balanceBefore1 + expectedInvestor1);

        // Withdraw for investor 2
        uint256 balanceBefore2 = otherInvestor.balance;
        vm.prank(otherInvestor);
        investment.withdrawRevenue(HOTEL_ID);

        assertEq(otherInvestor.balance, balanceBefore2 + expectedInvestor2);
    }

    function test_revert_withdraw_zero_revenue() public {
        vm.prank(investor);
        investment.invest(HOTEL_ID, 500e6);

        // Try to withdraw without revenue
        vm.prank(investor);
        vm.expectRevert("No revenue");
        investment.withdrawRevenue(HOTEL_ID);
    }

    /*//////////////////////////////////////////////////////////////
                        EDGE CASES
    //////////////////////////////////////////////////////////////*/

    function test_revert_invest_zero_amount() public {
        vm.prank(investor);
        vm.expectRevert(abi.encodeWithSignature("InvalidAmount()"));
        investment.invest(HOTEL_ID, 0);
    }

    function test_revert_invest_below_minimum() public {
        vm.prank(investor);
        vm.expectRevert(); // Will revert in HotelAssetManager
        investment.invest(HOTEL_ID, 50e6); // Min is 100 USDC
    }

    /*//////////////////////////////////////////////////////////////
                        HELPER VIEWS
    //////////////////////////////////////////////////////////////*/

    function test_preview_shares() public view {
        uint256 shares = manager.previewShares(HOTEL_ID, 250e6);
        assertEq(shares, 250 ether);
    }

    function test_role_setup() public view {
        // Verify HATToken roles
        assertTrue(hat.hasRole(hat.DEFAULT_ADMIN_ROLE(), address(this)));
        assertTrue(hat.hasRole(hat.MANAGER_ROLE(), address(manager)));

        // Verify HotelAssetManager roles
        assertTrue(manager.hasRole(manager.DEFAULT_ADMIN_ROLE(), address(this)));
        assertTrue(manager.hasRole(manager.ASSET_MANAGER_ROLE(), address(investment)));
        assertTrue(manager.hasRole(manager.ASSET_MANAGER_ROLE(), operator));
    }
}
