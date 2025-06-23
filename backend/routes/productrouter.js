import express from 'express';
import { addproduct,removeproduct,listproduct } from '../controllers/producthandler.js';


const productRouter = express.Router();

productRouter.post('/add', addproduct);
productRouter.delete('/remove/:productId', removeproduct);
productRouter.get('/list', listproduct);


export default productRouter;