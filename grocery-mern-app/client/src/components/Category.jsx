import { useRef } from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Category = () => {
  const { navigate } = useAppContext();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-black text-[#1a1a1a] tracking-tight">
            Shop by Category
          </h2>
          <span className="bg-[#F8C008] text-[#1a1a1a] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            {categories.length}+
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            className="group flex-shrink-0 flex flex-col items-center cursor-pointer"
          >
            {/* Image circle */}
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#F8C008] transition-all duration-200 group-hover:shadow-lg"
              style={{ backgroundColor: category.bgColor }}
            >
              <img
                src={category.image}
                alt={category.text}
                className="w-14 h-14 md:w-16 md:h-16 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#F8C008]/0 group-hover:bg-[#F8C008]/10 transition-all duration-200 rounded-2xl"></div>
            </div>
            {/* Label */}
            <p className="mt-2 text-[11px] md:text-xs font-bold text-gray-700 group-hover:text-[#1a1a1a] text-center leading-tight max-w-[80px] transition-colors">
              {category.text}
            </p>
          </div>
        ))}

        {/* See All */}
        <div
          onClick={() => { navigate("/products"); scrollTo(0, 0); }}
          className="group flex-shrink-0 flex flex-col items-center cursor-pointer"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-[#F8C008] group-hover:bg-[#F8C008]/5 transition-all duration-200">
            <div className="flex flex-col items-center gap-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400 group-hover:text-[#0c831f] transition-colors">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span className="text-[10px] font-black text-gray-400 group-hover:text-[#0c831f] transition-colors uppercase tracking-wide">All</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] font-bold text-gray-500 group-hover:text-[#0c831f] transition-colors text-center">
            See All
          </p>
        </div>
      </div>
    </div>
  );
};

export default Category;
