import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products, debouncedSearchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, debouncedSearchQuery]);

  const inStockProducts = filteredProducts.filter((product) => product.inStock);

  return (
    <div className="mt-8 animate-slide-in-up">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
              All Products 🛒
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <p className="text-gray-600 font-semibold">
                {inStockProducts.length} products available
              </p>
            </div>
          </div>
          <div className="hidden md:block p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/10">
            <p className="text-sm font-bold text-primary">⚡ FAST DELIVERY</p>
            <p className="text-xs text-gray-600 mt-1">10 minutes guaranteed</p>
          </div>
        </div>
        <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mt-4"></div>
      </div>

      {/* Products Grid */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-start justify-center">
        {inStockProducts.length > 0 ? (
          inStockProducts.map((product, index) => (
            <div 
              key={index} 
              className="animate-slide-in-up"
              style={{ animationDelay: `${(index % 5) * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-600 max-w-md">
              We couldn't find any products matching "{debouncedSearchQuery}". Try a different search term!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Products;
