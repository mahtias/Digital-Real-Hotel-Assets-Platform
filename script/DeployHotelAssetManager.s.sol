// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/HotelAssetManager.sol";

contract DeployHotelAssetManager is Script {
    function run(address kycRegistry) external returns (HotelAssetManager manager) {
        uint256 key = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(key);

        vm.startBroadcast(key);

        manager = new HotelAssetManager(
            kycRegistry,
            deployer // ✅ pass admin explicitly
        );

        vm.stopBroadcast();

        console.log("HotelAssetManager deployed at:", address(manager));
        console.log("  - KYC Registry:", kycRegistry);
        console.log("  - Admin:", deployer);
    }
}

