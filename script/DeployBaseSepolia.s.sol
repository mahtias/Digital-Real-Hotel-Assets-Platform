// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/KYCRegistry.sol";
import "../contracts/HATToken.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/Investment.sol";

contract DeployBaseSepolia is Script {
    // Base Sepolia USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    address constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        console.log("==========================================");
        console.log("Deploying to Base Sepolia");
        console.log("Deployer:", deployer);
        console.log("Using Real USDC:", BASE_SEPOLIA_USDC);
        console.log("==========================================\n");

        vm.startBroadcast(pk);

        // 1. Deploy KYCRegistry
        console.log("[1/4] Deploying KYCRegistry...");
        KYCRegistry kycRegistry = new KYCRegistry(deployer);
        console.log("  KYCRegistry:", address(kycRegistry));

        // 2. Deploy HATToken
        console.log("\n[2/4] Deploying HATToken...");
        HATToken hatToken = new HATToken();
        console.log("  HATToken:", address(hatToken));

        // 3. Deploy HotelAssetManager
        console.log("\n[3/4] Deploying HotelAssetManager...");
        HotelAssetManager assetManager = new HotelAssetManager(address(hatToken));
        console.log("  HotelAssetManager:", address(assetManager));

        // 4. Deploy Investment
        console.log("\n[4/4] Deploying Investment...");
        Investment investment = new Investment(
            BASE_SEPOLIA_USDC,
            address(kycRegistry),
            address(assetManager),
            deployer // treasury
        );
        console.log("  Investment:", address(investment));

        // 5. Setup: Grant MANAGER_ROLE to AssetManager (for minting HAT tokens)
        console.log("\n[Setup 1/3] Granting MANAGER_ROLE to AssetManager...");
        bytes32 MANAGER_ROLE = hatToken.MANAGER_ROLE();
        hatToken.grantRole(MANAGER_ROLE, address(assetManager));
        console.log("  AssetManager can mint HAT tokens");

        // 6. Setup: Set KYC registry in HATToken
        console.log("\n[Setup 2/3] Setting KYC registry in HATToken...");
        hatToken.setKYCRegistry(address(kycRegistry));
        console.log("   KYC registry connected to HATToken");

        // 7. Setup: Link Investment contract to AssetManager
        // Note: Deployer should have DEFAULT_ADMIN_ROLE from constructor
        console.log("\n[Setup 3/3] Linking Investment to AssetManager...");
        assetManager.setInvestmentContract(address(investment));
        console.log("   Investment contract linked to AssetManager");

        vm.stopBroadcast();

        // Print summary
        console.log("\n==========================================");
        console.log("DEPLOYMENT SUMMARY");
        console.log("==========================================");
        console.log("USDC (Base Sepolia):  ", BASE_SEPOLIA_USDC);
        console.log("KYCRegistry:          ", address(kycRegistry));
        console.log("HATToken:             ", address(hatToken));
        console.log("HotelAssetManager:    ", address(assetManager));
        console.log("Investment:           ", address(investment));
        console.log("Treasury:             ", deployer);
        console.log("==========================================\n");

        // Verify setup
        console.log("SETUP VERIFICATION:");
        console.log("-------------------------------------------");
        bytes32 DEFAULT_ADMIN = assetManager.DEFAULT_ADMIN_ROLE();
        console.log(" Deployer has DEFAULT_ADMIN:  ", assetManager.hasRole(DEFAULT_ADMIN, deployer));
        console.log(" Manager has MANAGER_ROLE:    ", hatToken.hasRole(MANAGER_ROLE, address(assetManager)));
        console.log(" HATToken KYC registry:       ", address(hatToken.kycRegistry()) == address(kycRegistry));
        console.log(" AssetManager investment:     ", assetManager.investmentContract() == address(investment));
        console.log("==========================================\n");

        // Print .env format
        console.log("ADD TO backend/.env FILE:");
        console.log("-------------------------------------------");
        console.log("PRIVATE_KEY=your_private_key_here");
        console.log("RPC_URL=https://sepolia.base.org");
        console.log("USDC_ADDRESS=%s", BASE_SEPOLIA_USDC);
        console.log("KYC_REGISTRY_ADDRESS=%s", address(kycRegistry));
        console.log("HAT_TOKEN_ADDRESS=%s", address(hatToken));
        console.log("HOTEL_ASSET_MANAGER_ADDRESS=%s", address(assetManager));
        console.log("INVESTMENT_ADDRESS=%s", address(investment));
        console.log("TREASURY_ADDRESS=%s", deployer);
        console.log("==========================================\n");

        // Print verification commands
        console.log("BASESCAN VERIFICATION COMMANDS:");
        console.log("-------------------------------------------");

        console.log("\n# 1. KYCRegistry");
        console.log("forge verify-contract %s \\", address(kycRegistry));
        console.log("  contracts/KYCRegistry.sol:KYCRegistry \\");
        console.log("  --chain base-sepolia \\");
        console.log("  --constructor-args $(cast abi-encode \\");
        console.log("    'constructor(address)' %s)", deployer);

        console.log("\n# 2. HATToken");
        console.log("forge verify-contract %s \\", address(hatToken));
        console.log("  contracts/HATToken.sol:HATToken \\");
        console.log("  --chain base-sepolia");

        console.log("\n# 3. HotelAssetManager");
        console.log("forge verify-contract %s \\", address(assetManager));
        console.log("  contracts/HotelAssetManager.sol:HotelAssetManager \\");
        console.log("  --chain base-sepolia \\");
        console.log("  --constructor-args $(cast abi-encode \\");
        console.log("    'constructor(address)' %s)", address(hatToken));

        console.log("\n# 4. Investment");
        console.log("forge verify-contract %s \\", address(investment));
        console.log("  contracts/Investment.sol:Investment \\");
        console.log("  --chain base-sepolia \\");
        console.log("  --constructor-args $(cast abi-encode \\");
        console.log("    'constructor(address,address,address,address)' \\");
        console.log("    %s \\", BASE_SEPOLIA_USDC);
        console.log("    %s \\", address(kycRegistry));
        console.log("    %s \\", address(assetManager));
        console.log("    %s)", deployer);
        console.log("==========================================\n");
    }
}
