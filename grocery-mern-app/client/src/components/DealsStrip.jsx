import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useMemo } from "react";
import { getImageUrl } from "../utils/getImageUrl";

const bgStyles = [
  { bg: "from-[#F8C008]/20 to-[#F8C008]/5", badgeColor: "#F8C008", badgeText: "#1a1a1a" },
  { bg: "from-[#FC8019]/20 to-[#FC8019]/5", badgeColor: "#FC8019", badgeText: "white" },
  { bg: "from-[#ff3e3e]/20 to-[#ff3e3e]/5", badgeColor: "#ff3e3e", badgeText: "white" },
  { bg: "from-[#0c831f]/20 to-[#0c831f]/5", badgeColor: "#0c831f", badgeText: "white" }
];

const badges = ["⚡ SUPER FRESH", "🧡 HOT DEAL", "🔥 TOP PICK", "🛒 MUST BUY"];

const DealsStrip = () => {
  const { products } = useAppContext();
  const navigate = useNavigate();

  // Dynamically select random products with discounts
  const dynamicDeals = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Sort products randomly
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    
    // Pick the top 6
    return shuffled.slice(0, 6).map((product, index) => {
      const style = bgStyles[index % bgStyles.length];
      const badge = badges[index % badges.length];
      const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100) || 10;
      
      return {
        id: product._id,
        title: product.name,
        subtitle: `${discount}% OFF (₹${product.offerPrice})`,
        image: getImageUrl(product.image?.[0]),
        ...style,
        badge,
        category: product.category,
      };
    });
  }, [products]);

  if (dynamicDeals.length === 0) return null;

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-black text-[#1a1a1a] tracking-tight">
            Exclusive Deals
          </h2>
          <span className="bg-[#ff3e3e] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse-badge">
            Auto Generated
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Deal Cards */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {dynamicDeals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => {
              navigate(`/product/${deal.category.toLowerCase()}/${deal.id}`);
              window.scrollTo(0, 0);
            }}
            className={`flex-shrink-0 w-44 md:w-52 rounded-2xl bg-gradient-to-br ${deal.bg} p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-white`}
            style={{ minHeight: "130px" }}
          >
            {/* Badge */}
            <span
              className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit shadow-sm mb-2"
              style={{ backgroundColor: deal.badgeColor, color: deal.badgeText }}
            >
              {deal.badge}
            </span>

            {/* Product Image */}
            <div className="flex-1 flex items-center justify-center py-2 h-20 mb-2">
              {deal.image ? (
                <img src={deal.image} alt={deal.title} className="max-h-full object-contain mix-blend-multiply hover:scale-105 transition-transform" />
              ) : (
                <div className="text-4xl animate-float">🛒</div>
              )}
            </div>

            {/* Text */}
            <div>
              <p className="text-[#1a1a1a] font-black text-sm leading-tight truncate">{deal.title}</p>
              <p className="text-[11px] font-bold mt-0.5" style={{ color: deal.badgeColor }}>{deal.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsStrip;
