// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IKYCRegistry.sol";

/**
 * @title HotelAssetToken
 * @notice ERC-20 token for fractional hotel ownership with advanced KYC
 */
contract HotelAssetToken is ERC20, ERC20Burnable, AccessControl, ReentrancyGuard, Pausable {
    // ============ ROLES ============

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ============ STATE VARIABLES ============

    IKYCRegistry public immutable kycRegistry;
    IKYCRegistry.KYCLevel public requiredKYCLevel; // NEW: Required KYC level

    uint256 public immutable maxSupply;
    uint256 public tokenPriceUSD;
    string public hotelId;
    string public hotelName;
    string public location;
    uint256 public immutable deployedAt;

    // Investment tracking
    mapping(address => uint256) public investmentTimestamp;
    mapping(address => uint256) public totalInvested;

    // ============ EVENTS ============

    event TokensMinted(address indexed to, uint256 amount, uint256 valueUSD, uint256 timestamp);
    event TokensBurned(address indexed from, uint256 amount, uint256 timestamp);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice, uint256 timestamp);
    event KYCCheckFailed(address indexed user, uint8 status, uint256 timestamp);
    event RequiredKYCLevelUpdated(IKYCRegistry.KYCLevel oldLevel, IKYCRegistry.KYCLevel newLevel);

    // ============ ERRORS ============

    error ExceedsMaxSupply();
    error InvalidPrice();
    error InvalidAddress();
    error InvalidAmount();
    error KYCNotVerified(address user);
    error InsufficientKYCLevel(address user, IKYCRegistry.KYCLevel required);
    error KYCExpired(address user);

    // ============ MODIFIERS ============

    /**
     * @dev Check KYC verification with level requirement
     */
    modifier onlyKycVerified(address user) {
        _onlyKycVerified(user);
        _;
    }

    /**
     * @dev Internal function to check KYC verification
     * Reverts with specific error based on KYC status
     */
    function _onlyKycVerified(address user) internal {
        // Check if KYC is valid (approved and not expired)
        if (!kycRegistry.isKYCValid(user)) {
            // Get status as uint8: 0=NONE, 1=PENDING, 2=APPROVED, 3=REJECTED, 4=EXPIRED
            uint8 statusCode = uint8(kycRegistry.getKYCStatus(user));
            emit KYCCheckFailed(user, statusCode, block.timestamp);

            // Compare as numbers
            if (statusCode == 4) {
                //
                revert KYCExpired(user);
            } else {
                revert KYCNotVerified(user);
            }
        }

        // Check if user has required KYC level
        if (!kycRegistry.hasKYCLevel(user, requiredKYCLevel)) {
            revert InsufficientKYCLevel(user, requiredKYCLevel);
        }
    }

    // ============ CONSTRUCTOR ============

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _hotelId,
        string memory _hotelName,
        string memory _location,
        uint256 _maxSupply,
        uint256 _initialPriceUSD,
        address _kycRegistry,
        address _admin,
        IKYCRegistry.KYCLevel _requiredKYCLevel
    ) ERC20(_name, _symbol) {
        if (_maxSupply == 0) revert InvalidAmount();
        if (_initialPriceUSD == 0) revert InvalidPrice();
        if (_kycRegistry == address(0)) revert InvalidAddress();
        if (_admin == address(0)) revert InvalidAddress();

        hotelId = _hotelId;
        hotelName = _hotelName;
        location = _location;
        maxSupply = _maxSupply;
        tokenPriceUSD = _initialPriceUSD;
        kycRegistry = IKYCRegistry(_kycRegistry);
        requiredKYCLevel = _requiredKYCLevel;
        deployedAt = block.timestamp;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MANAGER_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
    }

    // ============ MINTING ============

    /**
     * @notice Mint tokens for investor (with KYC check)
     */
    function mintInvestment(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        onlyKycVerified(to)
        nonReentrant
        whenNotPaused
    {
        if (to == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (totalSupply() + amount > maxSupply) revert ExceedsMaxSupply();

        // Track investment
        investmentTimestamp[to] = block.timestamp;
        uint256 valueUSD = (amount * tokenPriceUSD) / (10 ** decimals());
        totalInvested[to] += valueUSD;

        _mint(to, amount);

        emit TokensMinted(to, amount, valueUSD, block.timestamp);
    }

    /**
     * @notice Batch mint for multiple investors
     */
    function batchMintInvestments(address[] calldata recipients, uint256[] calldata amounts)
        external
        onlyRole(MINTER_ROLE)
        nonReentrant
        whenNotPaused
    {
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length <= 50, "Too many recipients");

        uint256 totalAmount = 0;

        // Validate all recipients first
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert InvalidAddress();
            if (amounts[i] == 0) revert InvalidAmount();

            // Check KYC
            if (!kycRegistry.isKYCValid(recipients[i])) {
                revert KYCNotVerified(recipients[i]);
            }
            if (!kycRegistry.hasKYCLevel(recipients[i], requiredKYCLevel)) {
                revert InsufficientKYCLevel(recipients[i], requiredKYCLevel);
            }

            totalAmount += amounts[i];
        }

        if (totalSupply() + totalAmount > maxSupply) revert ExceedsMaxSupply();

        // Mint to all recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            investmentTimestamp[recipients[i]] = block.timestamp;
            uint256 valueUSD = (amounts[i] * tokenPriceUSD) / (10 ** decimals());
            totalInvested[recipients[i]] += valueUSD;

            _mint(recipients[i], amounts[i]);

            emit TokensMinted(recipients[i], amounts[i], valueUSD, block.timestamp);
        }
    }

    // ============ BURNING ============

    /**
     * @notice Burn tokens (e.g., for redemptions/buybacks)
     */
    function burnInvestment(address from, uint256 amount) external onlyRole(MANAGER_ROLE) {
        if (from == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        _burn(from, amount);
        emit TokensBurned(from, amount, block.timestamp);
    }

    // ============ TRANSFERS (with KYC) ============

    /**
     * @dev Override transfer to enforce KYC on both sender and recipient
     */
    function transfer(address to, uint256 amount)
        public
        virtual
        override
        onlyKycVerified(msg.sender)
        onlyKycVerified(to)
        whenNotPaused
        returns (bool)
    {
        return super.transfer(to, amount);
    }

    /**
     * @dev Override transferFrom to enforce KYC
     */
    function transferFrom(address from, address to, uint256 amount)
        public
        virtual
        override
        onlyKycVerified(from)
        onlyKycVerified(to)
        whenNotPaused
        returns (bool)
    {
        return super.transferFrom(from, to, amount);
    }

    // ============ MANAGEMENT ============

    /**
     * @notice Update token price
     */
    function updatePrice(uint256 newPriceUSD) external onlyRole(MANAGER_ROLE) {
        if (newPriceUSD == 0) revert InvalidPrice();
        uint256 oldPrice = tokenPriceUSD;
        tokenPriceUSD = newPriceUSD;
        emit PriceUpdated(oldPrice, newPriceUSD, block.timestamp);
    }

    /**
     * @notice Update required KYC level
     */
    function updateRequiredKYCLevel(IKYCRegistry.KYCLevel newLevel)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        IKYCRegistry.KYCLevel oldLevel = requiredKYCLevel;
        requiredKYCLevel = newLevel;
        emit RequiredKYCLevelUpdated(oldLevel, newLevel);
    }

    /**
     * @notice Pause token (emergency)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause token
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return maxSupply - totalSupply();
    }

    /**
     * @notice Check if address has valid KYC
     */
    function checkKYC(address user)
        external
        view
        returns (bool isValid, uint8 status, IKYCRegistry.KYCLevel level, bool hasRequiredLevel)
    {
        isValid = kycRegistry.isKYCValid(user);

        //  Cast enum to uint8
        // Assume getKYCStatus returns a uint8 or an enum; cast directly to uint8
        status = uint8(kycRegistry.getKYCStatus(user));

        IKYCRegistry.KYCRecord memory record = kycRegistry.getKYCRecord(user);
        // This line retrieves the KYC record for the user, already assigned above.
        level = record.level;
        hasRequiredLevel = kycRegistry.hasKYCLevel(user, requiredKYCLevel);
    }

    /**
     * @notice Get KYC record details for a user
     * @param user Address to check
     * @return level KYC level (0=NONE, 1=BASIC, 2=ADVANCED)
     * @return status KYC status (0=NONE, 1=PENDING, 2=APPROVED, 3=REJECTED, 4=EXPIRED)
     * @return approvedAt Timestamp when KYC was approved
     * @return expiresAt Timestamp when KYC expires
     */
    function getKYCRecord(address user)
        external
        view
        returns (uint8 level, uint8 status, uint256 approvedAt, uint256 expiresAt)
    {
        IKYCRegistry.KYCRecord memory record = kycRegistry.getKYCRecord(user);

        level = uint8(record.level);
        status = uint8(record.status);
        approvedAt = record.approvedAt;
        expiresAt = record.expiresAt;
    }

    /**
     * @notice Get complete token information
     */
    function getTokenInfo()
        external
        view
        returns (
            string memory _hotelId,
            string memory _hotelName,
            string memory _location,
            uint256 _totalSupply,
            uint256 _maxSupply,
            uint256 _priceUSD,
            uint256 _deployedAt,
            bool _paused,
            IKYCRegistry.KYCLevel _requiredKYCLevel
        )
    {
        return (
            hotelId,
            hotelName,
            location,
            totalSupply(),
            maxSupply,
            tokenPriceUSD,
            deployedAt,
            paused(),
            requiredKYCLevel
        );
    }

    /**
     * @notice Calculate USD value of tokens
     */
    function calculateValue(uint256 tokenAmount) external view returns (uint256 valueUSD) {
        return (tokenAmount * tokenPriceUSD) / (10 ** decimals());
    }

    /**
     * @notice Get investor information
     */
    function getInvestorInfo(address investor)
        external
        view
        returns (
            uint256 balance,
            uint256 valueUSD,
            uint256 firstInvestmentTime,
            uint256 totalInvestedUSD
        )
    {
        balance = balanceOf(investor);
        valueUSD = (balance * tokenPriceUSD) / (10 ** decimals());
        firstInvestmentTime = investmentTimestamp[investor];
        totalInvestedUSD = totalInvested[investor];
    }
}
