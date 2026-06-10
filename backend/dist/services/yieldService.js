"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yieldService = void 0;
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
exports.yieldService = {
    async distributeFromBooking(bookingId, investorPoolAmount, tx) {
        const client = tx || database_1.default;
        return client.$transaction(async (db) => {
            const booking = await db.booking.findUnique({
                where: { id: bookingId },
            });
            if (!booking) {
                throw new Error("Booking not found");
            }
            const distribution = await db.yield_distributions.create({
                data: {
                    booking_id: booking.id,
                    hotel_asset_id: booking.hotelAssetId,
                    total_amount: investorPoolAmount,
                },
            });
            console.log("💰 Yield distribution created:", {
                bookingId,
                investorPoolAmount,
            });
            const investments = await db.investment.findMany({
                where: {
                    hotelAssetId: booking.hotelAssetId,
                    status: "ACTIVE",
                },
            });
            if (investments.length === 0) {
                console.log("⚠️ No active investors");
                return {
                    distribution,
                    distributed: false,
                };
            }
            const totalInvested = investments.reduce((sum, inv) => {
                return sum + Number(inv.investedAmount);
            }, 0);
            if (totalInvested <= 0) {
                throw new Error("Total invested amount is zero");
            }
            for (const inv of investments) {
                const investorShare = Number(inv.investedAmount) / totalInvested;
                const investorYield = Number((investorPoolAmount * investorShare).toFixed(8));
                await db.investor_yields.create({
                    data: {
                        yield_distribution_id: distribution.id,
                        user_id: inv.userId,
                        investment_id: inv.id,
                        amount: investorYield,
                        status: "PENDING",
                    },
                });
                await db.investment.update({
                    where: {
                        id: inv.id,
                    },
                    data: {
                        pendingRewards: {
                            increment: investorYield,
                        },
                    },
                });
                console.log("✅ Investor yield distributed:", {
                    investorId: inv.userId,
                    investorYield,
                });
            }
            return {
                distribution,
                distributed: true,
                totalInvested,
                investors: investments.length,
            };
        });
    },
    async distributePendingYields() {
        console.log("🔄 Distributing all pending yields...");
        const bookings = await database_1.default.booking.findMany({
            where: {
                status: "PAID",
            },
        });
        for (const booking of bookings) {
            try {
                const paymentAmount = booking.totalPrice instanceof client_1.Prisma.Decimal
                    ? booking.totalPrice.toNumber()
                    : Number(booking.totalPrice);
                const investorPool = paymentAmount * 0.10;
                await this.distributeFromBooking(booking.id, investorPool);
                console.log(`✅ Yield distributed for booking ${booking.id}`);
            }
            catch (err) {
                console.error(`❌ Yield distribution failed for booking ${booking.id}:`, err);
            }
        }
        console.log("🔄 Pending yield distribution completed.");
    }
};
//# sourceMappingURL=yieldService.js.map