import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../frontend_assets/assets';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

const Cart = () => {
  const { cartcount, setCartCount, currency, user } = useContext(ShopContext);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/cart/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
        calculateTotal(response.data);
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
        toast.error("Failed to fetch cart data");
      }
    };

    if (user && user.email) {
      fetchCartData();
    }
  }, [user, cartcount]);

  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce((acc, item) => {
      const price = item.product.price;
      const quantity = item.quantity;

      if (typeof price === 'number' && typeof quantity === 'number') {
        return acc + price * quantity;
      } else {
        console.error('Invalid price or quantity', item);
        return acc;
      }
    }, 0);

    setTotal(totalPrice);
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/cart/remove', { productId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      const itemToRemove = cart.find(item => item.product._id === productId);
      const itemQuantity = itemToRemove ? itemToRemove.quantity : 0;

      const updatedCart = cart.filter(item => item.product._id !== productId);
      setCart(updatedCart);
      calculateTotal(updatedCart);
      setCartCount(prev => prev - itemQuantity);
      console.log(cartcount);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleIncrementQuantity = async (productdata) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/cart/add', { productdata, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedCart = cart.map(item =>
        item.product._id === productdata._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      calculateTotal(updatedCart);
      setCartCount(prev => prev + 1);
      console.log(cartcount);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrementQuantity = async (productdata) => {
    try {
      const token = localStorage.getItem('token');
      const currentQuantity = cart.find(item => item.product._id === productdata._id).quantity;
      if (currentQuantity > 1) {
        await axios.post('/api/cart/add', { productdata, quantity: -1 }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedCart = cart.map(item =>
          item.product._id === productdata._id ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCart(updatedCart);
        calculateTotal(updatedCart);
        setCartCount(prev => prev - 1);
        console.log(cartcount);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error("Failed to update quantity");
    }
  };

  const addToOrders = async ({ cart }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/order/add', { cart }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.orders;
    } catch (error) {
      console.error('Failed to add order:', error);
      toast.error("Failed to place order");
      return [];
    }
  };

  const handleBuyNow = async () => {
    const orders = await addToOrders({ cart });
    if (orders.length > 0) {
      // Show OTP(s) to user
      const otps = orders.map(order => order.otp).join('\n');
      toast.success(`Order placed! OTP(s):\n${otps}`, { autoClose: false });
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/cart/clear', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart([]);
        setTotal(0);  
        setCartCount(0);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error("Failed to clear cart after purchase");
      }
    }
  };

  const handleRazorpayPayment = async () => {
    const token = localStorage.getItem('token');
    // 1. Create order on backend
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: total }), // total is in INR
    });
    const order = await res.json();

    // 2. Open Razorpay checkout
    const options = {
      key: "rzp_test_hvi1z6Sogsa8FF", // Your Razorpay key_id
      amount: order.amount,
      currency: order.currency,
      name: "IIIT Market",
      description: "Cart Payment",
      order_id: order.id,
      handler: async function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Place order and show OTP
        const orders = await addToOrders({ cart });
        if (orders.length > 0) {
          const otps = orders.map(order => order.otp).join('\n');
          toast.success(`Order placed! OTP(s):\n${otps}`, { autoClose: false });
          // Optionally clear cart here as well
        }
      },
      prefill: {
        email: user?.email || "",
        contact: "",
      },
      theme: { color: "#3399cc" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* <EmptyCartIcon /> */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Looks like you haven't made your choice yet. Browse the collection and add something you like!
          </p>
          <Link 
            to="/collection" 
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
        {/* Title */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <Title text1="Your" text2="Cart" />
        </div>

        {/* Cart Items */}
        <div className="space-y-6">
          {cart.map((item, index) => {
            const { product, quantity } = item;

            if (!product) return null;

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                {/* Product*/}
                <div className="flex items-center gap-4">
                  <img
                    className="w-20 h-20 object-cover rounded-lg"
                    src={product.image}
                    alt={product.name}
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{currency}{product.price}</p>
                  </div>
                </div>

                {/* Quantity*/}
                <div className="flex items-center mt-4 md:mt-0">
                  <label className="text-sm text-gray-600 dark:text-gray-300 mr-2">Qty:</label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                    <button
                      onClick={() => handleDecrementQuantity(product)}
                      className="w-8 h-8 flex justify-center items-center text-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      readOnly
                      className="w-12 h-8 text-center border-0 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      style={{
                        WebkitAppearance: 'none', 
                        MozAppearance: 'textfield', 
                      }}
                    />
                    <button
                      onClick={() => handleIncrementQuantity(product)}
                      className="w-8 h-8 flex justify-center items-center text-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <div
                  className="text-red-600 cursor-pointer hover:text-red-800 dark:hover:text-red-400 transition duration-200 mt-4 md:mt-0"
                  onClick={() => handleRemoveItem(product._id)}
                >
                  <img
                    src={assets.bin_icon}
                    className="w-6"
                    alt="Remove item"
                  />
                </div>
              </div>
            );
          })}
        </div>  

        {/* Total*/}
        <div className="mt-10 text-right space-y-4">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            Total: {currency}{total.toFixed(2)}
          </p>
          <button
            onClick={handleBuyNow}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 mr-4"
          >
            Buy Now (OTP)
          </button>
          <button
            onClick={handleRazorpayPayment}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200"
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;