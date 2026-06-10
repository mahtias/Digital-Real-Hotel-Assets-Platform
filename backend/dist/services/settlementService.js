"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlementService = void 0;
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const ethers_1 = require("ethers");
const stablecoinService_1 = require("./stablecoinService");
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC);
const signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
];
const SETTLEMENT_CONFIG = {
    MAX_RETRIES: 3,
    MIN_CONFIRMATIONS: 1,
};
exports.settlementService = {
    getTokenContract(stablecoin) {
        return new ethers_1.ethers.Contract(stablecoin.address, ERC20_ABI, signer);
    },
    async createSettlement(booking, currency = "USDC") {
        try {
            stablecoinService_1.StablecoinService.validateToken(currency, "BOOKING");
            const stablecoin = stablecoinService_1.StablecoinService.getStablecoin(currency);
            let hotelWallet = booking.hotelAsset?.walletAddress;
            if (!hotelWallet) {
                const hotelAsset = await database_1.default.hotelAsset.findUnique({
                    where: {
                        id: booking.hotelAssetId,
                    },
                    select: {
                        walletAddress: true,
                    },
                });
                hotelWallet = hotelAsset?.walletAddress;
            }
            if (!hotelWallet) {
                throw new Error("Hotel wallet not found");
            }
            hotelWallet = hotelWallet.trim();
            const amount = booking.totalPrice instanceof client_1.Prisma.Decimal
                ? booking.totalPrice.toNumber()
                : Number(booking.totalPrice);
            if (amount <= 0) {
                throw new Error("Invalid settlement amount");
            }
            const existingSettlement = await database_1.default.settlement.findFirst({
                where: {
                    bookingId: booking.id,
                },
            });
            if (existingSettlement) {
                console.log("⚠️ Settlement already exists:", existingSettlement.id);
                return existingSettlement;
            }
            const settlement = await database_1.default.settlement.create({
                data: {
                    hotelWallet,
                    amount: new client_1.Prisma.Decimal(amount),
                    currency: stablecoin.symbol,
                    status: "PENDING",
                    stablecoinSymbol: stablecoin.symbol,
                    stablecoinAddress: stablecoin.address,
                    chainId: stablecoin.chainId,
                    retryCount: 0,
                    booking: {
                        connect: {
                            id: booking.id,
                        },
                    },
                    hotelAsset: {
                        connect: {
                            id: booking.hotelAssetId,
                        },
                    },
                },
            });
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("🧾 SETTLEMENT CREATED");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Booking:", booking.id);
            console.log("Hotel:", booking.hotelAssetId);
            console.log("Currency:", stablecoin.symbol);
            console.log("Amount:", amount);
            console.log("Wallet:", hotelWallet);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            return settlement;
        }
        catch (err) {
            console.error("❌ Settlement creation error:", err.message);
            throw err;
        }
    },
    async processHotelPayout(hotelAssetId, currency = "USDC") {
        try {
            stablecoinService_1.StablecoinService.validateToken(currency, "BOOKING");
            const stablecoin = stablecoinService_1.StablecoinService.getStablecoin(currency);
            const tokenContract = this.getTokenContract(stablecoin);
            const settlements = await database_1.default.settlement.findMany({
                where: {
                    hotelAssetId,
                    currency: stablecoin.symbol,
                    status: "PENDING",
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
            if (settlements.length === 0) {
                console.log(`No pending ${stablecoin.symbol} settlements`);
                return {
                    success: true,
                    message: "No pending settlements",
                };
            }
            const totalAmount = settlements.reduce((sum, settlement) => {
                return sum + Number(settlement.amount);
            }, 0);
            if (totalAmount <= 0) {
                throw new Error("Invalid payout amount");
            }
            const hotelWallet = settlements[0].hotelWallet;
            if (!ethers_1.ethers.isAddress(hotelWallet)) {
                throw new Error("Invalid hotel wallet address");
            }
            const amountWei = ethers_1.ethers.parseUnits(totalAmount.toFixed(stablecoin.decimals), stablecoin.decimals);
            const treasuryBalance = await tokenContract.balanceOf(signer.address);
            if (treasuryBalance < amountWei) {
                throw new Error(`Insufficient ${stablecoin.symbol} treasury balance`);
            }
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("💸 PROCESSING HOTEL PAYOUT");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Hotel:", hotelAssetId);
            console.log("Currency:", stablecoin.symbol);
            console.log("Settlements:", settlements.length);
            console.log("Total:", totalAmount);
            console.log("Wallet:", hotelWallet);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            await database_1.default.settlement.updateMany({
                where: {
                    id: {
                        in: settlements.map((s) => s.id),
                    },
                },
                data: {
                    status: "PROCESSING",
                },
            });
            console.log(`🔄 Sending ${stablecoin.symbol} transfer...`);
            const tx = await tokenContract.transfer(hotelWallet, amountWei);
            console.log("📤 Transaction sent:", tx.hash);
            const receipt = await tx.wait(SETTLEMENT_CONFIG.MIN_CONFIRMATIONS);
            if (!receipt) {
                throw new Error("Transaction receipt missing");
            }
            if (receipt.status !== 1) {
                throw new Error("Blockchain transaction failed");
            }
            const txHash = receipt.hash;
            console.log("✅ Blockchain payout confirmed");
            console.log("TX:", txHash);
            await database_1.default.settlement.updateMany({
                where: {
                    id: {
                        in: settlements.map((s) => s.id),
                    },
                },
                data: {
                    status: "COMPLETED",
                    txHash,
                    processedAt: new Date(),
                    failureReason: null,
                },
            });
            return {
                success: true,
                hotelAssetId,
                currency: stablecoin.symbol,
                totalAmount,
                txHash,
                settlementCount: settlements.length,
                hotelWallet,
            };
        }
        catch (err) {
            console.error("❌ Payout processing error:", err.message);
            try {
                await database_1.default.settlement.updateMany({
                    where: {
                        hotelAssetId,
                        currency,
                        status: "PROCESSING",
                    },
                    data: {
                        status: "FAILED",
                        retryCount: {
                            increment: 1,
                        },
                        failureReason: err.message || "Unknown payout failure",
                    },
                });
            }
            catch (dbErr) {
                console.error("❌ Failed updating settlement failure state:", dbErr);
            }
            throw err;
        }
    },
    async retryFailedPayouts() {
        try {
            const failedSettlements = await database_1.default.settlement.findMany({
                where: {
                    status: "FAILED",
                    retryCount: {
                        lt: SETTLEMENT_CONFIG.MAX_RETRIES,
                    },
                },
                select: {
                    hotelAssetId: true,
                    currency: true,
                },
                distinct: ["hotelAssetId", "currency"],
            });
            console.log(`🔁 Retrying ${failedSettlements.length} payout groups`);
            for (const item of failedSettlements) {
                try {
                    await this.processHotelPayout(item.hotelAssetId, item.currency);
                }
                catch (err) {
                    console.error(`Retry failed for ${item.hotelAssetId}:`, err.message);
                }
            }
            return {
                success: true,
                retried: failedSettlements.length,
            };
        }
        catch (err) {
            console.error("❌ Retry payouts failed:", err.message);
            throw err;
        }
    },
    async getTreasuryBalance(currency = "USDC") {
        stablecoinService_1.StablecoinService.validateToken(currency, "BOOKING");
        const stablecoin = stablecoinService_1.StablecoinService.getStablecoin(currency);
        const tokenContract = this.getTokenContract(stablecoin);
        const balance = await tokenContract.balanceOf(signer.address);
        return {
            currency: stablecoin.symbol,
            wallet: signer.address,
            balance: ethers_1.ethers.formatUnits(balance, stablecoin.decimals),
        };
    },
    async processAllPendingPayouts() {
        console.log("🔄 Processing all pending hotel payouts...");
        const hotelAssetsWithPending = await database_1.default.settlement.findMany({
            where: { status: "PENDING" },
            select: { hotelAssetId: true, currency: true },
            distinct: ["hotelAssetId", "currency"],
        });
        for (const item of hotelAssetsWithPending) {
            try {
                await this.processHotelPayout(item.hotelAssetId, item.currency);
                console.log(`✅ Payout processed for hotel ${item.hotelAssetId}`);
            }
            catch (err) {
                console.error(`❌ Payout failed for hotel ${item.hotelAssetId}:`, err);
            }
        }
        console.log("🔄 All pending hotel payouts processed.");
    }
};
//# sourceMappingURL=settlementService.js.map