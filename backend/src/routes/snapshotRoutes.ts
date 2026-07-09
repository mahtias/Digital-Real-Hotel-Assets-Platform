import { Router } from "express";
import { takeSnapshot, listSnapshots, getSnapshot } from "../controllers/snapshotController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post("/take", takeSnapshot);
router.get("/list", listSnapshots);
router.get("/:id", getSnapshot);

export default router;
