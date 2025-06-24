import { useContext, useEffect, useState } from "react";
import React from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../frontend_assets/assets";
import Title from "../components/Title";
import Product from "../components/Product";
import { toast } from "react-toastify";

const ALL_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Appliances",
  "Sports",
  "Stationery",
  "Miscellaneous"

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

const ALL_TYPES = [
  "Mobile Phones", "Laptops", "Cameras", "Tablets", "Headphones", "Smart Watches", "Speakers", "Accessories",
  "Beds", "Sofas", "Chairs", "Tables", "Desks", "Wardrobes", "Shelves", "Drawers",
  "Men", "Women", "Kids", "T-Shirts", "Jeans", "Jackets", "Shoes",
  "Textbooks", "Novels", "Reference", "Comics", "Magazines", "Entrance Prep",
  "Kitchen Appliances", "Washing Machines", "Refrigerators", "Microwaves", "Fans", "Heaters",
  "Cricket", "Football", "Badminton", "Gym Equipment", "Bicycles",
  "Notebooks", "Pens & Pencils", "Calculators", "Drawing Supplies", "Folders",
  "Bags", "Watches", "Musical Instruments", "Games", "Others"
];

const Collections = () => {
  const { search, setSearch, showSearch, setShowSearch, products, fetchProducts } = useContext(ShopContext);
  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState('relevant'); // NEW

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply filters and sorting together
  useEffect(() => {
    let copy = products.slice();

    if (category.length > 0) {
      copy = copy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      copy = copy.filter((item) => subCategory.includes(item.subCategory));
    }

    if (search) {
      copy = copy.filter((item) =>
        (item.name || item.title || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort after filtering
    if (sortOption === 'low-high') {
      copy.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      copy.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(copy);
  }, [category, subCategory, search, products, sortOption]);

  const toggle = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggle1 = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Just update the sort option
  const sort = (variable) => {
    setSortOption(variable);
  };

  const filteredTypes = category.length === 0
    ? ALL_TYPES
    : category.flatMap(cat => CATEGORY_TYPE_MAP[cat] || []);

  return (
    <>
      {showSearch && (
        <div className="border-t border-b bg-gray-50 dark:bg-gray-900 text-center transition-colors duration-300">
          <div className="inline-flex items-center justify-center border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2 my-5 mx-3 rounded-full w-96 shadow transition-colors duration-300">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
              className="flex-1 outline-none bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 border-none rounded-full px-4 py-2 transition-colors duration-300"
            />
          </div>
          <img
            onClick={() => setShowSearch(false)}
            className="inline w-3 cursor-pointer"
            src={assets.cross_icon}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-200 dark:border-gray-700">
        <div className="min-w-60">
          <p
            onClick={() => setFilter(!filter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2 text-gray-900 dark:text-white"
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt=""
              className={`h-3 sm:hidden ${filter ? "rotate-90" : ""}`}
            />
          </p>

          <div className={`border border-gray-300 dark:border-gray-700 pl-5 py-3 mt-6 bg-white dark:bg-gray-800 rounded-lg ${filter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300">
              {ALL_CATEGORIES.map((cat) => (
                <p className="flex gap-2" key={cat}>
                  <input className="w-3 accent-blue-600" type="checkbox" value={cat} onChange={toggle} />
                  {cat.toUpperCase()}
                </p>
              ))}
            </div>
          </div>

          <div className={`border border-gray-300 dark:border-gray-700 pl-5 py-3 my-5 bg-white dark:bg-gray-800 rounded-lg ${filter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300" style={{ maxHeight: 220, overflowY: "auto" }}>
              {filteredTypes.map((subCat) => (
                <p className="flex gap-2" key={subCat}>
                  <input className="w-3 accent-blue-600" type="checkbox" value={subCat} onChange={toggle1} />
                  {subCat}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-2xl mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 uppercase drop-shadow-lg">
                ALL COLLECTIONS
              </h2>
              <div className="h-1 w-32 mt-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-4">
              <select
                onChange={(e) => sort(e.target.value)}
                className="border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filteredProducts.map((product) => (
              <Product
                product={product}
                key={product._id}
                name={product.name}
                id={product._id}
                price={product.price}
                image={product.image}
                sizes={product.sizes}
                quantity={product.quantity}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;