// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelTokenFactory.sol";
import "../contracts/interfaces/IKYCRegistry.sol";

contract DeployHotelAssetToken is Script {
    function run() external returns (address) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address factoryAddress = vm.envAddress("FACTORY_ADDRESS");
        address admin = vm.envAddress("ADMIN_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        HotelTokenFactory factory = HotelTokenFactory(factoryAddress);

        // Deploy token for Grand Palace Hotel with BASIC KYC requirement
        address tokenAddress = factory.deployHotelToken(
            "hotel-grand-palace-001", // hotelId
            "Grand Palace Hotel", // hotelName
            "Dubai, UAE", // location
            "HAT-GP", // symbol
            1000000, // maxSupply (1M tokens)
            300, // priceUSD (300 cents = $3.00)
            admin, // admin address
            IKYCRegistry.KYCLevel.BASIC // Required KYC level
        );

        console.log("Hotel token deployed at:", tokenAddress);
        console.log("Required KYC Level: BASIC");

        vm.stopBroadcast();

        return tokenAddress;
    }
}
