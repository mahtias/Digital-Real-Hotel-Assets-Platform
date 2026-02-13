// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/HotelAssetManager.sol";

contract DeployHotelAssetManager is Script {
    //  FIXED: Only needs hatToken (removed kycRegistry)
    function run(address hatToken) external returns (HotelAssetManager manager) {
        uint256 key = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(key);

        //  FIXED: Only pass hatToken
        manager = new HotelAssetManager(hatToken);

        vm.stopBroadcast();

        console.log("HotelAssetManager deployed at:", address(manager));
        console.log("  - HATToken:", hatToken);
    }
}
