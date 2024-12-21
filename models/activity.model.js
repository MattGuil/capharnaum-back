const mongoose = require('mongoose');

const { Disciplines, ActivityTypes, Days } = require('../enums');


const Activity = new mongoose.Schema({
   title: { 
      type: String,
      required: true 
   },
   discipline: { 
      type: String,
      enum: Object.values(Disciplines),
      required: true 
   },
   type: { 
      type: String,
      enum: Object.values(ActivityTypes),
      required: true 
   },
   address: { 
      type: String,
      required: true
   },
   placeName: { 
      type: String,
      required: false
   },
   coordinates: {
      type: Object,
      required: true
   },
   price: { 
      type: Number,
      required: true,
      validate: {
         validator: (v) => !isNaN(v),
         message: props => `${props.value} n'est pas un prix valide !`
      }
   },
   startTime: { 
      type: String,
      required: true,
      validate: {
         validator: (v) => /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(v),
         message: props => `${props.value} n'est pas une heure valide !`
      }
   },
   endTime: { 
      type: String,
      required: true,
      validate: {
         validator: (v) => /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(v),
         message: props => `${props.value} n'est pas une heure valide !`
      }
   },
   day: { 
      type: String,
      enum: Object.values(Days),
      required: false 
   },
   date: { 
      type: Date,
      required: false 
   },
   nbParticipants: { 
      type: Number,
      default: 0
   },
   maxParticipants: { 
      type: Number,
      required: true
   },
   description: { 
      type: String,
      required: false
   },
   owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
   }
 });

module.exports = mongoose.model("Activity", Activity);
