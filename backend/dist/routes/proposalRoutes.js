"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proposalController_1 = require("../controllers/proposalController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, proposalController_1.getAllProposals);
router.get('/:id', auth_1.authenticate, proposalController_1.getProposalById);
router.post('/', auth_1.authenticate, proposalController_1.createProposal);
router.put('/:id', auth_1.authenticate, proposalController_1.updateProposal);
router.delete('/:id', auth_1.authenticate, proposalController_1.deleteProposal);
router.post('/:id/vote', auth_1.authenticate, proposalController_1.voteOnProposal);
exports.default = router;
//# sourceMappingURL=proposalRoutes.js.map