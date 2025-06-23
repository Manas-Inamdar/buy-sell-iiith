import React, { useState } from 'react';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="container mx-auto py-12 px-4">
      
      <div className="max-w-6xl mx-auto"> 
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl bg-gray-100 p-3 rounded-xl"> {/* Increased gap */}
            <button
              className={`flex items-center justify-center gap-3 px-8 py-5 rounded-lg transition-all duration-300 ${
                activeTab === 'pending'
                  ? 'bg-white text-blue-600 shadow-lg transform scale-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="font-medium text-lg">Pending Orders</span> 
            </button>

            <button
            
              className={`flex items-center justify-center gap-3 px-8 py-5 rounded-lg transition-all duration-300 ${
                activeTab === 'completed'
                  ? 'bg-white text-green-600 shadow-lg transform scale-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              <span className="font-medium text-lg">Completed Orders</span>
            </button>
          </div>
        </div>

        <div className="transition-all duration-300 transform">
          <div className="grid gap-8 md:gap-10"> 
            {activeTab === 'pending' && (
              <div className="animate-fadeIn">
                <PendingOrders />
              </div>
            )}
            {activeTab === 'completed' && (
              <div className="animate-fadeIn">
                <CompletedOrders />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;