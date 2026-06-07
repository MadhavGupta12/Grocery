import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import { buildProductImageUrl, buildProductPlaceholderImage } from "../utils/productImages";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, wishlistIds, toggleWishlist } = useAppContext();

  const reviews = product?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const discountPct = product.price > product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const isLowStock = !product.inStock;
  const quantity = cartItems?.[product._id] || 0;

  return (
    product && (
      <div
        className={`relative bg-white border border-gray-100 rounded-2xl overflow-hidden card-shadow transition-all duration-200 flex flex-col w-[calc((100vw-44px)/2)] min-w-[calc((100vw-44px)/2)] sm:w-44 sm:min-w-44 ${
          isLowStock ? "opacity-60" : "hover:-translate-y-0.5"
        }`}
      >
        {/* Image Area */}
        <div
          onClick={() => {
            if (!isLowStock) {
              navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
              scrollTo(0, 0);
            }
          }}
          className={`relative bg-[#f8f9fa] flex items-center justify-center h-36 sm:h-40 px-3 sm:px-4 pt-4 pb-2 ${!isLowStock ? "cursor-pointer" : ""}`}
        >
          {/* Discount Badge */}
          {discountPct > 0 && (
            <div className="absolute top-2 left-2 bg-[#ff3e3e] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md z-10 shadow-sm">
              {discountPct}% OFF
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product._id);
            }}
            className="absolute top-1.5 right-1.5 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            {wishlistIds?.includes(product._id) ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" stroke="#9ca3af" strokeWidth="2"/></svg>
            )}
          </button>

          {/* Product Image */}
          <img
            className={`h-24 sm:h-28 w-full object-contain transition-transform duration-300 ${!isLowStock ? "group-hover:scale-105" : "grayscale"}`}
            src={getImageUrl(product.image?.[0])}
            alt={product.name}
            onError={(e) => {
              const step = e.currentTarget.dataset.fallbackStep || "0";
              const fallback = buildProductImageUrl(product.name, product.category);
              if (step === "0") {
                e.currentTarget.dataset.fallbackStep = "1";
                e.currentTarget.src = e.currentTarget.src.includes("tse1.mm.bing.net")
                  ? buildProductPlaceholderImage(product.name, product.category)
                  : fallback;
              } else if (step === "1") {
                e.currentTarget.dataset.fallbackStep = "2";
                e.currentTarget.src = buildProductPlaceholderImage(product.name, product.category);
              }
            }}
          />

          {/* Out of Stock Overlay */}
          {isLowStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <span className="text-[#1a1a1a] font-black text-xs bg-gray-200 px-2.5 py-1 rounded-lg">Out of Stock</span>
            </div>
          )}

          {/* 10 Min delivery tag */}
          <div className="absolute bottom-2 left-2 bg-white border border-gray-100 shadow-sm text-[#1a1a1a] text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0c831f" strokeWidth="2.5"/><path d="M12 6v6l4 2" stroke="#0c831f" strokeWidth="2.5" strokeLinecap="round"/></svg>
            10 MIN
          </div>
        </div>

        {/* Info Area */}
        <div className="px-3 pt-2 pb-3 flex flex-col flex-1">
          {/* Category */}
          <span className="text-[9px] uppercase font-black text-[#0c831f] tracking-wider opacity-80">
            {product.category}
          </span>

          {/* Name */}
          <h3
            onClick={() => {
              if (!isLowStock) {
                navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
              }
            }}
            className={`text-[#1a1a1a] font-bold text-xs leading-snug mt-0.5 line-clamp-2 min-h-[2.4rem] ${!isLowStock ? "cursor-pointer hover:text-[#0c831f] transition-colors" : ""}`}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {averageRating && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5 bg-[#0c831f] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {averageRating}
              </div>
              <span className="text-[9px] text-gray-400 font-medium">({reviews.length})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-[#1a1a1a] font-black text-sm">₹{product.offerPrice}</span>
            {product.price !== product.offerPrice && (
              <span className="text-[10px] text-gray-400 line-through font-medium">₹{product.price}</span>
            )}
          </div>

          {/* ADD Button — Blinkit signature style */}
          <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
            {quantity === 0 ? (
              <button
                onClick={() => { if (product.inStock) addToCart(product._id); }}
                disabled={isLowStock}
                className={`w-full py-2 rounded-xl text-xs font-black border-2 transition-all duration-150 active:scale-95 ${
                  isLowStock
                    ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    : "border-[#0c831f] text-[#0c831f] bg-white hover:bg-[#0c831f] hover:text-white cursor-pointer"
                }`}
              >
                {isLowStock ? "Notify Me" : "ADD"}
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-[#0c831f] text-white rounded-xl overflow-hidden h-8 shadow-md select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="flex-1 h-full flex items-center justify-center hover:bg-[#0a7019] active:bg-[#096018] transition-colors text-base font-black cursor-pointer"
                >
                  −
                </button>
                <span className="text-xs font-black w-8 text-center tabular-nums">{quantity}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex-1 h-full flex items-center justify-center hover:bg-[#0a7019] active:bg-[#096018] transition-colors text-base font-black cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
