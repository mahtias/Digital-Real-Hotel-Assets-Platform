// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./KYCRegistry.sol";
import "./HotelAssetManager.sol";

/**
 * @title HotelInvestment
 * @notice Handles USDC investments into tokenized hotel assets
 * @dev Main investment contract that interacts with HotelAssetManager and KYCRegistry
 */
contract HotelInvestment is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ IMMUTABLES ============

    IERC20 public immutable usdc;
    KYCRegistry public immutable kycRegistry;
    HotelAssetManager public immutable assetManager;

    // ============ CONSTANTS ============

    uint256 public constant PLATFORM_FEE_BPS = 200; // 2%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    // ============ STATE VARIABLES ============

    address public treasury;
    uint256 public totalPlatformFees;

    // ============ STRUCTS ============

    struct UserInvestment {
        uint256 hotelId;
        uint256 usdcAmount;
        uint256 shares;
        uint256 timestamp;
    }

    // ============ MAPPINGS ============

    mapping(address => UserInvestment[]) public userInvestments;

    // ============ EVENTS ============

    event Invested(
        address indexed investor,
        uint256 indexed hotelId,
        uint256 usdcAmount,
        uint256 shares,
        uint256 timestamp
    );
    event RevenueWithdrawn(address indexed investor, uint256 indexed hotelId, uint256 amount);
    event RevenueReceived(uint256 indexed hotelId, uint256 amount);
    event TreasuryUpdated(address indexed treasury);
    event FeesWithdrawn(address indexed treasury, uint256 amount);

    // ============ ERRORS ============

    error NotKYCApproved();
    error InvalidAmount();
    error HotelNotAvailable();
    error InsufficientUSDCAllowance();

    // ============ CONSTRUCTOR ============

    /**
     * @notice Initialize the HotelInvestment contract
     * @param _usdc Address of USDC token contract
     * @param _kycRegistry Address of KYC registry contract
     * @param _assetManager Address of Hotel Asset Manager contract
     * @param _treasury Address to receive platform fees
     */
    constructor(address _usdc, address _kycRegistry, address _assetManager, address _treasury)
        Ownable(msg.sender)
    {
        require(_usdc != address(0), "Invalid USDC");
        require(_kycRegistry != address(0), "Invalid KYC registry");
        require(_assetManager != address(0), "Invalid asset manager");
        require(_treasury != address(0), "Invalid treasury");

        usdc = IERC20(_usdc);
        kycRegistry = KYCRegistry(_kycRegistry);
        assetManager = HotelAssetManager(_assetManager);
        treasury = _treasury;
    }

    // ============ EXTERNAL FUNCTIONS ============

    /**
     * @notice Invest USDC into a hotel property
     * @param hotelId ID of the hotel to invest in
     * @param usdcAmount Amount of USDC to invest (6 decimals)
     * @return shares Amount of hotel shares received (18 decimals)
     */
    function invest(uint256 hotelId, uint256 usdcAmount)
        external
        nonReentrant
        returns (uint256 shares)
    {
        if (usdcAmount == 0) revert InvalidAmount();
        if (!kycRegistry.isKYCValid(msg.sender)) revert NotKYCApproved();
        if (!assetManager.isHotelAvailable(hotelId)) revert HotelNotAvailable();

        // Check allowance
        uint256 allowance = usdc.allowance(msg.sender, address(this));
        if (allowance < usdcAmount) revert InsufficientUSDCAllowance();

        // Calculate shares (18 decimals)
        uint256 scaledShares = assetManager.previewShares(hotelId, usdcAmount);
        require(scaledShares > 0, "Investment too small");

        // Calculate fees
        uint256 fee = (usdcAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 netAmount = usdcAmount - fee;

        // Transfer USDC from investor
        usdc.safeTransferFrom(msg.sender, address(this), usdcAmount);

        // Transfer fee to treasury
        usdc.safeTransfer(treasury, fee);

        totalPlatformFees += fee;

        // Mint shares (this will also check KYC again in token contract)
        assetManager.mintShares(hotelId, msg.sender, scaledShares, netAmount);

        // Record investment
        userInvestments[msg.sender]
        .push(
            UserInvestment({
                hotelId: hotelId,
                usdcAmount: usdcAmount,
                shares: scaledShares,
                timestamp: block.timestamp
            })
        );

        emit Invested(msg.sender, hotelId, usdcAmount, scaledShares, block.timestamp);

        return scaledShares;
    }

    // ============ REVENUE FUNCTIONS ============

    /**
     * @notice Receive and distribute revenue for a hotel
     * @dev Revenue stays in this contract for users to withdraw
     * @param hotelId Hotel receiving revenue
     */
    function receiveRevenue(uint256 hotelId) external payable nonReentrant {
        require(msg.value > 0, "No revenue sent");

        // ✅ Use getter function
        HotelAssetManager.Hotel memory hotel = assetManager.getHotel(hotelId);
        require(hotel.isVerified, "Hotel not verified");
        require(hotel.status == HotelAssetManager.HotelStatus.Operational, "Hotel not operational");

        // Record revenue in AssetManager
        assetManager.recordRevenue(hotelId, msg.value);

        emit RevenueReceived(hotelId, msg.value);
    }

    /**
     * @notice Withdraw accumulated revenue from a hotel
     * @dev Revenue is paid in ETH directly from this contract
     * @param hotelId Hotel to withdraw revenue from
     */
    function withdrawRevenue(uint256 hotelId) external nonReentrant {
        // Verify hotel exists
        require(assetManager.hotelExists(hotelId), "Hotel not found");

        // Get claimable amount
        uint256 amountWei = assetManager.claimableRevenue(hotelId, msg.sender);
        require(amountWei > 0, "No revenue to withdraw");
        require(address(this).balance >= amountWei, "Insufficient contract balance");

        // Mark as claimed
        assetManager.markRevenueClaimed(hotelId, msg.sender, amountWei);

        // Transfer ETH to user
        (bool success,) = msg.sender.call{ value: amountWei }("");
        require(success, "ETH transfer failed");

        emit RevenueWithdrawn(msg.sender, hotelId, amountWei);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Preview investment calculation
     * @param hotelId Hotel to invest in
     * @param usdcAmount USDC amount to invest
     * @return shares Shares that would be received
     * @return fee Platform fee amount
     * @return netAmount Amount after fees
     */
    function previewInvestment(uint256 hotelId, uint256 usdcAmount)
        external
        view
        returns (uint256 shares, uint256 fee, uint256 netAmount)
    {
        shares = assetManager.previewShares(hotelId, usdcAmount);
        fee = (usdcAmount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        netAmount = usdcAmount - fee;
    }

    /**
     * @notice Get all investments for a user
     * @param user Address to query
     * @return Array of user investments
     */
    function getUserInvestments(address user) external view returns (UserInvestment[] memory) {
        return userInvestments[user];
    }

    /**
     * @notice Get number of investments for a user
     * @param user Address to query
     * @return count Number of investments
     */
    function getUserInvestmentCount(address user) external view returns (uint256 count) {
        return userInvestments[user].length;
    }

    /**
     * @notice Get user's claimable revenue for a specific hotel
     * @param user Address to check
     * @param hotelId Hotel to check
     * @return claimable Amount of ETH claimable (wei)
     */
    function getUserClaimableRevenue(address user, uint256 hotelId)
        external
        view
        returns (uint256 claimable)
    {
        return assetManager.claimableRevenue(hotelId, user);
    }

    /**
     * @notice Get user's total claimable revenue across all hotels
     * @param user Address to check
     * @return total Total ETH claimable (wei)
     */
    function getUserTotalClaimableRevenue(address user) external view returns (uint256 total) {
        UserInvestment[] memory investments = userInvestments[user];

        for (uint256 i = 0; i < investments.length; i++) {
            total += assetManager.claimableRevenue(investments[i].hotelId, user);
        }
    }

    /**
     * @notice Get detailed information about a specific investment
     * @param user Investor address
     * @param index Investment index in user's array
     * @return investment Investment details
     * @return currentShares Current token balance
     * @return claimableRevenue Claimable ETH revenue
     */
    function getInvestmentDetails(address user, uint256 index)
        external
        view
        returns (UserInvestment memory investment, uint256 currentShares, uint256 claimableRevenue)
    {
        require(index < userInvestments[user].length, "Invalid index");

        investment = userInvestments[user][index];

        // Get current balance from hotel token
        (currentShares,) = assetManager.getUserHotelBalance(investment.hotelId, user);

        claimableRevenue = assetManager.claimableRevenue(investment.hotelId, user);
    }

    /**
     * @notice Check if user can invest in a hotel
     * @param user Address to check
     * @param hotelId Hotel to invest in
     * @return canInvest True if user can invest
     * @return reason Reason if cannot invest
     */
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

    /**
     * @notice Get platform statistics
     * @return totalFees Total platform fees collected (USDC)
     * @return treasuryAddress Current treasury address
     * @return feePercent Platform fee percentage (basis points)
     */
    function getPlatformStats()
        external
        view
        returns (uint256 totalFees, address treasuryAddress, uint256 feePercent)
    {
        return (totalPlatformFees, treasury, PLATFORM_FEE_BPS);
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Update treasury address
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /**
     * @notice Withdraw accumulated USDC fees to treasury
     * @dev Platform fees are already transferred during invest(),
     *      but any residual USDC can be withdrawn with this function
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");

        usdc.safeTransfer(treasury, balance);

        emit FeesWithdrawn(treasury, balance);
    }

    /**
     * @notice Emergency withdraw ETH (admin only)
     * @dev Only for stuck ETH, not for revenue distribution
     */
    function emergencyWithdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success,) = owner().call{ value: balance }("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Emergency withdraw ERC20 tokens (admin only)
     * @dev Only for accidentally sent tokens, cannot withdraw USDC
     * @param token Address of token to withdraw
     */
    function emergencyWithdrawERC20(address token) external onlyOwner {
        require(token != address(usdc), "Cannot withdraw USDC");

        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");

        IERC20(token).safeTransfer(owner(), balance);
    }

    // ============ RECEIVE FUNCTION ============

    /**
     * @notice Allow contract to receive ETH
     * @dev Required for revenue distribution
     */
    receive() external payable { }

    /**
     * @notice Get investment statistics for a user
     * @param user Address of the investor
     * @return totalInvested Total USDC invested
     * @return totalShares Total hotel tokens received
     * @return investmentCount Number of investments made
     */
    function getInvestmentStats(address user)
        external
        view
        returns (uint256 totalInvested, uint256 totalShares, uint256 investmentCount)
    {
        UserInvestment[] memory investments = userInvestments[user];
        investmentCount = investments.length;

        for (uint256 i = 0; i < investments.length; i++) {
            totalInvested += investments[i].usdcAmount;
            totalShares += investments[i].shares; // ✅ Changed from sharesReceived to shares
        }

        return (totalInvested, totalShares, investmentCount);
    }
}
