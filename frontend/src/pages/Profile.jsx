import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
  const { token, user } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) return null;
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 dark:border-gray-200 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Your IIIT SSO Account</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user?.firstname?.[0] || user?.email?.[0]}
              {user?.lastname?.[0] || ''}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.firstname || ''} {user?.lastname || ''}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">First Name: </span>
              <span className="text-gray-600 dark:text-gray-300">{user?.firstname || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Last Name: </span>
              <span className="text-gray-600 dark:text-gray-300">{user?.lastname || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Email: </span>
              <span className="text-gray-600 dark:text-gray-300">{user?.email || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Contact Number: </span>
              <span className="text-gray-600 dark:text-gray-300">{user?.contactnumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;