import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


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

    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(localStorage.getItem('token') || '');

    const setToken = (newToken) => {
        setTokenState(newToken);
        if (newToken) localStorage.setItem('token', newToken);
        else localStorage.removeItem('token');
    };

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Current time in seconds

                if (decodedToken.exp < currentTime) {
                    // Token is expired
                    console.error("Token expired");
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem("token");
                    navigate('/login');
                } else {
                    const newUser = { id: decodedToken.id, email: decodedToken.email };
                    setUser(newUser);
                    console.log(newUser, "user");
                    // Adjust based on your token payload
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setToken(null);
                setUser(null);
                localStorage.removeItem("token"); // Clear invalid tokens
                navigate('/login');
            }
        } else {
            setUser(null); // Reset user if no token
        }
    }, [token,navigate]);

    // Fetch products with specific error handling
    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/product/list");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch products");
        }
    };

    // Fetch user info with specific error handling
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
        token, setToken, user,
        fetchProducts, fetchUserInfo // <-- Export these functions
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