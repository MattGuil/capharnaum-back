const express = require('express');
const router = express.Router();

const favoriteController = require('../contollers/favorite.controller');

// Routes pour les favoris
router.post('/', favoriteController.addFavorite);
router.get('/user/:userId', favoriteController.getFavoritesByUser);
router.get('/check/:userId/:activityId', favoriteController.checkFavorite);
router.delete('/:userId/:activityId', favoriteController.removeFavorite);

module.exports = router;
