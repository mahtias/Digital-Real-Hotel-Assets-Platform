// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/HotelInvestment.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/HotelAssetToken.sol";
import "../contracts/KYCRegistry.sol";
import "./MockUSDC.sol";

contract HotelInvestmentTest is Test {
    HotelInvestment public investment;
    HotelAssetManager public manager;
    KYCRegistry public kycRegistry;
    MockUSDC public usdc;
    HotelAssetToken public hotelToken;

    address public owner;
    address public assetManager;
    address public backendVerifier;
    address public investor;
    address public propertyOwner;
    address public treasury;

    uint256 public hotelId;
    address public tokenAddress;

    string constant HOTEL_ID = "test-hotel-456";
    uint256 constant TOTAL_SHARES = 1000e18;
    uint256 constant PRICE_PER_SHARE = 100e6;
    uint256 constant MIN_INVESTMENT = 100e6;
    uint256 constant FUNDING_DURATION = 30 days;

    function setUp() public {
        owner = makeAddr("owner");
        assetManager = makeAddr("assetManager");
        backendVerifier = makeAddr("backendVerifier");
        investor = makeAddr("investor");
        propertyOwner = makeAddr("propertyOwner");
        treasury = makeAddr("treasury");

        kycRegistry = new KYCRegistry(backendVerifier);
        usdc = new MockUSDC();

        vm.prank(owner);
        manager = new HotelAssetManager(address(kycRegistry), owner);

        investment =
            new HotelInvestment(address(usdc), address(kycRegistry), address(manager), treasury);

        // ✅ Get role hash BEFORE prank
        bytes32 assetManagerRole = manager.ASSET_MANAGER_ROLE();

        // ✅ Now prank and grant
        vm.prank(owner);
        manager.grantRole(assetManagerRole, assetManager);

        // Rest of setup...
        vm.prank(owner);
        manager.setInvestmentContract(address(investment));

        _setupKYC(propertyOwner, IKYCRegistry.KYCLevel.ADVANCED);
        _setupKYC(investor, IKYCRegistry.KYCLevel.BASIC);

        usdc.mint(investor, 10_000e6);

        vm.prank(assetManager);
        (hotelId, tokenAddress) = manager.listHotel(
            HOTEL_ID,
            "Test Hotel",
            "Test City",
            "ipfs://test",
            "TEST",
            propertyOwner,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            MIN_INVESTMENT,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );

        hotelToken = HotelAssetToken(tokenAddress);

        bytes32 minterRole = hotelToken.MINTER_ROLE();

        vm.prank(owner);
        manager.grantTokenRole(HOTEL_ID, minterRole, address(investment));

        vm.prank(assetManager);
        manager.verifyHotel(hotelId);
    }

    function _setupKYC(address user, IKYCRegistry.KYCLevel level) internal {
        vm.prank(user);
        kycRegistry.submitKYC(level, keccak256(abi.encodePacked(user)));

        vm.prank(backendVerifier);
        kycRegistry.approveKYC(
            user,
            level, // ✅ ADD THIS: Pass the level parameter
            365 days
        );
    }

    function test_invest_success() public {
        uint256 investAmount = 1000e6;

        vm.startPrank(investor);
        usdc.approve(address(investment), investAmount);
        uint256 sharesMinted = investment.invest(hotelId, investAmount);
        vm.stopPrank();

        assertGt(sharesMinted, 0);
        assertEq(hotelToken.balanceOf(investor), sharesMinted);
    }

    function test_invest_fails_below_minimum() public {
        uint256 tooSmall = 50e6;

        vm.startPrank(investor);
        usdc.approve(address(investment), tooSmall);

        // ✅ FIX: Expect custom error instead of string
        vm.expectRevert(abi.encodeWithSignature("InvestmentTooSmall()"));
        investment.invest(hotelId, tooSmall);
        vm.stopPrank();
    }

    function test_invest_fails_without_kyc() public {
        address nonKycUser = makeAddr("nonKycUser");
        usdc.mint(nonKycUser, 1000e6);

        vm.startPrank(nonKycUser);
        usdc.approve(address(investment), 1000e6);

        // ✅ FIX: Expect custom error instead of string
        vm.expectRevert(abi.encodeWithSignature("NotKYCApproved()"));
        investment.invest(hotelId, 1000e6);
        vm.stopPrank();
    }

    function test_get_investment_stats() public {
        uint256 investAmount = 1000e6; // 1000 USDC

        vm.startPrank(investor);
        usdc.approve(address(investment), investAmount);
        investment.invest(hotelId, investAmount);
        vm.stopPrank();

        // ✅ FIX: Pass the INVESTOR address, not tokenAddress!
        (uint256 totalInvested, uint256 totalShares, uint256 investmentCount) =
            investment.getInvestmentStats(investor); // ← investor address!

        // Verify the stats
        assertEq(totalInvested, investAmount, "Total invested should be 1000 USDC");
        assertGt(totalShares, 0, "Should have shares");
        assertEq(investmentCount, 1, "Should have 1 investment");
    }

    function test_withdraw_fees() public {
        uint256 investAmount = 1000e6;

        vm.startPrank(investor);
        usdc.approve(address(investment), investAmount);
        investment.invest(hotelId, investAmount);
        vm.stopPrank();

        uint256 treasuryBalanceBefore = usdc.balanceOf(treasury);
        investment.withdrawFees();
        uint256 treasuryBalanceAfter = usdc.balanceOf(treasury);

        assertGt(treasuryBalanceAfter, treasuryBalanceBefore);
    }
}
