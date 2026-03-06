// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 *   WARNING: TESTING ONLY - DO NOT DEPLOY TO PRODUCTION
 *
 * @title MockUSDC
 * @notice Mock USDC token for local testing and development
 * @dev This contract allows unrestricted minting and is NOT secure for production
 *
 * Real USDC Addresses:
 * - Base Mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
 * - Base Sepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
 *
 * Usage: Only use this in test files (test/*.t.sol)
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USD Coin", "USDC") {
        _mint(msg.sender, 10_000_000 * 10 ** 6); // 10M USDC for testing
    }

    /// @notice USDC uses 6 decimals
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Mint tokens to any address (testing only!)
    /// @param to Address to mint tokens to
    /// @param amount Amount to mint (in 6 decimal format)
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /// @notice Burn tokens from any address (testing only!)
    /// @param from Address to burn tokens from
    /// @param amount Amount to burn
    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
