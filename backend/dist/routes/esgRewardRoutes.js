"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const esgRewardController_1 = require("../controllers/esgRewardController");
const router = (0, express_1.Router)();
router.get("/", esgRewardController_1.getRewardsByUser);
router.post("/", esgRewardController_1.createReward);
router.get("/:id", esgRewardController_1.getReward);
router.patch("/:id/claim", esgRewardController_1.claimReward);
router.delete("/:id", esgRewardController_1.deleteReward);
exports.default = router;
//# sourceMappingURL=esgRewardRoutes.js.map