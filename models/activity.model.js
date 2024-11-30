const mongoose = require('mongoose');

const disciplines = ['danse', 'dessin', 'théâtre', 'musique', 'photographie'];
const types = ['cours', 'pratique', 'rencontre', 'spectacle', 'expo'];
const statuses = ['fermée', 'complète', 'liste d\'attente', 'sans réservation', 'ouverte'];


const Activity = new mongoose.Schema({
   title: { 
      type: String,
      required: true 
   },
   discipline: { 
      type: String,
      enum: disciplines,
      required: true 
   },
   type: { 
      type: String,
      enum: types,
      required: true 
   },
   place: { 
      type: String,
      required: true
   },
   location: { 
      type: String,
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
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
      required: false 
   },
   date: { 
      type: Date,
      required: false 
   },
   status: { 
      type: String,
      enum: statuses,
      required: true
   },
   nbParticipants: { 
      type: Number,
      required: true
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

module.exports = mongoose.model("activity", Activity);
