"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investmentController_1 = require("../controllers/investmentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, investmentController_1.getUserInvestments);
router.post("/", auth_1.authenticate, investmentController_1.createInvestment);
router.get("/:id", auth_1.authenticate, investmentController_1.getInvestmentById);
router.put("/:id", auth_1.authenticate, investmentController_1.updateInvestment);
router.delete("/:id", auth_1.authenticate, investmentController_1.deleteInvestment);
exports.default = router;
//# sourceMappingURL=investmentRoutes.js.map