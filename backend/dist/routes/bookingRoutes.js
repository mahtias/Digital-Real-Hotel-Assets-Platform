"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const x402_1 = require("../middleware/x402");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.post("/", bookingController_1.createBooking);
router.post("/confirm-payment", bookingController_1.confirmBookingPayment);
router.post("/x402", (0, x402_1.x402Middleware)(1), bookingController_1.createX402Booking);
router.get("/my", bookingController_1.getUserBookings);
router.get("/asset/:assetId", bookingController_1.getBookingsByHotelAsset);
router.get("/:id", bookingController_1.getBooking);
router.put("/:id/status", bookingController_1.updateBookingStatus);
router.put("/:id/cancel", bookingController_1.cancelBooking);
router.delete("/:id", bookingController_1.deleteBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map