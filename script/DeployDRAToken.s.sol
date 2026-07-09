// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/DRAToken.sol";

contract DeployDRAToken is Script {
    function run() external returns (DRAToken token) {
        uint256 key = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(key);

        vm.startBroadcast(key);

        token = new DRAToken(deployer);

        vm.stopBroadcast();

        console.log("=== DRA TOKEN DEPLOYED ===");
        console.log("Address  :", address(token));
        console.log("Owner    :", deployer);
        console.log("Max Supply: 100,000,000 DRA");
        console.log("");
        console.log("Add to backend .env:");
        console.log("DRA_TOKEN_ADDRESS=", address(token));
    }
}
