"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const engineController_1 = require("../controllers/engineController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("ADMIN"));
router.get("/status", engineController_1.getEngineStatus);
router.get("/tx/:queueId", engineController_1.getTransactionStatus);
router.get("/wallets", engineController_1.listEngineWallets);
exports.default = router;
//# sourceMappingURL=engineRoutes.js.map