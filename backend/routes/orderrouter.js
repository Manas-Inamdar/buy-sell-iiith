import express from 'express';
import { addOrder, pendingOrders, verifyOtp, pendingSellingOrders, completedOrders, generatedOrderOTP } from '../controllers/orderhandler.js';
import auth from '../middleware/auth.js'; // <-- Import auth

const orderRouter = express.Router();

orderRouter.post('/add', auth, addOrder);
orderRouter.get('/list', auth, pendingOrders);
orderRouter.post('/verify', auth, verifyOtp);
orderRouter.get('/pending', auth, pendingSellingOrders);
orderRouter.get('/completed', auth, completedOrders);
orderRouter.post('/generate-otp/:orderId', auth, generatedOrderOTP);

export default orderRouter;