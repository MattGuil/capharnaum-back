const Favorite = require('../models/favorite.model');

exports.addFavorite = async (req, res) => {
  try {
    const { user, activity } = req.body;

    const newFavorite = new Favorite({ user, activity });
    
    await newFavorite.save();
    
    res.status(201).json({ message: 'Favorite added successfully', newFavorite });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId }).populate('activity');
    
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { userId, activityId } = req.params;

    const favorite = await Favorite.findOne({ user: userId, activity: activityId });
    
    if (favorite) {
      return res.status(200).json({ message: 'Favorite exists' });
    } else {
      return res.status(204).json({ message: 'Favorite not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { userId, activityId } = req.params;

    const favorite = await Favorite.findOneAndDelete({ user: userId, activity: activityId });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.status(200).json({ message: 'Favorite removed successfully', favorite });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
