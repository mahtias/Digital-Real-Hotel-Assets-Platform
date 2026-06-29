import { Router } from "express";
import { getEngineStatus, getTransactionStatus, listEngineWallets } from "../controllers/engineController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/status", getEngineStatus);
router.get("/tx/:queueId", getTransactionStatus);
router.get("/wallets", listEngineWallets);

export default router;
