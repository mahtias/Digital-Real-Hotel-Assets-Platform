// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

import "../contracts/KYCRegistry.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/HotelInvestment.sol";

contract DeployFullSystem is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");

        vm.startBroadcast(pk);

        // 1. KYC
        KYCRegistry kyc = new KYCRegistry(msg.sender);

        // 2. Asset Manager
        HotelAssetManager manager = new HotelAssetManager(address(kyc), msg.sender);

        // 3. Stablecoins (REAL MOCKS)
        address[] memory stablecoins = new address[](4);

        stablecoins[0] = vm.envAddress("USDC");
        stablecoins[1] = vm.envAddress("USDT");
        stablecoins[2] = vm.envAddress("HKD_HSBC");
        stablecoins[3] = vm.envAddress("HKD_SC");

        // 4. Investment
        HotelInvestment invest =
            new HotelInvestment(address(kyc), address(manager), treasury, stablecoins);

        // link
        manager.setInvestmentContract(address(invest));

        vm.stopBroadcast();

        console.log("KYC:", address(kyc));
        console.log("Manager:", address(manager));
        console.log("Investment:", address(invest));
    }
}
