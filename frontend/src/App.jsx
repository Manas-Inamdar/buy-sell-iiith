import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Product from './pages/Product';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SellProduct from './pages/SellProduct';
import GeminiChatbot from './pages/Chatbot.jsx';
import ProtectedRoute from './components/Protected.jsx';
import Cart from './pages/Cart.jsx';
import SoldItems from './pages/SoldItems.jsx';
import Register from './pages/Register';


const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <GeminiChatbot />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collections />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/sell' element={<SellProduct />} />
          <Route path='/sold' element={<SoldItems />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </div >
  );
};

export default App;