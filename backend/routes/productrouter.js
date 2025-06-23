import express from 'express';
import { addproduct, removeproduct, listproduct } from '../controllers/producthandler.js';
import auth from '../middleware/auth.js'; // <-- Import auth


const productRouter = express.Router();

productRouter.post('/add', auth, addproduct); // <-- Protect add
productRouter.delete('/remove/:productId', auth, removeproduct); // <-- Protect remove
productRouter.get('/list', listproduct); // <-- Listing can stay public


export default productRouter;