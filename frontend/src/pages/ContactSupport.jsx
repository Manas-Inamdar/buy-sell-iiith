// filepath: /home/manas/Downloads/Buy-Sell-IIITH-main/frontend/src/pages/ContactSupport.jsx
import React, { useState, useContext } from 'react';
// import your AuthContext or useAuth hook
import { AuthContext } from '../context/AuthContext';

const ContactSupport = () => {
  const { user, login } = useContext(AuthContext);
  const email = user?.email || '';
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Simulate a login (you might want to remove this in production)
  login({ email: 'student@iiit.ac.in', name: 'Student Name' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send to backend
    await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message }),
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
      {submitted ? (
        <p className="text-green-600">Thank you! Your message has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Your Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={email}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactSupport;