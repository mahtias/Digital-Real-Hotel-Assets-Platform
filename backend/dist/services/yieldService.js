"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yieldService = void 0;
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const HotelYieldVaultService_1 = __importDefault(require("./HotelYieldVaultService"));
const stablecoinRegistry_1 = require("../config/stablecoinRegistry");
exports.yieldService = {
    async distributeFromBooking(bookingId, investorPoolAmount, stablecoinSymbol = "USDC", tx) {
        const runInDb = async (db) => {
            const batchDistributionIds = [];
            const batchInvestors = [];
            const batchAmounts = [];
            const yieldRowsToUpdate = [];
            const booking = await db.booking.findUnique({
                where: { id: bookingId },
            });
            if (!booking)
                throw new Error("Booking not found");
            const existingDistribution = await db.yield_distributions.findFirst({
                where: { booking_id: booking.id },
            });
            if (existingDistribution) {
                throw new Error(`Yield already distributed for booking ${booking.id}`);
            }
            const distribution = await db.yield_distributions.create({
                data: {
                    booking_id: booking.id,
                    hotel_asset_id: booking.hotelAssetId,
                    total_amount: investorPoolAmount,
                    status: "PENDING",
                    stablecoin_symbol: stablecoinSymbol,
                },
            });
            const activeSnapshot = await database_1.default.snapshot.findFirst({
                where: { hotelAssetId: booking.hotelAssetId, status: "ACTIVE" },
                orderBy: { takenAt: "desc" },
                include: { entries: true },
            });
            let investments;
            if (activeSnapshot && activeSnapshot.entries.length > 0) {
                const snapshotInvestmentIds = activeSnapshot.entries.map((e) => e.investmentId);
                investments = await db.investment.findMany({
                    where: { id: { in: snapshotInvestmentIds } },
                    include: { user: true },
                });
                console.log(`Using snapshot ${activeSnapshot.id} (taken ${activeSnapshot.takenAt.toISOString()}) — ${investments.length} investor(s)`);
            }
            else {
                investments = await db.investment.findMany({
                    where: { hotelAssetId: booking.hotelAssetId, status: "CONFIRMED" },
                    include: { user: true },
                });
                console.log(`No snapshot found — using ${investments.length} live CONFIRMED investor(s)`);
            }
            if (investments.length === 0) {
                return {
                    distribution,
                    distributed: false,
                    totalInvested: 0,
                    investors: 0,
                    batchDistributionIds: [],
                    batchInvestors: [],
                    batchAmounts: [],
                    yieldRowsToUpdate: [],
                };
            }
            const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investedAmount), 0);
            if (totalInvested <= 0)
                throw new Error("Total invested amount is zero");
            for (const inv of investments) {
                if (!inv.user.walletAddress) {
                    console.warn(`Investor ${inv.userId} has no wallet`);
                    continue;
                }
                const investorShare = Number(inv.investedAmount) / totalInvested;
                const investorYield = Number((investorPoolAmount * investorShare).toFixed(8));
                const yieldRow = await db.investor_yields.create({
                    data: {
                        yield_distribution_id: distribution.id,
                        user_id: inv.userId,
                        investment_id: inv.id,
                        amount: investorYield,
                        status: "PENDING",
                        wallet_address: inv.user.walletAddress,
                        stablecoin_symbol: stablecoinSymbol,
                    },
                });
                batchDistributionIds.push(yieldRow.id);
                batchInvestors.push(inv.user.walletAddress);
                batchAmounts.push(BigInt(Math.round(investorYield * (10 ** (stablecoinRegistry_1.STABLECOIN_REGISTRY[stablecoinSymbol]?.decimals ?? 6)))));
                yieldRowsToUpdate.push(yieldRow.id);
                await db.investment.update({
                    where: { id: inv.id },
                    data: { pendingRewards: { increment: investorYield } },
                });
            }
            return {
                distribution,
                distributed: true,
                totalInvested,
                investors: investments.length,
                batchDistributionIds,
                batchInvestors,
                batchAmounts,
                yieldRowsToUpdate,
            };
        };
        const result = tx
            ? await runInDb(tx)
            : await database_1.default.$transaction(runInDb);
        if (!result.distributed || !result.batchDistributionIds?.length) {
            return result;
        }
        try {
            const txResult = await HotelYieldVaultService_1.default.addClaimableBatch(result.batchDistributionIds, result.batchInvestors, result.batchAmounts);
            if (txResult.receipt.status !== "success") {
                throw new Error("Vault batch allocation failed");
            }
            await database_1.default.investor_yields.updateMany({
                where: { id: { in: result.yieldRowsToUpdate } },
                data: { status: "ALLOCATED", tx_hash: txResult.hash },
            });
            await database_1.default.yield_distributions.update({
                where: { id: result.distribution.id },
                data: { status: "ALLOCATED", tx_hash: txResult.hash },
            });
            console.log(` Yield allocated for booking ${bookingId}`);
            return { ...result, txHash: txResult.hash };
        }
        catch (error) {
            console.error(" Yield allocation failed:", error);
            if (!tx) {
                await database_1.default.yield_distributions.update({
                    where: { id: result.distribution.id },
                    data: { status: "FAILED" },
                }).catch(() => { });
                await database_1.default.investor_yields.updateMany({
                    where: { id: { in: result.yieldRowsToUpdate } },
                    data: {
                        status: "FAILED",
                        failure_reason: error instanceof Error ? error.message : "Allocation failed",
                    },
                }).catch(() => { });
            }
            throw error;
        }
    },
    async distributePendingYields() {
        console.log("Distributing all pending yields...");
        const bookings = await database_1.default.booking.findMany({
            where: {
                status: "PAID",
                yield_distributions: { none: {} },
            },
        });
        for (const booking of bookings) {
            try {
                const paymentAmount = booking.totalPrice instanceof client_1.Prisma.Decimal
                    ? booking.totalPrice.toNumber()
                    : Number(booking.totalPrice);
                const investorPool = paymentAmount * 0.10;
                await this.distributeFromBooking(booking.id, investorPool);
                console.log(` Yield distributed for booking ${booking.id}`);
            }
            catch (err) {
                console.error(` Yield distribution failed for booking ${booking.id}:`, err);
            }
        }
        console.log("Pending yield distribution completed.");
    },
};
//# sourceMappingURL=yieldService.js.map