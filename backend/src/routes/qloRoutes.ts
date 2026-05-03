import express from "express";
import { handleQloWebhook } from "../controllers/qloWebhookController";

const router = express.Router();

router.post("/", handleQloWebhook);

export default router;