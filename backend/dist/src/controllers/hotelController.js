"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotels = void 0;
const database_1 = __importDefault(require("../config/database"));
const getHotels = async (req, res) => {
    try {
        const hotels = await database_1.default.hotelAsset.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            select: {
                id: true,
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
//# sourceMappingURL=hotelController.js.map