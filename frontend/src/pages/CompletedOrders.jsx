import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from "react-toastify";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/order/completed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch completed orders:', error);
        toast.error("Failed to fetch completed orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCompletedOrders();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Completed Orders</h1>
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">No completed orders to display</p>
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
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{item.product.name}</p>
                      <p className="text-gray-600 dark:text-gray-300">Quantity: {item.quantity}</p>
                      <p className="text-gray-600 dark:text-gray-300">Price: ₹{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`mt-4 ${order.status === 'Pending' ? 'text-yellow-600 font-bold' : 'text-gray-600 dark:text-gray-300'}`}>Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedOrders;