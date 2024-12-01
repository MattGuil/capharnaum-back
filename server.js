const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const app = express();

const userRoutes = require('./routes/user.routes');
const activityRoutes = require('./routes/activity.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const proposalRoutes = require('./routes/proposal.routes');

require("dotenv").config({ path: './config/.env' });
require('./config/db');

const bodyParser = require('body-parser');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://capharnaum.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(cookieParser(process.env.TOKEN_SECRET));

app.get('/auth/verify-session', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ authenticated: false });
      }
      res.status(200).json({ authenticated: true });
    });
  } else {
    res.status(200).json({ authenticated: false });
  }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/proposal', proposalRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT} ...`);
});