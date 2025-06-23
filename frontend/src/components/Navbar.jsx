import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../frontend_assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { cartcount, setCartCount, showSearch, setShowSearch, user, setToken, cartdata } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchCartCount = async () => {
        if (user && user.email) {
            try {
                const response = await axios.get(`/api/cart/list?email=${user.email}`);
                const cartData = response.data;
                const totalQuantity = cartData.reduce((acc, item) => acc + item.quantity, 0);
                setCartCount(totalQuantity);
            } catch (error) {
                console.error('Failed to fetch cart data:', error);
            }
        }
    };

    useEffect(() => {
        fetchCartCount();
    }, [user, cartdata]);

    const Logo = () => (
        <div className="flex items-center gap-2">
          <svg 
            className="w-8 h-8 text-blue-600" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-xl font-bold text-gray-800">
            IIIT<span className="text-blue-600">Market</span>
          </span>
        </div>
      );

    return (
        <div className="flex items-center justify-between py-10 font-extrabold">
            <Link to="/">
                <Logo />
            </Link>
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                <NavLink to="/" className="flex flex-col items-center gap-1">
                    <p>HOME</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                </NavLink>
                <NavLink to="/collection" className="flex flex-col items-center gap-1">
                    <p>COLLECTION</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                </NavLink>
                {user && (
                    <>
                        <NavLink to="/sell" className="flex flex-col items-center gap-1">
                            <p>SELL</p>
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                        </NavLink>
                        <NavLink to="/sold" className="flex flex-col items-center gap-1">
                            <p>ITEMS SOLD</p>
                            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
                        </NavLink>
                    </>
                )}
            </ul>
            <div className="flex items-center gap-6">
                {user ? (
                    <img
                        onClick={() => setShowSearch(!showSearch)}
                        src={assets.search_icon}
                        className="w-5 cursor-pointer"
                        alt=""
                    />
                ) : <div></div>}

                {user ? (
                    <div className="relative group">
                        <img className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
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
                        <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
                        <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                            {cartcount}
                        </p>
                    </Link>
                ) : <div></div>}

                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden"
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