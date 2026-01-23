"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelController_1 = require("../controllers/hotelController");
const router = (0, express_1.Router)();
router.get("/", hotelController_1.getHotels);
exports.default = router;
//# sourceMappingURL=hotelRoutes.js.map