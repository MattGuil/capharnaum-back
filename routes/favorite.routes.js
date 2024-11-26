const express = require('express');
const router = express.Router();
const favoriteController = require('../contollers/favorite.controller');

// Routes pour les favoris
router.post('/', favoriteController.addFavorite);
router.delete('/:id', favoriteController.removeFavorite);
router.get('/user/:userId', favoriteController.getFavoritesByUser);

module.exports = router;
