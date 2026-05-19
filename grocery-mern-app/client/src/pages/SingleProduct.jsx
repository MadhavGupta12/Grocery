import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const { products, navigate, addToCart, removeFromCart, cartItems, axios, fetchProducts, user, setShowUserLogin } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  // Review calculations
  const reviews = product?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

  const getPercentage = (ratingVal) => {
    if (reviews.length === 0) return 0;
    return Math.round((starCounts[ratingVal] / reviews.length) * 100);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await axios.post(`/api/product/${id}/review`, { rating, comment });
      if (data.success) {
        toast.success("Review submitted successfully");
        setComment("");
        setRating(5);
        fetchProducts(); // Reload products to get latest reviews
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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

            {/* Dynamic Ratings & Reviews */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500 text-sm">
                {"★".repeat(Math.round(averageRating || 5)) + "☆".repeat(5 - Math.round(averageRating || 5))}
              </div>
              <span className="text-xs text-gray-600 font-bold">
                {averageRating > 0 ? `${averageRating} rating` : "New Product"}
              </span>
              <span className="text-xs text-gray-400 font-medium">({reviews.length} customer reviews)</span>
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

        {/* Dynamic Reviews & Rating Breakdown */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl font-black text-gray-900">Customer Reviews & Ratings</h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Column 1: Rating breakdown */}
            <div className="lg:col-span-1 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center">
              <div className="text-center mb-6">
                <span className="text-5xl font-black text-gray-900">{averageRating > 0 ? averageRating : "N/A"}</span>
                <span className="text-sm font-bold text-gray-400 block mt-1">out of 5 stars</span>
                <div className="flex justify-center text-yellow-500 text-lg mt-2">
                  {"★".repeat(Math.round(averageRating || 5)) + "☆".repeat(5 - Math.round(averageRating || 5))}
                </div>
                <span className="text-xs text-gray-400 font-semibold block mt-1">({reviews.length} ratings total)</span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                    <span className="w-8">{stars} Star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500" 
                        style={{ width: `${getPercentage(stars)}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right">{getPercentage(stars)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Submit a review */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Thoughts</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                        >
                          <span className={star <= rating ? "text-yellow-500" : "text-gray-200"}>★</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reviewComment" className="block text-xs font-bold text-gray-400 uppercase mb-2">Write Review</label>
                    <textarea
                      id="reviewComment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike about this product?"
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition active:scale-95 disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold text-gray-500 mb-3">Please sign in to write a product review.</p>
                  <button 
                    onClick={() => {
                      setShowUserLogin(true);
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-800 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Timeline listing */}
          <div className="mt-10 space-y-4">
            <h3 className="text-base font-bold text-gray-800 mb-6">Customer Reviews</h3>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r, i) => (
                  <div key={i} className="p-4 bg-gray-50/30 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-gray-800">{r.userName}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-yellow-500 text-xs mt-1">
                        {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                      </div>
                      <p className="text-xs text-gray-600 font-semibold mt-2.5 leading-relaxed">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-4xl">📝</span>
                <p className="text-sm font-semibold text-gray-400 mt-2">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
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
