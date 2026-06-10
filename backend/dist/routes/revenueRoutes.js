"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const revenueController_1 = require("../controllers/revenueController");
const router = express_1.default.Router();
router.get("/", revenueController_1.getHotelRevenue);
exports.default = router;
//# sourceMappingURL=revenueRoutes.js.map