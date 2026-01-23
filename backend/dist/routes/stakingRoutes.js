"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stakingController_1 = require("../controllers/stakingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.authenticate, stakingController_1.createStaking);
router.get("/me", auth_1.authenticate, stakingController_1.getUserStakings);
router.post("/:id/claim", auth_1.authenticate, stakingController_1.claimStakingRewards);
router.post("/:id/unstake", auth_1.authenticate, stakingController_1.unstake);
exports.default = router;
//# sourceMappingURL=stakingRoutes.js.map