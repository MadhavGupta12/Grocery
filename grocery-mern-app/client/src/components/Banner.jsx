import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#5c0a86] via-[#7c22ab] to-[#ff477e] py-12 px-8 md:px-16 text-white flex flex-col md:flex-row items-center justify-between shadow-lg gap-6 my-6">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Left text column */}
      <div className="flex-1 z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider mb-4 animate-pulse">
          ⚡ MAPTA SAVINGS PASS
        </span>
        
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-4 max-w-lg">
          Freshness Delivered <br className="hidden md:block"/>
          in <span className="text-yellow-300">10 Minutes!</span>
        </h1>
        
        <p className="text-white/80 font-semibold text-sm md:text-base max-w-md mb-6 leading-relaxed">
          Premium organic fruits, farm-fresh vegetables, dairy, cold drinks, and snacks delivered to your door step instantly.
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <Link
            to="/products"
            className="px-7 py-3 bg-white text-[#5c0a86] font-bold rounded-xl shadow-md hover:bg-white/95 transition duration-150 active:scale-95"
          >
            Order Now
          </Link>
          <Link
            to="/products"
            className="px-7 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition duration-150 active:scale-95"
          >
            Claim 20% Off
          </Link>
        </div>
      </div>

      {/* Right Image/Graphic column */}
      <div className="w-full md:w-auto flex justify-center z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition duration-300"></div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
            alt="Fresh grocery basket"
            className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/10 rotate-3 group-hover:rotate-0 transition-all duration-300 ease-out"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
