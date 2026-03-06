// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelAssetManager.sol";

contract CheckRoleScript is Script {
    function run() external view {
        address deployerAddress = vm.addr(vm.envUint("PRIVATE_KEY"));
        address managerAddress = vm.envAddress("HOTEL_ASSET_MANAGER_ADDRESS");

        HotelAssetManager manager = HotelAssetManager(managerAddress);
        bytes32 ASSET_MANAGER_ROLE = manager.ASSET_MANAGER_ROLE();

        bool hasRole = manager.hasRole(ASSET_MANAGER_ROLE, deployerAddress);

        console.log("=== Role Check ===");
        console.log("Your Address:", deployerAddress);
        console.log("Has ASSET_MANAGER_ROLE:", hasRole);

        if (hasRole) {
            console.log("\n You can skip GrantRole script!");
            console.log(" Go directly to RegisterHotels script");
        } else {
            console.log("\n You need to run GrantRole script first");
        }
    }
}
