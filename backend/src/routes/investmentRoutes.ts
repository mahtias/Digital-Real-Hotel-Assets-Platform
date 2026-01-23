import { Router } from "express";
import {
  getUserInvestments,
  createInvestment,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
} from "../controllers/investmentController";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/investments → all investments of logged user
router.get("/", authenticate, getUserInvestments);

// POST /api/investments → create new investment
router.post("/", authenticate, createInvestment);

// GET /api/investments/:id
router.get("/:id", authenticate, getInvestmentById);

// PUT /api/investments/:id
router.put("/:id", authenticate, updateInvestment);

// DELETE /api/investments/:id
router.delete("/:id", authenticate, deleteInvestment);

export default router;
