// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

import "../contracts/HotelInvestment.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/KYCRegistry.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // =========================
        // 🌐 STABLECOINS
        // =========================
        address usdc = getUSDCAddress();
        address usdt = getUSDTAddress();
        address hkdHSBC = getHSBCAddress();
        address hkdSC = getSCAddress();

        // =========================
        // 📜 KYC
        // =========================
        KYCRegistry kycRegistry = new KYCRegistry(deployer);

        console.log("KYCRegistry:", address(kycRegistry));

        // =========================
        // 🏨 ASSET MANAGER
        // =========================
        HotelAssetManager assetManager = new HotelAssetManager(address(kycRegistry), deployer);

        console.log("AssetManager:", address(assetManager));

        // =========================
        // 🪙 STABLECOIN ARRAY
        // =========================
        address[] memory stablecoins = new address[](4);

        stablecoins[0] = usdc;
        stablecoins[1] = usdt;
        stablecoins[2] = hkdHSBC;
        stablecoins[3] = hkdSC;

        // =========================
        // 💰 INVESTMENT CONTRACT
        // =========================
        HotelInvestment investment = new HotelInvestment(
            address(kycRegistry), address(assetManager), treasury, stablecoins
        );

        console.log("Investment:", address(investment));

        // link
        assetManager.setInvestmentContract(address(investment));

        console.log("Linked successfully");

        vm.stopBroadcast();

        // =========================
        // SUMMARY
        // =========================
        console.log("\n=== DEPLOYMENT ===");
        console.log("Deployer:", deployer);
        console.log("Treasury:", treasury);

        console.log("\nStablecoins:");
        console.log("USDC:", usdc);
        console.log("USDT:", usdt);
        console.log("HSBC HKD:", hkdHSBC);
        console.log("SC HKD:", hkdSC);

        console.log("\nContracts:");
        console.log("KYC:", address(kycRegistry));
        console.log("Asset:", address(assetManager));
        console.log("Investment:", address(investment));
        console.log("==================");
    }

    // =========================
    // 🪙 REAL USDC (Base)
    // =========================
    function getUSDCAddress() internal view returns (address) {
        if (block.chainid == 8453) {
            return 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC
        } else if (block.chainid == 84532) {
            return 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // Base Sepolia USDC
        }
        revert("Unsupported network");
    }

    // =========================
    // 🪙 USDT (TEMP MOCK)
    // =========================
    function getUSDTAddress() internal pure returns (address) {
        return 0x029dEe78786039Ad6153772ba8c9493E9858c050;
    }

    // =========================
    // 🏦 HSBC HKD MOCK
    // =========================
    function getHSBCAddress() internal pure returns (address) {
        return 0xFD9c50987ccCa1D141bE0b75105fefBAD8fF44c1;
    }

    // =========================
    // 🏦 SC HKD MOCK
    // =========================
    function getSCAddress() internal pure returns (address) {
        return 0xDd0446b25C837A6647066657f60a71153D09E5E7;
    }
}
