// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./HotelAssetToken.sol";
import "./interfaces/IKYCRegistry.sol";

/**
 * @title HotelAssetManager
 * @notice Manages multiple hotel tokens (ERC-20 based)
 * @dev Each hotel has its own ERC-20 token contract
 */
contract HotelAssetManager is AccessControl, ReentrancyGuard {
    bytes32 public constant ASSET_MANAGER_ROLE = keccak256("ASSET_MANAGER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // ============ STATE ============
    IKYCRegistry public immutable kycRegistry;
    address public investmentContract;

    uint256 public nextHotelId = 1;

    enum HotelStatus {
        Pending,
        Fundraising,
        Funded,
        Operational,
        Closed
    }

    struct Hotel {
        string hotelId; // UUID from database
        string name;
        string location;
        string imageUrl;
        address propertyOwner;
        address tokenContract;
        uint256 totalShares;
        uint256 pricePerShare; // In USD cents
        uint256 minimumInvestment;
        uint256 fundingDeadline;
        HotelStatus status;
        bool isVerified;
        uint256 createdAt;
    }
    mapping(uint256 => Hotel) public hotels;
    mapping(string => uint256) public hotelIdToIndex; // UUID -> index
    mapping(address => uint256[]) public userHotels; // Track user's hotels
    // Revenue tracking
    mapping(uint256 => uint256) public totalRevenue;
    mapping(uint256 => mapping(address => uint256)) public revenueClaimed;
    // ============ EVENTS ============
    event HotelListed(
        uint256 indexed hotelIndex,
        string hotelId,
        string name,
        address indexed tokenContract,
        uint256 totalShares,
        uint256 pricePerShare
    );

    function totalHotels() public view returns (uint256) {
        return nextHotelId - 1;
    }
    event HotelVerified(uint256 indexed hotelIndex, string hotelId);
    event HotelStatusUpdated(uint256 indexed hotelIndex, HotelStatus newStatus);
    event SharesMinted(
        uint256 indexed hotelIndex, address indexed investor, uint256 shares, uint256 value
    );
    event RevenueDistributed(uint256 indexed hotelIndex, uint256 amount);
    event RevenueWithdrawn(uint256 indexed hotelIndex, address indexed investor, uint256 amount);
    event InvestmentContractSet(address indexed investmentContract);
    event TokenRoleGranted(string indexed hotelId, bytes32 indexed role, address indexed account);

    // ============ ERRORS ============
    error NotInvestment();
    error HotelNotVerified();
    error FundingClosed();
    error InsufficientShares();
    error InvestmentTooSmall();
    error InsufficientRevenue();
    error InvalidHotel();
    error AlreadyVerified();
    error InvalidParameters();
    error HotelExists();
    error TokenDeploymentFailed();
    error HotelNotFound();
    // ============ MODIFIERS ============

    modifier onlyInvestment() {
        _onlyInvestment();
        _;
    }

    //  NEW: Internal function with modifier logic
    function _onlyInvestment() internal view {
        if (msg.sender != investmentContract) revert NotInvestment();
    }
    // ============ CONSTRUCTOR ============

    constructor(address _kycRegistry, address admin) {
        require(_kycRegistry != address(0), "Invalid KYC registry");

        kycRegistry = IKYCRegistry(_kycRegistry);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ASSET_MANAGER_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    // ============ ADMIN FUNCTIONS ============

    function setInvestmentContract(address _investment) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_investment != address(0), "Invalid address");
        investmentContract = _investment;
        emit InvestmentContractSet(_investment);
    }

    function updateMinimumInvestment(uint256 hotelIndex, uint256 newMinimum)
        external
        onlyRole(ASSET_MANAGER_ROLE)
    {
        Hotel storage hotel = hotels[hotelIndex];

        if (hotel.tokenContract == address(0)) {
            revert InvalidHotel();
        }

        hotel.minimumInvestment = newMinimum;
    }

    /**
     * @notice List a new hotel and deploy its token
     * @dev Creates a new ERC-20 token for the hotel
     */
    function listHotel(
        string calldata hotelId,
        string calldata name,
        string calldata location,
        string calldata imageUrl,
        string calldata symbol,
        address propertyOwner,
        uint256 totalShares,
        uint256 pricePerShare,
        uint256 minimumInvestment,
        uint256 fundingDuration,
        IKYCRegistry.KYCLevel requiredKYCLevel
    ) external onlyRole(ASSET_MANAGER_ROLE) returns (uint256 hotelIndex, address tokenAddress) {
        if (totalShares == 0 || pricePerShare == 0) revert InvalidParameters();
        if (hotelIdToIndex[hotelId] != 0) revert HotelExists();
        if (propertyOwner == address(0)) revert InvalidParameters();

        hotelIndex = nextHotelId++;

        // Deploy new ERC-20 token for this hotel
        string memory tokenName = string(abi.encodePacked(name, " Shares"));

        try new HotelAssetToken(
            tokenName,
            symbol,
            hotelId,
            name,
            location,
            totalShares * 10 ** 18, // Max supply in wei
            pricePerShare,
            address(kycRegistry),
            address(this), // Admin = HotelAssetManager
            requiredKYCLevel
        ) returns (HotelAssetToken newToken) {
            tokenAddress = address(newToken);
        } catch {
            revert TokenDeploymentFailed();
        }
        hotels[hotelIndex] = Hotel({
            hotelId: hotelId,
            name: name,
            location: location,
            imageUrl: imageUrl,
            propertyOwner: propertyOwner,
            tokenContract: tokenAddress,
            totalShares: totalShares,
            pricePerShare: pricePerShare,
            minimumInvestment: minimumInvestment,
            fundingDeadline: block.timestamp + fundingDuration,
            status: HotelStatus.Pending,
            isVerified: false,
            createdAt: block.timestamp
        });

        hotelIdToIndex[hotelId] = hotelIndex;

        emit HotelListed(hotelIndex, hotelId, name, tokenAddress, totalShares, pricePerShare);

        return (hotelIndex, tokenAddress);
    }

    /**
     * @notice Verify a hotel to start fundraising
     */
    function verifyHotel(uint256 hotelIndex) external onlyRole(ASSET_MANAGER_ROLE) {
        Hotel storage hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) revert InvalidHotel();
        if (hotel.isVerified) revert AlreadyVerified();

        hotel.isVerified = true;
        hotel.status = HotelStatus.Fundraising;

        emit HotelVerified(hotelIndex, hotel.hotelId);
    }

    /**
     * @notice Update hotel status
     */
    function updateHotelStatus(uint256 hotelIndex, HotelStatus newStatus)
        external
        onlyRole(ASSET_MANAGER_ROLE)
    {
        Hotel storage hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) revert InvalidHotel();

        hotel.status = newStatus;
        emit HotelStatusUpdated(hotelIndex, newStatus);
    }

    // ============ INVESTMENT FUNCTIONS ============

    /**
     * @notice Mint shares for investor (called by Investment contract)
     * @dev This mints ERC-20 tokens directly
     */
    function mintShares(uint256 hotelIndex, address investor, uint256 shares, uint256 usdcAmount)
        external
        onlyInvestment
        nonReentrant
    {
        Hotel storage hotel = hotels[hotelIndex];

        if (!hotel.isVerified) revert HotelNotVerified();
        if (block.timestamp > hotel.fundingDeadline) revert FundingClosed();
        if (usdcAmount < hotel.minimumInvestment) revert InvestmentTooSmall();

        HotelAssetToken token = HotelAssetToken(hotel.tokenContract);

        // Check if enough supply remains
        uint256 remaining = token.maxSupply() - token.totalSupply();
        if (shares > remaining) revert InsufficientShares();

        // Mint tokens (KYC check happens in token contract)
        token.mintInvestment(investor, shares);

        // Track user's hotels
        bool hasHotel = false;
        uint256[] storage userHotelList = userHotels[investor];
        for (uint256 i = 0; i < userHotelList.length; i++) {
            if (userHotelList[i] == hotelIndex) {
                hasHotel = true;
                break;
            }
        }
        if (!hasHotel) {
            userHotels[investor].push(hotelIndex);
        }

        emit SharesMinted(hotelIndex, investor, shares, usdcAmount);
    }

    // ============ REVENUE FUNCTIONS ============

    /**
     * @notice Distribute revenue to a hotel
     * @dev Revenue is in ETH (wei)
     */
    function distributeRevenue(uint256 hotelIndex, uint256 amount)
        external
        onlyRole(OPERATOR_ROLE)
    {
        Hotel storage hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) revert InvalidHotel();

        totalRevenue[hotelIndex] += amount;
        emit RevenueDistributed(hotelIndex, amount);
    }

    /**
     * @notice Record incoming revenue (called by Investment contract)
     * @dev Updates totalRevenue for proportional distribution
     * @param hotelIndex Hotel receiving revenue
     * @param amount Revenue amount in wei
     */

    /**
     * @notice Get hotel struct by index
     * @param hotelIndex Hotel index
     * @return Hotel struct
     */
    function getHotel(uint256 hotelIndex) external view returns (Hotel memory) {
        Hotel memory hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) revert InvalidHotel();
        return hotel;
    }

    /**
     * @notice Check if hotel exists and is valid
     * @param hotelIndex Hotel index
     * @return exists True if hotel exists
     */
    function hotelExists(uint256 hotelIndex) external view returns (bool) {
        return hotels[hotelIndex].tokenContract != address(0);
    }

    function recordRevenue(uint256 hotelIndex, uint256 amount) external onlyInvestment {
        Hotel storage hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) revert InvalidHotel();

        totalRevenue[hotelIndex] += amount;
        emit RevenueDistributed(hotelIndex, amount);
    }

    /**
     * @notice Calculate claimable revenue for an investor
     * @return amount Claimable revenue in wei
     */
    function claimableRevenue(uint256 hotelIndex, address investor)
        public
        view
        returns (uint256 amount)
    {
        Hotel memory hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) return 0;

        HotelAssetToken token = HotelAssetToken(hotel.tokenContract);
        uint256 shares = token.balanceOf(investor);

        if (shares == 0) return 0;

        uint256 totalRev = totalRevenue[hotelIndex];
        uint256 claimed = revenueClaimed[hotelIndex][investor];
        uint256 totalSupply = token.totalSupply();

        if (totalSupply == 0) return 0;

        // Calculate proportional revenue
        uint256 totalClaimable = (totalRev * shares) / totalSupply;

        return totalClaimable > claimed ? totalClaimable - claimed : 0;
    }

    /**
     * @notice Grant a role on a hotel's token contract
     * @dev Only ASSET_MANAGER can grant token roles
     */
    function grantTokenRole(string calldata hotelId, bytes32 role, address account)
        external
        onlyRole(ASSET_MANAGER_ROLE)
    {
        uint256 hotelIndex = hotelIdToIndex[hotelId];
        if (hotelIndex == 0) revert HotelNotFound();

        Hotel storage hotel = hotels[hotelIndex];
        HotelAssetToken token = HotelAssetToken(hotel.tokenContract);

        token.grantRole(role, account);

        emit TokenRoleGranted(hotelId, role, account);
    }

    /**
     * @notice Mark revenue as claimed
     */
    function markRevenueClaimed(uint256 hotelIndex, address investor, uint256 amount)
        external
        onlyInvestment
    {
        uint256 claimable = claimableRevenue(hotelIndex, investor);
        if (amount > claimable) revert InsufficientRevenue();

        revenueClaimed[hotelIndex][investor] += amount;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Preview shares for investment amount
     */
    function previewShares(uint256 hotelIndex, uint256 usdcAmount)
        external
        view
        returns (uint256 shares)
    {
        Hotel memory hotel = hotels[hotelIndex];

        if (hotel.tokenContract == address(0)) {
            return 0;
        }

        if (hotel.pricePerShare == 0) {
            return 0;
        }

     uint256 usdcInWei = usdcAmount * 1e12;
     shares = usdcInWei / hotel.pricePerShare;
    }

    /**
     * @notice Check if hotel is available for investment
     */
    function isHotelAvailable(uint256 hotelIndex) external view returns (bool) {
        Hotel memory hotel = hotels[hotelIndex];

        if (hotel.tokenContract == address(0)) return false;
        if (!hotel.isVerified) return false;
        if (hotel.status != HotelStatus.Fundraising) return false;
        if (block.timestamp > hotel.fundingDeadline) return false;

        HotelAssetToken token = HotelAssetToken(hotel.tokenContract);
        return token.totalSupply() < token.maxSupply();
    }

    /**
     * @notice Get hotel by UUID
     */
    function getHotelByUUID(string calldata hotelId) external view returns (Hotel memory) {
        uint256 index = hotelIdToIndex[hotelId];
        return hotels[index];
    }

    function getHotelIdByHotelId(string memory _hotelId) external view returns (uint256) {
        uint256 index = hotelIdToIndex[_hotelId];
        require(index != 0, "Hotel not found");
        return index;
    }

    /**
     * @notice Get all hotels for a user
     */
    function getUserHotels(address user) external view returns (uint256[] memory) {
        return userHotels[user];
    }

    /**
     * @notice Get hotel token balance for user
     */
    function getUserHotelBalance(uint256 hotelIndex, address user)
        external
        view
        returns (uint256 balance, uint256 valueUSD)
    {
        Hotel memory hotel = hotels[hotelIndex];
        if (hotel.tokenContract == address(0)) return (0, 0);

        HotelAssetToken token = HotelAssetToken(hotel.tokenContract);
        balance = token.balanceOf(user);
        valueUSD = (balance * hotel.pricePerShare) / 1e18;
    }

    /**
     * @notice Get complete hotel information
     */
    function getHotelInfo(uint256 hotelIndex)
        external
        view
        returns (
            Hotel memory hotel,
            uint256 totalSupply,
            uint256 maxSupply,
            uint256 remainingShares,
            uint256 totalRevenueDistributed
        )
    {
        hotel = hotels[hotelIndex];

        if (hotel.tokenContract != address(0)) {
            HotelAssetToken token = HotelAssetToken(hotel.tokenContract);
            totalSupply = token.totalSupply();
            maxSupply = token.maxSupply();
            remainingShares = maxSupply - totalSupply;
        }

        totalRevenueDistributed = totalRevenue[hotelIndex];
    }
}
