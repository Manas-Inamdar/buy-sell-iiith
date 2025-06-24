import productModel from '../models/productmodel.js';

// Allowed categories and types here
const ALL_CATEGORIES = [
    "Electronics", "Furniture", "Clothing", "Books", "Appliances", "Sports", "Stationery", "Miscellaneous"
];
const CATEGORY_TYPE_MAP = {
    Electronics: ["Mobile Phones", "Laptops", "Cameras", "Tablets", "Headphones", "Smart Watches", "Speakers", "Accessories"],
    Furniture: ["Beds", "Sofas", "Chairs", "Tables", "Desks", "Wardrobes", "Shelves", "Drawers"],
    Clothing: ["Men", "Women", "Kids", "T-Shirts", "Jeans", "Jackets", "Shoes"],
    Books: ["Textbooks", "Novels", "Reference", "Comics", "Magazines", "Entrance Prep"],
    Appliances: ["Kitchen Appliances", "Washing Machines", "Refrigerators", "Microwaves", "Fans", "Heaters"],
    Sports: ["Cricket", "Football", "Badminton", "Gym Equipment", "Bicycles"],
    Stationery: ["Notebooks", "Pens & Pencils", "Calculators", "Drawing Supplies", "Folders"],
    Miscellaneous: ["Bags", "Watches", "Musical Instruments", "Games", "Others"]
};

const addproduct = async (req, res) => {
    const { title, price, description, category, subCategory, imageUrl } = req.body;
    const buyerEmail = req.user.email; // Use authenticated user's email

    try {
        if (!title || !price || !description || !category || !subCategory || !imageUrl) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        // Validate category
        if (!ALL_CATEGORIES.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }
        // Validate subCategory/type
        if (!CATEGORY_TYPE_MAP[category] || !CATEGORY_TYPE_MAP[category].includes(subCategory)) {
            return res.status(400).json({ message: "Invalid type for selected category" });
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
            image: imageUrl,
            buyer_email: buyerEmail,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
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