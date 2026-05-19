import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, wishlistIds, toggleWishlist } = useAppContext();
  
  const reviews = product?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/product/${product.category.toLowerCase()}/${product?._id}`
          );
          scrollTo(0, 0);
        }}
        className="relative border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl md:p-4 p-3 bg-white min-w-56 max-w-56 w-full flex flex-col justify-between overflow-hidden cursor-pointer"
      >
        {/* Zepto-Style 10 Mins Delivery Badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1 text-[10px] font-black text-gray-800 border border-gray-100/50 z-10">
          <span className="text-yellow-500">⚡</span>
          <span>10 MINS</span>
        </div>

        {/* Wishlist Heart Toggle */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-full shadow-xs border border-gray-100/50 z-10 hover:scale-110 active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          {wishlistIds?.includes(product._id) ? (
            <span className="text-red-500 text-sm">❤️</span>
          ) : (
            <span className="text-gray-400 text-sm">🤍</span>
          )}
        </div>

        {/* Product Image */}
        <div className="w-full h-32 flex items-center justify-center p-2 rounded-xl bg-gray-50/50 mb-3 relative overflow-hidden">
          <img
            className="hover:scale-105 transition-transform duration-300 max-h-full object-contain"
            src={getImageUrl(product.image?.[0])}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-gray-400 font-bold">{product.category}</span>
            <h3 className="text-gray-900 font-bold text-sm leading-tight mt-0.5 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-bold">
              {averageRating ? (
                <>
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-700">{averageRating}</span>
                  <span className="text-gray-400 font-medium">({reviews.length})</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">
                    New Product
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Pricing & Add to Cart Controls */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-black font-extrabold text-base">${product.offerPrice}</span>
              <span className="text-xs text-gray-400 line-through">${product.price}</span>
            </div>
            
            <div onClick={(e) => e.stopPropagation()}>
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="border-2 border-success text-success bg-white px-5 py-1.5 rounded-xl font-bold text-xs hover:bg-success hover:text-white transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                >
                  ADD
                </button>
              ) : (
                <div className="flex items-center justify-between w-[76px] h-[32px] bg-success text-white rounded-xl font-bold text-sm shadow-xs overflow-hidden select-none">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="cursor-pointer flex-1 h-full flex items-center justify-center text-base hover:bg-success-dark active:scale-90"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-xs font-black">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="cursor-pointer flex-1 h-full flex items-center justify-center text-base hover:bg-success-dark active:scale-90"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
