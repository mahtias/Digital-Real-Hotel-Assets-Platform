"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotelById = exports.getHotels = void 0;
const database_1 = __importDefault(require("../config/database"));
const viem_1 = require("viem");
const crypto_1 = __importDefault(require("crypto"));
const hotelFactory_1 = require("../blockchain/hotelFactory");
const viem_2 = require("viem");
const HotelAssetToken_json_1 = require("../blockchain/abis/HotelAssetToken.json");
const client = (0, viem_2.createPublicClient)({
    transport: (0, viem_2.http)(process.env.RPC_URL)
});
const getHotels = async (req, res) => {
    try {
        const hotels = await database_1.default.hotelAsset.findMany({
            orderBy: { createdAt: "desc" },
            take: 6
        });
        const enrichedHotels = await Promise.all(hotels.map(async (hotel) => {
            if (!hotel.tokenAddress)
                return hotel;
            try {
                const [totalSupply, maxSupply, decimals] = await Promise.all([
                    client.readContract({
                        address: hotel.tokenAddress,
                        abi: HotelAssetToken_json_1.abi,
                        functionName: "totalSupply",
                    }),
                    client.readContract({
                        address: hotel.tokenAddress,
                        abi: HotelAssetToken_json_1.abi,
                        functionName: "maxSupply",
                    }),
                    client.readContract({
                        address: hotel.tokenAddress,
                        abi: HotelAssetToken_json_1.abi,
                        functionName: "decimals",
                    }),
                ]);
                const totalSupplyScaled = Number(totalSupply) /
                    Math.pow(10, Number(decimals));
                const maxSupplyScaled = Number(maxSupply) /
                    Math.pow(10, Number(decimals));
                const soldPercentage = maxSupplyScaled > 0
                    ? (totalSupplyScaled / maxSupplyScaled) * 100
                    : 0;
                return {
                    ...hotel,
                    totalSupply: totalSupply.toString(),
                    maxSupply: maxSupply.toString(),
                    decimals: Number(decimals),
                    soldPercentage,
                    status: soldPercentage >= 100
                        ? "SOLD_OUT"
                        : hotel.status
                };
            }
            catch (err) {
                console.log("Blockchain read failed:", hotel.name);
                return hotel;
            }
        }));
        return res.status(200).json(enrichedHotels);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed load hotels"
        });
    }
};
exports.getHotels = getHotels;
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        let hotel;
        if (!isNaN(Number(id))) {
            hotel =
                await database_1.default.hotelAsset.findFirst({
                    where: {
                        blockchainId: Number(id)
                    }
                });
        }
        if (!hotel) {
            hotel =
                await database_1.default.hotelAsset.findUnique({
                    where: { id }
                });
        }
        if (!hotel) {
            return res.status(404)
                .json({
                error: "Hotel not found"
            });
        }
        return res.json(hotel);
    }
    catch (error) {
        console.error(error);
        return res.status(500)
            .json({
            error: "Failed"
        });
    }
};
exports.getHotelById = getHotelById;
const createHotel = async (req, res) => {
    try {
        const payload = req.body;
        const createdById = req.user?.id;
        if (!createdById) {
            return res.status(400)
                .json({
                error: "User not authenticated"
            });
        }
        const hotelId = crypto_1.default.randomUUID();
        console.log("[createHotel] deploying...");
        const hash = await hotelFactory_1.hotelFactory.wallet.writeContract({
            address: hotelFactory_1.hotelFactory.address,
            abi: hotelFactory_1.hotelFactory.abi,
            functionName: "deployHotelToken",
            args: [hotelId,
                payload.name,
                payload.location,
                payload.tokenSymbol
                    || "HAT",
                BigInt(payload.totalTokens),
                BigInt(payload.tokenPrice),
                process.env.TREASURY_ADDRESS, 0]
        });
        console.log("TX HASH:", hash);
        const receipt = await hotelFactory_1.hotelFactory.public
            .waitForTransactionReceipt({
            hash
        });
        const log = receipt.logs.find((l) => {
            try {
                const decoded = (0, viem_1.decodeEventLog)({
                    abi: hotelFactory_1.hotelFactory.abi,
                    data: l.data,
                    topics: l.topics
                });
                return (decoded.eventName
                    === "TokenDeployed");
            }
            catch {
                return false;
            }
        });
        if (!log) {
            throw new Error("TokenDeployed missing");
        }
        const decoded = (0, viem_1.decodeEventLog)({
            abi: hotelFactory_1.hotelFactory.abi,
            data: log.data,
            topics: log.topics
        });
        const tokenAddress = decoded.args.tokenAddress;
        const hotel = await database_1.default.hotelAsset.create({
            data: {
                id: hotelId,
                name: payload.name,
                location: payload.location,
                country: payload.country || null,
                imageUrl: payload.imageUrl || null,
                description: payload.description || null,
                tokenSymbol: payload.tokenSymbol || "HAT",
                totalTokens: Number(payload.totalTokens),
                tokenPrice: Number(payload.tokenPrice),
                tokenAddress,
                status: "FUNDRAISING",
                createdById
            }
        });
        return res
            .status(201)
            .json(hotel);
    }
    catch (error) {
        console.error("CREATE ERROR:", error);
        return res
            .status(500)
            .json({
            error: "Failed create hotel"
        });
    }
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    try {
        const hotel = await database_1.default.hotelAsset
            .update({
            where: {
                id: req.params.id
            },
            data: req.body
        });
        return res.json(hotel);
    }
    catch (error) {
        console.error(error);
        return res.status(500)
            .json({
            error: "Failed"
        });
    }
};
exports.updateHotel = updateHotel;
const deleteHotel = async (req, res) => {
    try {
        await database_1.default.hotelAsset
            .delete({
            where: {
                id: req.params.id
            }
        });
        return res.json({
            success: true
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500)
            .json({
            error: "Failed"
        });
    }
};
exports.deleteHotel = deleteHotel;
//# sourceMappingURL=hotelAssetController.js.map