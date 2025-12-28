// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {KYCRegistry} from "../contracts/KYCRegistry.sol";

contract KYCRegistryTest is Test {
    KYCRegistry public kyc;
    
    address public admin = address(1);
    address public verifier = address(2);
    address public user1 = address(3);
    address public user2 = address(4);
    
    event KYCSubmitted(
        address indexed user,
        KYCRegistry.KYCLevel level,
        bytes32 documentHash,
        uint256 timestamp
    );
    
    event KYCApproved(
        address indexed user,
        KYCRegistry.KYCLevel level,
        address indexed verifier,
        uint256 expiresAt
    );
    
    function setUp() public {
        vm.startPrank(admin);
        kyc = new KYCRegistry();
        kyc.grantRole(kyc.VERIFIER_ROLE(), verifier);
        vm.stopPrank();
    }
    
    function testSubmitKYC() public {
        bytes32 docHash = keccak256("document1");
        
        vm.expectEmit(true, false, false, true);
        emit KYCSubmitted(user1, KYCRegistry.KYCLevel.BASIC, docHash, block.timestamp);
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        KYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint(record.status), uint(KYCRegistry.KYCStatus.PENDING));
        assertEq(uint(record.level), uint(KYCRegistry.KYCLevel.BASIC));
        assertEq(record.documentHash, docHash);
    }
    
    function testCannotSubmitDuplicateHash() public {
        bytes32 docHash = keccak256("document1");
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        vm.prank(user2);
        vm.expectRevert("Document hash already used");
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
    }
    
    function testCannotSubmitWhenPending() public {
        bytes32 docHash1 = keccak256("document1");
        bytes32 docHash2 = keccak256("document2");
        
        vm.startPrank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash1);
        
        vm.expectRevert("KYC already pending or approved");
        kyc.submitKYC(KYCRegistry.KYCLevel.ADVANCED, docHash2);
        vm.stopPrank();
    }
    
    function testApproveKYC() public {
        bytes32 docHash = keccak256("document1");
        uint256 duration = 365 days;
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        uint256 expectedExpiry = block.timestamp + duration;
        
        vm.expectEmit(true, false, true, true);
        emit KYCApproved(user1, KYCRegistry.KYCLevel.BASIC, verifier, expectedExpiry);
        
        vm.prank(verifier);
        kyc.approveKYC(user1, duration);
        
        assertTrue(kyc.isKYCValid(user1));
        assertTrue(kyc.hasKYCLevel(user1, KYCRegistry.KYCLevel.BASIC));
        assertFalse(kyc.hasKYCLevel(user1, KYCRegistry.KYCLevel.ADVANCED));
        
        KYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint(record.status), uint(KYCRegistry.KYCStatus.APPROVED));
        assertEq(record.expiresAt, expectedExpiry);
        assertEq(record.verifiedBy, verifier);
    }
    
    function testRejectKYC() public {
        bytes32 docHash = keccak256("document1");
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        vm.prank(verifier);
        kyc.rejectKYC(user1, "Invalid documents");
        
        assertFalse(kyc.isKYCValid(user1));
        
        KYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint(record.status), uint(KYCRegistry.KYCStatus.REJECTED));
        assertEq(record.rejectionReason, "Invalid documents");
    }
    
    function testRevokeKYC() public {
        bytes32 docHash = keccak256("document1");
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        vm.prank(verifier);
        kyc.approveKYC(user1, 365 days);
        
        assertTrue(kyc.isKYCValid(user1));
        
        vm.prank(verifier);
        kyc.revokeKYC(user1, "Policy violation");
        
        assertFalse(kyc.isKYCValid(user1));
        
        KYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint(record.status), uint(KYCRegistry.KYCStatus.REJECTED));
    }
    
    function testKYCExpiration() public {
        bytes32 docHash = keccak256("document1");
        uint256 duration = 365 days;
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        vm.prank(verifier);
        kyc.approveKYC(user1, duration);
        
        assertTrue(kyc.isKYCValid(user1));
        
        // Fast forward past expiration
        vm.warp(block.timestamp + duration + 1);
        
        assertFalse(kyc.isKYCValid(user1));
    }
    
    function testOnlyVerifierCanApprove() public {
        bytes32 docHash = keccak256("document1");
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        vm.prank(user2);
        vm.expectRevert();
        kyc.approveKYC(user1, 365 days);
    }
    
    function testPauseUnpause() public {
        vm.prank(admin);
        kyc.pause();
        
        bytes32 docHash = keccak256("document1");
        
        vm.prank(user1);
        vm.expectRevert();
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        vm.prank(admin);
        kyc.unpause();
        
        vm.prank(user1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);
        
        KYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint(record.status), uint(KYCRegistry.KYCStatus.PENDING));
    }
}
