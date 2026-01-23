"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.post("/", bookingController_1.createBooking);
router.get("/user/:userId", bookingController_1.getUserBookings);
router.get("/asset/:assetId", bookingController_1.getBookingsByHotelAsset);
router.get("/:id", bookingController_1.getBooking);
router.put("/:id/status", bookingController_1.updateBookingStatus);
router.put("/:id/cancel", bookingController_1.cancelBooking);
router.delete("/:id", bookingController_1.deleteBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map