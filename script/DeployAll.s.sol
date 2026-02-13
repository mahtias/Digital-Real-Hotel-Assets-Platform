// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/MockUSDC.sol";
import "../contracts/KYCRegistry.sol";
import "../contracts/HATToken.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/Investment.sol";

contract DeployAll is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address treasury = deployer;

        console.log("Deployer:", deployer);
        console.log("Treasury:", treasury);

        vm.startBroadcast(pk);

        // 1. HATToken FIRST
        HATToken hatToken = new HATToken();
        console.log("HATToken:", address(hatToken));

        // 2. MockUSDC
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC:", address(usdc));

        // 3. KYCRegistry
        KYCRegistry kycRegistry = new KYCRegistry(address(hatToken));
        console.log("KYCRegistry:", address(kycRegistry));

        // 4. FIXED: HotelAssetManager(hatToken ONLY)
        HotelAssetManager assetManager = new HotelAssetManager(address(hatToken));
        console.log("HotelAssetManager:", address(assetManager));

        // 5. Investment
        Investment investment = new Investment(address(usdc), address(kycRegistry), address(assetManager), treasury);
        console.log("Investment:", address(investment));

        // Grant roles
        bytes32 MINTER_ROLE = keccak256("MINTER_ROLE");
        bytes32 MANAGER_ROLE = keccak256("MANAGER_ROLE");

        hatToken.grantRole(MINTER_ROLE, address(assetManager));
        hatToken.grantRole(MANAGER_ROLE, address(assetManager));
        console.log(" Roles granted");

        // Link investment
        assetManager.setInvestmentContract(address(investment));
        console.log(" Investment linked");

        vm.stopBroadcast();

        console.log("\n UPDATE .env with these:");
        console.log("HAT_CONTRACT_ADDRESS=", address(hatToken));
        console.log("HOTEL_ASSET_MANAGER_ADDRESS=", address(assetManager));
        console.log("KYC_CONTRACT_ADDRESS=", address(kycRegistry));
    }
}
