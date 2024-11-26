//
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Event = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    date: {
        type: String, 
        required: true
    },
    time: { 
        type: String, 
        required: true 
    },
    place: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const eventsModel = mongoose.model("events", Event);

module.exports = eventsModel;
