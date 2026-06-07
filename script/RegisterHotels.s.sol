// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/interfaces/IKYCRegistry.sol";

contract RegisterHotelsScript is Script {
    struct HotelData {
        string hotelId;
        string name;
        string location;
        string imageUrl;
        string symbol;
        uint256 totalShares;
        uint256 pricePerShare;
        uint256 minimumInvestment;
        uint256 fundingDuration;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address propertyOwner = 0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f;
        address managerAddress = vm.envAddress("HOTEL_ASSET_MANAGER_ADDRESS");

        HotelAssetManager manager = HotelAssetManager(managerAddress);

        HotelData[6] memory hotels = [
            HotelData({
                hotelId: "4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722",
                name: "My Hotel Name",
                location: "Kathmandu, Nepal",
                imageUrl: "https://dra-assets.s3.amazonaws.com/hotels/myhotel.jpg",
                symbol: "HAT-MHN",
                totalShares: 500000,
                pricePerShare: 300,
                minimumInvestment: 100 * 1e6,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "25c38d85-6b08-48f3-8d67-3795a32a9fbf",
                name: "Marina Bay Sands",
                location: "Singapore, Singapore",
                imageUrl: "https://dra-assets.s3.amazonaws.com/hotels/mbs.jpg",
                symbol: "HAT-MBS",
                totalShares: 1000000,
                pricePerShare: 500,
                minimumInvestment: 100 * 1e6,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "09c1fdb9-c592-4240-bcec-1c7a729074a7",
                name: "Ritz Carlton Bali",
                location: "Bali, Indonesia",
                imageUrl: "https://dra-assets.s3.amazonaws.com/hotels/ritzbali.jpg",
                symbol: "HAT-RCB",
                totalShares: 200000,
                pricePerShare: 400,
                minimumInvestment: 100 * 1e6,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "e009ef84-23bc-473e-b5d8-6c9a7498c784",
                name: "Grand Plaza Hotel - Branch 2",
                location: "Jakarta, Indonesia",
                imageUrl: "https://dra-assets.s3.amazonaws.com/hotels/grandplaza.jpg",
                symbol: "HAT-GPH",
                totalShares: 100000,
                pricePerShare: 350,
                minimumInvestment: 100 * 1e6,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce",
                name: "Waldorf Astoria Maldives",
                location: "Maldives",
                imageUrl: "https://dra-assets.s3.amazonaws.com/hotels/waldorf.jpg",
                symbol: "HAT-WAM",
                totalShares: 1000000,
                pricePerShare: 600,
                minimumInvestment: 100 * 1e6,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "12a04eed-c00f-4374-9261-2842ffcee58d",
                name: "Mountain View Lodge",
                location: "Bhutan",
                imageUrl: "https://dra-assets.s3.amazonaws.com/hotels/mountainview.jpg",
                symbol: "HAT-MVL",
                totalShares: 80000,
                pricePerShare: 250,
                minimumInvestment: 100 * 1e6,
                fundingDuration: 90 days
            })
        ];

        console.log("\n=== REGISTERING HOTELS ===\n");

        for (uint256 i = 0; i < hotels.length; i++) {
            console.log("Registering:", hotels[i].name);

            // Trigger a separate transaction for each hotel
            vm.broadcast(deployerPrivateKey);

            try manager.listHotel(
                hotels[i].hotelId, // 1
                hotels[i].name, // 2
                hotels[i].location, // 3
                hotels[i].imageUrl, // 4
                hotels[i].symbol, // 5
                propertyOwner, // 6
                hotels[i].totalShares, // 7
                hotels[i].pricePerShare, // 8
                hotels[i].minimumInvestment, // 9
                hotels[i].fundingDuration, // 10
                IKYCRegistry.KYCLevel.BASIC // 11
            ) returns (uint256 hotelIndex, address tokenAddress) {
                console.log("SUCCESS");
                console.log("Hotel Index:", hotelIndex);
                console.log("Token:", tokenAddress);
                console.log("--------------------------------");
            } catch Error(string memory reason) {
                console.log("FAILED:", reason);
            } catch {
                console.log("FAILED: Unknown error");
            }
        }

        console.log("\n=== ALL HOTELS REGISTERED ===");
    }
}
