import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    user, setUser, setShowUserLogin, navigate,
    searchQuery, setSearchQuery,
    cartCount, totalCartAmount, axios, wishlistIds,
  } = useAppContext();

  const [displayAddress, setDisplayAddress] = useState("Select Location");
  const [scrolled, setScrolled] = useState(false);

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
          if (data.success && data.addresses?.length > 0) {
            const addr = data.addresses[0];
            setDisplayAddress(`${addr.street}, ${addr.city}`);
          }
        }).catch(() => {});
    } else {
      setDisplayAddress("Select Location");
    }
  }, [user, axios]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== "/products") navigate("/products");
  };

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}>

      {/* Top Promo Bar - Unified Hybrid Gradient */}
      <div className="brand-gradient-bg text-[#1a1a1a] text-center py-2 text-xs font-black tracking-wide flex items-center justify-center gap-2">
        <span className="animate-bounce-slow">⚡</span>
        Delivery in 10 minutes — Fresh groceries, superfast delivery
        <span className="animate-bounce-slow">⚡</span>
      </div>

      {/* Main Navbar */}
      <div className="px-4 py-3 md:px-10 lg:px-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 shrink-0 hover:opacity-90 transition-opacity">
          <span className="text-2xl font-black text-[#1a1a1a] tracking-tight">
            Mapta
          </span>
          <span className="w-2.5 h-2.5 rounded-full mb-3 inline-block bg-[#0c831f]"></span>
        </Link>

        <div className="hidden md:block w-px h-10 bg-gray-200 mx-1"></div>

        {/* Delivery Info */}
        <div
          className="hidden md:flex flex-col cursor-pointer group shrink-0"
          onClick={() => user ? navigate("/cart") : setShowUserLogin(true)}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 text-[#0c831f]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0c831f" strokeWidth="2.5"/><path d="M12 6v6l4 2" stroke="#0c831f" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Delivery in 10 mins
          </span>
          <span className="text-[13px] font-bold text-[#1a1a1a] flex items-center gap-1 group-hover:text-[#FC8019] transition-colors">
            <span className="truncate max-w-[160px]">{displayAddress}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FC8019] transition-colors">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2.2"/>
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-50 border-2 border-gray-200 text-gray-800 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all duration-200 placeholder-gray-400 font-medium focus:bg-white focus:border-[#FC8019]"
              type="text"
              placeholder="Search for 'milk', 'bread', 'tomato'..."
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FC8019] transition-colors cursor-pointer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Admin */}
          <Link to="/admin" className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a1a1a] px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>
            Admin
          </Link>

          {/* Wishlist */}
          <button onClick={() => navigate("/wishlist")} className="relative p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer" title="Wishlist">
            <svg width="21" height="21" viewBox="0 0 24 24" fill={wishlistIds?.length > 0 ? "#ef4444" : "none"}>
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" stroke={wishlistIds?.length > 0 ? "#ef4444" : "#9ca3af"} strokeWidth="2"/>
            </svg>
            {wishlistIds?.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative group py-1">
              <div className="flex items-center gap-2 cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-all">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0 bg-[#FC8019]">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] text-gray-400 font-medium leading-none">Hello,</p>
                  <p className="text-sm font-bold text-[#1a1a1a] leading-tight">{user.name.split(" ")[0]}</p>
                </div>
              </div>
              <ul className="hidden group-hover:block absolute right-0 top-full bg-white shadow-2xl border border-gray-100 py-2 w-44 rounded-2xl z-50 text-sm font-semibold text-gray-700">
                <li onClick={() => navigate("/my-orders")} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-2.5 transition-colors">📦 My Orders</li>
                <li onClick={() => navigate("/wishlist")} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-2.5 transition-colors">❤️ Wishlist</li>
                <li onClick={() => navigate("/admin")} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer lg:hidden flex items-center gap-2.5 transition-colors">🏪 Admin Panel</li>
                <hr className="border-gray-100 my-1"/>
                <li className="px-4 py-2.5 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-2.5 transition-colors" onClick={logout}>🚪 Logout</li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-4 py-2 text-sm text-[#1a1a1a] font-bold hover:bg-gray-50 rounded-xl transition-all border border-gray-200 hover:border-gray-300"
            >
              Login
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            className="text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 font-bold text-sm cursor-pointer active:scale-95 bg-[#0c831f] hover:bg-[#0a7019]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M5.4 5H21L19 13H7M5.4 5L7 13M7 13L4.7 17.6C4.5 18 4.8 18.5 5.3 18.5H19M9 21.5C9.6 21.5 10 21.1 10 20.5C10 19.9 9.6 19.5 9 19.5C8.4 19.5 8 19.9 8 20.5C8 21.1 8.4 21.5 9 21.5ZM17 21.5C17.6 21.5 18 21.1 18 20.5C18 19.9 17.6 19.5 17 19.5C16.4 19.5 16 19.9 16 20.5C16 21.1 16.4 21.5 17 21.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col items-start leading-none">
              {cartCount() > 0 ? (
                <>
                  <span className="text-[10px] font-medium opacity-80">{cartCount()} item{cartCount() > 1 ? "s" : ""}</span>
                  <span className="text-sm font-black">₹{(totalCartAmount() * 1.02).toFixed(0)}</span>
                </>
              ) : (
                <span className="text-sm font-bold">My Cart</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-2.5 block sm:hidden">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/><path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#FC8019] text-gray-800 text-sm pl-9 pr-4 py-2 rounded-xl outline-none transition-all placeholder-gray-400 font-medium focus:bg-white"
            type="text"
            placeholder="Search groceries..."
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
