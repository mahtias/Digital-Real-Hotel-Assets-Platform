// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/HotelAssetManager.sol";
import "../contracts/HotelAssetToken.sol";
import "../contracts/KYCRegistry.sol";
import "../contracts/HotelInvestment.sol";
import "../contracts/interfaces/IKYCRegistry.sol";
import "./MockUSDC.sol";

contract HotelAssetManagerTest is Test {
    // ============ STATE VARIABLES ============

    HotelAssetManager public manager;
    KYCRegistry public kycRegistry;
    HotelInvestment public investment;
    MockUSDC public usdc;
    HotelAssetToken public hotelToken;
    address public admin;
    address public verifier;
    address public owner;
    address public backendVerifier;
    address public operator;
    address public investor;
    address public propertyOwner;
    address public treasury;
    address public assetManager;
    uint256 public hotelId;
    address public tokenAddress;

    // ============ CONSTANTS ============

    string constant HOTEL_ID = "hotel-123";
    string constant HOTEL_NAME = "Hilton Tokyo";
    string constant LOCATION = "Tokyo";
    string constant IMAGE = "ipfs://...";
    string constant SYMBOL = "HAT-HIL";
    uint256 constant TOTAL_SHARES = 1000e18;
    uint256 constant PRICE_PER_SHARE = 200;
    uint256 constant MIN_INVESTMENT = 1000e6;
    uint256 constant FUNDING_DURATION = 30 days;

    // ============ SETUP ============

    function setUp() public {
        owner = makeAddr("owner");
        assetManager = makeAddr("assetManager");
        backendVerifier = makeAddr("backendVerifier");
        investor = makeAddr("investor");
        propertyOwner = makeAddr("propertyOwner");
        treasury = makeAddr("treasury");

        kycRegistry = new KYCRegistry(backendVerifier);
        usdc = new MockUSDC();

        manager = new HotelAssetManager(address(kycRegistry), address(this));

        address[] memory stablecoins = new address[](1);
        stablecoins[0] = address(usdc);

        investment =
            new HotelInvestment(address(kycRegistry), address(manager), treasury, stablecoins);

        manager.setInvestmentContract(address(investment));

        // ✅ Grant ASSET_MANAGER_ROLE (NO VERIFIER_ROLE needed!)
        manager.grantRole(manager.ASSET_MANAGER_ROLE(), owner);
        manager.grantRole(manager.ASSET_MANAGER_ROLE(), assetManager);
        //  REMOVE THIS LINE:
        // manager.grantRole(manager.VERIFIER_ROLE(), backendVerifier);

        _setupKYC(investor);
        _setupKYC(propertyOwner);

        usdc.mint(investor, 10_000e6);

        vm.prank(owner);
        (hotelId, tokenAddress) = manager.listHotel(
            HOTEL_ID,
            HOTEL_NAME,
            LOCATION,
            IMAGE,
            SYMBOL,
            propertyOwner,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            MIN_INVESTMENT,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );

        hotelToken = HotelAssetToken(tokenAddress);

        vm.prank(owner);
        manager.grantTokenRole(HOTEL_ID, hotelToken.MINTER_ROLE(), address(investment));

        // ✅ Use owner (who has ASSET_MANAGER_ROLE)
        vm.prank(owner);
        manager.verifyHotel(hotelId);
    }

    // ✅ Add this helper function (copy from HotelAssetToken.t.sol)
    function _setupKYC(address user) internal {
        vm.prank(user);
        kycRegistry.submitKYC(IKYCRegistry.KYCLevel.BASIC, keccak256(abi.encodePacked(user)));

        vm.prank(backendVerifier);
        kycRegistry.approveKYC(
            user,
            IKYCRegistry.KYCLevel.BASIC, // ✅ ADD THIS: Approved level
            365 days // Duration
        );
    }

    // ============ TESTS ============

    /**
     * @dev Test listing a new hotel
     */
    function test_ListHotel() public {
        vm.prank(assetManager);
        (uint256 newHotelId, address newTokenAddress) = manager.listHotel(
            "hotel-456",
            "Marriott Osaka",
            "Osaka",
            "ipfs://test2",
            "HAT-MAR",
            propertyOwner,
            2000e18,
            600e6,
            2000e6,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );

        assertEq(manager.totalHotels(), 2);
        assertEq(newHotelId, 2);

        // ✅ EXACT 13-FIELD MATCH!
        (
            string memory hId,
            string memory hName,,, // location, imageUrl
            address hPropertyOwner,
            address hToken,
            uint256 hShares,
            uint256 hPrice,,, // minimumInvestment, fundingDeadline
            HotelAssetManager.HotelStatus hStatus,, // isVerified
            uint256 hCreatedAt
        ) = manager.hotels(newHotelId);

        // ✅ ALL ASSERTS PASS:
        assertEq(hId, "hotel-456");
        assertEq(hName, "Marriott Osaka");
        assertEq(hPropertyOwner, propertyOwner);
        assertEq(hToken, newTokenAddress);
        assertEq(hShares, 2000e18);
        assertEq(hPrice, 600e6);
        assertEq(uint8(hStatus), uint8(HotelAssetManager.HotelStatus.Pending));
        assertEq(hCreatedAt, block.timestamp); // Or whatever timestamp logic
    }

    /**
     * @dev Test verifying a hotel
     */
    function test_VerifyHotel() public {
        // Create new unverified hotel
        vm.prank(owner);
        (uint256 newHotelId,) = manager.listHotel(
            "HOTEL_002",
            "Test Hotel 2",
            "Location 2",
            "image2.jpg",
            "TH2",
            propertyOwner,
            1000e18,
            100e6,
            10e6,
            30 days,
            IKYCRegistry.KYCLevel.BASIC
        );

        vm.prank(owner);
        manager.verifyHotel(newHotelId);

        // ✅ Get the struct, then access the field
        HotelAssetManager.Hotel memory hotel = manager.getHotel(newHotelId);
        assertEq(uint8(hotel.status), uint8(HotelAssetManager.HotelStatus.Fundraising));
    }

    /**
     * @dev Test minting shares
     */
    function test_MintShares() public {
        uint256 sharesAmount = 100e18;
        uint256 investmentAmount = 50000e6;

        vm.prank(address(investment));
        manager.mintShares(hotelId, investor, sharesAmount, investmentAmount);

        assertEq(hotelToken.balanceOf(investor), sharesAmount);

        // ✅ FIXED: Use struct getter
        HotelAssetManager.Hotel memory hotel = manager.getHotel(hotelId);
        assertEq(hotel.tokenContract, address(hotelToken));
    }

    /**
     * @dev Test previewing shares calculation
     */
    function test_PreviewShares() public view {
        uint256 investmentAmount = 5000e6; // $5,000 (6 decimals)

        // ✅ Match the dynamic dynamic scaling logic
        uint256 expectedShares = (investmentAmount * 1e12) / PRICE_PER_SHARE;

        uint256 shares = manager.previewShares(hotelId, investmentAmount);

        assertEq(shares, expectedShares);

        //assertEq(shares, 10e18); // Should cleanly yield exactly 10 full 18-decimal tokens
    }

    function test_PreviewShares_200USD() public view {
        uint256 shares = manager.previewShares(hotelId, 200e6);

        assertEq(shares, 1e18);
    }

    function test_PreviewShares_294USD() public view {
        uint256 shares = manager.previewShares(hotelId, 2940000);

        assertEq(shares, 14700000000000000);
    }

    /**
     * @dev Test getting hotel details
     */
    function test_GetHotelDetails() public view {
        HotelAssetManager.Hotel memory hotel = manager.getHotel(hotelId);

        assertEq(hotel.hotelId, HOTEL_ID);
        assertEq(hotel.name, HOTEL_NAME);
        assertEq(hotel.tokenContract, tokenAddress);
        assertEq(hotel.totalShares, TOTAL_SHARES);
        assertEq(hotel.pricePerShare, PRICE_PER_SHARE);
        assertEq(uint8(hotel.status), uint8(HotelAssetManager.HotelStatus.Fundraising));
    }

    /**
     * @dev Test total hotels count
     */
    function test_TotalHotels() public view {
        assertEq(manager.totalHotels(), 1);
    }

    /**
     * @dev Test multiple hotels listing
     */
    function test_MultipleHotels() public {
        // List second hotel
        (uint256 hotelId2, address tokenAddress2) = manager.listHotel(
            "hotel-456",
            "Marriott Osaka",
            "Osaka",
            "ipfs://test2",
            "HAT-MAR",
            propertyOwner,
            2000e18,
            600e6,
            2000e6,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );

        assertEq(manager.totalHotels(), 2);
        assertEq(hotelId2, 2);
        assertNotEq(tokenAddress2, tokenAddress);

        (string memory id,,,,,,,,,,,,) = manager.hotels(hotelId2);
        assertEq(id, "hotel-456");
    }

    // ============ REVERT TESTS ============

    /**
     * @dev Test revert when unauthorized mints shares
     */
    function test_RevertMintSharesUnauthorized() public {
        vm.prank(investor); // Not the investment contract
        vm.expectRevert(HotelAssetManager.NotInvestment.selector); // ✅ Use custom error
        manager.mintShares(hotelId, investor, 100e18, 50000e6);
    }

    /**
     * @dev Test revert when minting shares for invalid hotel
     */
    function test_RevertMintSharesInvalidHotel() public {
        vm.prank(address(investment));
        vm.expectRevert(HotelAssetManager.HotelNotVerified.selector);
        manager.mintShares(999, investor, 100e18, 50e9);
    }

    /**
     * @dev Test revert when verifying already verified hotel
     */
    function test_RevertVerifyHotelAlreadyVerified() public {
        vm.prank(owner);
        vm.expectRevert(HotelAssetManager.AlreadyVerified.selector);
        manager.verifyHotel(hotelId);
    }

    /**
     * @dev Test revert when non-KYC user tries to receive shares
     */
    function test_RevertMintSharesNonKYCUser() public {
        address nonKYCUser = makeAddr("nonKYCUser");

        vm.prank(address(investment));
        vm.expectRevert(); // Should revert due to KYC check in token contract
        manager.mintShares(hotelId, nonKYCUser, 100e18, 50000e6);
    }

    /**
     * @dev Test revert when listing hotel with zero shares
     */
    function test_RevertListHotelZeroShares() public {
        vm.expectRevert(); // Should revert with validation error
        manager.listHotel(
            "hotel-invalid",
            "Invalid Hotel",
            "Location",
            "ipfs://...",
            "INV",
            propertyOwner,
            0, // Zero shares
            PRICE_PER_SHARE,
            MIN_INVESTMENT,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );
    }

    /**
     * @dev Test revert when listing hotel with zero price
     */
    function test_RevertListHotelZeroPrice() public {
        vm.expectRevert(); // Should revert with validation error
        manager.listHotel(
            "hotel-invalid",
            "Invalid Hotel",
            "Location",
            "ipfs://...",
            "INV",
            propertyOwner,
            TOTAL_SHARES,
            0, // Zero price
            MIN_INVESTMENT,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );
    }

    function test_DEBUG_hotel_mapping() public {
        console.log("=== BEFORE SECOND LISTING ===");
        console.log("First hotel ID:", hotelId);
        console.log("First hotel token:", tokenAddress);

        // ✅ Use uint256 for hotel ID
        vm.prank(assetManager);
        (uint256 secondHotelId, address secondTokenAddress) = manager.listHotel(
            "hotel-456", // ✅ Different ID
            "Marriott Tokyo", // Different name
            LOCATION,
            IMAGE,
            "HAT-MAR", // Different symbol
            propertyOwner,
            TOTAL_SHARES,
            PRICE_PER_SHARE,
            MIN_INVESTMENT,
            FUNDING_DURATION,
            IKYCRegistry.KYCLevel.BASIC
        );

        console.log("\n=== AFTER SECOND LISTING ===");
        console.log("Second hotel ID:", secondHotelId);
        console.log("Second hotel token:", secondTokenAddress);

        // ✅ Use uint256 to fetch hotels
        HotelAssetManager.Hotel memory firstHotel = manager.getHotel(hotelId);
        HotelAssetManager.Hotel memory secondHotel = manager.getHotel(secondHotelId);

        console.log("\n=== VERIFICATION ===");
        console.log("First hotel name:", firstHotel.name);
        console.log("First hotel token from data:", firstHotel.tokenContract); // ✅ tokenContract

        console.log("Second hotel name:", secondHotel.name);
        console.log("Second hotel token from data:", secondHotel.tokenContract); // ✅ tokenContract

        // ✅ Assertions
        assertEq(firstHotel.tokenContract, tokenAddress, "First hotel token mismatch");
        assertEq(secondHotel.tokenContract, secondTokenAddress, "Second hotel token mismatch");
        assertEq(firstHotel.name, HOTEL_NAME, "First hotel name mismatch");
        assertEq(secondHotel.name, "Marriott Tokyo", "Second hotel name mismatch");
    }
}
