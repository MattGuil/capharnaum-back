const express = require('express');
const router = express.Router();
const proposalController = require('../contollers/proposal.controller');

// Routes pour les propositions
router.post('/', proposalController.createProposal);
router.get('/', proposalController.getAllProposals);
router.get('/:id', proposalController.getProposalById);
router.put('/:id', proposalController.updateProposal);
router.delete('/:id', proposalController.deleteProposal);

module.exports = router;
