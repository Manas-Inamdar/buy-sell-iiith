import bcrypt from 'bcrypt';
import Order from '../models/orders.js';
import Product from '../models/productmodel.js'; // Import Product model

const addOrder = async (req, res) => {
    try {
        const email = req.user.email; // Authenticated user's email
        const { cart } = req.body;

        const orders = [];
        const plainOtps = [];

        for (const item of cart) {
            // Lookup product in DB to get the seller's email
            const product = await Product.findById(item.product._id);
            if (!product) continue; // skip if not found    

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);

            orders.push({
                buyer: email,
                seller: product.seller_email, // Use seller email from DB
                items: [{
                    product: product._id,
                    quantity: item.quantity
                }],
                status: 'Pending',
                otp: hashedOtp,
                createdAt: new Date()
            });

            plainOtps.push(otp);
        }

        const createdOrders = await Order.insertMany(orders);

        const responseOrders = createdOrders.map((order, index) => ({
            order_id: order._id,
            otp: plainOtps[index]
        }));

        res.status(200).json({ message: 'Orders created successfully', orders: responseOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const pendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const generatedOrderOTP = async (req, res) => {
    try {
        const { orderId } = req.params;
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const hashedOtp = await bcrypt.hash(otp, 10);

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { otp : hashedOtp  },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const pendingSellingOrders = async (req, res) => {
    try {
        const email = req.user.email; // Use authenticated user's email
        const pendingOrders = await Order.find({ seller: email, status: 'Pending' }).populate('items.product');
        res.status(200).json(pendingOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const completedOrders = async (req, res) => {
    try {
        const email = req.user.email; // Use authenticated user's email
        const completedOrders = await Order.find({ seller: email, status: 'Completed' }).populate('items.product');
        res.status(200).json(completedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const isMatch = await bcrypt.compare(otp, order.otp);

        if (!isMatch) {
            return res.status(400).json({success:false, message: 'Invalid OTP' });
        }

        order.status = 'Completed';
        await order.save();

        res.status(200).json({ success:true, message: 'Order verified and completed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}

export { addOrder, pendingOrders, verifyOtp, pendingSellingOrders, completedOrders , generatedOrderOTP};