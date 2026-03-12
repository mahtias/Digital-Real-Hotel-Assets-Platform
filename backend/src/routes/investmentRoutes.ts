// src/routes/investmentRoutes.ts

import { Router } from "express";
import {
  createInvestment,
  getUserInvestments,
  getInvestmentById,
  getInvestmentStats,
  getInvestmentsByStatus,
  updateInvestment,      
  deleteInvestment,
  confirmInvestment,     
} from "../controllers/investmentController";
import { authenticate } from "../middleware/auth";

const router = Router();

//  All routes require authentication
router.use(authenticate);

// Investment CRUD
router.post("/confirm", confirmInvestment);
router.post("/", createInvestment);                    
router.get("/", getUserInvestments);                   
router.get("/stats", getInvestmentStats);              
router.get("/status", getInvestmentsByStatus);        
router.get("/:id", getInvestmentById);                 

// Optional: Update/Delete (if you have these)
 router.put("/:id", updateInvestment);               
 router.delete("/:id", deleteInvestment);            

export default router;

