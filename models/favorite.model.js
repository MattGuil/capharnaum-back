const mongoose = require('mongoose');

const Favorite = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true 
  },
  activity: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activity', 
    required: true }
});

module.exports = mongoose.model('favorite', Favorite);
