import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const SellPage = () => {
    const { token } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        imageUrl: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = {
        Electronics: [
            "Mobile Phones", "Smartphones", "Feature Phones", "Laptops", "Desktops", "Cameras", "DSLR", "Mirrorless Cameras",
            "Tablets", "Headphones", "Earphones", "Smart Watches", "Speakers", "Bluetooth Devices", "Monitors", "Keyboards",
            "Mice", "Chargers", "Power Banks", "Accessories", "Printers", "Projectors", "Routers", "Wearables", "Other"
        ],
        Furniture: [
            "Beds", "Sofas", "Chairs", "Tables", "Desks", "Wardrobes", "Shelves", "Drawers", "Mattresses", "Cupboards",
            "Study Tables", "Dining Sets", "Bean Bags", "Stools", "Shoe Racks", "TV Units", "Bookshelves", "Recliners", "Other"
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'category' ? { subCategory: '' } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.subCategory || !formData.imageUrl) {
            setError('All fields are required, including an image URL.');
            setSuccess('');
            return;
        }

        if (isNaN(formData.price) || Number(formData.price) <= 0) {
            setError('Price must be a valid positive number.');
            setSuccess('');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                '/api/product/add',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess('Item submitted successfully!');
            setError('');
            setFormData({
                title: '',
                description: '',
                price: '',
                category: '',
                subCategory: '',
                imageUrl: '',
            });
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to submit the item. Please try again.');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-[90%] sm:max-w-lg m-auto mt-10 gap-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8"
        >
            <div className="inline-flex items-center gap-2 mb-4">
                <p className="text-3xl font-bold text-gray-700 dark:text-white">Sell an Item</p>
                <hr className="border-none h-[2px] w-12 bg-gray-800 dark:bg-gray-200" />
            </div>

            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded-md outline-none shadow-sm dark:bg-gray-800 dark:text-gray-100"
                placeholder="Item Title"
                required
            />

            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded-md outline-none shadow-sm dark:bg-gray-800 dark:text-gray-100"
                placeholder="Item Description"
                rows="4"
                required
            ></textarea>

            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded-md outline-none shadow-sm dark:bg-gray-800 dark:text-gray-100"
                placeholder="Price (in Rs)"
                min="1"
                required
            />

            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded-md outline-none shadow-sm dark:bg-gray-800 dark:text-gray-100"
                required
            >
                <option value="">Select Category</option>
                {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            {formData.category && (
                <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded-md outline-none shadow-sm dark:bg-gray-800 dark:text-gray-100"
                    required
                >
                    <option value="">Select Sub-Category</option>
                    {categories[formData.category].map((sub) => (
                        <option key={sub} value={sub}>
                            {sub}
                        </option>
                    ))}
                </select>
            )}

            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Image URL</label>
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded-md outline-none shadow-sm dark:bg-gray-800 dark:text-gray-100"
                    placeholder="Enter Image URL"
                    required
                />
            </div>

            {formData.imageUrl && (
                <div className="w-full mt-4">
                    <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-cover rounded-md shadow-md"
                    />
                </div>
            )}

            {error && (
                <div className="text-red-500 mt-2 font-bold bg-red-100 dark:bg-red-900 p-3 rounded-md w-full text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-green-500 mt-2 font-bold bg-green-100 dark:bg-green-900 p-3 rounded-md w-full text-center">
                    {success}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white font-medium px-6 py-3 mt-4 rounded-md shadow-md transition-all duration-200 ${
                    loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default SellPage;