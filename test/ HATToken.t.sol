// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {HATToken} from "../contracts/HATToken.sol";

contract HATTokenTest is Test {
    HATToken hat;

    address owner = address(0xA1);
    address investor1 = address(0xB1);
    address investor2 = address(0xC1);

    function setUp() public {
        vm.prank(owner);
        hat = new HATToken();

        // Make owner the msg.sender for all owner-only functions
        vm.startPrank(owner);
    }

    // ----------------------------------------------------
    // CREATE HOTEL
    // ----------------------------------------------------
    function testCreateHotel() public {
        hat.createHotel(
            1,
            "Hotel A",
            "Paris",
            "FR",
            "https://image.xyz",
            1000,
            1 ether,
            "Luxury hotel"
        );

        (string memory name,, , , uint256 totalTokens,,) = hat.hotels(1);

        assertEq(name, "Hotel A");
        assertEq(totalTokens, 1000);
        assertEq(hat.balanceOf(owner, 1), 1000);
    }

    // ----------------------------------------------------
    // KYC + MINT TO INVESTOR
    // ----------------------------------------------------
    function testMintToInvestorRequiresKYC() public {
        hat.createHotel(1, "H", "L", "C", "I", 1000, 1, "D");

        // investor NOT KYCed → revert
        vm.expectRevert("Investor not KYC approved");
        hat.mintToInvestor(1, investor1, 100);
    }
 
    function testMintToInvestorSuccess() public {
        hat.createHotel(1, "H", "L", "C", "I", 1000, 1, "D");

        hat.setWhitelisted(investor1, true);

        hat.mintToInvestor(1, investor1, 100);

        assertEq(hat.balanceOf(investor1, 1), 100);
        assertEq(hat.balanceOf(owner, 1), 900);
    }

    // ----------------------------------------------------
    // TRANSFER RESTRICTION (_update)
    // ----------------------------------------------------
    function testTransferBlockedForNonKYC() public {
        hat.createHotel(1, "H", "L", "C", "I", 1000, 1, "D");

        hat.setWhitelisted(investor1, true);
        hat.mintToInvestor(1, investor1, 100);

        // investor2 NOT whitelisted → should revert
        vm.startPrank(investor1);
        vm.expectRevert("Recipient not KYC verified");
        hat.safeTransferFrom(investor1, investor2, 1, 10, "");
    }

    function testTransferAllowedForKYCUsers() public {
        hat.createHotel(1, "H", "L", "C", "I", 1000, 1, "D");

        hat.setWhitelisted(investor1, true);
        hat.setWhitelisted(investor2, true);

        hat.mintToInvestor(1, investor1, 100);

        vm.startPrank(investor1);
        hat.safeTransferFrom(investor1, investor2, 1, 10, "");

        assertEq(hat.balanceOf(investor2, 1), 10);
    }

    // ----------------------------------------------------
    // REVENUE
    // ----------------------------------------------------
 function testAddRevenue() public {
    hat.createHotel(1, "H", "L", "C", "I", 1000, 1, "D");

    // fund owner so it can send 1 ETH
    vm.deal(owner, 1 ether);

    vm.expectEmit(true, true, false, true);
    emit HATToken.RevenueAdded(1, 1 ether);

    hat.addRevenue{value: 1 ether}(1);
 }

    function testAssignRevenueAndClaim() public {
        hat.createHotel(1, "H", "L", "C", "I", 1000, 1, "D");
         vm.deal(address(hat), 10 ether);
        hat.setWhitelisted(investor1, true);
        hat.mintToInvestor(1, investor1, 100);

        // assign 0.5 ETH revenue
        hat.assignRevenue(1, investor1, 0.5 ether);

        vm.stopPrank();

        // Claim as investor1
        vm.prank(investor1);
        uint256 balBefore = investor1.balance;
        hat.claimRevenue(1);
        uint256 balAfter = investor1.balance;

        assertEq(balAfter - balBefore, 0.5 ether);
    }

    // ----------------------------------------------------
    // METADATA UPDATE
    // ----------------------------------------------------
    function testUpdateHotelMetadata() public {
        hat.createHotel(1, "A", "B", "C", "URL1", 1000, 1, "D");

        hat.updateHotelMetadata(
            1,
            "NewName",
            "NewLoc",
            "NewCountry",
            "NewURL",
            2000,
            2,
            "Updated desc"
        );

        (string memory name, string memory loc,, , uint256 totalTokens,,) = hat.hotels(1);

        assertEq(name, "NewName");
        assertEq(loc, "NewLoc");
        assertEq(totalTokens, 2000);
    }

    // ----------------------------------------------------
    // DELETE HOTEL
    // ----------------------------------------------------
    function testDeleteHotel() public {
        hat.createHotel(1, "A", "B", "C", "URL", 1000, 1, "D");

        hat.deleteHotel(1);

        (, , , , uint256 totalTokens,,) = hat.hotels(1);

        assertEq(totalTokens, 0);
    }
}
