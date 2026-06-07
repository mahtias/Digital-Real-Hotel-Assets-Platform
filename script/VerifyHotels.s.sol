// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import "../contracts/HotelAssetManager.sol";

contract VerifyHotels is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(pk);

        HotelAssetManager manager = HotelAssetManager(vm.envAddress("HOTEL_ASSET_MANAGER_ADDRESS"));

        for (uint256 i = 1; i <= 6; i++) {
            manager.verifyHotel(i);
        }

        vm.stopBroadcast();
    }
}
