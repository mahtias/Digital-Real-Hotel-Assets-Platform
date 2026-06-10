"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.get("/admin/settlements", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/build", "adminSettlements.html"));
});
router.get("/bookings", bookingController_1.getAllBookingsAdmin);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map