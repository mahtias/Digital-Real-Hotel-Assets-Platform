// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./KYCRegistry.sol";
import "./HotelAssetManager.sol";

/**
 * @title HotelInvestment
 * @notice Handles multi-stablecoin investments into tokenized hotel assets
 * @dev Supports USDC, USDT, HKD stablecoins, etc.
 */
contract HotelInvestment is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ IMMUTABLES ============

    KYCRegistry public immutable kycRegistry;
    HotelAssetManager public immutable assetManager;

    // ============ CONSTANTS ============

    uint256 public constant PLATFORM_FEE_BPS = 200; // 2%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    // ============ STATE VARIABLES ============

    address public treasury;

    // token => enabled
    mapping(address => bool) public supportedStablecoins;

    // token => collected fees
    mapping(address => uint256) public totalPlatformFees;

    // ============ STRUCTS ============

    struct UserInvestment {
        uint256 hotelId;
        address stablecoin;
        uint256 tokenAmount;
        uint256 shares;
        uint256 timestamp;
    }

    // ============ MAPPINGS ============

    mapping(address => UserInvestment[]) public userInvestments;

    // ============ EVENTS ============

    event StablecoinAdded(address indexed token);
    event StablecoinRemoved(address indexed token);

    event Invested(
        address indexed investor,
        uint256 indexed hotelId,
        address indexed stablecoin,
        uint256 tokenAmount,
        uint256 shares,
        uint256 timestamp
    );

    event RevenueWithdrawn(address indexed investor, uint256 indexed hotelId, uint256 amount);

    event RevenueReceived(uint256 indexed hotelId, uint256 amount);

    event TreasuryUpdated(address indexed treasury);

    event FeesWithdrawn(address indexed treasury, address indexed stablecoin, uint256 amount);

    // ============ ERRORS ============

    error NotKYCApproved();
    error InvalidAmount();
    error HotelNotAvailable();
    error UnsupportedStablecoin();
    error InsufficientAllowance();

    // ============ CONSTRUCTOR ============

    constructor(
        address _kycRegistry,
        address _assetManager,
        address _treasury,
        address[] memory initialStablecoins
    ) Ownable(msg.sender) {
        require(_kycRegistry != address(0), "Invalid KYC registry");
        require(_assetManager != address(0), "Invalid asset manager");
        require(_treasury != address(0), "Invalid treasury");

        kycRegistry = KYCRegistry(_kycRegistry);
        assetManager = HotelAssetManager(_assetManager);
        treasury = _treasury;

        // Add initial stablecoins
        for (uint256 i = 0; i < initialStablecoins.length; i++) {
            supportedStablecoins[initialStablecoins[i]] = true;

            emit StablecoinAdded(initialStablecoins[i]);
        }
    }

    // ============ INVESTMENT FUNCTIONS ============

    /**
     * @notice Invest using supported stablecoin
     * @param hotelId Hotel ID
     * @param stablecoin Stablecoin address
     * @param tokenAmount Amount of token
     */
    function invest(uint256 hotelId, address stablecoin, uint256 tokenAmount)
        external
        nonReentrant
        returns (uint256 shares)
    {
        if (tokenAmount == 0) revert InvalidAmount();

        if (!supportedStablecoins[stablecoin]) {
            revert UnsupportedStablecoin();
        }

        if (!kycRegistry.isKYCValid(msg.sender)) {
            revert NotKYCApproved();
        }

        if (!assetManager.isHotelAvailable(hotelId)) {
            revert HotelNotAvailable();
        }

        IERC20 token = IERC20(stablecoin);

        uint256 allowance = token.allowance(msg.sender, address(this));

        if (allowance < tokenAmount) {
            revert InsufficientAllowance();
        }

        // Normalize to 6 decimals for AssetManager
        uint8 decimals = IERC20Metadata(stablecoin).decimals();

        // Fees
        uint256 fee = (tokenAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;

        uint256 netAmount = tokenAmount - fee;

        // Normalize net amount for AssetManager
        uint256 normalizedNetAmount;

        if (decimals == 6) {
            normalizedNetAmount = netAmount;
        } else if (decimals > 6) {
            normalizedNetAmount = netAmount / (10 ** (decimals - 6));
        } else {
            normalizedNetAmount = netAmount * (10 ** (6 - decimals));
        }
        // Calculate shares
        uint256 scaledShares = assetManager.previewShares(hotelId, normalizedNetAmount);

        require(scaledShares > 0, "Investment too small");

        // Transfer token from investor
        token.safeTransferFrom(msg.sender, address(this), tokenAmount);

        // Transfer fee to treasury
        token.safeTransfer(treasury, fee);

        totalPlatformFees[stablecoin] += fee;

        // Mint shares

        assetManager.mintShares(hotelId, msg.sender, scaledShares, normalizedNetAmount);

        // Record investment
        userInvestments[msg.sender].push(
            UserInvestment({
                hotelId: hotelId,
                stablecoin: stablecoin,
                tokenAmount: tokenAmount,
                shares: scaledShares,
                timestamp: block.timestamp
            })
        );

        emit Invested(msg.sender, hotelId, stablecoin, tokenAmount, scaledShares, block.timestamp);

        return scaledShares;
    }

    // ============ REVENUE FUNCTIONS ============

    function receiveRevenue(uint256 hotelId) external payable nonReentrant {
        require(msg.value > 0, "No revenue sent");

        HotelAssetManager.Hotel memory hotel = assetManager.getHotel(hotelId);

        require(hotel.isVerified, "Hotel not verified");

        require(hotel.status == HotelAssetManager.HotelStatus.Operational, "Hotel not operational");

        assetManager.recordRevenue(hotelId, msg.value);

        emit RevenueReceived(hotelId, msg.value);
    }

    function withdrawRevenue(uint256 hotelId) external nonReentrant {
        require(assetManager.hotelExists(hotelId), "Hotel not found");

        uint256 amountWei = assetManager.claimableRevenue(hotelId, msg.sender);

        require(amountWei > 0, "No revenue to withdraw");

        require(address(this).balance >= amountWei, "Insufficient contract balance");

        assetManager.markRevenueClaimed(hotelId, msg.sender, amountWei);

        (bool success,) = msg.sender.call{ value: amountWei }("");

        require(success, "ETH transfer failed");

        emit RevenueWithdrawn(msg.sender, hotelId, amountWei);
    }

    // ============ VIEW FUNCTIONS ============

    function previewInvestment(uint256 hotelId, address stablecoin, uint256 tokenAmount)
        external
        view
        returns (uint256 shares, uint256 fee, uint256 netAmount)
    {
        if (!supportedStablecoins[stablecoin]) {
            return (0, 0, 0);
        }

        uint8 decimals = IERC20Metadata(stablecoin).decimals();

        fee = (tokenAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;

        netAmount = tokenAmount - fee;

        uint256 normalizedNetAmount;

        if (decimals == 6) {
            normalizedNetAmount = netAmount;
        } else if (decimals > 6) {
            normalizedNetAmount = netAmount / (10 ** (decimals - 6));
        } else {
            normalizedNetAmount = netAmount * (10 ** (6 - decimals));
        }

        shares = assetManager.previewShares(hotelId, normalizedNetAmount);
    }

    function getUserInvestments(address user) external view returns (UserInvestment[] memory) {
        return userInvestments[user];
    }

    function getUserClaimableRevenue(address user, uint256 hotelId)
        external
        view
        returns (uint256 claimable)
    {
        return assetManager.claimableRevenue(hotelId, user);
    }

    function canUserInvest(address user, uint256 hotelId)
        external
        view
        returns (bool canInvest, string memory reason)
    {
        if (!kycRegistry.isKYCValid(user)) {
            return (false, "KYC not valid");
        }

        if (!assetManager.isHotelAvailable(hotelId)) {
            return (false, "Hotel not available");
        }

        return (true, "");
    }

    // ============ ADMIN FUNCTIONS ============

    function addStablecoin(address stablecoin) external onlyOwner {
        require(stablecoin != address(0), "Invalid stablecoin");

        supportedStablecoins[stablecoin] = true;

        emit StablecoinAdded(stablecoin);
    }

    function removeStablecoin(address stablecoin) external onlyOwner {
        supportedStablecoins[stablecoin] = false;

        emit StablecoinRemoved(stablecoin);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");

        treasury = newTreasury;

        emit TreasuryUpdated(newTreasury);
    }

    function withdrawFees(address stablecoin) external onlyOwner {
        IERC20 token = IERC20(stablecoin);

        uint256 balance = token.balanceOf(address(this));

        require(balance > 0, "No fees to withdraw");

        token.safeTransfer(treasury, balance);

        emit FeesWithdrawn(treasury, stablecoin, balance);
    }

    function emergencyWithdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, "No ETH");

        (bool success,) = owner().call{ value: balance }("");

        require(success, "Transfer failed");
    }

    function getInvestmentStats(address user)
        external
        view
        returns (uint256 totalInvested, uint256 totalShares, uint256 investmentCount)
    {
        UserInvestment[] memory investments = userInvestments[user];

        for (uint256 i = 0; i < investments.length; i++) {
            totalInvested += investments[i].tokenAmount;
            totalShares += investments[i].shares;
        }

        investmentCount = investments.length;
    }

    function emergencyWithdrawERC20(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));

        require(balance > 0, "No tokens");

        IERC20(token).safeTransfer(owner(), balance);
    }

    // ============ RECEIVE ============

    receive() external payable { }
}
