import axios from 'axios';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(ShopContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      navigate('/');
    }
  }, [navigate, setToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get('ticket');
    if (ticket) {
      axios
        .post('http://localhost:4000/api/user/cas-validate', {
          ticket,
          service: 'http://localhost:5173/login',
        })
        .then((res) => {
          if (res.data.success) {
            setToken(res.data.token);
            if (res.data.isNewUser) {
              navigate(`/register?email=${res.data.user.email}`);
            } else {
              navigate('/');
            }
          } else {
            toast.error("CAS validation failed");
          }
        })
        .catch(() => {
          toast.error("Login failed. Please try again.");
        });
    }
  }, [navigate, setToken]);

  const handleCASLogin = () => {
    const service = encodeURIComponent('http://localhost:5173/login');
    window.location.href = `https://login.iiit.ac.in/cas/login?service=${service}`;
  };

  return (
    <div
      className="fixed inset-0 min-h-screen min-w-screen flex items-center justify-center z-0 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-400 to-green-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
    >
      {/* Dot Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff80 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 0,
        }}
      ></div>

      {/* Login Card */}
      <div
        className="rounded-3xl shadow-2xl px-12 py-16 flex flex-col items-center bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700"
        style={{
          minWidth: 350,
          maxWidth: '90vw',
          zIndex: 1,
        }}
      >
        <h1
          className="text-5xl font-extrabold mb-10 text-center tracking-wide text-gray-900 dark:text-white"
          style={{
            letterSpacing: '2px',
            textShadow: '0 2px 8px #cbd5e1',
          }}
        >
          IIIT BUY SELL
        </h1>
        <button
          onClick={handleCASLogin}
          className="transition-all text-white px-12 py-5 rounded-2xl text-2xl font-bold shadow-xl focus:outline-none focus:ring-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900"
        >
          Login with IIIT CAS
        </button>
        <div className="mt-8 flex gap-2 items-center">
          <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
            Secure IIIT SSO Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
