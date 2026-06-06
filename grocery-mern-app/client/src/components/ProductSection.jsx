import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const ProductSection = ({ title, emoji, subtitle, products, seeAllPath, badgeColor = "#F8C008", badgeText }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl md:text-2xl font-black text-[#1a1a1a] tracking-tight flex items-center gap-2">
            {emoji && <span className="text-2xl">{emoji}</span>}
            {title}
          </h2>
          {badgeText && (
            <span
              className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: badgeColor }}
            >
              {badgeText}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">{subtitle}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Arrows */}
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>

          {/* See All */}
          <Link
            to={seeAllPath || "/products"}
            className="text-[#0c831f] font-bold text-sm flex items-center gap-1 hover:underline underline-offset-2 transition-all ml-1"
          >
            See All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </Link>
        </div>
      </div>

      {/* Horizontal Product Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
      >
        {products.map((product, index) => (
          <div
            key={product._id || index}
            className="flex-shrink-0 animate-slide-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
