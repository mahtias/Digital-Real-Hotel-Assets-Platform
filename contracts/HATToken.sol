// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./KYCRegistry.sol";

/**
 * @title HATToken
 * @notice ERC1155 token representing fractional hotel ownership shares
 * @dev Each token ID represents a different hotel property
 */
contract HATToken is ERC1155, AccessControl, ReentrancyGuard {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    KYCRegistry public kycRegistry;

    string public name;
    string public symbol;

    // Custom errors
    error KYCRequired();
    error TransferNotAllowed();
    error NotManager();

    event KYCRegistrySet(address indexed kycRegistry);
    event TokensMinted(address indexed to, uint256 indexed tokenId, uint256 amount);
    event TokensBurned(address indexed from, uint256 indexed tokenId, uint256 amount);

    /**
     * @notice Constructor
     */
    constructor() ERC1155("") {
        name = "Hotel Asset Token";
        symbol = "HAT";

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    /**
     * @notice Set the KYC registry contract
     * @param _kycRegistry Address of the KYC registry
     */
    function setKYCRegistry(address _kycRegistry) external onlyRole(DEFAULT_ADMIN_ROLE) {
        kycRegistry = KYCRegistry(_kycRegistry);
        emit KYCRegistrySet(_kycRegistry);
    }

    /**
     * @notice Mint new tokens (hotel shares)
     * @dev Only callable by contracts with MANAGER_ROLE
     * @param to Address to mint tokens to (must be KYC verified)
     * @param id Token ID (hotel ID)
     * @param amount Amount of tokens to mint
     * @param data Additional data
     */
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyRole(MANAGER_ROLE) {
        if (address(kycRegistry) != address(0)) {
            if (!kycRegistry.isKYCVerified(to)) revert KYCRequired();
        }

        _mint(to, id, amount, data);
        emit TokensMinted(to, id, amount);
    }

    function mintForTest(address to, uint256 tokenId, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(to, tokenId, amount, "");
        emit TokensMinted(to, tokenId, amount);
    }

    /**
     * @notice Mint multiple token types at once
     * @param to Address to mint tokens to
     * @param ids Array of token IDs
     * @param amounts Array of amounts
     * @param data Additional data
     */
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        external
        onlyRole(MANAGER_ROLE)
    {
        if (address(kycRegistry) != address(0)) {
            if (!kycRegistry.isKYCVerified(to)) revert KYCRequired();
        }

        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @notice Burn tokens
     * @param from Address to burn from
     * @param id Token ID
     * @param amount Amount to burn
     */
    function burn(address from, uint256 id, uint256 amount) external {
        if (from != msg.sender && !isApprovedForAll(from, msg.sender)) {
            revert TransferNotAllowed();
        }

        _burn(from, id, amount);
        emit TokensBurned(from, id, amount);
    }

    /**
     * @notice Burn multiple token types
     * @param from Address to burn from
     * @param ids Array of token IDs
     * @param amounts Array of amounts
     */
    function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) external {
        if (from != msg.sender && !isApprovedForAll(from, msg.sender)) {
            revert TransferNotAllowed();
        }

        _burnBatch(from, ids, amounts);
    }

    /**
     * @notice Override safeTransferFrom to add KYC check
     */
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public override {
        if (address(kycRegistry) != address(0)) {
            if (!kycRegistry.isKYCVerified(to)) revert KYCRequired();
        }

        super.safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @notice Override safeBatchTransferFrom to add KYC check
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        if (address(kycRegistry) != address(0)) {
            if (!kycRegistry.isKYCVerified(to)) revert KYCRequired();
        }

        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /**
     * @notice Check if contract supports an interface
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Set URI for all token types
     * @param newuri New URI
     */
    function setURI(string memory newuri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri);
    }
}
