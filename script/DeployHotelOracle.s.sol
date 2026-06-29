// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelOracle.sol";

contract DeployHotelOracle is Script {
    // Chainlink Functions Router — Base Sepolia
    address constant FUNCTIONS_ROUTER = 0xf9B8fc078197181C841c296C876945aaa425B278;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        HotelOracle oracle = new HotelOracle(FUNCTIONS_ROUTER);

        console.log("HotelOracle deployed to:", address(oracle));
        console.log("Owner:", oracle.owner());

        vm.stopBroadcast();
    }
}
