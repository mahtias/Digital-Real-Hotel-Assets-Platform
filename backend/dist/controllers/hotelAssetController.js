"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotelById = exports.getHotels = void 0;
const database_1 = __importDefault(require("../config/database"));
const hat_1 = require("../blockchain/hat");
const getHotels = async (req, res) => {
    try {
        const hotels = await database_1.default.hotelAsset.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            select: {
                id: true,
                blockchainId: true,
                name: true,
                location: true,
                country: true,
                imageUrl: true,
                totalValue: true,
                tokenSymbol: true,
                totalTokens: true,
                tokensSold: true,
                tokenPrice: true,
                apy: true,
                occupancyRate: true,
                revpar: true,
                esgScore: true,
                roomCount: true,
                starRating: true,
                status: true,
                leaseEndDate: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                createdById: true,
                createdBy: true,
                isSample: true,
            },
        });
        return res.status(200).json(hotels);
    }
    catch (error) {
        console.error("Error fetching hotels:", error);
        return res.status(500).json({ error: "Failed to load hotels" });
    }
};
exports.getHotels = getHotels;
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Looking for hotel with ID:', id);
        let hotel;
        if (!isNaN(Number(id))) {
            console.log('📍 Searching by blockchainId:', Number(id));
            hotel = await database_1.default.hotelAsset.findFirst({
                where: { blockchainId: Number(id) },
                include: {
                    createdByUser: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
        }
        if (!hotel) {
            console.log('📍 Trying database UUID:', id);
            hotel = await database_1.default.hotelAsset.findUnique({
                where: { id },
                include: {
                    createdByUser: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
        }
        if (!hotel) {
            console.log('❌ Hotel not found for ID:', id);
            return res.status(404).json({ error: "Hotel not found" });
        }
        console.log('✅ Hotel found:', hotel.name, '(blockchainId:', hotel.blockchainId, ')');
        res.status(200).json(hotel);
    }
    catch (error) {
        console.error("❌ Error fetching hotel:", error);
        res.status(500).json({ error: "Failed to load hotel" });
    }
};
exports.getHotelById = getHotelById;
const createHotel = async (req, res) => {
    try {
        const payload = req.body;
        const createdById = req.user?.id;
        if (!createdById) {
            return res.status(400).json({ error: "User not authenticated" });
        }
        console.log("[createHotel] Using createdById:", createdById);
        console.log("[createHotel] Payload:", JSON.stringify(payload, null, 2));
        const hotel = await database_1.default.hotelAsset.create({
            data: {
                name: payload.name,
                location: payload.location,
                country: payload.country || null,
                imageUrl: payload.imageUrl || null,
                totalTokens: payload.totalTokens ? Number(payload.totalTokens) : 0,
                tokenPrice: payload.tokenPrice ? Number(payload.tokenPrice) : 0,
                description: payload.description || null,
                status: payload.status ?? "UPCOMING",
                isSample: payload.isSample ?? false,
                createdById,
                createdAt: new Date(),
                updatedAt: new Date(),
                tokenAddress: payload.tokenAddress || null,
            },
        });
        return res.status(201).json(hotel);
    }
    catch (error) {
        console.error("Error creating hotel:", error);
        return res.status(500).json({ error: "Failed to create hotel" });
    }
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const data = req.body;
        const updatedHotel = await database_1.default.hotelAsset.update({
            where: { id: hotelId },
            data,
        });
        await hat_1.hat.wallet.writeContract({
            address: hat_1.hat.address,
            abi: hat_1.hat.abi,
            functionName: "updateHotelMetadata",
            args: [
                updatedHotel.id,
                updatedHotel.name,
                updatedHotel.location,
                updatedHotel.country,
                updatedHotel.imageUrl,
                updatedHotel.totalTokens,
                updatedHotel.tokenPrice,
                updatedHotel.description,
            ],
        });
        res.status(200).json(updatedHotel);
    }
    catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ error: "Failed to update hotel" });
    }
};
exports.updateHotel = updateHotel;
const deleteHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        await database_1.default.hotelAsset.delete({
            where: { id: hotelId },
        });
        await hat_1.hat.wallet.writeContract({
            address: hat_1.hat.address,
            abi: hat_1.hat.abi,
            functionName: "deleteHotel",
            args: [hotelId],
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
};
exports.deleteHotel = deleteHotel;
//# sourceMappingURL=hotelAssetController.js.map