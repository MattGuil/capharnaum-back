const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const app = express();

const userRoutes = require('./routes/user.routes');
const activityRoutes = require('./routes/activity.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const participationRoutes = require('./routes/participation.routes');
const messageRoutes = require ('./routes/message.routes');

require("dotenv").config({ path: './config/.env' });
require('./config/db');

const bodyParser = require('body-parser');

const allowedOrigins = [
	'http://localhost:5173',
	'http://localhost:4173',
	'https://capharnaum.vercel.app'
];

app.use(cors({
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
}));

app.get('/geocode', async (req, res) => {
    const address = req.query.address;
    const apiKey = process.env.GOOGLE_API_KEY;
    const googleMapsUrl = `https://maps.google.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(googleMapsUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Google Maps:", error);
        res.status(500).json({ error: "Erreur lors de l'appel à l'API Google Maps" });
    }
});

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
		res.status(402).json({ authenticated: false });
	}
});

const { Disciplines, ActivityTypes, Days } = require('./enums');

app.get('/enums', (req, res) => {
	res.json({ Disciplines, ActivityTypes, Days });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/participation', participationRoutes);
app.use('/api/message', messageRoutes)

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT} ...`);
});


const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	}
});

io.on('connection', (socket) => {
	console.log('Un utilisateur est connecté: ', socket.id);

	socket.on('joinConversation', (conversationId) => {
		socket.join(conversationId);
		console.log(`Un utilisateur a rejoint la conversation : ${conversationId}`);
	});

	socket.on('sendMessage', async (data) => {
		try {
			const response = await axios.post('http://localhost:5001/api/message/send', {
				from: data.from,
				to: data.to,
				content: data.content,
			});

			if (response.data.success) {
				io.to(data.conversationId).emit('newMessage', {
					message: response.data.message
				});

				console.log('Message envoyé avec succès');
			} else {
				console.error('Erreur lors de l\'enregistrement du message');
			}
		} catch (err) {
			console.error("Erreur lors de l'envoi du message: ", err);
		}
	});

	socket.on('disconnect', () => {
		console.log("Un utilisateur s'est déconnecté");
	});
});

server.listen(5002, () => {
	console.log(`Serveur démarré sur le port 5002`);
});