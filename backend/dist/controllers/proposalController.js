"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteOnProposal = exports.deleteProposal = exports.updateProposal = exports.getProposalById = exports.getAllProposals = exports.createProposal = void 0;
const database_1 = __importDefault(require("../config/database"));
const createProposal = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { title, description, type, hotelAssetId, quorumRequired, approvalThreshold, category } = req.body;
        const proposal = await database_1.default.proposal.create({
            data: {
                title,
                description,
                type: type,
                category: category,
                hotelAssetId,
                quorumRequired,
                approvalThreshold,
                proposerId: req.user.userId,
                createdById: req.user.userId
            }
        });
        res.status(201).json(proposal);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create proposal' });
    }
};
exports.createProposal = createProposal;
const getAllProposals = async (req, res) => {
    try {
        const proposals = await database_1.default.proposal.findMany({
            include: {
                proposer: true,
                hotelAsset: true,
                votes: true
            }
        });
        res.json(proposals);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch proposals' });
    }
};
exports.getAllProposals = getAllProposals;
const getProposalById = async (req, res) => {
    try {
        const proposal = await database_1.default.proposal.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch proposal' });
    }
};
exports.getProposalById = getProposalById;
const updateProposal = async (req, res) => {
    try {
        const proposal = await database_1.default.proposal.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(proposal);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update proposal' });
    }
};
exports.updateProposal = updateProposal;
const deleteProposal = async (req, res) => {
    try {
        await database_1.default.proposal.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Proposal deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete proposal' });
    }
};
exports.deleteProposal = deleteProposal;
const voteOnProposal = async (req, res) => {
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
        const existing = await database_1.default.vote.findUnique({
            where: { proposalId_userId: { proposalId, userId } }
        });
        if (existing) {
            return res.status(400).json({ message: "User already voted" });
        }
        const votingPower = 1;
        const newVote = await database_1.default.vote.create({
            data: {
                proposalId,
                userId,
                choice: choice,
                votingPower,
                comment
            }
        });
        const voteField = choice === "FOR"
            ? "votesFor"
            : choice === "AGAINST"
                ? "votesAgainst"
                : "votesAbstain";
        await database_1.default.proposal.update({
            where: { id: proposalId },
            data: {
                [voteField]: { increment: votingPower }
            }
        });
        res.json(newVote);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to cast vote" });
    }
};
exports.voteOnProposal = voteOnProposal;
//# sourceMappingURL=proposalController.js.map