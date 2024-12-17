const mongoose = require("mongoose");

const Message = new mongoose.Schema({
   from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   content: {
      type: String,
      required: true
   },
});

module.exports = mongoose.model("Message", Message);
