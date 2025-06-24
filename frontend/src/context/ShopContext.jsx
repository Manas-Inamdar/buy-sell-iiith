import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();
const ShopContextProvider = (props) => {
    const navigate = useNavigate();

    const [cartcount, setCartCount] = useState(0);
    const [cartdata, setCartData] = useState([]);
    const [products, setProducts] = useState([]);
    const [currency] = useState("INR");
    const [delivery_fee] = useState(0);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const [token, setTokenState] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);

    const setToken = (newToken) => {
        setTokenState(newToken);
        if (newToken) localStorage.setItem('token', newToken);
        else {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('http://localhost:4000/api/user/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (err) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [token]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/product/list");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch products");
        }
    };

    const fetchUserInfo = async (email) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/user/email/${email}`);
            // Do something with res.data if needed
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch user info");
        }
    };

    const value = {
        cartcount, setCartCount, cartdata, setCartData, products, setProducts,
        currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
        token, setToken, user, setUser,
        fetchProducts, fetchUserInfo
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};
export default ShopContextProvider;

// Only show user.email (and firstname/lastname if you want)
// <p>Email: {user?.email}</p>