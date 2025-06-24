import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [otps, setOtps] = useState({});

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

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No pending orders to display</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Order ID: {order._id}</h2>
              <p className="text-gray-600 mb-2">Buyer: {order.buyer}</p>
              <p className="text-gray-600 mb-4">Seller: {order.seller}</p>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{item.product.name}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: ₹{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                {otps[order._id] ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-semibold mb-2">OTP Generated</p>
                    <div className="flex gap-2 justify-center">
                      {otps[order._id].split('').map((digit, index) => (
                        <span 
                          key={index}
                          className="bg-white w-8 h-8 flex items-center justify-center rounded-lg border border-green-200 font-mono text-lg"
                        >
                          {digit}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerateOTP(order._id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate OTP
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;