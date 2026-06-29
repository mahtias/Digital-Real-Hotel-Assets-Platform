// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import "../contracts/HotelYieldVault.sol";
import "../contracts/MockStablecoin.sol";

contract MockKYCRegistry {
    mapping(address => bool) private _verified;

    function setVerified(address user, bool status) external {
        _verified[user] = status;
    }

    function isKYCVerified(address user) external view returns (bool) {
        return _verified[user];
    }
}

contract HotelYieldVaultTest is Test {
    HotelYieldVault vault;
    MockStablecoin stablecoin;
    MockKYCRegistry kycRegistry;

    address admin = address(1);
    address allocator = address(2);
    address investor = address(3);

    bytes32 constant ALLOCATOR_ROLE = keccak256("ALLOCATOR_ROLE");

    function setUp() public {
        // -----------------------
        // Deploy mock stablecoin
        // -----------------------
        stablecoin = new MockStablecoin("Mock USDT", "USDT", 6);

        // -----------------------
        // Deploy mock KYC registry
        // -----------------------
        kycRegistry = new MockKYCRegistry();

        // -----------------------
        // Deploy vault
        // -----------------------
        vault = new HotelYieldVault(address(stablecoin), admin, address(kycRegistry));

        // -----------------------
        // Grant allocator role
        // -----------------------
        vm.prank(admin);

        vault.grantRole(ALLOCATOR_ROLE, allocator);

        // -----------------------
        // Setup funds
        // -----------------------
        stablecoin.transfer(admin, 1_000_000e6);

        vm.startPrank(admin);

        stablecoin.approve(address(vault), type(uint256).max);

        vault.depositYield(1000e6);

        vm.stopPrank();
    }

    function testDepositYield() public view {
        (uint256 deposited,,, uint256 balance) = vault.getVaultStats();

        assertEq(deposited, 1000e6);
        assertEq(balance, 1000e6);
    }

    function testAllocateYield() public {
        bytes32 distributionId = keccak256("DIST-001");

        vm.prank(allocator);

        vault.addClaimable(distributionId, investor, 100e6);

        assertEq(vault.getClaimableYield(investor), 100e6);
    }

    function testClaimYield() public {
        bytes32 distributionId = keccak256("DIST-002");

        kycRegistry.setVerified(investor, true);

        vm.prank(allocator);

        vault.addClaimable(distributionId, investor, 100e6);

        uint256 beforeBal = stablecoin.balanceOf(investor);

        vm.prank(investor);

        vault.claimYield();

        uint256 afterBal = stablecoin.balanceOf(investor);

        assertEq(afterBal - beforeBal, 100e6);
        assertEq(vault.getClaimableYield(investor), 0);
    }

    function testCannotProcessSameDistributionTwice() public {
        bytes32 distributionId = keccak256("DIST-003");

        vm.prank(allocator);

        vault.addClaimable(distributionId, investor, 100e6);

        vm.prank(allocator);

        vm.expectRevert();

        vault.addClaimable(distributionId, investor, 100e6);
    }

    function testPause() public {
        vm.prank(admin);

        vault.pause();

        bytes32 distributionId = keccak256("DIST-004");

        vm.prank(allocator);

        vm.expectRevert();

        vault.addClaimable(distributionId, investor, 100e6);
    }

    function testOnlyAllocatorCanAllocate() public {
        bytes32 distributionId = keccak256("DIST-NO-ROLE");

        vm.expectRevert();

        vault.addClaimable(distributionId, investor, 100e6);
    }

    function testClaimWithoutYield() public {
        vm.prank(investor);

        vm.expectRevert();

        vault.claimYield();
    }

    function testBatchAllocation() public {
        bytes32[] memory ids = new bytes32[](2);

        address[] memory investors = new address[](2);

        uint256[] memory amounts = new uint256[](2);

        ids[0] = keccak256("DIST-A");
        ids[1] = keccak256("DIST-B");

        investors[0] = investor;
        investors[1] = address(4);

        amounts[0] = 100e6;
        amounts[1] = 200e6;

        vm.prank(allocator);

        vault.addClaimableBatch(ids, investors, amounts);

        assertEq(vault.getClaimableYield(investor), 100e6);

        assertEq(vault.getClaimableYield(address(4)), 200e6);
    }

    function testCannotWithdrawAllocatedFunds() public {
        bytes32 distributionId = keccak256("DIST-PROTECT");

        vm.prank(allocator);

        vault.addClaimable(distributionId, investor, 900e6);

        vm.prank(admin);

        vm.expectRevert();

        vault.emergencyWithdraw(200e6);
    }
}
