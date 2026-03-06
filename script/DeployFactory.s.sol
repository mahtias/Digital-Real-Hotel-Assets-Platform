// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HotelTokenFactory.sol";

contract DeployFactory is Script {
    function run() external {
        address kycRegistry = vm.envAddress("KYC_CONTRACT_ADDRESS");
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        HotelTokenFactory factory = new HotelTokenFactory(kycRegistry);

        console.log("=========================================");
        console.log("HotelTokenFactory deployed!");
        console.log("=========================================");
        console.log("Factory Address:", address(factory));
        console.log("KYC Registry:", kycRegistry);
        console.log("Factory Owner:", factory.owner());
        console.log("Default KYC Level:", uint8(factory.defaultKYCLevel()));
        console.log("=========================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Add HOTEL_FACTORY_ADDRESS to .env");
        console.log("2. Copy ABIs to backend:");
        console.log(
            "   cp out/HotelTokenFactory.sol/HotelTokenFactory.json backend/src/blockchain/abis/"
        );
        console.log(
            "   cp out/HotelAssetToken.sol/HotelAssetToken.json backend/src/blockchain/abis/"
        );
        console.log("3. Update backend .env with factory address");
        console.log("=========================================");

        vm.stopBroadcast();
    }
}
