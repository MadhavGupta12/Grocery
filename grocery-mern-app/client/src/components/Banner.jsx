import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative rounded-none md:rounded-3xl overflow-hidden bg-gradient-to-r from-[#1a472a] via-[#2d5a3d] to-[#1a472a] py-16 px-6 md:px-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl gap-8 my-0 md:my-6 animate-slide-in-down">
      
      {/* Decorative Animated Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none animate-float"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-yellow-300/10 rounded-full blur-2xl pointer-events-none animate-float" style={{ animationDelay: "1s" }}></div>

      {/* Left Content */}
      <div className="flex-1 z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="bg-yellow-300 text-black text-[11px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider mb-6 animate-pulse shadow-lg">
          ⚡ 10 MINUTE DELIVERY GUARANTEED
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-4 max-w-lg">
          <span className="block text-yellow-300 mb-2">Get Fresh Groceries</span>
          <span className="block">in 10 Minutes! ⚡</span>
        </h1>
        
        <p className="text-white/90 font-semibold text-base md:text-lg max-w-lg mb-8 leading-relaxed">
          Premium quality groceries, farm-fresh vegetables & fruits delivered instantly to your doorstep. Shop now & save big!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full md:w-auto">
          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-4 bg-yellow-300 text-black font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-yellow-200 transition-all duration-300 active:scale-95 hover:scale-105 text-lg flex items-center justify-center gap-2"
          >
            🛍️ SHOP NOW
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 active:scale-95 hover:scale-105 backdrop-blur-sm text-lg"
          >
            View Offers →
          </Link>
        </div>
      </div>

      {/* Right Visual */}
      <div className="w-full md:w-auto flex justify-center z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-yellow-300/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
            alt="Fresh groceries"
            className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-3xl shadow-2xl border-4 border-white/10 group-hover:border-white/30 transition-all duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
