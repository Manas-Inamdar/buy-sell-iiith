import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const { token, setToken } = useContext(ShopContext);

  const isTokenValid = () => {
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        setToken(null);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      setToken(null);
      return false;
    }
  };

  return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;