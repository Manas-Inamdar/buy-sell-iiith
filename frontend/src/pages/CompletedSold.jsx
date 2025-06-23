import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompletedSold = () => {
  const { user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/order/completed?email=${user.email}`, config);
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch completed orders:', error);
      }
    };

    if (user && user.email) {
      fetchCompletedOrders();
    }
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Completed Sales Found
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          Your completed sales will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order ID: {order._id}</h2>
          <p className="text-gray-600 mb-2">Buyer: {order.buyer}</p>
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
          <p className="mt-4 text-green-600 font-semibold">Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default CompletedSold;