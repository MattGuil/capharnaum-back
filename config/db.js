const mongoose = require('mongoose');

require("dotenv").config({ path: './config/.env' });

mongoose.connect("mongodb+srv://capharnaum:capharnaum@cluster0.q1lfe.mongodb.net/capharnaum?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err))