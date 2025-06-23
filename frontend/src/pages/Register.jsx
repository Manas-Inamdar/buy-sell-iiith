import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contactnumber, setContactnumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #6a11cb 0%, #2575fc 50%, #43e97b 100%)'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: 32,
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          minWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Complete Your Registration</h2>
        <label>
          Email:
          <input value={email} disabled style={{ width: '100%', marginTop: 4, marginBottom: 8 }} />
        </label>
        <label>
          First Name:
          <input value={firstname} onChange={e => setFirstname(e.target.value)} required style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label>
          Last Name:
          <input value={lastname} onChange={e => setLastname(e.target.value)} required style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label>
          Contact Number:
          <input value={contactnumber} onChange={e => setContactnumber(e.target.value)} required style={{ width: '100%', marginTop: 4 }} />
        </label>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <button
          type="submit"
          style={{
            marginTop: 12,
            background: 'linear-gradient(90deg, #2563eb 0%, #6a11cb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;