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
    const { userId, activityId } = req.body;
    
    const newParticipation = new Participation({ userId, activityId });
    
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

exports.deleteParticipation = async (req, res) => {
  try {
    const Participation = await Participation.findByIdAndDelete(req.params.id);
    
    if (!Participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }
    
    res.status(200).json({ message: 'Participation deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
