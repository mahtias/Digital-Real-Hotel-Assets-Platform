import { Request, Response } from "express";
import prisma from "../config/database";
import { hat } from "../blockchain/hat";

// -------------------------------------------------------
// GET ALL HOTELS
// -------------------------------------------------------


export const getHotels = async (req: Request, res: Response) => {

  try {
    const hotels = await prisma.hotelAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        blockchainId: true,
        name: true,
        walletAddress: true,
        location: true,
        country: true,
        imageUrl: true,
        totalValue: true,
        tokenSymbol: true,
        totalTokens: true,
        tokensSold: true,
        tokenPrice: true,
        apy: true,
        occupancyRate: true,
        revpar: true,
        esgScore: true,
        roomCount: true,
        starRating: true,
        status: true,
        leaseEndDate: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        createdById: true,
        createdBy: true,
        isSample: true,
      },
    });

    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ error: "Failed to load hotels" });
  }
};


export const getHotelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🔍 Looking for hotel with ID:', id);

    let hotel;

    // ✅ TRY BLOCKCHAIN ID FIRST (numeric like 0, 1, 2, 3)
    if (!isNaN(Number(id))) {
      console.log('📍 Searching by blockchainId:', Number(id));
      hotel = await prisma.hotelAsset.findFirst({
        where: { blockchainId: Number(id) },
        include: {
          createdByUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
    }

    // ✅ FALLBACK TO DATABASE UUID IF NOT FOUND
    if (!hotel) {
      console.log('📍 Trying database UUID:', id);
      hotel = await prisma.hotelAsset.findUnique({
        where: { id },
        include: {
          createdByUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
    }

    if (!hotel) {
      console.log('❌ Hotel not found for ID:', id);
      return res.status(404).json({ error: "Hotel not found" });
    }

    console.log('✅ Hotel found:', hotel.name, '(blockchainId:', hotel.blockchainId, ')');
    res.status(200).json(hotel);
  } catch (error) {
    console.error("❌ Error fetching hotel:", error);
    res.status(500).json({ error: "Failed to load hotel" });
  }
};


// -------------------------------------------------------
// CREATE HOTEL (DB + Blockchain)
// -------------------------------------------------------

export const createHotel = async (req: any, res: Response) => {
  try {
    const payload = req.body;

    // Use authenticated user's ID if available
    const createdById = req.user?.id;
    if (!createdById) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    console.log("[createHotel] Using createdById:", createdById);
    console.log("[createHotel] Payload:", JSON.stringify(payload, null, 2));

    // Create hotel in DB
    const hotel = await prisma.hotelAsset.create({
      data: {
        name: payload.name,
        location: payload.location,
        country: payload.country || null,
        imageUrl: payload.imageUrl || null,
        totalTokens: payload.totalTokens ? Number(payload.totalTokens) : 0,
        tokenPrice: payload.tokenPrice ? Number(payload.tokenPrice) : 0,
        description: payload.description || null,
        status: payload.status ?? "UPCOMING", // Assuming AssetStatus enum
        isSample: payload.isSample ?? false,
        createdById,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokenAddress: payload.tokenAddress || null,
      },
    });

    // No blockchain write — just return the DB record
    return res.status(201).json(hotel);
  } catch (error) {
    console.error("Error creating hotel:", error);
    return res.status(500).json({ error: "Failed to create hotel" });
  }
};

// -------------------------------------------------------
// UPDATE HOTEL (DB + Blockchain metadata update)
// -------------------------------------------------------

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.id; 
    const data = req.body;

    const updatedHotel = await prisma.hotelAsset.update({
      where: { id: hotelId },
      data,
    });

    await hat.wallet.writeContract({
      address: hat.address,
      abi: hat.abi,
      functionName: "updateHotelMetadata",
      args: [
        updatedHotel.id,           
        updatedHotel.name,
        updatedHotel.location,
        updatedHotel.country,
        updatedHotel.imageUrl,
        updatedHotel.totalTokens,  
        updatedHotel.tokenPrice,   
        updatedHotel.description,
      ],
    });

    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ error: "Failed to update hotel" });
  }
};

// -------------------------------------------------------
// DELETE HOTEL (DB + Blockchain delete metadata)
// -------------------------------------------------------

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.id; 

    await prisma.hotelAsset.delete({
      where: { id: hotelId },
    });

    await hat.wallet.writeContract({
      address: hat.address,
      abi: hat.abi,
      functionName: "deleteHotel",
      args: [hotelId], 
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ error: "Failed to delete hotel" });
  }
};
