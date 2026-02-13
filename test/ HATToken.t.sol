// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {HATToken} from "../contracts/HATToken.sol";
import {KYCRegistry} from "../contracts/KYCRegistry.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract HATTokenTest is Test {
    HATToken hat;
    KYCRegistry kyc;

    address owner = address(0xA0); // Changed to EOA instead of contract
    address verifier = address(0xA1);
    address investor1 = address(0xB1);
    address investor2 = address(0xC1);

    function setUp() public {
        // Deploy registry WITH verifier
        kyc = new KYCRegistry(verifier);

        // KYC investor1 - investor submits their own KYC
        bytes32 docHash = keccak256("investor1-doc");

        // submitKYC should be called BY the investor
        vm.prank(investor1);
        kyc.submitKYC(KYCRegistry.KYCLevel.BASIC, docHash);

        // approveKYC expects: (address investor, uint256 level)
        // Verifier approves the KYC
        vm.prank(verifier);
        kyc.approveKYC(investor1, uint256(KYCRegistry.KYCLevel.BASIC));

        // Deploy token
        hat = new HATToken();
        hat.setKYCRegistry(address(kyc));

        // Mint once to owner (now an EOA)
        hat.mintForTest(owner, 1, 100);
    }

    // ----------------------------------------------------
    // TRANSFER BLOCKED WITHOUT KYC
    // ----------------------------------------------------
    function testTransferBlockedWithoutKYC() public {
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSignature("KYCRequired()"));
        hat.safeTransferFrom(owner, investor2, 1, 10, "");
    }

    // ----------------------------------------------------
    // TRANSFER ALLOWED WITH KYC
    // ----------------------------------------------------
    function testTransferAllowedWithKYC() public {
        vm.prank(owner);
        hat.safeTransferFrom(owner, investor1, 1, 10, "");

        assertEq(hat.balanceOf(investor1, 1), 10);
        assertEq(hat.balanceOf(owner, 1), 90);
    }
}
