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
        <div className="flex items-center gap-5">
          {/* Fast shopping cart logo with handles */}
          <svg
            className="w-28 h-20"
            viewBox="0 0 140 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Speed lines */}
            <g>
              <line x1="10" y1="35" x2="50" y2="35" stroke="#fb8500" strokeWidth="4" />
              <line x1="10" y1="45" x2="40" y2="45" stroke="#fb8500" strokeWidth="3" />
              <line x1="15" y1="55" x2="35" y2="55" stroke="#fb8500" strokeWidth="2" />
              <line x1="20" y1="25" x2="55" y2="25" stroke="#fb8500" strokeWidth="2" />
              <line x1="25" y1="65" x2="45" y2="65" stroke="#fb8500" strokeWidth="1.5" />
            </g>
            {/* Cart handle */}
            <line x1="50" y1="20" x2="40" y2="8" stroke="#2196f3" strokeWidth="6" strokeLinecap="round" />
            {/* Cart body */}
            <polyline
              points="50,20 120,20 110,60 60,60 50,20"
              fill="none"
              stroke="#2196f3"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            {/* Cart grid */}
            <line x1="65" y1="25" x2="105" y2="25" stroke="#2196f3" strokeWidth="2"/>
            <line x1="67" y1="35" x2="103" y2="35" stroke="#2196f3" strokeWidth="2"/>
            <line x1="69" y1="45" x2="101" y2="45" stroke="#2196f3" strokeWidth="2"/>
            <line x1="71" y1="55" x2="99" y2="55" stroke="#2196f3" strokeWidth="2"/>
            <line x1="75" y1="25" x2="75" y2="60" stroke="#2196f3" strokeWidth="2"/>
            <line x1="85" y1="25" x2="85" y2="60" stroke="#2196f3" strokeWidth="2"/>
            <line x1="95" y1="25" x2="95" y2="60" stroke="#2196f3" strokeWidth="2"/>
            {/* Wheels */}
            <circle cx="70" cy="68" r="7" fill="#2196f3" />
            <circle cx="105" cy="68" r="7" fill="#2196f3" />
          </svg>
          <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
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