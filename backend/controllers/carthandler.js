import express from 'express';
const router = express.Router();
import userModel from '../models/usermodel.js';
import productModel from '../models/productmodel.js';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';

router.post('/add', auth, async (req, res) => {
    try {
      const { productdata, quantity, email } = req.body;
  
      console.log("Request Body:", req.body);
  
      const findproduct = await productModel.findById(productdata._id);
      if (!findproduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.cartdata) {
        user.cartdata = [];
      }
      const existingCartItem = user.cartdata.find(item =>
        item.product._id.toString() === productdata._id
      );
  
      console.log("Existing Cart Item:", existingCartItem);
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        user.markModified('cartdata'); 
      } else {
        user.cartdata.push({
          product: findproduct,
          quantity
        });
      }
  
      await user.save();
  
      res.status(200).json({
        message: 'Product added to cart successfully',
        cart: user.cartdata
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.post('/remove', auth, async (req, res) => {
    try {
        const { productId, email } = req.body;
        console.log("Attempting to remove product:", { productId, email });

        if (!productId || !email) {
            return res.status(400).json({ message: 'Product ID and email are required' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(typeof productId);
        
        const result = await userModel.findOneAndUpdate(
            { email },
            { 
                $set: { 
                    cartdata: user.cartdata.filter(item => 
                        item.product._id.toString() !== productId
                    )
                }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Update failed' });
        }

        return res.status(200).json({
            message: 'Product removed from cart',
            cartdata: result.cartdata
        });

    } catch (error) {
        console.error("Failed to remove item:", error);
        return res.status(500).json({
            message: 'Failed to remove product from cart',
            error: error.message
        });
    }
});

router.post('/update', auth, async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await userModel.findById(req.user._id).populate('cartdata.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingCartItem = user.cartdata.find(item => item.product.toString() === product._id);
        if (existingCartItem) {
            existingCartItem.quantity = quantity;
        }

        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', cart: user.cartdata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
);

router.get('/list', auth, async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await userModel.findOne({ email }).populate('cartdata.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.cartdata);
        console.log
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/clear', auth, async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body);

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cartdata = [];
        await user.save();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
