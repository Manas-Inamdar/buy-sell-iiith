import productModel from '../models/productmodel.js';

// Allowed categories and types here
const ALL_CATEGORIES = [
    "Electronics", "Furniture", "Clothing", "Books", "Appliances", "Sports", "Stationery", "Miscellaneous", "Food"
];

const CATEGORY_TYPE_MAP = {
    Electronics: [
        "Mobile Phones", "Smartphones", "Feature Phones", "Laptops", "Desktops", "Cameras", "DSLR", "Mirrorless Cameras",
        "Tablets", "Headphones", "Earphones", "Smart Watches", "Speakers", "Bluetooth Devices", "Monitors", "Keyboards",
        "Mice", "Chargers", "Power Banks", "Accessories", "Printers", "Projectors", "Routers", "Wearables", "Other"
    ],
    Furniture: [
        "Beds", "Sofas", "Chairs", "Tables", "Desks", "Wardrobes", "Shelves", "Drawers", "Mattresses", "Cupboards",
        "Study Tables", "Dining Sets", "Bean Bags", "Stools", "Shoe Racks", "TV aUnits", "Bookshelves", "Recliners", "Other"
    ],
    Clothing: [
        "Men", "Women", "Kids", "T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Sweaters", "Dresses", "Sarees",
        "Kurta/Kurti", "Shorts", "Skirts", "Shoes", "Sandals", "Sportswear", "Ethnic Wear", "Accessories", "Bags",
        "Belts", "Caps", "Socks", "Scarves", "Gloves", "Winter Wear", "Rain Wear", "Other"
    ],
    Books: [
        "Textbooks", "Novels", "Reference", "Comics", "Magazines", "Entrance Prep", "Competitive Exams", "Engineering",
        "Medical", "Science", "Math", "History", "Biography", "Children", "Fiction", "Non-Fiction", "Language Learning",
        "Poetry", "Self-Help", "Cookbooks", "Travel", "Art", "Photography", "Other"
    ],
    Appliances: [
        "Kitchen Appliances", "Washing Machines", "Refrigerators", "Microwaves", "Fans", "Heaters", "Mixers/Grinders",
        "Toasters", "Air Conditioners", "Water Purifiers", "Geysers", "Irons", "Vacuum Cleaners", "Coffee Makers",
        "Blenders", "Rice Cookers", "Dishwashers", "Juicers", "Other"
    ],
    Sports: [
        "Cricket", "Football", "Badminton", "Tennis", "Table Tennis", "Basketball", "Volleyball", "Gym Equipment",
        "Bicycles", "Skates", "Yoga Mats", "Dumbbells", "Sports Shoes", "Rackets", "Swim Gear", "Sportswear",
        "Fitness Trackers", "Camping Gear", "Other"
    ],
    Stationery: [
        "Notebooks", "Pens & Pencils", "Calculators", "Drawing Supplies", "Folders", "Files", "Markers", "Highlighters",
        "Sticky Notes", "Art Supplies", "Geometry Boxes", "Erasers", "Sharpeners", "Staplers", "Desk Organizers",
        "Planners", "Diaries", "Whiteboards", "Other"
    ],
    Miscellaneous: [
        "Bags", "Watches", "Musical Instruments", "Games", "Toys", "Decor", "Jewelry", "Cosmetics", "Gardening Tools",
        "Pet Supplies", "Collectibles", "Gift Items", "Handmade", "DIY Kits", "Other"
    ],
    Food: [
        "Snacks", "Meals", "Beverages", "Homemade", "Packaged", "Bakery", "Sweets", "Chocolates", "Ready-to-eat",
        "Frozen Food", "Dairy", "Fruits", "Vegetables", "Health Food", "Vegan", "Gluten-Free", "Non-Veg", "Eggless",
        "Organic", "Dry Fruits", "Pickles", "Sauces & Dips", "Breakfast", "Lunch", "Dinner", "Street Food", "Other"
    ]
};

const addproduct = async (req, res) => {
    const { title, price, description, category, subCategory, imageUrl } = req.body;
    const sellerEmail = req.user.email; // The logged-in user is the seller

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
            seller_email: sellerEmail, // <-- Correct field
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