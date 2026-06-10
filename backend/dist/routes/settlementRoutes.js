"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settlementController_1 = require("../controllers/settlementController");
const router = express_1.default.Router();
router.post("/process/:hotelAssetId", settlementController_1.processSettlement);
router.get("/history", settlementController_1.getSettlementHistory);
exports.default = router;
//# sourceMappingURL=settlementRoutes.js.map