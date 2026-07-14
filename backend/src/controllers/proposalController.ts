import { Request, Response } from 'express';
import prisma from '../config/database';
import { ProposalType, ProposalStatus,ProposalCategory , VoteChoice } from '@prisma/client';
import { draService } from '../services/draService';

// CREATE proposal
export const createProposal = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      type,
      hotelAssetId,
      quorumRequired,
      approvalThreshold,
      category,
      status,
      votingStartDate,
      votingEndDate,
    } = req.body;

    const proposal = await prisma.proposal.create({
      data: {
        title,
        description,
        type: type as ProposalType,
        category: category as ProposalCategory,
        hotelAssetId,
        quorumRequired,
        approvalThreshold,
        proposerId: req.user.userId,
        createdById: req.user.userId,
        ...(status && { status: status as ProposalStatus }),
        ...(votingStartDate && { votingStartDate: new Date(votingStartDate) }),
        ...(votingEndDate && { votingEndDate: new Date(votingEndDate) }),
      }
    });

    res.status(201).json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create proposal' });
  }
};

// GET ALL proposals
export const getAllProposals = async (req: Request, res: Response) => {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        proposer: true,
        hotelAsset: true,
        votes: true
      }
    });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch proposals' });
  }
};

// GET proposal by ID
export const getProposalById = async (req: Request, res: Response) => {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id },
      include: {
        proposer: true,
        hotelAsset: true,
        votes: true
      }
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch proposal' });
  }
};

// UPDATE proposal
export const updateProposal = async (req: Request, res: Response) => {
  try {
    const proposal = await prisma.proposal.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update proposal' });
  }
};

// DELETE proposal
export const deleteProposal = async (req: Request, res: Response) => {
  try {
    await prisma.proposal.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Proposal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete proposal' });
  }
};

// VOTE
export const voteOnProposal = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { choice, comment } = req.body;
    const proposalId = req.params.id;
    const userId = req.user.userId;

    if (!["FOR", "AGAINST", "ABSTAIN"].includes(choice)) {
      return res.status(400).json({ message: "Invalid vote choice" });
    }

    const existing = await prisma.vote.findUnique({
      where: { proposalId_userId: { proposalId, userId } }
    });

    if (existing) {
      return res.status(400).json({ message: "User already voted" });
    }

    // Voting power = DRA balance (floored to whole tokens). Minimum 1 for any token holder.
    const voter = await prisma.user.findUnique({ where: { id: userId }, select: { walletAddress: true } });
    let votingPower = 1;
    if (voter?.walletAddress) {
      const draBalance = await draService.getBalance(voter.walletAddress);
      if (draBalance > 0) votingPower = Math.max(1, Math.floor(draBalance));
    }

    const newVote = await prisma.vote.create({
      data: {
        proposalId,
        userId,
        choice: choice as VoteChoice,
        votingPower,
        comment
      }
    });

    const voteField =
      choice === "FOR"
        ? "votesFor"
        : choice === "AGAINST"
        ? "votesAgainst"
        : "votesAbstain";

    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        [voteField]: { increment: votingPower }
      }
    });

    res.json(newVote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cast vote" });
  }
};
