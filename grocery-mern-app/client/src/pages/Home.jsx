import Banner from "../components/Banner";
import Category from "../components/Category";
import DealsStrip from "../components/DealsStrip";
import ProductSection from "../components/ProductSection";
import NewsLetter from "../components/NewsLetter";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  const { products } = useAppContext();

  const inStock = products.filter((p) => p.inStock);

  // Category-filtered sections
  const getByCategory = (cat) =>
    inStock.filter((p) => p.category?.toLowerCase().includes(cat.toLowerCase())).slice(0, 12);

  const bestSellers = inStock.slice(0, 12);
  const freshProduce = getByCategory("vegetable");
  const fruits = getByCategory("fruit");
  const dairy = getByCategory("dairy");
  const snacks = getByCategory("snack");
  const bakery = getByCategory("bakery");

  // Fallback: if category has <3, show from all
  const safeSection = (arr) => (arr.length >= 2 ? arr : inStock.slice(0, 10));

  return (
    <div className="mt-4 pb-12">
      {/* Hero Banner */}
      <Banner />

      {/* Categories */}
      <Category />

      {/* Deals Strip */}
      <DealsStrip />

      {/* Best Sellers */}
      <ProductSection
        title="Best Sellers"
        emoji="🔥"
        badgeText="Trending"
        badgeColor="#ff3e3e"
        subtitle="Most loved products"
        products={bestSellers}
        seeAllPath="/products"
      />

      {/* Mid-page Promo Banner */}
      <div className="mt-10 rounded-2xl overflow-hidden bg-gradient-to-r from-[#F8C008] via-[#ffd230] to-[#F8C008] flex items-center justify-between px-8 py-6 relative">
        <div className="absolute right-0 top-0 w-40 h-full bg-[#1a1a1a]/5 rounded-l-full pointer-events-none"></div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/60 mb-1">⚡ Limited Time</p>
          <h3 className="text-2xl md:text-3xl font-black text-[#1a1a1a] leading-tight">
            Free Delivery on<br />First 3 Orders!
          </h3>
          <p className="text-[#1a1a1a]/70 font-semibold text-sm mt-1">No minimum order value</p>
        </div>
        <div className="flex flex-col items-end gap-3 z-10">
          <span className="text-5xl animate-bounce-slow select-none">🛵</span>
          <a
            href="/products"
            className="bg-[#1a1a1a] text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-[#333] active:scale-95 transition-all shadow-lg"
          >
            Order Now →
          </a>
        </div>
      </div>

      {/* Fresh Fruits & Vegetables */}
      <ProductSection
        title="Fresh Fruits & Vegetables"
        emoji="🥦"
        badgeText="Farm Fresh"
        badgeColor="#0c831f"
        products={safeSection([...freshProduce, ...fruits])}
        seeAllPath="/products/vegetables"
      />

      {/* Dairy & Breakfast */}
      <ProductSection
        title="Dairy & Breakfast"
        emoji="🥛"
        badgeText="Daily Essentials"
        badgeColor="#f57f17"
        products={safeSection(dairy)}
        seeAllPath="/products/dairy"
      />

      {/* Snacks & Beverages */}
      <ProductSection
        title="Snacks & Beverages"
        emoji="🍟"
        badgeText="Munch Time"
        badgeColor="#c62828"
        products={safeSection(snacks)}
        seeAllPath="/products"
      />

      {/* Bakery */}
      {safeSection(bakery).length > 0 && (
        <ProductSection
          title="Bakery & Biscuits"
          emoji="🥐"
          badgeText="Baked Fresh"
          badgeColor="#6a1b9a"
          products={safeSection(bakery)}
          seeAllPath="/products/bakery"
        />
      )}

      {/* Newsletter / App CTA */}
      <NewsLetter />
    </div>
  );
};

export default Home;
