// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/HATToken.sol";

contract DeployHATToken is Script {
    function run() external returns (HATToken hat) {
        uint256 key = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(key);
        hat = new HATToken();
        vm.stopBroadcast();

        console.log("HATToken deployed at:", address(hat));
    }
}
