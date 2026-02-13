// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/Investment.sol";

contract DeployInvestment is Script {
    //  FIXED: Added treasury parameter back
    function run(
        address usdc,
        address kycRegistry,
        address assetManager,
        address treasury // ← Added back
    )
        external
        returns (Investment investment)
    {
        uint256 key = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(key);

        //  FIXED: Pass all 4 parameters
        investment = new Investment(usdc, kycRegistry, assetManager, treasury);

        vm.stopBroadcast();

        console.log("Investment deployed at:", address(investment));
        console.log("  - USDC:", usdc);
        console.log("  - KYCRegistry:", kycRegistry);
        console.log("  - AssetManager:", assetManager);
        console.log("  - Treasury:", treasury);
    }
}
