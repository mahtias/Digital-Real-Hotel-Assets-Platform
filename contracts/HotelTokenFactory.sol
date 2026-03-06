// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./HotelAssetToken.sol";
import "./interfaces/IKYCRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HotelTokenFactory
 * @notice Factory to deploy hotel tokens with KYC integration
 */
contract HotelTokenFactory is Ownable {
    // ============ STATE ============

    address[] public deployedTokens;
    mapping(string => address) public hotelTokens;
    address public immutable kycRegistry;

    // Default KYC level for new tokens
    IKYCRegistry.KYCLevel public defaultKYCLevel;

    // ============ EVENTS ============

    event TokenDeployed(
        address indexed tokenAddress,
        string hotelId,
        string hotelName,
        string symbol,
        uint256 maxSupply,
        uint256 priceUSD,
        IKYCRegistry.KYCLevel kycLevel
    );

    event DefaultKYCLevelUpdated(IKYCRegistry.KYCLevel oldLevel, IKYCRegistry.KYCLevel newLevel);

    // ============ CONSTRUCTOR ============

    constructor(address _kycRegistry) Ownable(msg.sender) {
        require(_kycRegistry != address(0), "Invalid KYC registry");
        kycRegistry = _kycRegistry;
        defaultKYCLevel = IKYCRegistry.KYCLevel.BASIC; // Default to BASIC
    }

    // ============ DEPLOYMENT ============

    /**
     * @notice Deploy a new hotel token
     */
    function deployHotelToken(
        string memory hotelId,
        string memory hotelName,
        string memory location,
        string memory symbol,
        uint256 maxSupply,
        uint256 priceUSD,
        address admin,
        IKYCRegistry.KYCLevel kycLevel
    ) external onlyOwner returns (address) {
        require(hotelTokens[hotelId] == address(0), "Hotel token exists");
        require(admin != address(0), "Invalid admin");
        require(bytes(hotelId).length > 0, "Invalid hotel ID");
        require(bytes(hotelName).length > 0, "Invalid hotel name");

        string memory name = string(abi.encodePacked(hotelName, " Shares"));

        HotelAssetToken newToken = new HotelAssetToken(
            name,
            symbol,
            hotelId,
            hotelName,
            location,
            maxSupply * 10 ** 18, // Convert to wei
            priceUSD,
            kycRegistry,
            admin,
            kycLevel
        );

        address tokenAddress = address(newToken);

        deployedTokens.push(tokenAddress);
        hotelTokens[hotelId] = tokenAddress;

        emit TokenDeployed(tokenAddress, hotelId, hotelName, symbol, maxSupply, priceUSD, kycLevel);

        return tokenAddress;
    }

    /**
     * @notice Deploy with default KYC level
     */
    function deployHotelTokenDefault(
        string memory hotelId,
        string memory hotelName,
        string memory location,
        string memory symbol,
        uint256 maxSupply,
        uint256 priceUSD,
        address admin
    ) external onlyOwner returns (address) {
        return this.deployHotelToken(
            hotelId, hotelName, location, symbol, maxSupply, priceUSD, admin, defaultKYCLevel
        );
    }

    /**
     * @notice Update default KYC level for new deployments
     */
    function setDefaultKYCLevel(IKYCRegistry.KYCLevel newLevel) external onlyOwner {
        IKYCRegistry.KYCLevel oldLevel = defaultKYCLevel;
        defaultKYCLevel = newLevel;
        emit DefaultKYCLevelUpdated(oldLevel, newLevel);
    }

    // ============ VIEW ============

    function getAllTokens() external view returns (address[] memory) {
        return deployedTokens;
    }

    function getTokenForHotel(string memory hotelId) external view returns (address) {
        return hotelTokens[hotelId];
    }

    function getTotalDeployedTokens() external view returns (uint256) {
        return deployedTokens.length;
    }
}
