// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../test/MockUSDC.sol";

contract DeployMockUSDC is Script {
    function run() external returns (MockUSDC) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("==========================================");
        console.log("Deploying MockUSDC");
        console.log("Deployer:", deployer);
        console.log("==========================================");

        vm.startBroadcast(deployerPrivateKey);

        MockUSDC usdc = new MockUSDC();

        vm.stopBroadcast();

        console.log("\n==========================================");
        console.log("MockUSDC deployed at:", address(usdc));
        console.log("Initial supply to deployer: 1,000,000 USDC");
        console.log("Decimals:", usdc.decimals());
        console.log("==========================================\n");

        return usdc;
    }
}
