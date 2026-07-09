// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DRAToken
 * @notice DIGIREAL Assets governance and reward token
 * @dev 100M fixed supply. Platform backend mints DRA as investment rewards.
 *      Owner is the platform deployer wallet.
 */
contract DRAToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18; // 100M DRA

    uint256 public totalMinted;

    event DRAMinted(address indexed to, uint256 amount);

    constructor(address initialOwner) ERC20("DIGIREAL Assets Token", "DRA") Ownable(initialOwner) {}

    /**
     * @notice Mint DRA reward tokens to an investor wallet.
     * @dev Called by the platform backend after a confirmed investment.
     *      Will not exceed MAX_SUPPLY.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "DRA: mint to zero address");
        require(totalMinted + amount <= MAX_SUPPLY, "DRA: max supply reached");
        totalMinted += amount;
        _mint(to, amount);
        emit DRAMinted(to, amount);
    }

    /**
     * @notice Remaining mintable supply.
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
}
