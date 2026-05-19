import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
  } = useAppContext();

  const [displayAddress, setDisplayAddress] = useState("Select Delivery Location");

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        localStorage.removeItem("mapta_user_token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

useEffect(() => {
     if (user) {
       axios.get("/api/address/get")
         .then(({ data }) => {
           if (data.success && data.addresses && data.addresses.length > 0) {
             const addr = data.addresses[0];
             setDisplayAddress(`${addr.street}, ${addr.city}`);
           }
         })
         .catch(() => {});
     } else {
       setDisplayAddress("Select Delivery Location");
     }
   }, [user, axios]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Banner: Promo or Speed info */}
      <div className="bg-primary text-white text-center py-1 text-xs font-semibold tracking-wide">
        ⚡ Superfast 10-Minute Delivery to your doorstep!
      </div>

      <div className="px-4 py-3 md:px-12 lg:px-24 flex flex-col gap-3">
        {/* Main Row */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Delivery Info */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-black italic text-primary tracking-tighter">Mapta</span>
              <span className="text-accent text-3xl font-black font-sans">.</span>
            </Link>

            {/* Delivery Time & Address Card */}
            <div className="hidden md:flex flex-col pl-6 border-l border-gray-200">
              <div className="flex items-center gap-1.5 text-black font-extrabold text-sm tracking-tight">
                <span>⚡</span>
                <span>Delivering in 10 Mins</span>
              </div>
              <div 
                onClick={() => user ? navigate("/cart") : setShowUserLogin(true)}
                className="text-xs text-gray-500 font-semibold cursor-pointer hover:text-primary flex items-center gap-1 mt-0.5"
              >
                <span className="truncate max-w-[200px]">{displayAddress}</span>
                <span>▼</span>
              </div>
            </div>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="flex-1 max-w-[600px] relative hidden sm:block">
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#f3f4f6] text-gray-800 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-transparent focus:border-primary/20 focus:bg-white focus:shadow-sm outline-none transition placeholder-gray-400 font-medium"
              type="text"
              placeholder="Search for 'milk', 'bread', 'banana' or 'veggies'..."
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Admin Link */}
            <Link 
              to="/admin" 
              className="text-sm font-semibold text-gray-600 hover:text-primary hidden lg:block"
            >
              Admin Panel
            </Link>

            {/* Auth Button */}
            {user ? (
              <div className="relative group py-2">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img src={assets.profile_icon} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                  <span className="text-sm font-semibold text-gray-700 hidden md:inline">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                </div>
                <ul className="hidden group-hover:block absolute right-0 top-full bg-white shadow-xl border border-gray-100 py-1.5 w-40 rounded-xl z-50 text-sm font-semibold text-gray-700">
                  <li
                    onClick={() => navigate("/my-orders")}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                  >
                    📦 My Orders
                  </li>
                  <li
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer lg:hidden flex items-center gap-2"
                  >
                    🏪 Admin Panel
                  </li>
                  <hr className="border-gray-100 my-1" />
                  <li 
                    className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-2" 
                    onClick={logout}
                  >
                    🚪 Logout
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => setShowUserLogin(true)}
                className="cursor-pointer px-5 py-2 text-sm text-primary font-bold hover:bg-primary/5 rounded-xl transition"
              >
                Login
              </button>
            )}

            {/* Zepto-Style Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="bg-success text-white px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-md hover:bg-success/95 transition font-semibold text-sm cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M5.4 5H21L19 13H7M5.4 5L7 13M7 13L4.7 17.6C4.5 18 4.8 18.5 5.3 18.5H19M9 21.5C9.6 21.5 10 21.1 10 20.5C10 19.9 9.6 19.5 9 19.5C8.4 19.5 8 19.9 8 20.5C8 21.1 8.4 21.5 9 21.5ZM17 21.5C17.6 21.5 18 21.1 18 20.5C18 19.9 17.6 19.5 17 19.5C16.4 19.5 16 19.9 16 20.5C16 21.1 16.4 21.5 17 21.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{cartCount() > 0 ? `${cartCount()} items` : "My Cart"}</span>
              {cartCount() > 0 && (
                <span className="border-l border-white/20 pl-2.5 font-bold">
                  ${(totalCartAmount() + (totalCartAmount() * 2) / 100).toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (sm and under) */}
        <div className="relative block sm:hidden pb-1">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-[#f3f4f6] text-gray-800 text-sm pl-11 pr-4 py-2 rounded-xl border border-transparent focus:border-primary/20 focus:bg-white focus:shadow-sm outline-none transition placeholder-gray-400 font-medium"
            type="text"
            placeholder="Search for 'milk', 'chips', 'apple'..."
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
