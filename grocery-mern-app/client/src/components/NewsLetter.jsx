import { useState } from "react";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("🎉 You're subscribed! Exclusive deals coming your way.");
    setEmail("");
  };

  return (
    <div className="mt-12 rounded-2xl overflow-hidden bg-[#1a1a1a] relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F8C008]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0c831f]/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-10">
        {/* Left — App Download CTA */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#F8C008]/10 border border-[#F8C008]/20 px-3 py-1 rounded-full text-[#F8C008] text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="animate-bounce-slow">📱</span>
            Download the App
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
            Get <span className="text-[#F8C008]">10% off</span> on<br />your first app order!
          </h2>
          <p className="text-gray-400 font-medium text-sm mb-6 max-w-sm">
            Order faster, track real-time, get exclusive app-only deals. Available on iOS & Android.
          </p>

          {/* App Badges */}
          <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
            <button className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
              <div className="text-left">
                <p className="text-[9px] text-gray-400 font-medium leading-none">Download on</p>
                <p className="text-sm font-black leading-tight">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.29.16.62.22.97.12l12.43-7.17-2.83-2.83-10.57 9.88zM.33 1.13C.12 1.44 0 1.84 0 2.33v19.33c0 .49.12.89.34 1.2l.07.06 10.82-10.82v-.26L.4 1.07l-.07.06zM19.94 10.01l-2.89-1.67-3.18 3.18 3.18 3.18 2.91-1.68c.83-.48.83-1.26-.02-1.74v.01zM4.15.24L16.58 7.41l-2.83 2.83-9.6-10z"/></svg>
              <div className="text-left">
                <p className="text-[9px] text-gray-400 font-medium leading-none">Get it on</p>
                <p className="text-sm font-black leading-tight">Google Play</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right — Newsletter */}
        <div className="w-full md:w-auto md:min-w-[320px] bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎁</span>
            <div>
              <h3 className="text-white font-black text-sm leading-tight">Never Miss a Deal</h3>
              <p className="text-gray-400 text-xs font-medium">Get exclusive offers in your inbox</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/15 focus:border-[#F8C008]/50 focus:bg-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
              placeholder="your@email.com"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#F8C008] text-[#1a1a1a] font-black text-sm py-3 rounded-xl hover:bg-[#ffd230] active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Subscribe for Free →
            </button>
          </form>

          <p className="text-gray-600 text-[10px] font-medium mt-3 text-center">
            ✓ No spam · Unsubscribe anytime · We respect your privacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
