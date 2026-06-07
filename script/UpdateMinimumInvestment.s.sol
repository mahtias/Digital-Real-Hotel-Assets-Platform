// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

interface IHotelAssetManager {
    function updateMinimumInvestment(uint256 hotelIndex, uint256 newMinimum) external;
}

contract UpdateMinimumInvestment is Script {
    function run() external {
        address manager = 0x9BCCec289EB06D7B51206a4eb76eA652C30F5c74;

        vm.startBroadcast();

        IHotelAssetManager(manager).updateMinimumInvestment(1, 1_000_000);

        IHotelAssetManager(manager).updateMinimumInvestment(2, 1_000_000);

        IHotelAssetManager(manager).updateMinimumInvestment(3, 1_000_000);

        IHotelAssetManager(manager).updateMinimumInvestment(4, 1_000_000);

        IHotelAssetManager(manager).updateMinimumInvestment(5, 1_000_000);

        IHotelAssetManager(manager).updateMinimumInvestment(6, 1_000_000);

        vm.stopBroadcast();
    }
}
