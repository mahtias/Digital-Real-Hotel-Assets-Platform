// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelInvestment.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/HotelAssetToken.sol";
import "../contracts/KYCRegistry.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Get real USDC address based on network
        address usdcAddress = getUSDCAddress();

        // Deploy KYCRegistry with deployer as initial admin
        KYCRegistry kycRegistry = new KYCRegistry(deployer);
        console.log("KYCRegistry deployed:", address(kycRegistry));
        console.log("KYC Admin:", deployer);

        //  FIXED: Use deployer instead of address(this)
        HotelAssetManager assetManager = new HotelAssetManager(address(kycRegistry), deployer);
        console.log("HotelAssetManager deployed:", address(assetManager));

        // Deploy HotelInvestment
        HotelInvestment hotelInvestment = new HotelInvestment(
            usdcAddress, address(kycRegistry), address(assetManager), treasury
        );
        console.log("HotelInvestment deployed:", address(hotelInvestment));

        // Set investment contract in asset manager
        assetManager.setInvestmentContract(address(hotelInvestment));
        console.log("Investment contract set in AssetManager");

        vm.stopBroadcast();

        // Summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network Chain ID:", block.chainid);
        console.log("Deployer:", deployer);
        console.log("Treasury:", treasury);
        console.log("USDC:", usdcAddress);
        console.log("\nContracts:");
        console.log("  KYCRegistry:", address(kycRegistry));
        console.log("  HotelAssetManager:", address(assetManager));
        console.log("  HotelInvestment:", address(hotelInvestment));
        console.log("========================\n");

        // Security reminders
        console.log("NEXT STEPS:");
        console.log("1. Verify contracts on Basescan");
        console.log("2. Transfer ownership if needed");
        console.log("3. Set up additional KYC managers");
        console.log("4. Configure revenue distribution");
    }

    function getUSDCAddress() internal view returns (address) {
        // Base Mainnet
        if (block.chainid == 8453) {
            return 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        }
        // Base Sepolia
        else if (block.chainid == 84532) {
            return 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
        }
        // Localhost/Anvil - revert with message
        else {
            revert(
                "Unsupported network for production USDC. Use DeployLocal.s.sol for local testing."
            );
        }
    }
}
