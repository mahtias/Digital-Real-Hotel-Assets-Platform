import { Router } from "express";
import { 
  getHotels, 
  getHotelById,  // ✅ Now works!
  createHotel,
  updateHotel,
  deleteHotel 
} from "../controllers/hotelAssetController";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);  // ✅ Single hotel
router.post("/", createHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

export default router;