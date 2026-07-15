"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const revenueController_1 = require("../controllers/revenueController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("ADMIN"));
router.get("/", revenueController_1.getHotelRevenue);
router.get("/qlo/:hotelId", revenueController_1.getQloHotelStats);
exports.default = router;
//# sourceMappingURL=revenueRoutes.js.map