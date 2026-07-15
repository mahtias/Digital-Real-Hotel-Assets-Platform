"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("ADMIN"));
router.get("/bookings", bookingController_1.getAllBookingsAdmin);
router.get("/users", adminController_1.getAdminUsers);
router.get("/investments", adminController_1.getAdminInvestments);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map