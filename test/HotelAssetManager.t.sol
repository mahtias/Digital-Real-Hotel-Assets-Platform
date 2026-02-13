// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../contracts/HotelAssetManager.sol";
import "../contracts/HATToken.sol";
import "../contracts/KYCRegistry.sol";

contract HotelAssetManagerTest is Test {
    HotelAssetManager manager;
    HATToken hat;
    KYCRegistry kyc;

    address admin = address(this);
    address verifier = address(0x1);
    address operator = address(0x2);
    address investment = address(0x3);
    address investor = address(0x4);
    address propertyOwner = address(0x5);

    uint256 constant HOTEL_ID = 1;

    function setUp() public {
        // ───────────────────────────────
        // Deploy contracts
        // ───────────────────────────────
        hat = new HATToken();
        kyc = new KYCRegistry(verifier);
        manager = new HotelAssetManager(address(hat));

        // ✅ Grant MANAGER_ROLE to HotelAssetManager
        hat.grantRole(hat.MANAGER_ROLE(), address(manager));

        // Set KYC registry in HATToken
        hat.setKYCRegistry(address(kyc));

        // ✅ ERC1155 approval for investor
        vm.prank(investor);
        hat.setApprovalForAll(address(manager), true);

        // ✅ Grant ASSET_MANAGER_ROLE to operator and investment
        manager.grantRole(manager.ASSET_MANAGER_ROLE(), operator);
        manager.grantRole(manager.ASSET_MANAGER_ROLE(), investment);

        // Set Investment contract
        manager.setInvestmentContract(investment);

        // ✅ Setup KYC for investor
        vm.prank(investor);
        kyc.submitKYC(KYCRegistry.KYCLevel.ADVANCED, keccak256("investor-doc"));

        vm.prank(verifier);
        kyc.approveKYC(investor, 365 days);

        // ───────────────────────────────
        // List & verify a hotel
        // ───────────────────────────────
        vm.prank(operator);
        manager.listHotel(
            "Test Hotel",
            "Tokyo",
            "ipfs://image",
            propertyOwner,
            1_000 ether, // totalShares (scaled)
            1e6, // pricePerShare (USDC 6 decimals)
            100e6, // minimumInvestment
            7 days // fundingDuration
        );

        vm.prank(operator);
        manager.verifyHotel(HOTEL_ID);
    }

    /*//////////////////////////////////////////////////////////////
                                DEPLOYMENT
    //////////////////////////////////////////////////////////////*/

    function test_constructor_sets_roles() public view {
        assertTrue(manager.hasRole(manager.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(manager.hasRole(manager.ASSET_MANAGER_ROLE(), operator));
        assertTrue(manager.hasRole(manager.ASSET_MANAGER_ROLE(), investment));
    }

    function test_hat_token_roles() public view {
        assertTrue(hat.hasRole(hat.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(hat.hasRole(hat.MANAGER_ROLE(), address(manager)));
    }

    /*//////////////////////////////////////////////////////////////
                                HOTEL STATE
    //////////////////////////////////////////////////////////////*/

    function test_hotel_is_fundraising_after_verification() public view {
        (,,,,,,,,, HotelAssetManager.HotelStatus status, bool verified) = manager.hotels(HOTEL_ID);

        assertTrue(verified);
        assertEq(uint256(status), uint256(HotelAssetManager.HotelStatus.Fundraising));
    }

    function test_isHotelAvailable() public view {
        bool available = manager.isHotelAvailable(HOTEL_ID);
        assertTrue(available);
    }

    function test_hotel_metadata_set_correctly() public view {
        (
            string memory name,
            string memory location,,
            address owner,
            uint256 totalShares,
            uint256 availableShares,
            uint256 pricePerShare,
            uint256 minInvestment,,
            HotelAssetManager.HotelStatus status,
            bool verified
        ) = manager.hotels(HOTEL_ID);

        assertEq(name, "Test Hotel");
        assertEq(location, "Tokyo");
        assertEq(owner, propertyOwner);
        assertEq(totalShares, 1_000 ether);
        assertEq(availableShares, 1_000 ether);
        assertEq(pricePerShare, 1e6);
        assertEq(minInvestment, 100e6);
        assertTrue(verified);
        assertEq(uint256(status), uint256(HotelAssetManager.HotelStatus.Fundraising));
    }

    /*//////////////////////////////////////////////////////////////
                            MINT SHARES
    //////////////////////////////////////////////////////////////*/

    function test_only_investment_can_mint() public {
        vm.expectRevert(HotelAssetManager.NotInvestment.selector);
        manager.mintShares(HOTEL_ID, investor, 100 ether, 100e6);
    }

    function test_mintShares_success() public {
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 200 ether, 200e6);

        // Check investor shares
        uint256 shares = manager.investorShares(HOTEL_ID, investor);
        assertEq(shares, 200 ether);

        // Check HAT token balance
        uint256 hatBalance = hat.balanceOf(investor, HOTEL_ID);
        assertEq(hatBalance, 200 ether);
    }

    function test_mintShares_reduces_available_shares() public {
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 200 ether, 200e6);

        (,,,,, uint256 available,,,,,) = manager.hotels(HOTEL_ID);
        assertEq(available, 800 ether);
    }

    function test_investor_share_balance_updated() public {
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 150 ether, 150e6);

        uint256 shares = manager.investorShares(HOTEL_ID, investor);
        assertEq(shares, 150 ether);
    }

    function test_revert_mint_exceeds_available() public {
        vm.prank(investment);
        vm.expectRevert(HotelAssetManager.InsufficientShares.selector);
        manager.mintShares(HOTEL_ID, investor, 1_001 ether, 1_001e6);
    }

    function test_revert_mint_below_minimum() public {
        vm.prank(investment);
        vm.expectRevert(HotelAssetManager.InvestmentTooSmall.selector);
        manager.mintShares(HOTEL_ID, investor, 50 ether, 50e6);
    }

    /*//////////////////////////////////////////////////////////////
                        FUNDING DEADLINE
    //////////////////////////////////////////////////////////////*/

    function test_funding_closes_after_deadline() public {
        vm.warp(block.timestamp + 8 days);

        vm.prank(investment);
        vm.expectRevert(HotelAssetManager.FundingClosed.selector);
        manager.mintShares(HOTEL_ID, investor, 100 ether, 100e6);
    }

    function test_funding_works_before_deadline() public {
        vm.warp(block.timestamp + 6 days);

        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 100 ether, 100e6);

        uint256 shares = manager.investorShares(HOTEL_ID, investor);
        assertEq(shares, 100 ether);
    }

    /*//////////////////////////////////////////////////////////////
                        REVENUE DISTRIBUTION
    //////////////////////////////////////////////////////////////*/

    function test_revenue_distribution_and_claimable() public {
        // Investor buys 200 / 1000 shares (20%)
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 200 ether, 200e6);

        // Operator distributes 1,000 ETH revenue
        vm.prank(operator);
        manager.distributeRevenue(HOTEL_ID, 1_000 ether);

        uint256 claimable = manager.claimableRevenue(HOTEL_ID, investor);

        // 20% of 1,000 ETH = 200 ETH
        assertEq(claimable, 200 ether);
    }

    function test_markRevenueClaimed_reduces_claimable() public {
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 100 ether, 100e6);

        vm.prank(operator);
        manager.distributeRevenue(HOTEL_ID, 1_000 ether);

        // Claim 50 ETH
        vm.prank(investment);
        manager.markRevenueClaimed(HOTEL_ID, investor, 50 ether);

        uint256 remaining = manager.claimableRevenue(HOTEL_ID, investor);

        // Should have 50 ETH remaining (100 - 50)
        assertEq(remaining, 50 ether);
    }

    function test_multiple_revenue_distributions() public {
        // Investor owns 30% of shares
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 300 ether, 300e6);

        // First distribution: 1000 ETH
        vm.prank(operator);
        manager.distributeRevenue(HOTEL_ID, 1_000 ether);

        uint256 claimable1 = manager.claimableRevenue(HOTEL_ID, investor);
        assertEq(claimable1, 300 ether); // 30% of 1000

        // Claim half
        vm.prank(investment);
        manager.markRevenueClaimed(HOTEL_ID, investor, 150 ether);

        // Second distribution: 500 ETH
        vm.prank(operator);
        manager.distributeRevenue(HOTEL_ID, 500 ether);

        uint256 claimable2 = manager.claimableRevenue(HOTEL_ID, investor);
        // Remaining 150 + 30% of 500 = 150 + 150 = 300
        assertEq(claimable2, 300 ether);
    }

    function test_revert_claim_more_than_available() public {
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 100 ether, 100e6);

        vm.prank(operator);
        manager.distributeRevenue(HOTEL_ID, 1_000 ether);

        // Try to claim more than available
        vm.prank(investment);
        vm.expectRevert(HotelAssetManager.InsufficientRevenue.selector);
        manager.markRevenueClaimed(HOTEL_ID, investor, 200 ether);
    }

    /*//////////////////////////////////////////////////////////////
                        PREVIEW SHARES
    //////////////////////////////////////////////////////////////*/

    function test_previewShares_correct_calculation() public view {
        // 250 USDC should equal 250 shares (1:1 ratio at 1e6 price)
        uint256 shares = manager.previewShares(HOTEL_ID, 250e6);
        assertEq(shares, 250 ether);
    }

    function test_previewShares_different_amounts() public view {
        assertEq(manager.previewShares(HOTEL_ID, 100e6), 100 ether);
        assertEq(manager.previewShares(HOTEL_ID, 500e6), 500 ether);
        assertEq(manager.previewShares(HOTEL_ID, 1000e6), 1000 ether);
    }

    /*//////////////////////////////////////////////////////////////
                        EDGE CASES
    //////////////////////////////////////////////////////////////*/

    function test_full_subscription() public {
        // Buy all 1000 shares
        vm.prank(investment);
        manager.mintShares(HOTEL_ID, investor, 1_000 ether, 1_000e6);

        (,,,,, uint256 available,,,,,) = manager.hotels(HOTEL_ID);
        assertEq(available, 0);

        // Hotel should no longer be available
        bool isAvailable = manager.isHotelAvailable(HOTEL_ID);
        assertFalse(isAvailable);
    }
}
