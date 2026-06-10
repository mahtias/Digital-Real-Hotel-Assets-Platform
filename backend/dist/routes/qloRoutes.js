"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qloWebhookController_1 = require("../controllers/qloWebhookController");
const router = express_1.default.Router();
router.post("/", qloWebhookController_1.handleQloWebhook);
exports.default = router;
//# sourceMappingURL=qloRoutes.js.map