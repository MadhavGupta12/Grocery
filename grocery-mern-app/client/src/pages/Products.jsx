import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";

const Products = () => {
  const { products, debouncedSearchQuery, navigate } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (debouncedSearchQuery.length > 0) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "price-low") result = [...result].sort((a, b) => a.offerPrice - b.offerPrice);
    else if (sortBy === "price-high") result = [...result].sort((a, b) => b.offerPrice - a.offerPrice);
    else if (sortBy === "discount") result = [...result].sort((a, b) => ((b.price - b.offerPrice) / b.price) - ((a.price - a.offerPrice) / a.price));

    setFilteredProducts(result);
  }, [products, debouncedSearchQuery, selectedCategory, sortBy]);

  const inStockProducts = filteredProducts.filter((p) => p.inStock);
  const outOfStockProducts = filteredProducts.filter((p) => !p.inStock);
  const allVisible = [...inStockProducts, ...outOfStockProducts];

  return (
    <div className="flex gap-6 mt-6 pb-16 min-h-screen">
      {/* Left Sidebar — Category Filter */}
      <aside className="hidden md:flex flex-col w-52 shrink-0">
        <div className="sticky top-24">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-50">
              <h2 className="font-black text-[#1a1a1a] text-sm uppercase tracking-wider">Categories</h2>
            </div>

            {/* All */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all text-left cursor-pointer border-l-3 ${
                selectedCategory === "all"
                  ? "bg-[#F8C008]/10 border-[#F8C008] text-[#1a1a1a]"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">🛒</span>
              <span>All Products</span>
              {selectedCategory === "all" && (
                <span className="ml-auto text-[10px] bg-[#F8C008] text-[#1a1a1a] font-black px-1.5 py-0.5 rounded-full">
                  {inStockProducts.length}
                </span>
              )}
            </button>

            {categories.map((cat, i) => {
              const count = products.filter(
                (p) => p.inStock && p.category?.toLowerCase() === cat.path.toLowerCase()
              ).length;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat.path.toLowerCase())}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-all text-left cursor-pointer border-l-3 ${
                    selectedCategory === cat.path.toLowerCase()
                      ? "bg-[#F8C008]/10 border-[#F8C008] text-[#1a1a1a]"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <img src={cat.image} alt={cat.text} className="w-7 h-7 object-contain" />
                  <span className="truncate">{cat.text}</span>
                  {count > 0 && (
                    <span className="ml-auto text-[9px] text-gray-400 font-bold shrink-0">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Fast Delivery Card */}
          <div className="mt-4 bg-[#0c831f] text-white rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-black text-sm">10-Min Delivery</p>
            <p className="text-white/70 text-[10px] font-medium mt-1">Guaranteed fast delivery to your door</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.path.toLowerCase() === selectedCategory)?.text || selectedCategory}
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0c831f] inline-block"></span>
              {inStockProducts.length} products in stock
              {debouncedSearchQuery && (
                <span className="text-[#0c831f] font-bold">for "{debouncedSearchQuery}"</span>
              )}
            </p>
          </div>

          {/* Sort + Mobile Category */}
          <div className="flex items-center gap-2">
            {/* Mobile Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="md:hidden text-xs font-bold text-[#1a1a1a] border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#F8C008] bg-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c.path.toLowerCase()}>{c.text}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-[#1a1a1a] border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#F8C008] bg-white cursor-pointer"
            >
              <option value="default">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
          <Link to="/" className="hover:text-[#0c831f] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1a1a1a] font-bold">
            {selectedCategory === "all" ? "All Products" : selectedCategory}
          </span>
        </div>

        {/* Products Grid */}
        {allVisible.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {allVisible.map((product, index) => (
              <div
                key={product._id || index}
                className="animate-slide-in-up flex justify-center"
                style={{ animationDelay: `${(index % 10) * 40}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-[#F8C008]/10 rounded-full flex items-center justify-center text-5xl mb-5">
              🔍
            </div>
            <h2 className="text-xl font-black text-[#1a1a1a] mb-2">No Products Found</h2>
            <p className="text-gray-500 font-medium text-sm max-w-xs leading-relaxed mb-6">
              {debouncedSearchQuery
                ? `We couldn't find anything for "${debouncedSearchQuery}". Try a different search term!`
                : "No products in this category yet. Check back soon!"}
            </p>
            <button
              onClick={() => { setSelectedCategory("all"); navigate("/products"); }}
              className="bg-[#0c831f] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0a7019] active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
