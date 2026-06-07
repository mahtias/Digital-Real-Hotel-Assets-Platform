// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelTokenFactory.sol";
import "../contracts/interfaces/IKYCRegistry.sol";

contract DeployHotelAssetTokens is Script {
    struct Hotel {
        string hotelId;
        string name;
        string location;
        string symbol;
        uint256 maxSupply;
        uint256 priceUSD; // in cents
        IKYCRegistry.KYCLevel kycLevel;
    }

    function run() external returns (address[] memory) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address factoryAddress = vm.envAddress("HOTEL_FACTORY_ADDRESS");

        // DRA Platform Wallet
        address admin = 0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f;

        vm.startBroadcast(deployerPrivateKey);

        HotelTokenFactory factory = HotelTokenFactory(factoryAddress);

        // =========================================
        // PRODUCTION HOTEL CONFIGURATION
        // =========================================

        Hotel[6] memory hotels = [
            Hotel(
                "4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722",
                "My Hotel Name",
                "Kathmandu, Nepal",
                "HAT-MHN",
                500000,
                300,
                IKYCRegistry.KYCLevel.BASIC
            ),
            Hotel(
                "25c38d85-6b08-48f3-8d67-3795a32a9fbf",
                "Marina Bay Sands",
                "Singapore, Singapore",
                "HAT-MBS",
                1000000,
                500,
                IKYCRegistry.KYCLevel.BASIC
            ),
            Hotel(
                "09c1fdb9-c592-4240-bcec-1c7a729074a7",
                "Ritz Carlton Bali",
                "Bali, Indonesia",
                "HAT-RCB",
                200000,
                400,
                IKYCRegistry.KYCLevel.BASIC     
            ),
            Hotel(
                "e009ef84-23bc-473e-b5d8-6c9a7498c784",
                "Grand Plaza Hotel - Branch 2",
                "Jakarta, Indonesia",
                "HAT-GPH",
                100000,
                350,
                IKYCRegistry.KYCLevel.BASIC
            ),
            Hotel(
                "d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce",
                "Waldorf Astoria Maldives",
                "Maldives",
                "HAT-WAM",
                1000000,
                600,
                IKYCRegistry.KYCLevel.BASIC
            ),
            Hotel(
                "12a04eed-c00f-4374-9261-2842ffcee58d",
                "Mountain View Lodge",
                "Bhutan",
                "HAT-MVL",
                80000,
                250,
                IKYCRegistry.KYCLevel.BASIC
            )
        ];

        address[] memory deployedTokens = new address[](hotels.length);

        for (uint256 i = 0; i < hotels.length; i++) {
            deployedTokens[i] = factory.deployHotelToken(
                hotels[i].hotelId,
                hotels[i].name,
                hotels[i].location,
                hotels[i].symbol,
                hotels[i].maxSupply,
                hotels[i].priceUSD,
                admin,
                hotels[i].kycLevel
            );

            console.log("====================================");
            console.log("Hotel:", hotels[i].name);
            console.log("Token:", deployedTokens[i]);
            console.log("Supply:", hotels[i].maxSupply);
            console.log("Price USD:", hotels[i].priceUSD);
            console.log("====================================");
        }

        vm.stopBroadcast();

        return deployedTokens;
    }
}
