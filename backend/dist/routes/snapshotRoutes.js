"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const snapshotController_1 = require("../controllers/snapshotController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)("ADMIN"));
router.post("/take", snapshotController_1.takeSnapshot);
router.get("/list", snapshotController_1.listSnapshots);
router.get("/:id", snapshotController_1.getSnapshot);
exports.default = router;
//# sourceMappingURL=snapshotRoutes.js.map