// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IKYCRegistry.sol";

contract HotelYieldVault is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ALLOCATOR_ROLE = keccak256("ALLOCATOR_ROLE");

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    IERC20 public immutable stablecoin;

    IKYCRegistry public kycRegistry;

    mapping(address => uint256) public claimableYield;

    // Prevent duplicate processing
    mapping(bytes32 => bool) public processedDistributions;

    uint256 public totalDeposited;
    uint256 public totalAllocated;
    uint256 public totalClaimed;

    struct DistributionInfo {
        uint256 amount;
        uint256 timestamp;
        address allocator;
    }

    mapping(bytes32 => DistributionInfo) public distributions;

    event YieldDeposited(address indexed depositor, uint256 amount);

    event YieldAllocated(bytes32 indexed distributionId, address indexed investor, uint256 amount);

    event YieldClaimed(address indexed investor, uint256 amount);

    event DistributionProcessed(
        bytes32 indexed distributionId, uint256 totalAmount, address indexed allocator
    );

    event KYCRegistryUpdated(address indexed oldRegistry, address indexed newRegistry);

    constructor(address stablecoinAddress, address admin, address kycRegistryAddress) {
        require(stablecoinAddress != address(0), "Invalid stablecoin");
        require(admin != address(0), "Invalid admin");
        require(kycRegistryAddress != address(0), "Invalid KYC registry");

        stablecoin = IERC20(stablecoinAddress);
        kycRegistry = IKYCRegistry(kycRegistryAddress);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ALLOCATOR_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function setKYCRegistry(address newRegistry) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRegistry != address(0), "Invalid KYC registry");
        emit KYCRegistryUpdated(address(kycRegistry), newRegistry);
        kycRegistry = IKYCRegistry(newRegistry);
    }

    // ====================================================
    // VAULT FUNDING
    // ====================================================

    function depositYield(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(amount > 0, "Invalid amount");

        stablecoin.safeTransferFrom(msg.sender, address(this), amount);

        totalDeposited += amount;

        emit YieldDeposited(msg.sender, amount);
    }

    // ====================================================
    // ALLOCATION
    // ====================================================

    function addClaimable(bytes32 distributionId, address investor, uint256 amount)
        external
        onlyRole(ALLOCATOR_ROLE)
        whenNotPaused
    {
        require(!processedDistributions[distributionId], "Distribution already processed");

        require(investor != address(0), "Invalid investor");

        require(amount > 0, "Invalid amount");

        require(
            totalAllocated + amount <= stablecoin.balanceOf(address(this)),
            "Insufficient vault balance"
        );

        processedDistributions[distributionId] = true;

        claimableYield[investor] += amount;

        totalAllocated += amount;

        distributions[distributionId] =
            DistributionInfo({ amount: amount, timestamp: block.timestamp, allocator: msg.sender });

        emit YieldAllocated(distributionId, investor, amount);

        emit DistributionProcessed(distributionId, amount, msg.sender);
    }

    function addClaimableBatch(
        bytes32[] calldata distributionIds,
        address[] calldata investors,
        uint256[] calldata amounts
    ) external onlyRole(ALLOCATOR_ROLE) whenNotPaused {
        uint256 length = investors.length;

        require(length == amounts.length, "Length mismatch");
        require(length == distributionIds.length, "Length mismatch");

        // =====================================
        // Validate total batch allocation
        // =====================================

        uint256 totalBatchAmount;

        for (uint256 i = 0; i < length; i++) {
            require(amounts[i] > 0, "Invalid amount");
            totalBatchAmount += amounts[i];
        }

        require(
            totalAllocated + totalBatchAmount <= stablecoin.balanceOf(address(this)),
            "Insufficient vault balance"
        );

        // =====================================
        // Process allocations
        // =====================================

        for (uint256 i = 0; i < length; i++) {
            require(!processedDistributions[distributionIds[i]], "Distribution processed");

            require(investors[i] != address(0), "Invalid investor");

            processedDistributions[distributionIds[i]] = true;

            claimableYield[investors[i]] += amounts[i];

            totalAllocated += amounts[i];

            distributions[distributionIds[i]] = DistributionInfo({
                amount: amounts[i], timestamp: block.timestamp, allocator: msg.sender
            });

            emit YieldAllocated(distributionIds[i], investors[i], amounts[i]);
        }
    }

    // ====================================================
    // CLAIM
    // ====================================================

    function claimYield() external nonReentrant whenNotPaused {
        require(kycRegistry.isKYCVerified(msg.sender), "KYC not verified");

        uint256 amount = claimableYield[msg.sender];

        require(amount > 0, "No claimable yield");

        claimableYield[msg.sender] = 0;

        totalAllocated -= amount;
        totalClaimed += amount;

        stablecoin.safeTransfer(msg.sender, amount);

        emit YieldClaimed(msg.sender, amount);
    }

    // ====================================================
    // ADMIN
    // ====================================================

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function emergencyWithdraw(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            stablecoin.balanceOf(address(this)) - amount >= totalAllocated,
            "Allocated funds protected"
        );

        stablecoin.safeTransfer(msg.sender, amount);
    }

    // ====================================================
    // VIEWS
    // ====================================================

    function getVaultStats()
        external
        view
        returns (uint256 deposited, uint256 allocated, uint256 claimed, uint256 vaultBalance)
    {
        return (totalDeposited, totalAllocated, totalClaimed, stablecoin.balanceOf(address(this)));
    }

    function getClaimableYield(address investor) external view returns (uint256) {
        return claimableYield[investor];
    }
}
