const Participation = require('../models/participation.model');

exports.getAllParticipations = async (req, res) => {
  try {
    const Participations = await Participation.find();
    
    res.status(200).json(Participations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createParticipation = async (req, res) => {
  try {
    const { user, activity } = req.body;
    
    const newParticipation = new Participation({ user, activity });
    
    await newParticipation.save();
    
    res.status(201).json({ message: 'Participation created successfully', newParticipation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getParticipationById = async (req, res) => {
  try {
    const Participation = await Participation.findById(req.params.id);
    
    if (!Participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }
    
    res.status(200).json(Participation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getParticipationsByUser = async (req, res) => {
  try {
    const participations = await Participation.find({ user: req.params.userId }).populate('activity');
    
    res.status(200).json(participations);
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

exports.checkParticipation = async (req, res) => {
  try {
    const { userId, activityId } = req.params;

    const participation = await Participation.findOne({ user: userId, activity: activityId });
    
    if (participation) {
      return res.status(200).json({ message: 'Participation exists' });
    } else {
      return res.status(204).json({ message: 'Participation not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteParticipation = async (req, res) => {
  try {
    const { userId, activityId } = req.params;

    const participation = await Participation.findOneAndDelete({ user: userId, activity: activityId });
    
    if (!participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }
    
    res.status(200).json({ message: 'Participation removed successfully', participation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
