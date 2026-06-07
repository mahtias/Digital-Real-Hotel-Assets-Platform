// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "../contracts/HotelInvestment.sol";

contract DeployInvestment is Script {
    function run(address kycRegistry, address assetManager, address treasury)
        external
        returns (HotelInvestment investment)
    {
        uint256 key = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(key);

        // =========================
        // 💰 Stablecoins (ALL SUPPORTED TOKENS)
        // =========================
        address[] memory stablecoins = new address[](4);

        stablecoins[0] = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // USDC
        stablecoins[1] = 0x029dEe78786039Ad6153772ba8c9493E9858c050; // USDT
        stablecoins[2] = 0xFD9c50987ccCa1D141bE0b75105fefBAD8fF44c1; // HSBC HKD
        stablecoins[3] = 0xDd0446b25C837A6647066657f60a71153D09E5E7; // SC HKD

        // =========================
        // 💰 Deploy Investment Contract
        // =========================
        investment = new HotelInvestment(kycRegistry, assetManager, treasury, stablecoins);

        vm.stopBroadcast();

        // =========================
        // LOGS
        // =========================
        console.log("=== HOTEL INVESTMENT DEPLOYED ===");
        console.log("Address:", address(investment));

        console.log("\nDependencies:");
        console.log("KYCRegistry:", kycRegistry);
        console.log("AssetManager:", assetManager);
        console.log("Treasury:", treasury);

        console.log("\nStablecoins:");
        console.log("USDC:", stablecoins[0]);
        console.log("USDT:", stablecoins[1]);
        console.log("HSBC HKD:", stablecoins[2]);
        console.log("SC HKD:", stablecoins[3]);

        console.log("==================================");

        return investment;
    }
}
