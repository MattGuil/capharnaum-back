const mongoose = require('mongoose');

const Participation = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
   },
  activity: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Activity', 
      required: true
   },
});

module.exports = mongoose.model('participation', Participation);
