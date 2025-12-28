// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from  "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title KYCRegistry
 * @dev Manages KYC verification for users with multiple levels
 */
contract KYCRegistry is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    enum KYCLevel { NONE, BASIC, ADVANCED }
    enum KYCStatus { NONE, PENDING, APPROVED, REJECTED, EXPIRED }
    
    struct KYCRecord {
        KYCLevel level;
        KYCStatus status;
        uint256 approvedAt;
        uint256 expiresAt;
        bytes32 documentHash;   
        address verifiedBy;
        string rejectionReason;
    }
    
    mapping(address => KYCRecord) private kycRecords;
    mapping(bytes32 => bool) public usedDocumentHashes;
    
    event KYCSubmitted(
        address indexed user,
        KYCLevel level,
        bytes32 documentHash,
        uint256 timestamp
    );
    
    event KYCApproved(
        address indexed user,
        KYCLevel level,
        address indexed verifier,
        uint256 expiresAt
    );
    
    event KYCRejected(
        address indexed user,
        address indexed verifier,
        string reason
    );
    
    event KYCRevoked(
        address indexed user,
        address indexed revoker,
        string reason
    );

    // deployer is a verifier   // backend becomes verifier
   constructor(address backendVerifier) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(VERIFIER_ROLE, msg.sender);            
    _grantRole(VERIFIER_ROLE, backendVerifier);      
}
   
    function getKYCStatus(address _user) external view returns (KYCStatus) {
    return kycRecords[_user].status;
}
    /**
     * @dev Submit KYC application
     */
    function submitKYC(
        KYCLevel _level,
        bytes32 _documentHash
    ) external whenNotPaused nonReentrant {
        require(_level != KYCLevel.NONE, "Invalid KYC level");
        require(_documentHash != bytes32(0), "Invalid document hash");
        require(!usedDocumentHashes[_documentHash], "Document hash already used");
        
        KYCRecord storage record = kycRecords[msg.sender];
        require(
            record.status == KYCStatus.NONE || 
            record.status == KYCStatus.REJECTED ||
            record.status == KYCStatus.EXPIRED,
            "KYC already pending or approved"
        );
        
        kycRecords[msg.sender] = KYCRecord({
            level: _level,
            status: KYCStatus.PENDING,
            approvedAt: 0,
            expiresAt: 0,
            documentHash: _documentHash,
            verifiedBy: address(0),
            rejectionReason: ""
        });
        
        usedDocumentHashes[_documentHash] = true;
        
        emit KYCSubmitted(msg.sender, _level, _documentHash, block.timestamp);
    }
    
    /**
     * @dev Approve KYC application
     */
    function approveKYC(
        address _user,
        uint256 _validityDuration
    ) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(_user != address(0), "Invalid address");
        KYCRecord storage record = kycRecords[_user];
        require(record.status == KYCStatus.PENDING, "KYC not pending");
        require(_validityDuration > 0, "Invalid duration");
        
        record.status = KYCStatus.APPROVED;
        record.approvedAt = block.timestamp;
        record.expiresAt = block.timestamp + _validityDuration;
        record.verifiedBy = msg.sender;
        
        emit KYCApproved(_user, record.level, msg.sender, record.expiresAt);
    }
    
    /**
     * @dev Reject KYC application
     */
    function rejectKYC(
        address _user,
        string calldata _reason
    ) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(_user != address(0), "Invalid address");
        KYCRecord storage record = kycRecords[_user];
        require(record.status == KYCStatus.PENDING, "KYC not pending");
        require(bytes(_reason).length > 0, "Reason required");
        
        record.status = KYCStatus.REJECTED;
        record.rejectionReason = _reason;
        record.verifiedBy = msg.sender;
        
        emit KYCRejected(_user, msg.sender, _reason);
    }
    
    /**
     * @dev Revoke approved KYC
     */
    function revokeKYC(
        address _user,
        string calldata _reason
    ) external onlyRole(VERIFIER_ROLE) {
        require(_user != address(0), "Invalid address");
        KYCRecord storage record = kycRecords[_user];
        require(record.status == KYCStatus.APPROVED, "KYC not approved");
        
        record.status = KYCStatus.REJECTED;
        record.rejectionReason = _reason;
        
        emit KYCRevoked(_user, msg.sender, _reason);
    }
    
    /**
     * @dev Check if KYC is valid and not expired
     */
    function isKYCValid(address _user) public view returns (bool) {
        KYCRecord memory record = kycRecords[_user];
        return record.status == KYCStatus.APPROVED && 
               block.timestamp < record.expiresAt;
    }
    
    /**
     * @dev Check if user has minimum KYC level
     */
    function hasKYCLevel(
        address _user,
        KYCLevel _level
    ) external view returns (bool) {
        if (!isKYCValid(_user)) return false;
        KYCRecord memory record = kycRecords[_user];
        return uint(record.level) >= uint(_level);
    }
    
    /**
     * @dev Get KYC record for user
     */
    function getKYCRecord(address _user) external view returns (KYCRecord memory) {
        return kycRecords[_user];
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
