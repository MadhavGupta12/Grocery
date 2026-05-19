import { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import toast from "react-hot-toast";
const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  // state to store the products available in cart
  const [cartArray, setCartArray] = useState([]);
  // state to address
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  // state for selected address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  const [totalSpending, setTotalSpending] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

const getCart = useCallback(() => {
     let tempArray = [];
     for (const key in cartItems) {
       const product = products.find((product) => product._id === key);
       if (product) {
         product.quantity = cartItems[key];
         tempArray.push(product);
       }
     }
     setCartArray(tempArray);
   }, [cartItems, products]);

   const getAddress = useCallback(async () => {
     try {
       const { data } = await axios.get("/api/address/get");
       if (data.success) {
         setAddress(data.addresses);
         if (data.addresses.length > 0) {
           setSelectedAddress(data.addresses[0]);
         }
       } else {
         toast.error(data.message);
       }
     } catch (error) {
       toast.error(error.message);
     }
   }, [axios]);

   const fetchCoupons = useCallback(async () => {
     try {
       const { data } = await axios.get("/api/user/coupons");
       if (data.success) {
         setTotalSpending(data.totalSpending);
         setCoupons(data.coupons);
       }
     } catch (error) {
       console.error("Error fetching coupons:", error);
     }
   }, [axios]);

   useEffect(() => {
     if (user) {
       getAddress();
       fetchCoupons();
     }
   }, [user, getAddress, fetchCoupons]);

   useEffect(() => {
     if (products.length > 0 && cartItems) {
       getCart();
     }
   }, [products, cartItems, getCart]);

  const applyCoupon = (coupon) => {
    if (selectedCoupon?.code === coupon.code) {
      setSelectedCoupon(null);
      toast.success("Coupon removed");
    } else {
      setSelectedCoupon(coupon);
      toast.success(`Coupon ${coupon.code} applied successfully!`);
    }
  };

  const getNextTier = () => {
    if (totalSpending < 100) {
      return { tier: "Bronze", target: 100, needed: 100 - totalSpending, pct: Math.min((totalSpending / 100) * 100, 100) };
    } else if (totalSpending < 250) {
      return { tier: "Silver", target: 250, needed: 250 - totalSpending, pct: Math.min(((totalSpending - 100) / 150) * 100, 100) };
    } else if (totalSpending < 500) {
      return { tier: "Gold", target: 500, needed: 500 - totalSpending, pct: Math.min(((totalSpending - 250) / 250) * 100, 100) };
    } else {
      return { tier: "Gold Max", target: 500, needed: 0, pct: 100 };
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
          couponCode: selectedCoupon ? selectedCoupon.code : undefined,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayPalPayment = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      setIsProcessing(true);

      const { data } = await axios.post("/api/order/paypal/create", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
        couponCode: selectedCoupon ? selectedCoupon.code : undefined,
      });

      if (data.success && data.approvalUrl) {
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: data.orderId,
            paypalOrderId: data.paypalOrderId,
          })
        );
        window.location.href = data.approvalUrl;
      } else {
        toast.error(data.message || "Failed to create PayPal order");
      }
    } catch (error) {
      toast.error(error.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (products.length === 0) return null;

  if (cartArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
        <div className="w-36 h-36 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 font-semibold text-xs mb-8 leading-relaxed">
          Looks like you haven't added any products to your basket yet. Explore our categories to start shopping.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition cursor-pointer text-sm"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const subtotal = totalCartAmount();
  const discountPct = selectedCoupon ? selectedCoupon.discount : 0;
  const discountAmount = Math.floor(((subtotal * discountPct) / 100) * 100) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Math.floor(((taxableAmount * 2) / 100) * 100) / 100;
  const grandTotal = taxableAmount + taxAmount;
  const nextTier = getNextTier();

  return (
    <div className="flex flex-col lg:flex-row py-8 gap-8 max-w-6xl w-full mx-auto">
      
      {/* Product List Panel */}
      <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span>Shopping Basket</span>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
            {cartCount()} {cartCount() === 1 ? "Item" : "Items"}
          </span>
        </h1>

        {/* List Headers */}
        <div className="grid grid-cols-[3fr_1fr_1fr] text-[11px] font-black uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-50">
          <p className="text-left">Product Details</p>
          <p className="text-center">Price</p>
          <p className="text-right">Action</p>
        </div>

        {/* Cart items */}
        <div className="divide-y divide-gray-50">
          {cartArray.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[3fr_1fr_1fr] items-center py-4"
            >
              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-20 h-20 flex items-center justify-center border border-gray-100 rounded-xl bg-gray-50/50 p-1.5 hover:shadow-xs transition"
                >
                  <img
                    className="max-h-full object-contain"
                    src={getImageUrl(product.image?.[0])}
                    alt={product.name}
                  />
                </div>
                <div>
                  <h3 
                    onClick={() => {
                      navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                      scrollTo(0, 0);
                    }}
                    className="font-bold text-sm text-gray-800 hover:text-primary cursor-pointer leading-snug"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mt-1">
                    <span>Category: {product.category}</span>
                    <div className="flex items-center gap-1 border border-gray-100 bg-white px-2 py-0.5 rounded-md">
                      <span>Qty:</span>
                      <select
                        onChange={(e) =>
                          updateCartItem(product._id, Number(e.target.value))
                        }
                        value={cartItems[product._id]}
                        className="outline-none text-gray-700 bg-transparent font-bold cursor-pointer"
                      >
                        {Array(
                          cartItems[product._id] > 9 ? cartItems[product._id] : 9
                        )
                          .fill("")
                          .map((_, idx) => (
                            <option key={idx} value={idx + 1}>
                              {idx + 1}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-center font-bold text-sm text-gray-800">
                ${(product.offerPrice * product.quantity).toFixed(2)}
              </p>
              
              <div className="text-right">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer inline-flex p-2 hover:bg-red-50 text-red-500 rounded-xl transition duration-150 active:scale-95"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-6 gap-2 text-primary font-bold text-xs hover:text-primary-dark transition"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add More Products
        </button>
      </div>

      {/* Checkout Sidebar Panel */}
      <div className="w-full lg:w-[380px] bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-fit">
        <h2 className="text-lg font-black text-gray-900 mb-5">Order Checkout</h2>
        
        {/* Delivery Address Box */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">Delivery Address</span>
            {selectedAddress ? (
              <button 
                onClick={() => setShowAddress(!showAddress)} 
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Change
              </button>
            ) : (
              <button 
                onClick={() => navigate("/add-address")} 
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Add Address
              </button>
            )}
          </div>
          {selectedAddress ? (
            <div className="text-sm font-semibold text-gray-800">
              <p className="font-bold flex items-center gap-1 text-xs">
                <span>🏠</span> Home Address
              </p>
              <p className="text-gray-500 font-semibold text-xs mt-1 leading-relaxed">
                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country}
              </p>
            </div>
          ) : (
            <div className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 mt-1">
              <span>⚠️</span>
              <span>No delivery address found.</span>
            </div>
          )}

          {/* Address Dropdown selection popup */}
          {showAddress && (
            <div className="absolute left-4 right-4 md:left-auto md:right-auto md:w-[300px] mt-2 py-1.5 bg-white border border-gray-100 text-xs rounded-xl shadow-xl z-50 divide-y divide-gray-50">
              {address.map((addr, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddress(false);
                  }}
                  className="text-gray-600 p-3 hover:bg-gray-50 cursor-pointer font-semibold"
                >
                  <p className="font-bold text-black">{addr.street}</p>
                  <p className="text-gray-400 mt-0.5">{addr.city}, {addr.state}, {addr.country}</p>
                </div>
              ))}
              <div
                onClick={() => navigate("/add-address")}
                className="text-primary text-center cursor-pointer p-3 font-bold hover:bg-primary/5 transition"
              >
                + Add New Address
              </div>
            </div>
          )}
        </div>

        {/* Loyalty Program Progress Dashboard */}
        {user && coupons.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/10 mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] uppercase font-black tracking-wider text-primary">Spending Rewards</span>
              <span className="text-[10px] font-bold text-gray-500">Spent: ${totalSpending.toFixed(2)}</span>
            </div>
            
            {nextTier.needed > 0 ? (
              <div>
                <p className="text-[11px] font-bold text-gray-700">
                  Spend <span className="text-primary font-black">${nextTier.needed.toFixed(2)}</span> more to unlock <span className="font-black text-black">{nextTier.tier}</span> Coupon
                </p>
                {/* Progress bar */}
                <div className="w-full bg-gray-200/60 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${nextTier.pct}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] font-black text-emerald-600 flex items-center gap-1">🏆 Max Loyalty Tier Unlocked!</p>
            )}

            {/* Coupons selection list */}
            <div className="mt-4 space-y-2">
              {coupons.map((coupon, idx) => (
                <div 
                  key={idx}
                  onClick={() => coupon.unlocked && applyCoupon(coupon)}
                  className={`p-2.5 rounded-xl border text-xs flex justify-between items-center transition ${
                    selectedCoupon?.code === coupon.code 
                      ? "bg-primary border-primary text-white" 
                      : coupon.unlocked
                        ? "bg-white hover:bg-gray-50/50 border-gray-200 text-gray-700 cursor-pointer"
                        : "bg-gray-50/50 border-gray-100 text-gray-400 opacity-60"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-black tracking-wider flex items-center gap-1.5">
                      <span>🎟️</span> {coupon.code}
                      {selectedCoupon?.code === coupon.code && (
                        <span className="bg-white/20 text-white font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Active</span>
                      )}
                      {!coupon.unlocked && (
                        <span className="text-gray-400 text-[9px] font-normal">🔒 Locked</span>
                      )}
                    </p>
                    <p className={`text-[10px] font-medium mt-0.5 ${selectedCoupon?.code === coupon.code ? "text-white/80" : "text-gray-400"}`}>
                      {coupon.description}
                    </p>
                  </div>
                  <span className="font-black text-sm text-right shrink-0 ml-2">
                    {coupon.discount}% Off
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Select Cards */}
        <div className="mb-6">
          <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block mb-2.5">Payment Method</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentOption("COD")}
              className={`py-3 px-4 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentOption === "COD" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200 text-gray-600 bg-white"
              }`}
            >
              <span className="text-lg">💵</span>
              <span>Cash on Delivery</span>
            </button>
            <button
              onClick={() => setPaymentOption("PayPal")}
              className={`py-3 px-4 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentOption === "PayPal" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200 text-gray-600 bg-white"
              }`}
            >
              <span className="text-lg">💳</span>
              <span>PayPal Account</span>
            </button>
          </div>
        </div>

        {/* Summary Pricing Details */}
        <div className="space-y-3 text-xs font-semibold text-gray-500 mb-6 border-t border-gray-50 pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-black font-bold">${subtotal.toFixed(2)}</span>
          </div>
          {selectedCoupon && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount ({selectedCoupon.code})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Handling & Delivery</span>
            <span className="text-emerald-600 font-bold">FREE</span>
          </div>
          <div className="flex justify-between">
            <span>GST & Service Tax (2%)</span>
            <span className="text-black font-bold">${taxAmount.toFixed(2)}</span>
          </div>
          <hr className="border-gray-50 my-2" />
          <div className="flex justify-between text-base font-black text-black">
            <span>Grand Total</span>
            <span className="text-primary text-xl font-black">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Checkout Action */}
        <button
          onClick={() => {
            if (paymentOption === "COD") {
              placeOrder();
            } else {
              handlePayPalPayment();
            }
          }}
          disabled={isProcessing}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/95 transition active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed text-center text-sm cursor-pointer"
        >
          {isProcessing
            ? "Processing..."
            : paymentOption === "COD"
            ? "⚡ Place Order (10 Mins)"
            : "💳 Pay with PayPal"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
