import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';
import axios from 'axios';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { cartcount, setCartCount, user, currency, token } = useContext(ShopContext);
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
          const response1 = await axios.get(`/api/user/email/${product.buyer_email}`);
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative bg-gray-100 p-8">
                  <div className="flex gap-6">
                    {/* Thumbnails */}
                    <div className="hidden md:flex flex-col gap-4">
                      <img
                        src={productdata.image}
                        alt={productdata.name}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-all duration-300 ring-2 ring-offset-2 ring-transparent hover:ring-black"
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
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">{productdata.name}</h1>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(122 Reviews)</span>
                      </div>
                      <div className="text-5xl font-bold text-gray-900 mb-8">
                        {currency}{productdata.price}
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-8">
                        Description:
                        <br></br>
                        {productdata.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Product Details Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-500 mb-1">Category</p>
                          <p className="font-medium">{productdata.category}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-500 mb-1">Subcategory</p>
                          <p className="font-medium">{productdata.subCategory}</p>
                        </div>
                      </div>
                      {sellerInfo && (
                        <div className="border-t border-gray-100 pt-6 mt-6">
                          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seller Information</h2>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Name:</span>
                              <span className="text-gray-600">{sellerInfo.firstname} {sellerInfo.lastname}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Email:</span>
                              <span className="text-gray-600">{sellerInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Phone:</span>
                              <span className="text-gray-600">{sellerInfo.contactnumber}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className={`w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 font-medium text-lg ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                      <div className="border-t border-gray-100 pt-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">100% Original</span>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">Cash on Delivery</span>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                            </svg>
                            <span className="text-sm">7-Day Returns</span>
                          </div>
                        </div>
                      </div>

                      {/* Seller Information */}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
        </div>
      )}
    </>
  );
};

export default Product;