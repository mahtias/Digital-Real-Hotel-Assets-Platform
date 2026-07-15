"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotelById = exports.getHotels = void 0;
const ethers_1 = require("ethers");
const database_1 = __importDefault(require("../config/database"));
const crypto_1 = __importDefault(require("crypto"));
const hotelFactory_1 = require("../blockchain/hotelFactory");
const HotelAssetToken_json_1 = require("../blockchain/abis/HotelAssetToken.json");
const provider = hotelFactory_1.hotelFactory.getProvider();
const getHotels = async (req, res) => {
    try {
        const hotels = await database_1.default.hotelAsset.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
        });
        const enrichedHotels = await Promise.all(hotels.map(async (hotel) => {
            if (!hotel.tokenAddress)
                return hotel;
            try {
                const token = new ethers_1.ethers.Contract(hotel.tokenAddress, HotelAssetToken_json_1.abi, provider);
                const [totalSupply, maxSupply, decimals] = await Promise.all([
                    token.totalSupply(),
                    token.maxSupply(),
                    token.decimals(),
                ]);
                const dec = Number(decimals);
                const totalSupplyScaled = Number(totalSupply) / Math.pow(10, dec);
                const maxSupplyScaled = Number(maxSupply) / Math.pow(10, dec);
                const soldPercentage = maxSupplyScaled > 0
                    ? (totalSupplyScaled / maxSupplyScaled) * 100
                    : 0;
                return {
                    ...hotel,
                    totalSupply: totalSupply.toString(),
                    maxSupply: maxSupply.toString(),
                    decimals: dec,
                    soldPercentage,
                    status: soldPercentage >= 100 ? "SOLD_OUT" : hotel.status,
                };
            }
            catch {
                console.log("Blockchain read failed:", hotel.name);
                return hotel;
            }
        }));
        return res.status(200).json(enrichedHotels);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed load hotels" });
    }
};
exports.getHotels = getHotels;
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        let hotel = null;
        if (!isNaN(Number(id))) {
            hotel = await database_1.default.hotelAsset.findFirst({ where: { blockchainId: Number(id) } });
        }
        if (!hotel) {
            hotel = await database_1.default.hotelAsset.findUnique({ where: { id } });
        }
        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        return res.json(hotel);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed" });
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
        const hotelId = crypto_1.default.randomUUID();
        console.log("[createHotel] deploying...");
        const wallet = hotelFactory_1.hotelFactory.getWallet();
        const contract = hotelFactory_1.hotelFactory.getContract(wallet);
        const tx = await contract.deployHotelToken(hotelId, payload.name, payload.location, payload.tokenSymbol || "HAT", BigInt(payload.totalTokens), BigInt(payload.tokenPrice), process.env.TREASURY_ADDRESS, 0);
        console.log("TX HASH:", tx.hash);
        const receipt = await tx.wait();
        const iface = new ethers_1.ethers.Interface(hotelFactory_1.hotelFactory.abi);
        const tokenDeployedLog = receipt?.logs
            .map((log) => {
            try {
                return iface.parseLog(log);
            }
            catch {
                return null;
            }
        })
            .find((parsed) => parsed?.name === "TokenDeployed");
        if (!tokenDeployedLog) {
            throw new Error("TokenDeployed event not found in receipt");
        }
        const tokenAddress = tokenDeployedLog.args.tokenAddress;
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
                createdById,
            },
        });
        return res.status(201).json(hotel);
    }
    catch (error) {
        console.error("CREATE ERROR:", error);
        return res.status(500).json({ error: "Failed create hotel" });
    }
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    try {
        const hotel = await database_1.default.hotelAsset.update({
            where: { id: req.params.id },
            data: req.body,
        });
        return res.json(hotel);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed" });
    }
};
exports.updateHotel = updateHotel;
const deleteHotel = async (req, res) => {
    try {
        await database_1.default.hotelAsset.delete({ where: { id: req.params.id } });
        return res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed" });
    }
};
exports.deleteHotel = deleteHotel;
//# sourceMappingURL=hotelAssetController.js.map