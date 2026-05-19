import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
  const { products, navigate, addToCart, removeFromCart, cartItems } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const product = products.find((product) => product._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const filtered = products.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] ? product.image[0] : null);
  }, [product]);

  const quantity = cartItems?.[product?._id] || 0;

  return (
    product && (
      <div className="mt-8 pb-16">
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 font-semibold flex flex-wrap items-center gap-1.5 mb-6">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition">Products</Link>
          <span>/</span>
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary transition capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-primary font-bold">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          
          {/* Left: Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-1/2">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
              {product.image.map((image, index) => {
                const imgUrl = getImageUrl(image);
                return (
                  <div
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`border-2 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer transition duration-150 p-1 flex items-center justify-center bg-gray-50/50 ${
                      thumbnail === image ? "border-primary bg-white shadow-xs" : "border-gray-100 hover:border-primary/45"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                );
              })}
            </div>

            {/* Main Image View */}
            <div className="flex-1 border border-gray-100 rounded-2xl bg-gray-50/30 flex items-center justify-center p-6 min-h-[300px] md:min-h-[400px]">
              <img
                src={getImageUrl(thumbnail)}
                alt="Selected product"
                className="max-h-[350px] object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1">
            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-3 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Tags */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-400 text-sm">
                ★ ★ ★ ★ <span className="text-gray-200">★</span>
              </div>
              <span className="text-xs text-gray-400 font-semibold">(4.0 rating)</span>
            </div>

            {/* Price section */}
            <div className="my-6 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 line-through font-medium block">MRP: ${product.price}</span>
                <span className="text-3xl font-black text-black">
                  ${product.offerPrice}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-0.5">(inclusive of all taxes)</span>
              </div>
              
              {product.inStock ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">In Stock</span>
              ) : (
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
              )}
            </div>

            {/* About Product */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Product Highlights</h3>
              <ul className="space-y-1.5">
                {product.description.map((desc, index) => (
                  <li key={index} className="text-xs text-gray-500 font-semibold flex items-start gap-2">
                    <span className="text-primary mt-0.5">▪</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery speed badge */}
            <div className="my-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-sm font-black text-black">Superfast Delivery</p>
                  <p className="text-xs text-gray-500 font-semibold">Delivered in 10 minutes to your door!</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-white px-3 py-1 rounded-full shadow-xs border border-primary/10">10 MINS</span>
            </div>

            {/* Policy badges */}
            <div className="grid grid-cols-3 gap-3 my-6 text-center">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-lg">♻️</span>
                <p className="text-[11px] font-bold text-gray-700 mt-1">Easy Returns</p>
                <p className="text-[9px] text-gray-400 font-semibold">7-Day Policy</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-lg">🛡️</span>
                <p className="text-[11px] font-bold text-gray-700 mt-1">100% Quality</p>
                <p className="text-[9px] text-gray-400 font-semibold">Direct Source</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-lg">🥛</span>
                <p className="text-[11px] font-bold text-gray-700 mt-1">Cold Chain</p>
                <p className="text-[9px] text-gray-400 font-semibold">Always Chilled</p>
              </div>
            </div>

            {/* Cart Actions */}
            <div className="flex items-center gap-4 mt-8">
              {quantity === 0 ? (
                <>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex-1 py-3.5 bg-white border-2 border-primary text-primary hover:bg-primary/5 transition rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 text-center"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product._id);
                      navigate("/cart");
                      scrollTo(0, 0);
                    }}
                    className="flex-1 py-3.5 bg-primary text-white hover:bg-primary/95 transition rounded-xl font-bold text-sm shadow-md cursor-pointer active:scale-95 text-center"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full max-w-[200px] h-[48px] bg-success text-white rounded-xl font-bold text-sm shadow-md overflow-hidden select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer flex-1 h-full flex items-center justify-center text-lg hover:bg-success-dark active:scale-90"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-black">
                    {quantity} in Cart
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer flex-1 h-full flex items-center justify-center text-lg hover:bg-success-dark active:scale-90"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-8 border-t border-gray-100">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">You Might Also Like</h2>
              <div className="w-12 h-1 bg-primary rounded-full mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
              {relatedProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <button
                onClick={() => {
                  navigate("/products");
                  scrollTo(0, 0);
                }}
                className="px-8 py-3 bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-bold rounded-xl text-sm"
              >
                See All Products
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default SingleProduct;
