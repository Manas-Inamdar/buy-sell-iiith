import { useContext, useEffect, useState } from "react";
import React from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../frontend_assets/assets";
import Title from "../components/Title";
import Product from "../components/Product";

const Collections = () => {
  const {search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product/list');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initialize filteredProducts with fetched data
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

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

  const apply = () => {
    let copy = products.slice();

    if (category.length > 0) {
      copy = copy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      copy = copy.filter((item) => subCategory.includes(item.subCategory));
    }

    if (search) {
      copy = copy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredProducts(copy);
  };

  const sort = (variable) => {
    let copy = products.slice();
    if (variable === 'low-high') {
      copy.sort((a, b) => a.price - b.price);
    } else if (variable === 'high-low') {
      copy.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(copy);
  };

  useEffect(() => {
    apply();
  }, [category, subCategory, search, products]);

  return (
    <>
      {showSearch && (
        <div className="border-t border-b bg-gray-50 text-center">
          <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-96">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
              className="flex-1 outline-none bg-white text-lg"
            />
          </div>
          <img
            onClick={() => setShowSearch(false)}
            className="inline w-3 cursor-pointer"
            src={assets.cross_icon}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        <div className="min-w-60">
          <p
            onClick={() => setFilter(!filter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt=""
              className={`h-3 sm:hidden ${filter ? "rotate-90" : ""}`}
            />
          </p>

          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${filter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["Electronics", "Furniture", "Clothing"].map((cat) => (
                <p className="flex gap-2" key={cat}>
                  <input className="w-3" type="checkbox" value={cat} onChange={toggle} />
                  {cat.toUpperCase()}
                </p>
              ))}
            </div>
          </div>

          <div className={`border border-gray-300 pl-5 py-3 my-5 ${filter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["Mobile Phones", "Laptops", "Cameras","Beds","Sofas","Chairs","Men","Women","Kids "].map((subCat) => (
                <p className="flex gap-2" key={subCat}>
                  <input className="w-3" type="checkbox" value={subCat} onChange={toggle1} />
                  {subCat}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            <div className="flex items-center gap-4">
              <select
                onChange={(e) => sort(e.target.value)}
                className="border-2 border-gray-300 px-2 py-1 text-sm"
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