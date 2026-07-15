"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueService = void 0;
const yieldService_1 = require("./yieldService");
const settlementService_1 = require("./settlementService");
const treasuryService_1 = require("./treasuryService");
exports.revenueService = {
    async processBookingRevenue({ booking, paymentAmount, tx, }) {
        const hotelShare = paymentAmount * 0.79;
        const investorPool = paymentAmount * 0.20;
        const platformFee = paymentAmount * 0.01;
        console.log("💰 Revenue Split:", {
            hotelShare,
            investorPool,
            platformFee,
        });
        await treasuryService_1.treasuryService.recordRevenue({
            hotelAssetId: booking.hotelAssetId,
            amount: platformFee,
            tx,
        });
        await yieldService_1.yieldService.distributeFromBooking(booking.id, investorPool);
        await settlementService_1.settlementService.createSettlement({
            booking,
            amount: hotelShare,
            tx,
        });
        return {
            hotelShare,
            investorPool,
            platformFee,
        };
    },
};
//# sourceMappingURL=revenueService.js.map