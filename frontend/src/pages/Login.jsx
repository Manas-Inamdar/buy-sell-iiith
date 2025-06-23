import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const { setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      navigate('/');
    }
  }, [setToken, navigate]);

  const handleCASLogin = () => {
    window.location.href = 'http://localhost:4000/api/user/cas-login';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(120deg, #6a11cb 0%, #2575fc 50%, #43e97b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* 🔳 Uniform Dot Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#ffffff80 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      ></div>

      {/* 💳 Login Card */}
      <div
        className="rounded-3xl shadow-2xl px-12 py-16 flex flex-col items-center"
        style={{
          background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          border: '2px solid #e0e7ef',
          minWidth: 350,
          maxWidth: '90vw',
          zIndex: 1,
        }}
      >
        <h1
          className="text-5xl font-extrabold mb-10 text-center tracking-wide"
          style={{
            color: '#1e293b',
            letterSpacing: '2px',
            textShadow: '0 2px 8px #cbd5e1',
          }}
        >
          IIIT BUY SELL
        </h1>
        <button
          onClick={handleCASLogin}
          className="transition-all text-white px-12 py-5 rounded-2xl text-2xl font-bold shadow-xl focus:outline-none focus:ring-4"
          style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #6a11cb 100%)',
            boxShadow: '0 4px 24px 0 #2563eb55, 0 1.5px 8px 0 #6a11cb55',
            border: 'none',
          }}
        >
          Login with IIIT CAS
        </button>
        <div className="mt-8 flex gap-2 items-center">
          <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-blue-700 font-medium text-sm">
            Secure IIIT SSO Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
