// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/KYCRegistry.sol";

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
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Load contract address
        address managerAddress = vm.envAddress("HOTEL_ASSET_MANAGER_ADDRESS");

        HotelAssetManager manager = HotelAssetManager(managerAddress);

        // Define 4 hotels
        HotelData[4] memory hotels = [
            HotelData({
                hotelId: "hotel-hilton-tokyo",
                name: "Hilton Tokyo Bay",
                location: "Tokyo, Japan",
                imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
                symbol: "HAT-HIL",
                totalShares: 5_000_000,
                pricePerShare: 20,
                minimumInvestment: 1000,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "hotel-marriott-paris",
                name: "Marriott Paris Champs-Elysees",
                location: "Paris, France",
                imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
                symbol: "HAT-MAR",
                totalShares: 3_000_000,
                pricePerShare: 50,
                minimumInvestment: 2500,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "hotel-hyatt-london",
                name: "Hyatt Regency London",
                location: "London, UK",
                imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                symbol: "HAT-HYA",
                totalShares: 2_500_000,
                pricePerShare: 75,
                minimumInvestment: 5000,
                fundingDuration: 90 days
            }),
            HotelData({
                hotelId: "hotel-intercontinental-dubai",
                name: "InterContinental Dubai Marina",
                location: "Dubai, UAE",
                imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
                symbol: "HAT-ICD",
                totalShares: 4_000_000,
                pricePerShare: 100,
                minimumInvestment: 10000,
                fundingDuration: 90 days
            })
        ];

        vm.startBroadcast(deployerPrivateKey);

        console.log("\n=== Registering 4 Hotels ===\n");
        console.log("Deployer:", deployerAddress);
        console.log("Manager Contract:", managerAddress);
        console.log("");

        for (uint256 i = 0; i < hotels.length; i++) {
            console.log("Registering:", hotels[i].name);

            try manager.listHotel(
                hotels[i].hotelId,
                hotels[i].name,
                hotels[i].location,
                hotels[i].imageUrl,
                hotels[i].symbol,
                deployerAddress, // propertyOwner
                hotels[i].totalShares,
                hotels[i].pricePerShare,
                hotels[i].minimumInvestment,
                hotels[i].fundingDuration,
                IKYCRegistry.KYCLevel.BASIC
            ) returns (uint256 hotelIndex, address tokenAddress) {
                console.log("   Success!");
                console.log("  Hotel Index:", hotelIndex);
                console.log("  Token Address:", tokenAddress);
                console.log("");
            } catch Error(string memory reason) {
                console.log("   Failed:", reason);
                console.log("");
            } catch {
                console.log("   Failed: Unknown error");
                console.log("");
            }
        }

        vm.stopBroadcast();

        console.log("=== Registration Complete ===\n");
    }
}
