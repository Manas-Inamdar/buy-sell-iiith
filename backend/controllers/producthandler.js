import productModel from '../models/productmodel.js';

const addproduct = async (req, res) => {
    const { title, price, description, category, subCategory, imageUrl } = req.body;
    const buyerEmail = req.user.email; // Use authenticated user's email

    try {
        if (!title || !price || !description || !category || !subCategory || !imageUrl) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const product = await productModel.findOne({ name: title });
        if (product) {
            return res.status(400).json({ message: "Product with this title already exists", product });
        }

        const newProduct = new productModel({
            name: title,
            price: price,
            description: description,
            category: category,
            subCategory: subCategory,
            buyer_email: buyerEmail, // Use from JWT, not body
            image: imageUrl,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: "Something went wrong" });
    }
};

const removeproduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await productModel.findByIdAndDelete(productId);
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const listproduct = async (req, res) => {
    console.log("hi");
    try {
        const products = await productModel.find();
        // console.log("hi");
        // console.log(products);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { addproduct, removeproduct, listproduct };

// Assuming you have an Express app and router set up
// import express from 'express';
// const app = express();
// const productRouter = express.Router();

// // Your existing routes
// productRouter.post('/add', addproduct);
// productRouter.get('/list', listproduct);
// productRouter.delete('/remove/:productId', removeproduct);

// export default productRouter;