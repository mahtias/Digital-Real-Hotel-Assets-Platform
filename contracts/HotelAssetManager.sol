// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./HATToken.sol";

contract HotelAssetManager is AccessControl, ReentrancyGuard, IERC1155Receiver {
    bytes32 public constant ASSET_MANAGER_ROLE = keccak256("ASSET_MANAGER_ROLE");

    HATToken public hatToken;
    address public investmentContract;
    uint256 public nextHotelId = 1;

    error NotInvestment();
    error HotelNotVerified();
    error FundingClosed();
    error InsufficientShares();
    error InvestmentTooSmall();
    error InsufficientRevenue();
    error InvalidHotel();
    error AlreadyVerified();
    error InvalidParameters();

    enum HotelStatus {
        Pending,
        Fundraising,
        Funded,
        Operational,
        Closed
    }

    struct Hotel {
        string name;
        string location;
        string imageUrl;
        address propertyOwner;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        uint256 minimumInvestment;
        uint256 fundingDeadline;
        HotelStatus status;
        bool isVerified;
    }

    mapping(uint256 => Hotel) public hotels;
    mapping(uint256 => mapping(address => uint256)) public investorShares;
    mapping(uint256 => uint256) public totalRevenue;
    mapping(uint256 => mapping(address => uint256)) public revenueClaimed;
    mapping(uint256 => uint256) public hotelTotalInvestments;

    event HotelListed(
        uint256 indexed hotelId, string name, address indexed propertyOwner, uint256 totalShares, uint256 pricePerShare
    );
    event HotelVerified(uint256 indexed hotelId);
    event SharesMinted(uint256 indexed hotelId, address indexed investor, uint256 shares);
    event RevenueDistributed(uint256 indexed hotelId, uint256 amount);
    event InvestmentContractSet(address indexed investmentContract);

    modifier onlyInvestment() {
        _onlyInvestment();
        _;
    }

    function _onlyInvestment() internal view {
        if (msg.sender != investmentContract) revert NotInvestment();
    }

    constructor(address _hatToken) {
        hatToken = HATToken(_hatToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ASSET_MANAGER_ROLE, msg.sender);
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId) || interfaceId == type(IERC1155Receiver).interfaceId;
    }

    function setInvestmentContract(address _investment) external onlyRole(DEFAULT_ADMIN_ROLE) {
        investmentContract = _investment;
        emit InvestmentContractSet(_investment);
    }

    function listHotel(
        string calldata name,
        string calldata location,
        string calldata imageUrl,
        address propertyOwner,
        uint256 totalShares,
        uint256 pricePerShare,
        uint256 minimumInvestment,
        uint256 fundingDuration
    ) external onlyRole(ASSET_MANAGER_ROLE) returns (uint256) {
        if (totalShares == 0 || pricePerShare == 0) revert InvalidParameters();

        uint256 hotelId = nextHotelId++;

        hotels[hotelId] = Hotel({
            name: name,
            location: location,
            imageUrl: imageUrl,
            propertyOwner: propertyOwner,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            minimumInvestment: minimumInvestment,
            fundingDeadline: block.timestamp + fundingDuration,
            status: HotelStatus.Pending,
            isVerified: false
        });

        emit HotelListed(hotelId, name, propertyOwner, totalShares, pricePerShare);
        return hotelId;
    }

    function verifyHotel(uint256 hotelId) external onlyRole(ASSET_MANAGER_ROLE) {
        Hotel storage hotel = hotels[hotelId];
        if (hotel.isVerified) revert AlreadyVerified();

        hotel.isVerified = true;
        hotel.status = HotelStatus.Fundraising;

        emit HotelVerified(hotelId);
    }

    function mintShares(uint256 hotelId, address investor, uint256 shares, uint256 usdcAmount)
        external
        onlyInvestment
        nonReentrant
    {
        Hotel storage hotel = hotels[hotelId];

        if (!hotel.isVerified) revert HotelNotVerified();
        if (block.timestamp > hotel.fundingDeadline) revert FundingClosed();
        if (shares > hotel.availableShares) revert InsufficientShares();
        if (usdcAmount < hotel.minimumInvestment) revert InvestmentTooSmall();

        hotel.availableShares -= shares;
        investorShares[hotelId][investor] += shares;
        hotelTotalInvestments[hotelId] += usdcAmount;

        hatToken.mint(investor, hotelId, shares, "");

        emit SharesMinted(hotelId, investor, shares);
    }

    function distributeRevenue(uint256 hotelId, uint256 amount) external onlyRole(ASSET_MANAGER_ROLE) {
        totalRevenue[hotelId] += amount;
        emit RevenueDistributed(hotelId, amount);
    }

    /**
     * @notice Calculate claimable revenue for an investor
     * ✅ Uses totalShares as denominator (Option 1)
     */
    function claimableRevenue(uint256 hotelId, address investor) public view returns (uint256) {
        uint256 shares = investorShares[hotelId][investor];
        if (shares == 0) return 0;

        Hotel memory hotel = hotels[hotelId];
        uint256 totalRev = totalRevenue[hotelId];
        uint256 claimed = revenueClaimed[hotelId][investor];

        // ✅ KEY FIX: Divide by totalShares (not availableShares or soldShares)
        uint256 totalClaimable = (totalRev * shares) / hotel.totalShares;

        return totalClaimable > claimed ? totalClaimable - claimed : 0;
    }

    function markRevenueClaimed(uint256 hotelId, address investor, uint256 amount) external onlyInvestment {
        uint256 claimable = claimableRevenue(hotelId, investor);
        if (amount > claimable) revert InsufficientRevenue();

        revenueClaimed[hotelId][investor] += amount;
    }

    function previewShares(uint256 hotelId, uint256 usdcAmount) external view returns (uint256) {
        Hotel memory hotel = hotels[hotelId];
        return (usdcAmount * 1e18) / hotel.pricePerShare;
    }

    function isHotelAvailable(uint256 hotelId) external view returns (bool) {
        Hotel memory hotel = hotels[hotelId];
        return hotel.isVerified && hotel.status == HotelStatus.Fundraising && hotel.availableShares > 0
            && block.timestamp <= hotel.fundingDeadline;
    }
}
