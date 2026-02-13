// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract HotelOracle is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    struct HotelData {
        string name;
        string location;
        string imageUrl;
        uint256 rooms;
        uint256 rating;
        uint256 lastUpdated;
    }

    // Store multiple hotels
    mapping(uint256 => HotelData) public hotels;
    mapping(bytes32 => uint256) private requestIdToHotelId;

    event HotelDataRequested(uint256 indexed hotelId, bytes32 indexed requestId);
    event HotelDataUpdated(
        uint256 indexed hotelId,
        string name,
        string location,
        string imageUrl,
        uint256 rooms,
        uint256 rating,
        uint256 timestamp
    );
    event RequestFailed(bytes32 indexed requestId, bytes error);

    error InvalidHotelId();
    error InvalidResponse();
    error EmptyApiUrl();

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    /**
     * @notice Request hotel data from external API
     * @param hotelId The ID of the hotel to fetch data for
     * @param apiUrl The API endpoint URL
     * @param subscriptionId Chainlink Functions subscription ID
     * @param gasLimit Gas limit for the callback
     * @param donId DON ID for the request
     */
    function requestHotelData(
        uint256 hotelId,
        string memory apiUrl,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donId
    ) external onlyOwner returns (bytes32 requestId) {
        if (hotelId == 0) revert InvalidHotelId();
        if (bytes(apiUrl).length == 0) revert EmptyApiUrl();

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(getJsCode(apiUrl));

        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);

        requestIdToHotelId[requestId] = hotelId;

        emit HotelDataRequested(hotelId, requestId);
    }

    /**
     * @notice Chainlink Functions callback
     * @dev This function is called by the Chainlink DON
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        uint256 hotelId = requestIdToHotelId[requestId];

        if (err.length > 0) {
            emit RequestFailed(requestId, err);
            return;
        }

        if (response.length == 0) revert InvalidResponse();

        // Decode the response
        (string memory name, string memory location, string memory imageUrl, uint256 rooms, uint256 rating) =
            abi.decode(response, (string, string, string, uint256, uint256));

        // Validate data
        require(bytes(name).length > 0, "Invalid hotel name");
        require(rooms > 0, "Invalid room count");
        require(rating <= 5, "Invalid rating"); // Assuming 5-star rating system

        // Store hotel data
        hotels[hotelId] = HotelData({
            name: name,
            location: location,
            imageUrl: imageUrl,
            rooms: rooms,
            rating: rating,
            lastUpdated: block.timestamp
        });

        emit HotelDataUpdated(hotelId, name, location, imageUrl, rooms, rating, block.timestamp);

        // Clean up mapping
        delete requestIdToHotelId[requestId];
    }

    /**
     * @notice Get hotel data by ID
     * @param hotelId The hotel ID
     */
    function getHotelData(uint256 hotelId)
        external
        view
        returns (
            string memory name,
            string memory location,
            string memory imageUrl,
            uint256 rooms,
            uint256 rating,
            uint256 lastUpdated
        )
    {
        HotelData memory hotel = hotels[hotelId];
        return (hotel.name, hotel.location, hotel.imageUrl, hotel.rooms, hotel.rating, hotel.lastUpdated);
    }

    /**
     * @notice Generate JavaScript code for Chainlink Functions
     * @param apiUrl The API endpoint
     */
    function getJsCode(string memory apiUrl) private pure returns (string memory) {
        return string.concat(
            "const url = '",
            apiUrl,
            "';",
            "const response = await Functions.makeHttpRequest({ url });",
            "if (response.error) { throw new Error('API request failed'); }",
            "const hotel = response.data;",
            "return Functions.encodeBytes(",
            "  ethers.utils.defaultAbiCoder.encode(",
            "    ['string','string','string','uint256','uint256'],",
            "    [",
            "      hotel.name || '',",
            "      hotel.location || '',",
            "      hotel.imageUrl || '',",
            "      Number(hotel.rooms) || 0,",
            "      Number(hotel.rating) || 0",
            "    ]",
            "  )",
            ");"
        );
    }

    /**
     * @notice Check if hotel data exists
     */
    function hasHotelData(uint256 hotelId) external view returns (bool) {
        return hotels[hotelId].lastUpdated > 0;
    }
}
