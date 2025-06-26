import express from 'express';
import { addproduct, removeproduct, listproduct } from '../controllers/producthandler.js';
import auth from '../middleware/auth.js'; // <-- Import auth
import Product from '../models/productmodel.js'; // Add this import if not already present


const productRouter = express.Router();

productRouter.post('/add', auth, addproduct); // <-- Protect add
productRouter.delete('/remove/:productId', auth, removeproduct); // <-- Protect remove
productRouter.get('/list', listproduct); // <-- Listing can stay public

// Update buyer_email for a product
productRouter.put('/buyer/:id', async (req, res) => {
  const { buyer_email } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { buyer_email },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update buyer email' });
  }
});


export default productRouter;