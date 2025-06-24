import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PendingSold = () => {
  const { user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [otp, setOtp] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('/api/order/pending', config);
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch pending orders:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchPendingOrders();
    }
  }, [user]);

  const handleVerifyOTP = async (orderId, inputOTP) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/order/verify', { orderId, otp: inputOTP }, config);
      if (response.data.success == true) {
        toast.success('Order completed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setOrders(orders.filter(order => order._id !== orderId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Pending Sales Found
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          When customers buy your items, they will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order ID: {order._id}</h2>
            <p className="text-gray-600 mb-4">Buyer: {order.buyer}</p>
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
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col  items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength="6"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
                  value={otp[order._id] || ''}
                  onChange={(e) => setOtp({ ...otp, [order._id]: e.target.value })}
                />
                <button
                  onClick={() => handleVerifyOTP(order._id, otp[order._id])}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PendingSold;