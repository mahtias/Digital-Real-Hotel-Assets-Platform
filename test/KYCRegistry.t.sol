// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test, console } from "forge-std/Test.sol";
import { KYCRegistry } from "../contracts/KYCRegistry.sol";
import { IKYCRegistry } from "../contracts/interfaces/IKYCRegistry.sol";

contract KYCRegistryTest is Test {
    KYCRegistry public kyc;
    address public admin;
    address public verifier;
    address public user1;
    address public user2;

    // ✅ Event declarations (match interface exactly)
    event KYCSubmitted(address indexed user, IKYCRegistry.KYCLevel level, bytes32 documentHash);

    event KYCApproved(
        address indexed user,
        IKYCRegistry.KYCLevel requestedLevel,
        IKYCRegistry.KYCLevel approvedLevel,
        address indexed verifier,
        uint256 expiresAt
    );

    event KYCRejected(address indexed user, address indexed verifier, string reason);
    event KYCRevoked(address indexed user, address indexed revokedBy, string reason);

    function setUp() public {
        admin = makeAddr("admin");
        verifier = makeAddr("verifier");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // ✅ Deploy from admin, pass verifier as constructor argument
        vm.prank(admin);
        kyc = new KYCRegistry(verifier);

        // Constructor already grants:
        // - DEFAULT_ADMIN_ROLE to msg.sender (admin)
        // - VERIFIER_ROLE to msg.sender (admin)
        // - VERIFIER_ROLE to backendVerifier (verifier)
    }

    // ✅ FIXED: 3 parameters
    function testSubmitKYC() public {
        bytes32 docHash = keccak256("document1");

        vm.expectEmit(true, false, false, true);
        emit KYCSubmitted(user1, IKYCRegistry.KYCLevel.BASIC, docHash);

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        IKYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint256(record.status), uint256(IKYCRegistry.KYCStatus.PENDING));
        assertEq(uint256(record.level), uint256(IKYCRegistry.KYCLevel.BASIC));
        assertEq(record.documentHash, docHash);
    }

    // ✅ FIXED: 5 parameters for KYCApproved
    function testApproveKYC() public {
        bytes32 docHash = keccak256("document1");
        uint256 duration = 365 days;

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        uint256 expectedExpiry = block.timestamp + duration;

        vm.expectEmit(true, true, false, true);
        emit KYCApproved(
            user1,
            IKYCRegistry.KYCLevel.BASIC, // requestedLevel
            IKYCRegistry.KYCLevel.BASIC, // approvedLevel
            verifier, // verifier
            expectedExpiry // expiresAt
        );

        vm.prank(verifier);
        kyc.approveKYC(user1, IKYCRegistry.KYCLevel.BASIC, duration);

        assertTrue(kyc.isKYCValid(user1));
        IKYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint256(record.status), uint256(IKYCRegistry.KYCStatus.APPROVED));
        assertEq(record.verifiedBy, verifier);
    }

    function testRejectKYC() public {
        bytes32 docHash = keccak256("document1");

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        vm.expectEmit(true, true, false, true);
        emit KYCRejected(user1, verifier, "Invalid documents");

        vm.prank(verifier);
        kyc.rejectKYC(user1, "Invalid documents");

        IKYCRegistry.KYCRecord memory record = kyc.getKYCRecord(user1);
        assertEq(uint256(record.status), uint256(IKYCRegistry.KYCStatus.REJECTED));
        assertEq(record.rejectionReason, "Invalid documents");
    }

    function testRevokeKYC() public {
        bytes32 docHash = keccak256("document1");

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        vm.prank(verifier);
        kyc.approveKYC(user1, IKYCRegistry.KYCLevel.BASIC, 365 days);

        // ✅ FIXED: Expect the actual reason string from contract
        vm.expectEmit(true, true, false, true);
        emit KYCRevoked(user1, verifier, "Revoked by admin");

        vm.prank(verifier);
        kyc.revokeKYC(user1);

        assertFalse(kyc.isKYCValid(user1));
    }

    function testKYCExpiration() public {
        bytes32 docHash = keccak256("document1");
        uint256 duration = 365 days;

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        vm.prank(verifier);
        kyc.approveKYC(user1, IKYCRegistry.KYCLevel.BASIC, duration);

        assertTrue(kyc.isKYCValid(user1));

        vm.warp(block.timestamp + duration + 1);
        assertFalse(kyc.isKYCValid(user1));
    }

    function testOnlyVerifierCanApprove() public {
        bytes32 docHash = keccak256("document1");

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        vm.prank(user2);
        vm.expectRevert();
        kyc.approveKYC(user1, IKYCRegistry.KYCLevel.BASIC, 365 days);
    }

    function testPauseUnpause() public {
        vm.prank(admin);
        kyc.pause();

        bytes32 docHash = keccak256("document1");

        vm.prank(user1);
        vm.expectRevert();
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);

        vm.prank(admin);
        kyc.unpause();

        vm.prank(user1);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, docHash);
    }
}
