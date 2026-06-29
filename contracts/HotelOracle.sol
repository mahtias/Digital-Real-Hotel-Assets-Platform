// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract HotelOracle is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // ============================================================
    //  ENUMS & STRUCTS
    // ============================================================

    enum RequestType {
        HOTEL_DATA,
        PERFORMANCE_DATA
    }

    struct HotelData {
        string name;
        string location;
        string imageUrl;
        uint256 rooms;
        uint256 rating;
        uint256 lastUpdated;
    }

    struct HotelPerformanceData {
        uint256 occupancyRate; // scaled x100 (e.g. 7550 = 75.50%)
        uint256 revenue; // in cents (e.g. 100000 = $1000.00)
        uint256 revpar; // scaled x100
        uint256 bookingCount;
        string period; // "YYYY-MM"
        uint256 lastUpdated;
    }

    // ============================================================
    //  STATE
    // ============================================================

    mapping(uint256 => HotelData) public hotels;
    mapping(uint256 => HotelPerformanceData) public performances;

    mapping(bytes32 => uint256) private requestIdToHotelId;
    mapping(bytes32 => RequestType) private requestTypes;

    // ============================================================
    //  EVENTS
    // ============================================================

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

    event PerformanceDataRequested(uint256 indexed hotelId, bytes32 indexed requestId);
    event PerformanceDataUpdated(
        uint256 indexed hotelId,
        uint256 occupancyRate,
        uint256 revenue,
        uint256 revpar,
        uint256 bookingCount,
        string period,
        uint256 timestamp
    );

    event RequestFailed(bytes32 indexed requestId, bytes error);

    // ============================================================
    //  ERRORS
    // ============================================================

    error InvalidHotelId();
    error InvalidResponse();
    error EmptyApiUrl();

    // ============================================================
    //  CONSTRUCTOR
    // ============================================================

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) { }

    // ============================================================
    //  REQUEST — STATIC HOTEL DATA
    // ============================================================

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
        req.initializeRequestForInlineJavaScript(getHotelJsCode(apiUrl));

        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);

        requestIdToHotelId[requestId] = hotelId;
        requestTypes[requestId] = RequestType.HOTEL_DATA;

        emit HotelDataRequested(hotelId, requestId);
    }

    // ============================================================
    //  REQUEST — PERFORMANCE DATA
    // ============================================================

    function requestPerformanceData(
        uint256 hotelId,
        string memory apiUrl,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donId
    ) external onlyOwner returns (bytes32 requestId) {
        if (hotelId == 0) revert InvalidHotelId();
        if (bytes(apiUrl).length == 0) revert EmptyApiUrl();

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(getPerformanceJsCode(apiUrl));

        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);

        requestIdToHotelId[requestId] = hotelId;
        requestTypes[requestId] = RequestType.PERFORMANCE_DATA;

        emit PerformanceDataRequested(hotelId, requestId);
    }

    // ============================================================
    //  FULFILLMENT CALLBACK
    // ============================================================

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err)
        internal
        override
    {
        uint256 hotelId = requestIdToHotelId[requestId];
        RequestType reqType = requestTypes[requestId];

        delete requestIdToHotelId[requestId];
        delete requestTypes[requestId];

        if (err.length > 0) {
            emit RequestFailed(requestId, err);
            return;
        }

        if (response.length == 0) revert InvalidResponse();

        if (reqType == RequestType.HOTEL_DATA) {
            _fulfillHotelData(hotelId, response);
        } else {
            _fulfillPerformanceData(hotelId, response);
        }
    }

    function _fulfillHotelData(uint256 hotelId, bytes memory response) private {
        (
            string memory name,
            string memory location,
            string memory imageUrl,
            uint256 rooms,
            uint256 rating
        ) = abi.decode(response, (string, string, string, uint256, uint256));

        require(bytes(name).length > 0, "Invalid hotel name");
        require(rooms > 0, "Invalid room count");
        require(rating <= 5, "Invalid rating");

        hotels[hotelId] = HotelData({
            name: name,
            location: location,
            imageUrl: imageUrl,
            rooms: rooms,
            rating: rating,
            lastUpdated: block.timestamp
        });

        emit HotelDataUpdated(hotelId, name, location, imageUrl, rooms, rating, block.timestamp);
    }

    function _fulfillPerformanceData(uint256 hotelId, bytes memory response) private {
        (
            uint256 occupancyRate,
            uint256 revenue,
            uint256 revpar,
            uint256 bookingCount,
            string memory period
        ) = abi.decode(response, (uint256, uint256, uint256, uint256, string));

        require(occupancyRate <= 10000, "Invalid occupancy");
        require(bytes(period).length > 0, "Invalid period");

        performances[hotelId] = HotelPerformanceData({
            occupancyRate: occupancyRate,
            revenue: revenue,
            revpar: revpar,
            bookingCount: bookingCount,
            period: period,
            lastUpdated: block.timestamp
        });

        emit PerformanceDataUpdated(
            hotelId, occupancyRate, revenue, revpar, bookingCount, period, block.timestamp
        );
    }

    // ============================================================
    //  VIEWS
    // ============================================================

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
        HotelData memory h = hotels[hotelId];
        return (h.name, h.location, h.imageUrl, h.rooms, h.rating, h.lastUpdated);
    }

    function getPerformanceData(uint256 hotelId)
        external
        view
        returns (
            uint256 occupancyRate,
            uint256 revenue,
            uint256 revpar,
            uint256 bookingCount,
            string memory period,
            uint256 lastUpdated
        )
    {
        HotelPerformanceData memory p = performances[hotelId];
        return (p.occupancyRate, p.revenue, p.revpar, p.bookingCount, p.period, p.lastUpdated);
    }

    function hasHotelData(uint256 hotelId) external view returns (bool) {
        return hotels[hotelId].lastUpdated > 0;
    }

    function hasPerformanceData(uint256 hotelId) external view returns (bool) {
        return performances[hotelId].lastUpdated > 0;
    }

    // ============================================================
    //  JS CODE GENERATORS
    // ============================================================

    function getHotelJsCode(string memory apiUrl) private pure returns (string memory) {
        return string.concat(
            "const response = await Functions.makeHttpRequest({ url: '",
            apiUrl,
            "' });",
            "if (response.error) throw new Error('API request failed');",
            "const h = response.data;",
            "return Functions.encodeBytes(",
            "  ethers.utils.defaultAbiCoder.encode(",
            "    ['string','string','string','uint256','uint256'],",
            "    [h.name||'',h.location||'',h.imageUrl||'',Number(h.rooms)||0,Number(h.rating)||0]",
            "  )",
            ");"
        );
    }

    function getPerformanceJsCode(string memory apiUrl) private pure returns (string memory) {
        return string.concat(
            "const response = await Functions.makeHttpRequest({ url: '",
            apiUrl,
            "' });",
            "if (response.error) throw new Error('API request failed');",
            "const d = response.data?.data || response.data;",
            "const occupancy = Math.round((Number(d.occupancyRate)||0) * 100);",
            "const revenue   = Math.round((Number(d.totalRevenue)||0) * 100);",
            "const revpar    = Math.round((Number(d.revpar)||0) * 100);",
            "const bookings  = Number(d.bookingCount)||0;",
            "const period    = d.period || '';",
            "return Functions.encodeBytes(",
            "  ethers.utils.defaultAbiCoder.encode(",
            "    ['uint256','uint256','uint256','uint256','string'],",
            "    [occupancy, revenue, revpar, bookings, period]",
            "  )",
            ");"
        );
    }
}
