import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [otps, setOtps] = useState({});
  const [verifyInputs, setVerifyInputs] = useState({}); // <-- Add this

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/order/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch pending orders:', error);
        toast.error("Failed to fetch pending orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPendingOrders();
    }
  }, [token]);

  const handleGenerateOTP = async (orderId) => {
    try {
      const response = await axios.post(`/api/order/generate-otp/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { otp } = response.data;
      setOtps(prev => ({
        ...prev,
        [orderId]: otp
      }));
    } catch (error) {
      console.error('Failed to generate OTP:', error);
      toast.error("Failed to generate OTP");
    }
  };

  const handleVerifyOTP = async (orderId) => {
    try {
      const otp = verifyInputs[orderId];
      const response = await axios.post(`/api/order/verify-otp/${orderId}`, { otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order marked as completed!");
      // Optionally, remove the order from the list or refresh
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (error) {
      toast.error("Invalid OTP or failed to verify.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Pending Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">No pending orders to display</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Order ID: {order._id}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Buyer: {order.buyer}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Seller: {order.seller}</p>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.product.image || "/default-image.png"}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={e => { e.target.src = "/default-image.png"; }}
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{item.product.name}</p>
                      <p className="text-gray-600 dark:text-gray-300">Quantity: {item.quantity}</p>
                      <p className="text-gray-600 dark:text-gray-300">Price: ₹{item.product.price}</p>
                        <p className="text-gray-600 dark:text-gray-300">Category: {item.product.category}</p>
                      {/* Add more fields as needed */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {otps[order._id] ? (
                  <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                    <p className="text-green-700 dark:text-green-300 font-semibold mb-2">OTP Generated</p>
                    <div className="flex gap-2 justify-center">
                      {otps[order._id].split('').map((digit, index) => (
                        <span 
                          key={index}
                          className="bg-white dark:bg-gray-800 w-8 h-8 flex items-center justify-center rounded-lg border border-green-200 dark:border-green-700 font-mono text-lg"
                        >
                          {digit}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerateOTP(order._id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
                  >
                    Generate OTP
                  </button>
                )}

                {/* OTP Verification UI */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={verifyInputs[order._id] || ""}
                    onChange={e =>
                      setVerifyInputs(prev => ({
                        ...prev,
                        [order._id]: e.target.value
                      }))
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() => handleVerifyOTP(order._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;