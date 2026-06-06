import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { products, wishlistIds, navigate } = useAppContext();
  const wishlistProducts = products.filter((p) => wishlistIds?.includes(p._id));

  return (
    <div className="mt-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight flex items-center gap-2">
            <span>❤️</span> My Wishlist
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-0.5">
            {wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={() => navigate("/products")}
            className="text-[#0c831f] font-black text-sm flex items-center gap-1 hover:underline underline-offset-2"
          >
            + Add More
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
          {wishlistProducts.map((product, index) => (
            <div key={product._id || index} className="animate-slide-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-5xl">❤️</div>
            <span className="absolute -top-1 -right-1 badge-orange shadow-sm">⚡</span>
          </div>
          <h2 className="text-xl font-black text-[#1a1a1a] mb-2">Wishlist is Empty</h2>
          <p className="text-gray-500 text-sm font-medium max-w-xs leading-relaxed mb-6">
            Tap the ❤️ on any product to save it here. Build your ultimate grocery list!
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              className="brand-gradient-bg text-white font-black px-6 py-3 rounded-xl active:scale-95 transition-all cursor-pointer shadow-md text-sm"
            >
              Start Shopping Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
