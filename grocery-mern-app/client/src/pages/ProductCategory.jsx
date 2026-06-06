import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";

const ProductCategory = () => {
  const { products, navigate } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  const inStock = filteredProducts.filter((p) => p.inStock);
  const outOfStock = filteredProducts.filter((p) => !p.inStock);

  return (
    <div className="mt-6 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-5">
        <Link to="/" className="hover:text-[#0c831f] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#0c831f] transition-colors">Products</Link>
        <span>/</span>
        <span className="text-[#1a1a1a] font-bold capitalize">{category}</span>
      </div>

      {/* Category Hero Bar */}
      {searchCategory && (
        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: searchCategory.bgColor }}
          >
            <img src={searchCategory.image} alt={searchCategory.text} className="w-12 h-12 object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black text-[#1a1a1a] tracking-tight capitalize">{searchCategory.text}</h1>
            <p className="text-gray-500 font-medium text-sm mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0c831f] inline-block"></span>
              {inStock.length} items in stock
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#0c831f]/10 text-[#0c831f] px-3 py-2 rounded-xl border border-[#0c831f]/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span className="font-black text-xs">10 MIN DELIVERY</span>
          </div>
        </div>
      )}

      {/* Category Quick Jump */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => { navigate(`/products/${cat.path.toLowerCase()}`); scrollTo(0, 0); }}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
              cat.path.toLowerCase() === category
                ? "border-[#F8C008] bg-[#F8C008]/10 text-[#1a1a1a]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <img src={cat.image} alt={cat.text} className="w-5 h-5 object-contain" />
            {cat.text}
          </button>
        ))}
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
          {[...inStock, ...outOfStock].map((product, index) => (
            <div key={product._id || index} className="animate-slide-in-up" style={{ animationDelay: `${(index % 10) * 40}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-[#F8C008]/10 rounded-full flex items-center justify-center text-5xl mb-5">📦</div>
          <h2 className="text-xl font-black text-[#1a1a1a] mb-2">No Products Here Yet</h2>
          <p className="text-gray-500 text-sm font-medium max-w-xs leading-relaxed mb-6">
            We're stocking up! Check back soon for fresh {searchCategory?.text || category} products.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#0c831f] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0a7019] active:scale-95 transition-all cursor-pointer shadow-md"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
