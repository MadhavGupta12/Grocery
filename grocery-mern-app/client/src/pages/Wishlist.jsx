import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { products, wishlistIds, navigate } = useAppContext();

  // Filter products that are in the user's wishlist
  const wishlistProducts = products.filter((product) =>
    wishlistIds?.includes(product._id)
  );

  return (
    <div className="mt-16 pb-20">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <span>❤️</span> My Wishlist
        </h1>
        <p className="text-sm text-gray-400 font-semibold mt-2">
          Your curated list of premium favorites
        </p>
        <div className="w-12 h-1 bg-primary rounded-full mt-3"></div>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {wishlistProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-gray-100 max-w-lg mx-auto p-8 shadow-xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-5 animate-pulse">
            ❤️
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-400 font-semibold text-center mt-2 max-w-xs leading-relaxed">
            Tap the heart icon on any product to save it here for later. Keep track of what you love!
          </p>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="mt-6 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition shadow-md active:scale-95 cursor-pointer"
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
