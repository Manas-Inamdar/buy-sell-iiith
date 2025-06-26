// filepath: /home/manas/Downloads/Buy-Sell-IIITH-main/backend/routes/supportRouter.js
import express from 'express';
import SupportMessage from '../models/supportMessageModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    await SupportMessage.create({ email, message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;