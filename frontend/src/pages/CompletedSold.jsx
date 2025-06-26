import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const CompletedSold = () => {
  const { user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('/api/order/completed', config);
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch completed orders:', error);
        toast.error("Failed to fetch completed sales");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchCompletedOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
          Loading...
        </h3>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
          No Completed Sales Found
        </h3>
        <p className="text-gray-500 dark:text-gray-300 text-center max-w-sm">
          Your completed sales will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Order ID: {order._id}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Buyer: {order.buyer}</p>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={
                    item.product.image ||
                    item.product.imageUrl ||
                    item.product.img ||
                    item.product.photo ||
                    item.product.picture ||
                    "/default-image.png"
                  }
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={e => { e.target.src = "/default-image.png"; }}
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{item.product.name}</p>
                  <p className="text-gray-600 dark:text-gray-300">Quantity: {item.quantity}</p>
                  <p className="text-gray-600 dark:text-gray-300">Price: ₹{item.product.price}</p>
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