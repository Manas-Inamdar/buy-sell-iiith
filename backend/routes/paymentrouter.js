import express from 'express';
import { createOrder } from '../controllers/paymenthandler.js';
import auth from '../middleware/auth.js'; // <-- Import auth

const router = express.Router();

router.post('/create-order', auth, createOrder); // <-- Protect with auth

export default router;