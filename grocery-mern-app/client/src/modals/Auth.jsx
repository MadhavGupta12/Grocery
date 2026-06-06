import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });
      if (data.success) {
        toast.success(data.message);
        if (data.token) {
          localStorage.setItem("mapta_user_token", data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        }
        setUser(data.user);
        setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-in-up"
      >
        {/* Top Banner */}
        <div className="bg-[#F8C008] px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xl font-black text-[#1a1a1a] tracking-tight">mapta</span>
              <span className="w-2 h-2 rounded-full bg-[#1a1a1a] mb-2 inline-block"></span>
            </div>
            <p className="text-[#1a1a1a] font-bold text-sm opacity-70">
              {state === "login" ? "Welcome back! 👋" : "Join us today! 🎉"}
            </p>
          </div>
          <button
            onClick={() => setShowUserLogin(false)}
            className="w-8 h-8 rounded-full bg-[#1a1a1a]/10 hover:bg-[#1a1a1a]/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-50 mx-6 mt-5 rounded-xl p-1">
          <button
            onClick={() => setState("login")}
            className={`flex-1 py-2 text-sm font-black rounded-lg transition-all cursor-pointer ${
              state === "login"
                ? "bg-white text-[#1a1a1a] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setState("register")}
            className={`flex-1 py-2 text-sm font-black rounded-lg transition-all cursor-pointer ${
              state === "register"
                ? "bg-white text-[#1a1a1a] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {state === "register" && (
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border-2 border-gray-200 focus:border-[#F8C008] rounded-xl px-4 py-3 text-sm font-medium text-[#1a1a1a] outline-none transition-all placeholder-gray-400"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border-2 border-gray-200 focus:border-[#F8C008] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#1a1a1a] outline-none transition-all placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 1C8.676 1 6 3.676 6 7v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V11a2 2 0 00-2-2h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 10a2 2 0 110 4 2 2 0 010-4z" fill="currentColor"/></svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full border-2 border-gray-200 focus:border-[#F8C008] rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-[#1a1a1a] outline-none transition-all placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0c831f] hover:bg-[#0a7019] disabled:bg-gray-300 text-white font-black py-3.5 rounded-xl transition-all active:scale-95 shadow-lg cursor-pointer mt-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Please wait...
              </>
            ) : (
              state === "login" ? "Login to Mapta →" : "Create Account →"
            )}
          </button>

          <p className="text-center text-xs text-gray-500 font-medium">
            {state === "register" ? "Already have an account? " : "New to Mapta? "}
            <button
              type="button"
              onClick={() => setState(state === "login" ? "register" : "login")}
              className="text-[#0c831f] font-black hover:underline cursor-pointer"
            >
              {state === "login" ? "Sign up free" : "Login here"}
            </button>
          </p>
        </form>

        {/* Trust Badges */}
        <div className="px-6 pb-5 flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium">
          <span className="flex items-center gap-1">🔒 Secure Login</span>
          <span className="flex items-center gap-1">⚡ 10-Min Delivery</span>
          <span className="flex items-center gap-1">✅ Verified App</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
