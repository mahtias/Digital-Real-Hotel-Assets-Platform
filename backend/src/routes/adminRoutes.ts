import express from "express";
import path from "path";

const router = express.Router();

// Serve the Admin Settlements Page
router.get("/admin/settlements", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "adminSettlements.html"));
});

export default router;