"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelAssetController_1 = require("../controllers/hotelAssetController");
const router = (0, express_1.Router)();
router.get("/", hotelAssetController_1.getHotels);
router.get("/:id", hotelAssetController_1.getHotelById);
router.post("/", hotelAssetController_1.createHotel);
router.put("/:id", hotelAssetController_1.updateHotel);
router.delete("/:id", hotelAssetController_1.deleteHotel);
exports.default = router;
//# sourceMappingURL=hotelAssetRoutes.js.map