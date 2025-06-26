import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const ContactSupport = () => {
  const { user } = useContext(ShopContext);
  const email = user?.email || '';
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Contact Support</h1>
        <p className="text-red-600">Please log in to contact support.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message }),
    });
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Contact Support</h1>
      {submitted ? (
        <p className="text-green-600 dark:text-green-400">Thank you! Your message has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Your Email</label>
            <div
              className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 text-base font-mono text-gray-900 dark:text-gray-100 overflow-x-auto whitespace-nowrap text-left"
              style={{ userSelect: 'all', maxWidth: '100%' }}
              tabIndex={0}
              title={email}
            >
              {email}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactSupport;