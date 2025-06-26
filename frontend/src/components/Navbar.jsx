import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../frontend_assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { cartcount, setCartCount, showSearch, setShowSearch, user, setToken, cartdata } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        // Redirect to CAS logout (replace service URL with your deployed app if needed)
        window.location.href = "https://login.iiit.ac.in/cas/logout?service=http://localhost:5173/login";
    };

    const fetchCartCount = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('/api/cart/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const cartData = response.data;
                const totalQuantity = cartData.reduce((acc, item) => acc + item.quantity, 0);
                setCartCount(totalQuantity);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setToken(null);
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    console.error('Failed to fetch cart data:', error);
                }
            }
        }
    };

    useEffect(() => {
        fetchCartCount();
    }, [user, cartdata]);

    const Logo = () => (
        <div className="flex items-center gap-4">
          {/* Beautiful, detailed shopping cart logo */}
          <svg
            className="w-14 h-14"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cart basket */}
            <rect x="10" y="18" width="36" height="18" rx="4" fill="#2563eb" stroke="#1e40af" strokeWidth="2"/>
            {/* Cart handle */}
            <path d="M14 18c0-6 8-10 14-10s14 4 14 10" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Cart wheels */}
            <circle cx="18" cy="40" r="4" fill="#1e40af" stroke="#2563eb" strokeWidth="2"/>
            <circle cx="38" cy="40" r="4" fill="#1e40af" stroke="#2563eb" strokeWidth="2"/>
            {/* Cart grid lines */}
            <line x1="18" y1="22" x2="18" y2="32" stroke="#fff" strokeWidth="1.5"/>
            <line x1="28" y1="22" x2="28" y2="32" stroke="#fff" strokeWidth="1.5"/>
            <line x1="38" y1="22" x2="38" y2="32" stroke="#fff" strokeWidth="1.5"/>
            <line x1="14" y1="26" x2="42" y2="26" stroke="#fff" strokeWidth="1.2"/>
            <line x1="14" y1="30" x2="42" y2="30" stroke="#fff" strokeWidth="1.2"/>
            {/* Subtle shadow */}
            <ellipse cx="28" cy="48" rx="16" ry="2.5" fill="#e0e7ef" />
          </svg>
          <span className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            IIITH <span className="text-blue-700">TradeZone</span>
          </span>
        </div>
      );

    return (
        <div className="flex items-center justify-between py-10 font-extrabold bg-white dark:bg-gray-900">
            <Link to="/">
                <Logo />
            </Link>
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700 dark:text-gray-200">
                <NavLink to="/" className="flex flex-col items-center gap-1">
                    <p>HOME</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-200" />
                </NavLink>
                <NavLink to="/collection" className="flex flex-col items-center gap-1">
                    <p>COLLECTION</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-200" />
                </NavLink>
                {user && (
                    <>
                        <NavLink to="/sell" className="flex flex-col items-center gap-1">
                            <p>SELL</p>
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-200" />
                        </NavLink>
                        <NavLink to="/sold" className="flex flex-col items-center gap-1">
                            <p>ITEMS SOLD</p>
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-200" />
                        </NavLink>
                    </>
                )}
            </ul>
            <div className="flex items-center gap-4">
                {/* Theme toggle button on the left of search */}
                <ThemeToggle />
                {user ? (
                    <img
                        onClick={() => setShowSearch(!showSearch)}
                        src={assets.search_icon}
                        className="w-5 cursor-pointer icon-invert"
                        alt=""
                    />
                ) : <div></div>}

                {user ? (
                    <div className="relative group">
                        <img className="w-5 cursor-pointer icon-invert" src={assets.profile_icon} alt="" />
                        <div className="hidden group-hover:block absolute right-0 pt-4 z-50">
                            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded-lg shadow-xl">
                                <Link to={`/profile/${user.id}`}>
                                    <p className="cursor-pointer hover:text-black transition-colors">My Profile</p>
                                </Link>
                                <Link to="/orders" className="cursor-pointer hover:text-black">
                                    <p className="cursor-pointer hover:text-black transition-colors">Orders</p>
                                </Link>
                                <p onClick={handleLogout} className="cursor-pointer hover:text-black">
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Only show Login, no Sign Up
                    <Link to="/login" className="text-sm font-medium text-gray-700">
                        Login
                    </Link>
                )}

                {user ? (
                    <Link to="/cart" className="relative">
                        <img src={assets.cart_icon} className="w-5 min-w-5 icon-invert" alt="" />
                        <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                            {cartcount}
                        </p>
                    </Link>
                ) : <div></div>}

                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden icon-invert"
                />
            </div>

            {/* Mobile menu: Remove any sign up/change password here too */}
            <div
                className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? `w-full` : `w-0`
                    }`}
            >
                <div className="flex flex-col text-gray-600">
                    <div
                        className="flex items-center gap-3 p-3 cursor-pointer"
                        onClick={() => {
                            setVisible(false);
                        }}
                    >
                        <img className="h-4 rotate-180" src={assets.dropdown_icon}></img>
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} to="/" className="py-2 pl-6 border">
                        HOME
                    </NavLink>
                    <NavLink onClick={() => setVisible(false)} to="/collection" className="py-2 pl-6 border">
                        COLLECTION
                    </NavLink>
                    <NavLink onClick={() => setVisible(false)} to="/about" className="py-2 pl-6 border">
                        ABOUT
                    </NavLink>
                    <NavLink onClick={() => setVisible(false)} to="/contact" className="py-2 pl-6 border">
                        CONTACT
                    </NavLink>
                    {user && (
                        <>
                            <NavLink onClick={() => setVisible(false)} to="/sell" className="py-2 pl-6 border">
                                SELL PRODUCT
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} to="/sold" className="py-2 pl-6 border">
                                ITEMS SOLD
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;