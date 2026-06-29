// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelYieldVault.sol";

contract DeployHotelYieldVault is Script {
    function run() external returns (HotelYieldVault vault) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address stablecoin = vm.envAddress("USDC_ADDRESS");

        address admin = vm.envAddress("TREASURY_ADDRESS");

        address kycRegistry = vm.envAddress("KYC_CONTRACT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        vault = new HotelYieldVault(stablecoin, admin, kycRegistry);

        vm.stopBroadcast();

        console.log("HotelYieldVault:", address(vault));

        console.log("Stablecoin:", stablecoin);

        console.log("Admin:", admin);

        console.log("KYCRegistry:", kycRegistry);
    }
}
