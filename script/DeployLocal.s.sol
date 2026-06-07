// script/DeployLocal.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelInvestment.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/KYCRegistry.sol";
import "../contracts/interfaces/IKYCRegistry.sol";
import "../test/MockUSDC.sol";

contract DeployLocalScript is Script {
    function run() external {
        address deployer = msg.sender;
        address treasury = makeAddr("treasury");

        vm.startBroadcast();

        // Deploy MockUSDC for local testing
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed:", address(usdc));

        // Deploy KYCRegistry with deployer as admin
        KYCRegistry kycRegistry = new KYCRegistry(deployer);
        console.log("KYCRegistry deployed:", address(kycRegistry));

        // Deploy HotelAssetManager
        HotelAssetManager assetManager = new HotelAssetManager(address(kycRegistry), deployer);
        console.log("HotelAssetManager deployed:", address(assetManager));

        // Deploy HotelInvestment
        // ========================================
        // 💰 INITIAL STABLECOINS
        // ========================================
        address[] memory initialStablecoins = new address[](1);

        // Local testing only uses MockUSDC
        initialStablecoins[0] = address(usdc);

        // ========================================
        // 🏦 HOTEL INVESTMENT
        // ========================================
        HotelInvestment hotelInvestment = new HotelInvestment(
            address(kycRegistry), address(assetManager), treasury, initialStablecoins
        );
        console.log("HotelInvestment deployed:", address(hotelInvestment));

        // Set investment contract
        assetManager.setInvestmentContract(address(hotelInvestment));
        console.log("Investment contract set in AssetManager");

        vm.stopBroadcast();

        // Setup test users with KYC
        address testUser1 = makeAddr("testUser1");
        address testUser2 = makeAddr("testUser2");

        console.log("\n=== Setting up Test Users ===");

        // Mint USDC to test users
        vm.startPrank(deployer);
        usdc.mint(testUser1, 100_000 * 10 ** 6); // 100k USDC
        usdc.mint(testUser2, 50_000 * 10 ** 6); // 50k USDC
        vm.stopPrank();

        console.log("Test User 1:", testUser1);
        console.log("  - USDC Balance:", usdc.balanceOf(testUser1) / 10 ** 6);

        console.log("Test User 2:", testUser2);
        console.log("  - USDC Balance:", usdc.balanceOf(testUser2) / 10 ** 6);

        // Submit KYC for users
        vm.startPrank(testUser1);
        kycRegistry.submitKYC(IKYCRegistry.KYCLevel.ADVANCED, keccak256("user1-docs"));
        vm.stopPrank();

        vm.startPrank(testUser2);
        kycRegistry.submitKYC(IKYCRegistry.KYCLevel.BASIC, keccak256("user2-docs"));
        vm.stopPrank();

        console.log("\n=== KYC Submissions ===");
        console.log("User 1 submitted ADVANCED KYC");
        console.log("User 2 submitted BASIC KYC");

        // Approve KYC (admin approves with level + duration)
        uint256 validityDuration = 365 days; // 1 year validity

        vm.startPrank(deployer);

        // ✅ UPDATED: Now passes both level and duration
        // User 1: Requested ADVANCED, Admin approves as ADVANCED for 1 year
        kycRegistry.approveKYC(
            testUser1,
            IKYCRegistry.KYCLevel.ADVANCED, // ✅ Admin confirms ADVANCED
            validityDuration
        );

        // User 2: Requested BASIC, Admin approves as BASIC for 6 months
        kycRegistry.approveKYC(
            testUser2,
            IKYCRegistry.KYCLevel.BASIC, // ✅ Admin confirms BASIC
            180 days // ✅ Shorter duration for BASIC
        );

        vm.stopPrank();

        console.log("\n=== KYC Approvals ===");
        console.log("User 1 KYC:");
        console.log("  - Level: ADVANCED");
        console.log("  - Valid Until:", block.timestamp + validityDuration);

        console.log("User 2 KYC:");
        console.log("  - Level: BASIC");
        console.log("  - Valid Until:", block.timestamp + 180 days);

        // Deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Deployer:", deployer);
        console.log("Treasury:", treasury);
        console.log("\nContracts:");
        console.log("  MockUSDC:", address(usdc));
        console.log("  KYCRegistry:", address(kycRegistry));
        console.log("  HotelAssetManager:", address(assetManager));
        console.log("  HotelInvestment:", address(hotelInvestment));
        console.log("========================\n");
    }
}
