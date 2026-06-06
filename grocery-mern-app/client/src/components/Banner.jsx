import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 0,
    badge: "⚡ 10 MINUTE DELIVERY",
    title: "Fresh Groceries",
    subtitle: "at Your Doorstep",
    desc: "Order fresh vegetables, fruits & daily essentials — guaranteed in 10 mins!",
    cta: "Order Now",
    bg: "from-[#1a472a] via-[#2d6a3f] to-[#1a472a]",
    accent: "#F8C008",
    emoji: "🥦",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  },
  {
    id: 1,
    badge: "🔥 BEST DEALS TODAY",
    title: "Snacks & Beverages",
    subtitle: "Up to 50% Off!",
    desc: "Chips, drinks, packaged foods — all at unbeatable prices.",
    cta: "Shop Snacks",
    bg: "from-[#7b2d00] via-[#a03d00] to-[#7b2d00]",
    accent: "#FC8019",
    emoji: "🍟",
    img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80",
  },
  {
    id: 2,
    badge: "🧡 FARM FRESH",
    title: "Dairy & Proteins",
    subtitle: "Fresh Daily!",
    desc: "Milk, eggs, paneer & butter — sourced fresh daily, delivered in minutes.",
    cta: "Shop Dairy",
    bg: "from-[#7C3500] via-[#a04a00] to-[#7C3500]",
    accent: "#FC8019",
    emoji: "🥚",
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
  },
  {
    id: 3,
    badge: "🍎 MAPTA EXPRESS",
    title: "Seasonal Fruits",
    subtitle: "Fresh from Farms",
    desc: "Hand-picked seasonal fruits straight from farms to your home — superfast.",
    cta: "Shop Fruits",
    bg: "from-[#1a3a5c] via-[#1e4976] to-[#1a3a5c]",
    accent: "#FC8019",
    emoji: "🍓",
    img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  },
  {
    id: 4,
    badge: "🥛 DAIRY & EGGS",
    title: "Bakery & Breads",
    subtitle: "Baked Today",
    desc: "Fresh breads, cookies, cakes — baked today and delivered in 10 minutes.",
    cta: "Shop Bakery",
    bg: "from-[#4a0e4e] via-[#6b1470] to-[#4a0e4e]",
    accent: "#F8C008",
    emoji: "🥐",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  },
  {
    id: 5,
    badge: "🛒 MEGA SPECIAL",
    title: "Cold Drinks & Juices",
    subtitle: "Flat 30% Off Today",
    desc: "Beat the heat — all beverages, juices & cold drinks at massive discounts.",
    cta: "Shop Now",
    bg: "from-[#003d1a] via-[#005c27] to-[#003d1a]",
    accent: "#F8C008",
    emoji: "🧃",
    img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 450);
  }, [animating]);

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 3800);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden rounded-2xl mt-4">
      <div
        key={current}
        className={`relative bg-gradient-to-r ${slide.bg} rounded-2xl overflow-hidden flex flex-col md:flex-row items-center min-h-[220px] md:min-h-[280px] animate-banner-slide`}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Left Content */}
        <div className="flex-1 z-10 px-7 py-8 md:py-10 flex flex-col items-start">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest border"
              style={{ color: slide.accent, borderColor: `${slide.accent}40`, backgroundColor: `${slide.accent}15` }}
            >
              {slide.badge}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white mb-1">
            {slide.title}
          </h1>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-3" style={{ color: slide.accent }}>
            {slide.subtitle}
          </h2>
          <p className="text-white/75 text-sm md:text-base max-w-sm mb-6 font-medium leading-relaxed">
            {slide.desc}
          </p>

          <Link
            to="/products"
            className="px-7 py-3 rounded-xl font-black text-[#1a1a1a] text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            style={{ backgroundColor: slide.accent }}
          >
            {slide.cta}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </Link>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex w-80 lg:w-96 h-full items-center justify-center relative pr-8 py-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: slide.accent }}></div>
          </div>
          <img
            src={slide.img}
            alt={slide.title}
            className="relative z-10 w-64 h-56 lg:w-72 lg:h-60 object-cover rounded-2xl shadow-2xl border-2 border-white/10 hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-6 right-6 text-5xl animate-float z-20 select-none drop-shadow-lg">{slide.emoji}</span>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === current ? s.accent : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-[45%] -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer z-20">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>
      <button onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-3 top-[45%] -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer z-20">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
};

export default Banner;
