// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IKYCRegistry.sol";

contract KYCRegistry is AccessControl, ReentrancyGuard, Pausable, IKYCRegistry {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    mapping(address => IKYCRegistry.KYCRecord) private kycRecords;
    mapping(bytes32 => bool) public usedDocumentHashes;

    //  DELETE THESE - They're already in IKYCRegistry
    // event KYCSubmitted(...);
    // event KYCApproved(...);
    // event KYCRejected(...);
    // event KYCRevoked(...);

    constructor(address backendVerifier) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, backendVerifier);
    }

    function getKYCStatus(address _user) external view returns (IKYCRegistry.KYCStatus) {
        return kycRecords[_user].status;
    }

    function submitKYC(IKYCRegistry.KYCLevel _level, bytes32 _documentHash)
        external
        override
        whenNotPaused
        nonReentrant
    {
        require(_level != IKYCRegistry.KYCLevel.NONE, "Invalid KYC level");
        require(_documentHash != bytes32(0), "Invalid document hash");
        require(!usedDocumentHashes[_documentHash], "Document hash already used");

        IKYCRegistry.KYCRecord storage record = kycRecords[msg.sender];
        require(
            record.status == IKYCRegistry.KYCStatus.NONE
                || record.status == IKYCRegistry.KYCStatus.REJECTED
                || record.status == IKYCRegistry.KYCStatus.EXPIRED,
            "KYC already pending or approved"
        );

        kycRecords[msg.sender] = IKYCRegistry.KYCRecord({
            level: _level,
            status: IKYCRegistry.KYCStatus.PENDING,
            approvedAt: 0,
            expiresAt: 0,
            documentHash: _documentHash,
            verifiedBy: address(0),
            rejectionReason: ""
        });

        usedDocumentHashes[_documentHash] = true;

        // ✅ Event is inherited from IKYCRegistry
        emit KYCSubmitted(msg.sender, _level, _documentHash);
    }

    function approveKYC(
        address _user,
        IKYCRegistry.KYCLevel _approvedLevel,
        uint256 _validityDuration
    ) external override onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(_user != address(0), "Invalid address");
        require(_approvedLevel != IKYCRegistry.KYCLevel.NONE, "Invalid KYC level");
        require(_validityDuration > 0, "Invalid duration");

        IKYCRegistry.KYCRecord storage record = kycRecords[_user];
        require(record.status == IKYCRegistry.KYCStatus.PENDING, "KYC not pending");

        // ✅ ADD: Prevent approving at lower level than submitted
        require(_approvedLevel >= record.level, "Cannot approve at lower level than submitted");

        IKYCRegistry.KYCLevel requestedLevel = record.level;

        record.level = _approvedLevel;
        record.status = IKYCRegistry.KYCStatus.APPROVED;
        record.approvedAt = block.timestamp;
        record.expiresAt = block.timestamp + _validityDuration;
        record.verifiedBy = msg.sender;

        // ✅ Event is inherited from IKYCRegistry
        emit KYCApproved(_user, requestedLevel, _approvedLevel, msg.sender, record.expiresAt);
    }

    function rejectKYC(address _user, string calldata _reason)
        external
        override
        onlyRole(VERIFIER_ROLE)
        whenNotPaused
    {
        require(_user != address(0), "Invalid address");
        IKYCRegistry.KYCRecord storage record = kycRecords[_user];
        require(record.status == IKYCRegistry.KYCStatus.PENDING, "KYC not pending");
        require(bytes(_reason).length > 0, "Reason required");

        record.status = IKYCRegistry.KYCStatus.REJECTED;
        record.rejectionReason = _reason;
        record.verifiedBy = msg.sender;

        // ✅ Event is inherited from IKYCRegistry
        emit KYCRejected(_user, msg.sender, _reason);
    }

    function revokeKYC(address _user) external override onlyRole(VERIFIER_ROLE) {
        _revokeKYCInternal(_user, "Revoked by admin");
    }

    function revokeKYCWithReason(address _user, string calldata _reason)
        external
        onlyRole(VERIFIER_ROLE)
    {
        _revokeKYCInternal(_user, _reason);
    }

    function _revokeKYCInternal(address _user, string memory _reason) private {
        require(_user != address(0), "Invalid address");
        IKYCRegistry.KYCRecord storage record = kycRecords[_user];
        require(record.status == IKYCRegistry.KYCStatus.APPROVED, "KYC not approved");

        record.status = IKYCRegistry.KYCStatus.REJECTED;
        record.rejectionReason = _reason;

        // ✅ Event is inherited from IKYCRegistry
        emit KYCRevoked(_user, msg.sender, _reason);
    }

    function isKYCValid(address _user) public view returns (bool) {
        IKYCRegistry.KYCRecord memory record = kycRecords[_user];
        return
            record.status == IKYCRegistry.KYCStatus.APPROVED && block.timestamp < record.expiresAt;
    }

    function isKYCVerified(address _user) external view override returns (bool) {
        return isKYCValid(_user);
    }

    function hasValidKYC(address _user, IKYCRegistry.KYCLevel _requiredLevel)
        external
        view
        override
        returns (bool)
    {
        if (!isKYCValid(_user)) return false;
        IKYCRegistry.KYCRecord memory record = kycRecords[_user];
        return uint256(record.level) >= uint256(_requiredLevel);
    }

    function hasKYCLevel(address _user, IKYCRegistry.KYCLevel _level)
        external
        view
        override
        returns (bool)
    {
        IKYCRegistry.KYCRecord memory record = kycRecords[_user];
        return uint256(record.level) >= uint256(_level);
    }

    function getKYCData(address _user)
        external
        view
        override
        returns (IKYCRegistry.KYCLevel level, bool isApproved, uint256 expiryDate)
    {
        IKYCRegistry.KYCRecord memory record = kycRecords[_user];
        return (record.level, record.status == IKYCRegistry.KYCStatus.APPROVED, record.expiresAt);
    }

    function getKYCRecord(address _user) external view returns (IKYCRegistry.KYCRecord memory) {
        return kycRecords[_user];
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
