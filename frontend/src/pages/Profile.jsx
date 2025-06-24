import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { token, user, setUser } = useContext(ShopContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    contactnumber: user?.contactnumber || ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    setForm({
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      contactnumber: user?.contactnumber || ''
    });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        '/api/user/profile',
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data); // update context
      toast.success('Profile updated!');
      setEditMode(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

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
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden p-8 relative border-2 border-blue-500/60 dark:border-blue-400/40 backdrop-blur-sm transition-all duration-300">
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
            >
              Edit
            </button>
          )}
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
              {editMode ? (
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-gray-100"
                />
              ) : (
                <span className="text-gray-600 dark:text-gray-300">{user?.firstname || 'N/A'}</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Last Name: </span>
              {editMode ? (
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-gray-100"
                />
              ) : (
                <span className="text-gray-600 dark:text-gray-300">{user?.lastname || 'N/A'}</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Email: </span>
              <span className="text-gray-600 dark:text-gray-300">{user?.email || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Contact Number: </span>
              {editMode ? (
                <input
                  name="contactnumber"
                  value={form.contactnumber}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-gray-100"
                />
              ) : (
                <span className="text-gray-600 dark:text-gray-300">{user?.contactnumber || 'N/A'}</span>
              )}
            </div>
          </div>
          {editMode && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;