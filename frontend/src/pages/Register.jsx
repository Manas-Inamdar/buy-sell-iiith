import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contactnumber, setContactnumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const validateContact = (number) => {
    // Simple validation: 10 digits, all numbers
    return /^\d{10}$/.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateContact(contactnumber)) {
      setError('Please enter a valid 10-digit contact number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/user/register-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstname, lastname, contactnumber }),
      });
      if (res.ok) {
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-500 to-green-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl min-w-[320px] w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">Complete Your Registration</h2>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Email:
          <input
            value={email}
            disabled
            className="w-full mt-1 mb-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </label>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          First Name:
          <input
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Enter your first name"
          />
        </label>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Last Name:
          <input
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Enter your last name"
          />
        </label>
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Contact Number:
          <input
            value={contactnumber}
            onChange={e => setContactnumber(e.target.value)}
            required
            maxLength={10}
            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="10-digit mobile number"
            inputMode="numeric"
            pattern="\d*"
          />
        </label>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className={`mt-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg py-3 font-bold text-lg shadow-md transition-all duration-200 ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Register;