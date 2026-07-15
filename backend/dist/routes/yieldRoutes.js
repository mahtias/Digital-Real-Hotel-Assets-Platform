"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const yieldController_1 = require("../controllers/yieldController");
const router = (0, express_1.Router)();
router.get("/vault", yieldController_1.getVaultStats);
router.get("/claimable/:wallet", yieldController_1.getClaimableYield);
router.get("/history/:userId", yieldController_1.getYieldHistory);
router.post("/mark-claimed", yieldController_1.markClaimed);
router.post("/distribute", yieldController_1.distributeYield);
exports.default = router;
//# sourceMappingURL=yieldRoutes.js.map