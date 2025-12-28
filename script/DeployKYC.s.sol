// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Script.sol";
import {KYCRegistry} from  "../contracts/KYCRegistry.sol";

contract DeployKYC is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy with backend verifier address passed to constructor
        KYCRegistry registry = new KYCRegistry(
         0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
);
    console.log("Deployed KYCRegistry at:", address(registry));
        vm.stopBroadcast();
    }
}
