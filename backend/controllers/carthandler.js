import express from 'express';
const router = express.Router();
import userModel from '../models/usermodel.js';
import productModel from '../models/productmodel.js';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';

// Add to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productdata, quantity } = req.body;
        const user = await userModel.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const findproduct = await productModel.findById(productdata._id);
        if (!findproduct) return res.status(404).json({ message: 'Product not found' });

        if (!user.cartdata) user.cartdata = [];
        const existingCartItem = user.cartdata.find(item =>
            item.product._id.toString() === productdata._id
        );

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

// Remove from cart
router.post('/remove', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID is required' });

        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cartdata = user.cartdata.filter(item => item.product._id.toString() !== productId);
        await user.save();

        return res.status(200).json({
            message: 'Product removed from cart',
            cartdata: user.cartdata
        });
    } catch (error) {
        console.error("Failed to remove item:", error);
        return res.status(500).json({
            message: 'Failed to remove product from cart',
            error: error.message
        });
    }
});

// Update cart item quantity
router.post('/update', auth, async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!req.user) return res.status(401).json({ message: 'User not authenticated' });

        const user = await userModel.findById(req.user._id).populate('cartdata.product');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingCartItem = user.cartdata.find(item => item.product._id.toString() === product._id);
        if (existingCartItem) {
            existingCartItem.quantity = quantity;
        }

        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', cart: user.cartdata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// List cart items
router.get('/list', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate('cartdata.product');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user.cartdata);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear cart
router.post('/clear', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cartdata = [];
        await user.save();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
