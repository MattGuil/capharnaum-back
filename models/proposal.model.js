const mongoose = require('mongoose');

const Proposal = new mongoose.Schema({
  title: {
     type: String,
      required: true
     },
  description: {
     type: String
     },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'user', required: true }
});

module.exports = mongoose.model('proposals', Proposal);
