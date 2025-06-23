import express from 'express';

import { addOrder, pendingOrders,verifyOtp ,pendingSellingOrders , completedOrders , generatedOrderOTP} from '../controllers/orderhandler.js';

const orderRouter = express.Router();

orderRouter.post('/add', addOrder);
orderRouter.get('/list', pendingOrders);
orderRouter.post('/verify', verifyOtp);
orderRouter.get('/pending', pendingSellingOrders);
orderRouter.get('/completed', completedOrders);
orderRouter.post('/generate-otp/:orderId', generatedOrderOTP);

export default orderRouter;