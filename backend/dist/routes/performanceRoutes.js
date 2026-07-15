"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const performanceController_1 = require("../controllers/performanceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("ADMIN"));
router.post("/record", performanceController_1.recordPerformance);
router.get("/all", performanceController_1.getAllHotelsPerformance);
router.get("/:hotelAssetId/history", performanceController_1.getPerformanceHistory);
router.get("/:hotelAssetId/latest", performanceController_1.getLatestPerformance);
exports.default = router;
//# sourceMappingURL=performanceRoutes.js.map