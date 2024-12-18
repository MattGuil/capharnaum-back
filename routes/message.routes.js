const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Message = require('../models/message.model');

router.post('/send', async (req, res) => {
	const { from, to, content } = req.body;

	if (!from || !to || !content) {
		return res
			.status(400)
			.json({ error: 'Tous les champs sont nécessaires' });
	}

	try {
		const newMessage = new Message({ from, to, content });
		await newMessage.save();
		res.status(201).json({ success: 'Message envoyé avec succès', message: newMessage });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
	}
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.aggregate([
            {
                $addFields: {
                    conversationPartner: {
                        $cond: {
                            if: { $eq: ["$from", new mongoose.Types.ObjectId(userId)] },
                            then: "$to",
                            else: "$from"
                        }
                    }
                }
            },
			{
                $match: {
                    $or: [
                        { from: new mongoose.Types.ObjectId(userId) },
                        { to: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $group: {
                    _id: "$conversationPartner",
                    messages: { $push: "$$ROOT" },
                }
            },
			{
                $project: {
                    _id: 0,
                    conversationPartner: "$_id",
                    latestMessage: { $arrayElemAt: [{ $sortArray: { input: "$messages", sortBy: { createdAt: -1 } } }, 0] },
                }
            },
			{
                $match: {
                    conversationPartner: { $ne: new mongoose.Types.ObjectId(userId) }
                }
            },
            {
                $sort: {
                    "latestMessage.createdAt": -1,
                }
            },
			{
                $lookup: {
                    from: "users",
                    localField: "conversationPartner",
                    foreignField: "_id",
                    as: "conversationPartnerInfo"
                }
            },
            {
                $unwind: "$conversationPartnerInfo"
            },
            {
                $project: {
                    conversationPartner: "$conversationPartnerInfo",
                    latestMessage: 1
                }
            }
        ]);

        const result = messages.map(conversation => ({
            conversationPartner: conversation.conversationPartner,
            latestMessage: conversation.latestMessage,
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
});

router.get('/:userId/:correspondentId', async (req, res) => {
	const { userId, correspondentId } = req.params;

	try {
		const messages = await Message.find({
			$or: [
				{ from: userId, to: correspondentId },
				{ from: correspondentId, to: userId }
			]
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erreur lors de la récupération de la conversation' });
	}
});

module.exports = router;
