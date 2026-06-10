"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.post("/intent", paymentController_1.createPaymentIntent);
router.post("/confirm", paymentController_1.confirmPayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map