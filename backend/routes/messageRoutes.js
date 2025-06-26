import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// Send a message
router.post('/send', async (req, res) => {
  const { sender, receiver, content } = req.body;
  try {
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get chat history between two users
router.get('/history', async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all unique chat users for a given user
router.get('/chat-users/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  try {
    const sent = await Message.find({ sender: userEmail }).distinct('receiver');
    const received = await Message.find({ receiver: userEmail }).distinct('sender');
    const users = Array.from(new Set([...sent, ...received])).filter(email => email !== userEmail);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat users' });
  }
});

export default router;