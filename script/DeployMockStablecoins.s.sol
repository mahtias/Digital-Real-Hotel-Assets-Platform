// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/MockStablecoin.sol";

interface IHotelInvestment {
    function addStablecoin(address token) external;
}

contract DeployMockStablecoins is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address investmentAddress = vm.envAddress("INVESTMENT_CONTRACT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // -------------------
        // Deploy tokens
        // -------------------

        MockStablecoin usdt = new MockStablecoin("Mock USDT", "USDT", 6);

        MockStablecoin hsbc = new MockStablecoin("HSBC HKD Stablecoin", "HKDHSBC", 6);

        MockStablecoin sc = new MockStablecoin("SC HKD Stablecoin", "HKDSC", 6);

        // -------------------
        // Register them
        // -------------------

        IHotelInvestment invest = IHotelInvestment(investmentAddress);

        invest.addStablecoin(address(usdt));

        invest.addStablecoin(address(hsbc));

        invest.addStablecoin(address(sc));

        vm.stopBroadcast();

        console.log("USDT:", address(usdt));

        console.log("HKD HSBC:", address(hsbc));

        console.log("HKD SC:", address(sc));
    }
}
