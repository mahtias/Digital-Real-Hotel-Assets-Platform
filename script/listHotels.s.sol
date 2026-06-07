// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/interfaces/IKYCRegistry.sol";

contract ListHotels is Script {
    struct HotelData {
        string hotelId;
        string name;
        string location;
        string symbol;
        uint256 totalShares; // maxSupply
        uint256 pricePerShare; // in USD cents, 200 = $2.00
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address propertyOwner = vm.envAddress("TREASURY_ADDRESS");
        address managerAddress = vm.envAddress("HOTEL_ASSET_MANAGER_ADDRESS");

        HotelAssetManager manager = HotelAssetManager(managerAddress);

        // All hotels
        HotelData[6] memory hotels = [
            HotelData(
                "hotel-001", "My Hotel Kathmandu", "Kathmandu, Nepal", "DRA-MHN", 500_000, 200
            ),
            HotelData(
                    "hotel-002",
                    "Marina Bay Sands",
                    "Singapore, Singapore",
                    "DRA-MBS",
                    1_000_000,
                    200
                ),
            HotelData("hotel-003", "Ritz Carlton Bali", "Bali, Indonesia", "DRA-RCB", 200_000, 200),
            HotelData(
                "hotel-004", "Grand Plaza Jakarta", "Jakarta, Indonesia", "DRA-GPH", 100_000, 200
            ),
            HotelData(
                "hotel-005", "Waldorf Astoria Maldives", "Maldives", "DRA-WAM", 1_000_000, 200
            ),
            HotelData("hotel-006", "Mountain View Lodge", "Bhutan", "DRA-MVL", 80_000, 200)
        ];

        console.log("\n=== REGISTERING HOTELS IN BATCHES ===\n");

        // Split into batches of 3
        for (uint256 i = 0; i < hotels.length; i += 3) {
            uint256 batchSize = (i + 3 > hotels.length) ? hotels.length - i : 3;

            // Collect batch
            HotelData[] memory batch = new HotelData[](batchSize);
            for (uint256 j = 0; j < batchSize; j++) {
                batch[j] = hotels[i + j];
            }

            // Broadcast one batch
            vm.startBroadcast(deployerPrivateKey);
            for (uint256 k = 0; k < batch.length; k++) {
                try manager.listHotel(
                    batch[k].hotelId,
                    batch[k].name,
                    batch[k].location,
                    "", // no image
                    batch[k].symbol,
                    propertyOwner,
                    batch[k].totalShares,
                    batch[k].pricePerShare,
                    100 * 1e6,
                    90 days,
                    IKYCRegistry.KYCLevel.BASIC
                ) returns (uint256 hotelIndex, address tokenAddress) {
                    console.log("SUCCESS");
                    console.log("Hotel:", batch[k].name);
                    console.logUint(hotelIndex);
                    console.logAddress(tokenAddress);
                } catch Error(string memory reason) {
                    console.log("FAILED:", batch[k].name, reason);
                } catch {
                    console.log("FAILED:", batch[k].name, "Unknown error");
                }
            }
            vm.stopBroadcast();
            console.log("--------------------------");
        }

        console.log("\n=== ALL HOTELS REGISTERED ===");
    }
}
