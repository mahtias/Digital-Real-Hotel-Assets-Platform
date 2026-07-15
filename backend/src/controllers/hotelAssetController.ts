import { Request, Response } from "express";
import { ethers } from "ethers";
import prisma from "../config/database";
import crypto from "crypto";

import { hotelFactory } from "../blockchain/hotelFactory";
import { abi as hotelAbi } from "../blockchain/abis/HotelAssetToken.json";

// Shared read-only provider for on-chain reads
const provider = hotelFactory.getProvider();

// -------------------------------------------------------
// GET HOTELS
// -------------------------------------------------------

export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await prisma.hotelAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    const enrichedHotels = await Promise.all(
      hotels.map(async (hotel) => {
        if (!hotel.tokenAddress) return hotel;

        try {
          const token = new ethers.Contract(hotel.tokenAddress, hotelAbi, provider);

          const [totalSupply, maxSupply, decimals] = await Promise.all([
            token.totalSupply() as Promise<bigint>,
            token.maxSupply()   as Promise<bigint>,
            token.decimals()    as Promise<bigint>,
          ]);

          const dec = Number(decimals);
          const totalSupplyScaled = Number(totalSupply) / Math.pow(10, dec);
          const maxSupplyScaled   = Number(maxSupply)   / Math.pow(10, dec);
          const soldPercentage    = maxSupplyScaled > 0
            ? (totalSupplyScaled / maxSupplyScaled) * 100
            : 0;

          return {
            ...hotel,
            totalSupply: totalSupply.toString(),
            maxSupply:   maxSupply.toString(),
            decimals:    dec,
            soldPercentage,
            status: soldPercentage >= 100 ? "SOLD_OUT" : hotel.status,
          };
        } catch {
          console.log("Blockchain read failed:", hotel.name);
          return hotel;
        }
      })
    );

    return res.status(200).json(enrichedHotels);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed load hotels" });
  }
};


// -------------------------------------------------------
// GET HOTEL
// -------------------------------------------------------

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let hotel = null;

    if (!isNaN(Number(id))) {
      hotel = await prisma.hotelAsset.findFirst({ where: { blockchainId: Number(id) } });
    }

    if (!hotel) {
      hotel = await prisma.hotelAsset.findUnique({ where: { id } });
    }

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    return res.json(hotel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
};


// -------------------------------------------------------
// CREATE HOTEL
// -------------------------------------------------------

export const createHotel = async (req: any, res: Response) => {
  try {
    const payload = req.body;
    const createdById = req.user?.id;

    if (!createdById) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const hotelId = crypto.randomUUID();
    console.log("[createHotel] deploying...");

    const wallet   = hotelFactory.getWallet();
    const contract = hotelFactory.getContract(wallet);

    const tx = await contract.deployHotelToken(
      hotelId,
      payload.name,
      payload.location,
      payload.tokenSymbol || "HAT",
      BigInt(payload.totalTokens),
      BigInt(payload.tokenPrice),
      process.env.TREASURY_ADDRESS,
      0,
    );

    console.log("TX HASH:", tx.hash);

    const receipt = await tx.wait();

    // Decode the TokenDeployed event from receipt logs
    const iface = new ethers.Interface(hotelFactory.abi);

    const tokenDeployedLog = receipt?.logs
      .map((log: any) => {
        try { return iface.parseLog(log); } catch { return null; }
      })
      .find((parsed: any) => parsed?.name === "TokenDeployed");

    if (!tokenDeployedLog) {
      throw new Error("TokenDeployed event not found in receipt");
    }

    const tokenAddress = tokenDeployedLog.args.tokenAddress as string;

    const hotel = await prisma.hotelAsset.create({
      data: {
        id:          hotelId,
        name:        payload.name,
        location:    payload.location,
        country:     payload.country     || null,
        imageUrl:    payload.imageUrl    || null,
        description: payload.description || null,
        tokenSymbol: payload.tokenSymbol || "HAT",
        totalTokens: Number(payload.totalTokens),
        tokenPrice:  Number(payload.tokenPrice),
        tokenAddress,
        status:      "FUNDRAISING",
        createdById,
      },
    });

    return res.status(201).json(hotel);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return res.status(500).json({ error: "Failed create hotel" });
  }
};


// -------------------------------------------------------
// UPDATE HOTEL
// -------------------------------------------------------

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await prisma.hotelAsset.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json(hotel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
};


// -------------------------------------------------------
// DELETE HOTEL
// -------------------------------------------------------

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    await prisma.hotelAsset.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed" });
  }
};
