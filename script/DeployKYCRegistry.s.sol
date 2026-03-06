// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import { KYCRegistry } from "../contracts/KYCRegistry.sol";

contract DeployKYCRegistry is Script {
    function run() external returns (KYCRegistry registry) {
        // Use broadcast() instead of vm.envUint
        vm.startBroadcast();

        address deployer = msg.sender;
        registry = new KYCRegistry(deployer);

        vm.stopBroadcast();

        console.log("KYCRegistry deployed at:", address(registry));
        console.log("Deployed by:", deployer);
    }
}
