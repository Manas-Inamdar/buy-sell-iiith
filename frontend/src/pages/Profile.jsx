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

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Your IIIT SSO Account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user?.firstname?.[0] || user?.email?.[0]}
              {user?.lastname?.[0] || ''}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.firstname || ''} {user?.lastname || ''}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-gray-700">First Name: </span>
              <span className="text-gray-600">{user?.firstname || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Last Name: </span>
              <span className="text-gray-600">{user?.lastname || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email: </span>
              <span className="text-gray-600">{user?.email || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Contact Number: </span>
              <span className="text-gray-600">{user?.contactnumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;