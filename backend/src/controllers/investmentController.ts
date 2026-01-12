import { Request, Response } from "express";
import prisma from "../config/database"; 

// GET /api/investments
export const getUserInvestments = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { hotelAsset: true },
      orderBy: { createdAt: "desc" }
    });

    
    res.json(investments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/investments
export const createInvestment = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const investment = await prisma.investment.create({
      data: {
        ...data,
        userId,
      },
    });

    res.json(investment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/investments/:id
export const getInvestmentById = async (req: Request, res: Response) => {
  try {
    const investment = await prisma.investment.findUnique({
      where: { id: req.params.id },
      include: { hotelAsset: true, user: true },
    });

    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/investments/:id
export const updateInvestment = async (req: Request, res: Response) => {
  try {
    const updated = await prisma.investment.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/investments/:id
export const deleteInvestment = async (req: Request, res: Response) => {
  try {
    await prisma.investment.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
