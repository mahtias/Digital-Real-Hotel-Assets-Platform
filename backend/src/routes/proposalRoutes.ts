import { Router } from 'express';
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  voteOnProposal
} from '../controllers/proposalController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllProposals);
router.get('/:id', authenticate, getProposalById);
router.post('/', authenticate, createProposal);
router.put('/:id', authenticate, updateProposal);
router.delete('/:id', authenticate, deleteProposal);
router.post('/:id/vote', authenticate, voteOnProposal);

export default router;
