import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Attach Bearer Token to headers if cookies are blocked by cross-origin policies
axios.interceptors.request.use(
  (config) => {
    const isAdminRequest = config.url.includes("/admin") || config.url.includes("/product/add-product") || config.url.includes("/product/stock") || config.url.includes("/order/status");
    const token = isAdminRequest
      ? localStorage.getItem("mapta_admin_token")
      : localStorage.getItem("mapta_user_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  // Debouncing effect for search queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // check admin status
  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      if (data.success) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch {
       setIsAdmin(false);
     }
  };

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart);
        setWishlistIds(data.user.wishlist || []);
      } else {
        // Silently ignore if not authenticated
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // User is not logged in, ignore
      } else {
        toast.error(error.message);
      }
    }
  };

  // toggle item in wishlist
  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to save items");
      setShowUserLogin(true);
      return;
    }
    try {
      const { data } = await axios.post("/api/user/wishlist/toggle", { productId });
      if (data.success) {
        setWishlistIds(data.wishlist);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems || {}); // safeguard for undefined

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success(`cart updated`);
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += cartItems[items] * itemInfo.offerPrice;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success(`remove from cart`);
      setCartItems(cartData);
    }
  };
  useEffect(() => {
    fetchAdmin();
    fetchProducts();
    fetchUser();
  }, []);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]);
  const value = {
    navigate,
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    wishlistIds,
    toggleWishlist,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext);
};
