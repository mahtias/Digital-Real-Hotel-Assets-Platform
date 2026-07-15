"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oracleController_1 = require("../controllers/oracleController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("ADMIN"));
router.get("/status", oracleController_1.getOracleStatus);
router.post("/request-performance", oracleController_1.requestPerformanceUpdate);
router.get("/performance/:hotelAssetId", oracleController_1.getOnChainPerformance);
router.get("/hotel/:hotelAssetId", oracleController_1.getOnChainHotelData);
exports.default = router;
//# sourceMappingURL=oracleRoutes.js.map