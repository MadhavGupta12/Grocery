import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, wishlistIds, toggleWishlist } = useAppContext();
  
  const reviews = product?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Calculate discount percentage
  const discountPct = Math.round(((product.price - product.offerPrice) / product.price) * 100);
  
  // Stock status
  const isLowStock = !product.inStock;
  const stockBadge = isLowStock ? "Out of Stock" : "In Stock";

  return (
    product && (
      <div
        className={`relative border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-2xl md:p-4 p-3 bg-white min-w-56 max-w-56 w-full flex flex-col justify-between overflow-hidden group ${
          isLowStock ? "opacity-60" : "cursor-pointer"
        }`}
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/5 transition-all duration-300 rounded-2xl pointer-events-none"></div>

        {/* Delivery Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 text-[9px] font-black text-gray-800 border border-gray-100/50 z-20 group-hover:scale-105 transition-all duration-300">
          <span>⚡</span>
          <span>10 MIN</span>
        </div>

        {/* Discount Badge */}
        {discountPct > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-black z-20 shadow-lg">
            {discountPct}% OFF
          </div>
        )}

        {/* Wishlist */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute bottom-20 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-full shadow-sm border border-gray-100/50 z-20 hover:scale-125 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          {wishlistIds?.includes(product._id) ? (
            <span className="text-red-500 text-lg animate-bounce">❤️</span>
          ) : (
            <span className="text-gray-400 text-lg hover:text-red-500">🤍</span>
          )}
        </div>

        {/* Product Image */}
        <div className={`w-full h-36 flex items-center justify-center p-2 rounded-xl mb-3 relative overflow-hidden ${
          isLowStock ? "bg-gray-100" : "bg-gradient-to-br from-gray-50 to-gray-100"
        }`}>
          <img
            className={`max-h-full object-contain group-hover:drop-shadow-lg transition-all duration-300 ${
              isLowStock ? "grayscale" : "group-hover:scale-110"
            }`}
            src={getImageUrl(product.image?.[0])}
            alt={product.name}
          />
          {isLowStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-xl">
              <span className="text-white font-black text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between relative z-10">
          <div>
            <span className="text-[9px] tracking-wider uppercase text-emerald-600 font-black opacity-70 group-hover:opacity-100 transition-opacity">
              {product.category}
            </span>
            
            <h3 className="text-gray-900 font-bold text-sm leading-tight mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating */}
            {averageRating && (
              <div className="flex items-center gap-1 mt-1.5 text-[11px]">
                <span className="text-yellow-500 animate-bounce-slow">★</span>
                <span className="text-gray-700 font-bold">{averageRating}</span>
                <span className="text-gray-400 font-medium">({reviews.length})</span>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div className="flex items-baseline gap-2 mt-4 pt-3 border-t border-gray-100">
            <span className="text-black font-black text-lg group-hover:text-emerald-700 transition-colors">
              ₹{product.offerPrice}
            </span>
            {product.price !== product.offerPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Blinkit Style */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="mt-4"
          >
            {!cartItems?.[product?._id] ? (
              <button
                onClick={() => {
                  if (product.inStock) {
                    addToCart(product?._id);
                  }
                }}
                disabled={isLowStock}
                className={`w-full py-2.5 px-3 rounded-xl font-black text-sm transition-all duration-300 active:scale-95 ${
                  isLowStock
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "border-2 border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 hover:shadow-md"
                }`}
              >
                {isLowStock ? "Out of Stock" : "ADD"}
              </button>
            ) : (
              <div className="flex items-center justify-between w-full h-11 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-md overflow-hidden select-none hover:shadow-lg transition-shadow">
                <button
                  onClick={() => removeFromCart(product?._id)}
                  className="flex-1 h-full flex items-center justify-center hover:bg-emerald-700 active:bg-emerald-800 transition-colors text-xl"
                >
                  −
                </button>
                <span className="flex-0 text-center text-sm font-black w-8">
                  {cartItems[product?._id]}
                </span>
                <button
                  onClick={() => addToCart(product?._id)}
                  className="flex-1 h-full flex items-center justify-center hover:bg-emerald-700 active:bg-emerald-800 transition-colors text-xl"
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
