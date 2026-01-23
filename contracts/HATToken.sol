// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from  "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from  "@openzeppelin/contracts/access/Ownable.sol";

contract HATToken is ERC1155, Ownable {

    struct HotelMetadata {
        string name;
        string location;
        string country;
        string imageUrl;
        uint256 totalTokens;
        uint256 tokenPrice;
        string description;
    }

    mapping(uint256 => HotelMetadata) public hotels; 
    
    // Transfer restriction (KYC whitelist)
    mapping(address => bool) public isWhitelisted;

    // Revenue tracking
    mapping(uint256 => mapping(address => uint256)) public revenue;

    event HotelCreated(uint256 indexed hotelId, uint256 supply);
    event HotelMinted(uint256 indexed hotelId, address indexed to, uint256 amount);
    event RevenueAdded(uint256 indexed hotelId, uint256 totalAmount);
    event RevenueClaimed(address indexed user, uint256 indexed hotelId, uint256 amount);

    constructor() ERC1155("") Ownable(msg.sender) {}

    // 1. CREATE HOTEL
    function createHotel(
        uint256 hotelId,
        string memory name,
        string memory location,
        string memory country,
        string memory imageUrl,
        uint256 totalTokens,
        uint256 tokenPrice,
        string memory description
    ) external onlyOwner {
        require(hotels[hotelId].totalTokens == 0, "Hotel already exists");

        hotels[hotelId] = HotelMetadata({
            name: name,
            location: location,
            country: country,
            imageUrl: imageUrl,
            totalTokens: totalTokens,
            tokenPrice: tokenPrice,
            description: description
        });


        _mint(msg.sender, hotelId, totalTokens, "");

        emit HotelCreated(hotelId, totalTokens);
    }

    // 2. MINT TOKENS TO INVESTOR
    function mintToInvestor(
        uint256 hotelId,
        address investor,
        uint256 tokenAmount
    ) external onlyOwner {
        require(isWhitelisted[investor], "Investor not KYC approved");

        _safeTransferFrom(owner(), investor, hotelId, tokenAmount, "");

        emit HotelMinted(hotelId, investor, tokenAmount);
    }

    // 3. KYC
    function setWhitelisted(address user, bool status) external onlyOwner {
        isWhitelisted[user] = status;
    }

    // ✔ CORRECT KYC TRANSFER HOOK (OZ 5.4.0)
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override {
        // block transfers (not mint/burn) to non-KYC users
        if (from != address(0) && to != address(0)) {
            require(isWhitelisted[to], "Recipient not KYC verified");
        }

        super._update(from, to, ids, amounts);
    }

    // 4. REVENUE
    function addRevenue(uint256 hotelId) external payable onlyOwner {
        require(msg.value > 0, "Send ETH revenue");
        emit RevenueAdded(hotelId, msg.value);
    }

    function assignRevenue(
        uint256 hotelId,
        address investor,
        uint256 amountWei
    ) external onlyOwner {
        revenue[hotelId][investor] += amountWei;
    }

    function claimRevenue(uint256 hotelId) external {
        uint256 amt = revenue[hotelId][msg.sender];
        require(amt > 0, "Nothing to claim");

        revenue[hotelId][msg.sender] = 0;
        payable(msg.sender).transfer(amt);

        emit RevenueClaimed(msg.sender, hotelId, amt);
    }

    // 6. METADATA URI
    function uri(uint256 hotelId) public view override returns (string memory) {
        return hotels[hotelId].imageUrl;
    }

    function updateHotelMetadata(
        uint256 hotelId,
        string memory name,
        string memory location,
        string memory country,
        string memory imageUrl,
        uint256 totalTokens,
        uint256 tokenPrice,
        string memory description
    ) external onlyOwner {
        require(hotels[hotelId].totalTokens > 0, "Hotel does not exist");

        hotels[hotelId] = HotelMetadata({
            name: name,
            location: location,
            country: country,
            imageUrl: imageUrl,
            totalTokens: totalTokens,
            tokenPrice: tokenPrice,
            description: description
        });
    }

    function deleteHotel(uint256 hotelId) external onlyOwner {
        require(hotels[hotelId].totalTokens > 0, "Hotel does not exist");
        delete hotels[hotelId];
    }
}
