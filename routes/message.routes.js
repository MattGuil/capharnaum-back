const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');

// Route pour envoyer un message
router.post('/send', async (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Tous les champs sont nécessaires' });
  }

  try {
    const newMessage = new Message({ from, to, message });
    await newMessage.save();
    res.status(201).json({ success: 'Message envoyé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});
// route récupere messa
router.get('/:userId/messages', async (req, res) => {
    const { userId } = req.params;
  
    try {
        const messages = await Message.find({ to: userId }); // Filtrer les messages où 'to' correspond à l'ID
        res.status(200).json(messages); // Renvoyer les messages sans peuplement
      } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
  });
  
module.exports = router;
