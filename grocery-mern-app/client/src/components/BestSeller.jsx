import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="mt-16 animate-slide-in-up">
      <div className="mb-2">
        <p className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Best Sellers 🔥
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
      </div>
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <div key={index} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </div>
  );
};
export default BestSeller;
