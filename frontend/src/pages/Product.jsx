import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useChat } from '../context/ChatContext';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { cartcount, setCartCount, user, currency, token } = useContext(ShopContext);
  const { openChat } = useChat();
  const [productdata, setproductdata] = useState(null);
  const [image, setimage] = useState('');
  const [sizes, setsizes] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error('Failed to decode token', error);
        toast.error('Authentication error. Please login again.');
        navigate('/login');
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/product/list');
        const data = response.data;
        const product = data.find((product) => product._id === productId);
        setproductdata(product);
        if (product) {
          const response1 = await axios.get(`/api/user/email/${product.seller_email}`);
          setSellerInfo(response1.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleAddToCart = async () => {
    if (productdata.buyer_email === user.email) {
      toast.error("You can't buy your own product");
      return;
    }

    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setLoading(true);
    const cartData = {
      productdata,
      quantity: 1,
    };

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Added to cart successfully!');
        setCartCount(prev => prev + 1);
        console.log(cartcount, 'cartcount');
      } else {
        throw new Error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {productdata ? (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative bg-gray-100 dark:bg-gray-800 p-8">
                  <div className="flex gap-6">
                    {/* Thumbnails */}
                    <div className="hidden md:flex flex-col gap-4">
                      <img
                        src={productdata.image}
                        alt={productdata.name}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-all duration-300 ring-2 ring-offset-2 ring-transparent hover:ring-black dark:hover:ring-white"
                        onClick={() => setimage(productdata.image)}
                      />
                    </div>

                    {/* Main Image */}
                    <div className="flex-1">
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <img
                          src={image || productdata.image}
                          alt={productdata.name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-8 lg:p-12">
                  <div className="flex flex-col h-full">
                    <div className="mb-8">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{productdata.name}</h1>
                      <div className="flex items-start justify-between mb-8">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white">
                          {currency}{productdata.price}
                        </div>
                        {user && productdata && productdata.seller_email && user.email !== productdata.seller_email && (
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded ml-4"
                            onClick={() => openChat(productdata.seller_email)}
                          >
                            Message Seller
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        Description:
                        <br />
                        {productdata.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Product Details Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Category</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{productdata.category}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Subcategory</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{productdata.subCategory}</p>
                        </div>
                      </div>
                      {/* Seller Information */}
                      {sellerInfo && (
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Seller Information</h2>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700 dark:text-gray-200">Name:</span>
                              <span className="text-gray-600 dark:text-gray-300">{sellerInfo.firstname} {sellerInfo.lastname}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700 dark:text-gray-200">Email:</span>
                              <span className="text-gray-600 dark:text-gray-300">{sellerInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700 dark:text-gray-200">Phone:</span>
                              <span className="text-gray-600 dark:text-gray-300">{sellerInfo.contactnumber}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className={`w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 font-medium text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding to Cart...
                          </span>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>

                      {/* Features */}
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-900 dark:text-gray-100">100% Original</span>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-900 dark:text-gray-100">Cash on Delivery</span>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                            </svg>
                            <span className="text-sm text-gray-900 dark:text-gray-100">7-Day Returns</span>
                          </div>
                        </div>
                      </div>

                      {/* Message Seller Button - REMOVE THIS DUPLICATE */}
                      {/* 
                      {user && productdata && productdata.seller_email && user.email !== productdata.seller_email && (
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded ml-4"
                          onClick={() => openChat(productdata.seller_email)}
                        >
                          Message Seller
                        </button>
                      )} 
                      */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 dark:border-gray-200 border-t-transparent"></div>
        </div>
      )}
    </>
  );
};

export default Product;