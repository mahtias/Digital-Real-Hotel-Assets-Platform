// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./KYCRegistry.sol";
import "./HotelAssetManager.sol";

/**
 * @title Investment
 * @notice Handles USDC investments into hotel assets
 * @dev Revenue is distributed in ETH (18 decimals), investments are in USDC (6 decimals)
 */
contract Investment is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    KYCRegistry public immutable kycRegistry;
    HotelAssetManager public immutable assetManager;

    uint256 public constant PLATFORM_FEE_BPS = 200; // 2%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    address public treasury;
    uint256 public totalPlatformFees;

    struct UserInvestment {
        uint256 hotelId;
        uint256 usdcAmount; // USDC (6 decimals)
        uint256 shares; // Scaled (18 decimals)
        uint256 timestamp;
    }

    mapping(address => UserInvestment[]) public userInvestments;

    event Invested(
        address indexed investor, uint256 indexed hotelId, uint256 usdcAmount, uint256 shares, uint256 timestamp
    );

    event RevenueWithdrawn(address indexed investor, uint256 indexed hotelId, uint256 amount);

    event RevenueReceived(uint256 indexed hotelId, uint256 amount);

    event TreasuryUpdated(address treasury);

    error NotKYCApproved();
    error InvalidAmount();
    error HotelNotAvailable();

    constructor(address _usdc, address _kycRegistry, address _assetManager, address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");

        usdc = IERC20(_usdc);
        kycRegistry = KYCRegistry(_kycRegistry);
        assetManager = HotelAssetManager(_assetManager);
        treasury = _treasury;
    }

    /**
     * @notice Invest USDC into a hotel
     * @param hotelId Hotel to invest in
     * @param usdcAmount Amount in USDC (6 decimals)
     * @return shares Amount of shares received (18 decimals)
     */
    function invest(uint256 hotelId, uint256 usdcAmount) external nonReentrant returns (uint256 shares) {
        if (usdcAmount == 0) revert InvalidAmount();
        require(kycRegistry.isKYCValid(msg.sender), "KYC not approved");

        if (!assetManager.isHotelAvailable(hotelId)) {
            revert HotelNotAvailable();
        }

        // ✅ previewShares returns SCALED shares (18 decimals)
        uint256 scaledShares = assetManager.previewShares(hotelId, usdcAmount);
        require(scaledShares > 0, "Too small");

        uint256 fee = (usdcAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 netAmount = usdcAmount - fee;

        usdc.safeTransferFrom(msg.sender, address(this), usdcAmount);
        usdc.safeTransfer(treasury, fee);

        totalPlatformFees += fee;

        // ✅ mintShares expects SCALED shares (18 decimals)
        assetManager.mintShares(hotelId, msg.sender, scaledShares, netAmount);

        userInvestments[msg.sender]
        .push(
            UserInvestment({hotelId: hotelId, usdcAmount: usdcAmount, shares: scaledShares, timestamp: block.timestamp})
        );

        emit Invested(msg.sender, hotelId, usdcAmount, scaledShares, block.timestamp);

        return scaledShares;
    }

    /**
     * @notice Withdraw accumulated revenue
     * @dev Revenue is paid in ETH (not USDC!)
     * @param hotelId Hotel to withdraw from
     */
    function withdrawRevenue(uint256 hotelId) external nonReentrant {
        // ✅ claimableRevenue returns wei (18 decimals)
        uint256 amountWei = assetManager.claimableRevenue(hotelId, msg.sender);
        require(amountWei > 0, "No revenue");

        // ✅ Mark as claimed in wei
        assetManager.markRevenueClaimed(hotelId, msg.sender, amountWei);

        // ✅ Transfer ETH (not USDC!)
        (bool success,) = msg.sender.call{value: amountWei}("");
        require(success, "ETH transfer failed");

        emit RevenueWithdrawn(msg.sender, hotelId, amountWei);
    }

    /**
     * @notice Receive ETH revenue for distribution
     * @dev Operator sends ETH to this contract, which registers it in AssetManager
     * @param hotelId Hotel receiving revenue
     */
    function receiveRevenue(uint256 hotelId) external payable nonReentrant {
        require(msg.value > 0, "Zero amount");

        // ✅ Register revenue in wei (18 decimals)
        // Investment contract MUST have ASSET_MANAGER_ROLE
        assetManager.distributeRevenue(hotelId, msg.value);

        emit RevenueReceived(hotelId, msg.value);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /**
     * @notice Allow contract to receive ETH
     */
    receive() external payable {}
}
