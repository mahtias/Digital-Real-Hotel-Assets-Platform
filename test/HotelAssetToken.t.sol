// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/HotelAssetToken.sol";
import "../contracts/KYCRegistry.sol";
import "../contracts/interfaces/IKYCRegistry.sol";

contract HotelAssetTokenTest is Test {
    HotelAssetToken public token;
    KYCRegistry public kyc;

    address admin = address(this);
    address verifier = address(0x1);
    address minter = address(0x3);
    address investor1 = address(0x4);
    address investor2 = address(0x5);
    address nonKYC = address(0x6);

    string constant HOTEL_ID = "hotel-123";
    string constant HOTEL_NAME = "Hilton Tokyo";
    uint256 constant MAX_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 constant TOKEN_PRICE = 500; // $5.00

    function setUp() public {
        kyc = new KYCRegistry(verifier);

        token = new HotelAssetToken(
            "Hilton Shares",
            "HAT-HIL",
            HOTEL_ID,
            HOTEL_NAME,
            "Tokyo",
            MAX_SUPPLY,
            TOKEN_PRICE,
            address(kyc),
            admin,
            IKYCRegistry.KYCLevel.BASIC
        );

        token.grantRole(token.MINTER_ROLE(), minter);

        _setupKYC(investor1);
        _setupKYC(investor2);
    }

    function _setupKYC(address user) internal {
        vm.prank(user);
        kyc.submitKYC(IKYCRegistry.KYCLevel.BASIC, keccak256(abi.encodePacked(user)));

        vm.prank(verifier);
        kyc.approveKYC(
            user,
            IKYCRegistry.KYCLevel.BASIC, // ✅ ADD THIS: Approved level
            365 days // Duration
        );
    }

    /*//////////////////////////////////////////////////////////////
                            CORE TESTS
    //////////////////////////////////////////////////////////////*/

    function test_deployment() public view {
        assertEq(token.hotelId(), HOTEL_ID);
        assertEq(token.maxSupply(), MAX_SUPPLY);
        assertEq(token.tokenPriceUSD(), TOKEN_PRICE);
    }

    function test_mint_success() public {
        vm.prank(minter);
        token.mintInvestment(investor1, 100e18);

        assertEq(token.balanceOf(investor1), 100e18);
    }

    function test_revert_mint_no_kyc() public {
        vm.prank(minter);
        vm.expectRevert();
        token.mintInvestment(nonKYC, 100e18);
    }

    function test_revert_mint_exceeds_max() public {
        vm.prank(minter);
        vm.expectRevert(HotelAssetToken.ExceedsMaxSupply.selector);
        token.mintInvestment(investor1, MAX_SUPPLY + 1);
    }

    function test_transfer_kyc_users() public {
        vm.prank(minter);
        token.mintInvestment(investor1, 100e18);

        vm.prank(investor1);
        token.transfer(investor2, 50e18);

        assertEq(token.balanceOf(investor2), 50e18);
    }

    function test_revert_transfer_no_kyc() public {
        vm.prank(minter);
        token.mintInvestment(investor1, 100e18);

        vm.prank(investor1);
        vm.expectRevert();
        token.transfer(nonKYC, 50e18);
    }

    function test_burn() public {
        vm.prank(minter);
        token.mintInvestment(investor1, 100e18);

        vm.prank(investor1);
        token.burn(30e18);

        assertEq(token.balanceOf(investor1), 70e18);
    }

    function test_pause() public {
        vm.prank(admin);
        token.pause();

        assertTrue(token.paused());
    }

    /*//////////////////////////////////////////////////////////////
                            KYC TESTS - FIXED
    //////////////////////////////////////////////////////////////*/

    function test_check_kyc() public view {
        // ✅ Use correct return order from your contract
        (bool isValid, uint8 statusRaw, IKYCRegistry.KYCLevel level, bool hasRequiredLevel) =
            token.checkKYC(investor1);

        IKYCRegistry.KYCStatus status = IKYCRegistry.KYCStatus(statusRaw);

        assertTrue(isValid);
        assertEq(uint8(status), uint8(IKYCRegistry.KYCStatus.APPROVED));
        assertEq(uint8(level), uint8(IKYCRegistry.KYCLevel.BASIC));
        assertTrue(hasRequiredLevel);
    }

    function test_check_kyc_non_verified() public view {
        (bool isValid,,,) = token.checkKYC(nonKYC);
        assertFalse(isValid);
    }

    function test_kyc_expired() public {
        vm.warp(block.timestamp + 366 days);

        (bool isValid,,,) = token.checkKYC(investor1);
        assertFalse(isValid);
    }

    function test_get_kyc_record() public view {
        (uint8 levelRaw, uint8 statusRaw,, uint256 expiresAt) = token.getKYCRecord(investor1);

        IKYCRegistry.KYCLevel level = IKYCRegistry.KYCLevel(levelRaw);

        assertEq(uint8(level), uint8(IKYCRegistry.KYCLevel.BASIC));
        assertEq(uint8(statusRaw), uint8(IKYCRegistry.KYCStatus.APPROVED));
        assertTrue(expiresAt > block.timestamp);
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS - FIXED
    //////////////////////////////////////////////////////////////*/

    function test_calculate_value() public view {
        // ✅ Use correct function name: calculateValue
        uint256 value = token.calculateValue(100e18);
        assertEq(value, 50000); // 100 tokens * $5.00
    }

    function test_remaining_supply() public {
        vm.prank(minter);
        token.mintInvestment(investor1, 100e18);

        assertEq(token.remainingSupply(), MAX_SUPPLY - 100e18);
    }

    function test_get_token_info() public view {
        (
            string memory _hotelId,
            string memory _hotelName,
            string memory _location,
            uint256 _totalSupply,
            uint256 _maxSupply,
            uint256 _priceUSD,
            uint256 _deployedAt,
            bool _paused,
            IKYCRegistry.KYCLevel _requiredLevel
        ) = token.getTokenInfo();

        // Test all returned values
        assertEq(_hotelId, HOTEL_ID);
        assertEq(_hotelName, HOTEL_NAME);
        assertEq(_location, "Tokyo");
        assertEq(_totalSupply, 0);
        assertEq(_maxSupply, MAX_SUPPLY);
        assertEq(_priceUSD, TOKEN_PRICE);
        assertGt(_deployedAt, 0);
        assertLe(_deployedAt, block.timestamp);
        assertFalse(_paused);
        assertEq(uint8(_requiredLevel), uint8(IKYCRegistry.KYCLevel.BASIC));
    }

    function test_get_investor_info() public {
        vm.prank(minter);
        token.mintInvestment(investor1, 100e18);

        (uint256 balance, uint256 valueUSD, uint256 firstInvestmentTime, uint256 totalInvestedUSD) =
            token.getInvestorInfo(investor1);

        assertEq(balance, 100e18);
        assertEq(valueUSD, 50000);
        assertEq(firstInvestmentTime, block.timestamp);
        assertGt(totalInvestedUSD, 0);
    }

    /*//////////////////////////////////////////////////////////////
                        MANAGEMENT TESTS
    //////////////////////////////////////////////////////////////*/

    function test_update_price() public {
        vm.prank(admin);
        token.updatePrice(600);

        assertEq(token.tokenPriceUSD(), 600);
    }

    function test_update_kyc_level() public {
        vm.prank(admin);
        token.updateRequiredKYCLevel(IKYCRegistry.KYCLevel.ADVANCED);

        assertEq(uint8(token.requiredKYCLevel()), uint8(IKYCRegistry.KYCLevel.ADVANCED));
    }

    function test_batch_mint() public {
        address[] memory recipients = new address[](2);
        recipients[0] = investor1;
        recipients[1] = investor2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 100e18;
        amounts[1] = 200e18;

        vm.prank(minter);
        token.batchMintInvestments(recipients, amounts);

        assertEq(token.balanceOf(investor1), 100e18);
        assertEq(token.balanceOf(investor2), 200e18);
    }

    /*//////////////////////////////////////////////////////////////
                            FUZZ TESTS
    //////////////////////////////////////////////////////////////*/

    function testFuzz_mint(uint256 amount) public {
        amount = bound(amount, 1, MAX_SUPPLY);

        vm.prank(minter);
        token.mintInvestment(investor1, amount);

        assertEq(token.balanceOf(investor1), amount);
    }
}
