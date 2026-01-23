// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FunctionsClient } from "@chainlink/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "@chainlink/v0.8/shared/access/ConfirmedOwner.sol";

contract HotelOracle is FunctionsClient, ConfirmedOwner {

    event HotelDataUpdated(
        uint256 hotelId,
        string name,
        string location,
        string imageUrl,
        uint256 rooms,
        uint256 rating
    );

    string public latestHotelName;
    string public latestLocation;

    constructor(address router)
        FunctionsClient(router)
        ConfirmedOwner(msg.sender)
    {}

    function requestHotelData(
        uint256 /* hotelId */,
        string memory apiUrl,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donId
    ) external onlyOwner {

        bytes memory jsSource = getJsCode(apiUrl);

        _sendRequest(
            jsSource,
            subscriptionId,
            gasLimit,
            donId
        );
    }

    // MUST override this exact function from FunctionsClient
    function fulfillRequest(
        bytes32, 
        bytes memory response, 
        bytes memory err
    )
        internal
        override
    {
        require(err.length == 0, "Chainlink Functions error");

        (
            string memory name,
            string memory location,
            string memory imageUrl,
            uint256 rooms,
            uint256 rating
        ) = abi.decode(response, (string, string, string, uint256, uint256));

        latestHotelName = name;
        latestLocation = location;

        emit HotelDataUpdated(1, name, location, imageUrl, rooms, rating);
    }

    function getJsCode(string memory apiUrl) private pure returns (bytes memory) {
        string memory js =
            string.concat(
                "const req = await Functions.makeHttpRequest({ url: '",
                apiUrl,
                "' });",
                "const h = req.data;",
                "return Functions.encodeString(",
                "JSON.stringify([h.name, h.location, h.imageUrl, h.rooms, h.rating])",
                ");"
            );

        return bytes(js);
    }
}
