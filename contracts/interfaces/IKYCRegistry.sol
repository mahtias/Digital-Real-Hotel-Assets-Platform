// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IKYCRegistry {
    // ========================================
    // ENUMS
    // ========================================

    enum KYCLevel {
        NONE,
        BASIC,
        ADVANCED
    }

    enum KYCStatus {
        NONE,
        PENDING,
        APPROVED,
        REJECTED,
        EXPIRED
    }

    // ========================================
    // STRUCTS
    // ========================================

    struct KYCRecord {
        KYCLevel level;
        KYCStatus status;
        uint256 approvedAt;
        uint256 expiresAt;
        bytes32 documentHash;
        address verifiedBy;
        string rejectionReason;
    }

    // ========================================
    // EVENTS
    // ========================================

    /// @notice Emitted when a user submits KYC documentation
    /// @param user Address of the user
    /// @param level KYC level requested
    /// @param documentHash Hash of submitted documents
    event KYCSubmitted(address indexed user, KYCLevel level, bytes32 documentHash);

    /// @notice Emitted when KYC is approved
    /// @param user Address of the user
    /// @param requestedLevel KYC level originally requested
    /// @param approvedLevel KYC level actually approved
    /// @param verifier Address of the verifier
    /// @param expiresAt Expiration timestamp
    event KYCApproved(
        address indexed user,
        KYCLevel requestedLevel,
        KYCLevel approvedLevel,
        address indexed verifier,
        uint256 expiresAt
    );

    /// @notice Emitted when KYC is rejected
    /// @param user Address of the user
    /// @param verifier Address of the verifier
    /// @param reason Rejection reason
    event KYCRejected(address indexed user, address indexed verifier, string reason);

    /// @notice Emitted when KYC is revoked
    /// @param user Address of the user
    /// @param revokedBy Address of admin who revoked
    /// @param reason Revocation reason
    event KYCRevoked(address indexed user, address indexed revokedBy, string reason);

    /// @notice Emitted when KYC expires
    /// @param user Address of the user
    event KYCExpired(address indexed user);

    // ========================================
    // EXTERNAL FUNCTIONS
    // ========================================

    /// @notice Submit KYC documentation for verification
    /// @param level Desired KYC level
    /// @param documentHash Hash of KYC documents
    function submitKYC(KYCLevel level, bytes32 documentHash) external;

    /// @notice Approve a pending KYC submission
    /// @param user Address of the user
    /// @param approvedLevel KYC level to approve (can differ from requested)
    /// @param validityPeriod How long the KYC is valid (in seconds)
    function approveKYC(address user, KYCLevel approvedLevel, uint256 validityPeriod) external;

    /// @notice Reject a pending KYC submission
    /// @param user Address of the user
    /// @param reason Reason for rejection
    function rejectKYC(address user, string calldata reason) external;

    /// @notice Revoke an approved KYC
    /// @param user Address of the user
    function revokeKYC(address user) external;

    // ========================================
    // VIEW FUNCTIONS
    // ========================================

    /// @notice Check if user has valid (non-expired, approved) KYC
    /// @param user Address to check
    /// @return true if KYC is valid
    function isKYCValid(address user) external view returns (bool);

    /// @notice Check if user's KYC is verified (approved, may be expired)
    /// @param user Address to check
    /// @return true if KYC is verified
    function isKYCVerified(address user) external view returns (bool);

    /// @notice Get KYC status for a user
    /// @param user Address to check
    /// @return Current KYC status
    function getKYCStatus(address user) external view returns (KYCStatus);

    /// @notice Get complete KYC record for a user
    /// @param user Address to check
    /// @return Complete KYC record
    function getKYCRecord(address user) external view returns (KYCRecord memory);

    /// @notice Check if user has at least the specified KYC level
    /// @param user Address to check
    /// @param level Minimum required level
    /// @return true if user has at least this level
    function hasKYCLevel(address user, KYCLevel level) external view returns (bool);

    /// @notice Check if user has valid KYC at required level
    /// @param user Address to check
    /// @param requiredLevel Minimum required level
    /// @return true if user has valid KYC at required level
    function hasValidKYC(address user, KYCLevel requiredLevel) external view returns (bool);

    /// @notice Get simplified KYC data
    /// @param user Address to check
    /// @return level Current KYC level
    /// @return isApproved Whether KYC is approved
    /// @return expiryDate When KYC expires
    function getKYCData(address user)
        external
        view
        returns (KYCLevel level, bool isApproved, uint256 expiryDate);
}
