const express = require('express');
const router = express.Router();
const participationController = require('../contollers/participation.controller');

// Routes pour les propositions
router.get('/', participationController.getAllParticipations);
router.post('/', participationController.createParticipation);
router.get('/:id', participationController.getParticipationById);
router.delete('/:id', participationController.deleteParticipation);

module.exports = router;
