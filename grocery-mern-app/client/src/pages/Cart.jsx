import { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import toast from "react-hot-toast";

const Cart = () => {
  const upiId = import.meta.env.VITE_UPI_ID || "merchant@upi";
  const upiName = import.meta.env.VITE_UPI_NAME || "Grocery Store";
  const {
    products, navigate, cartCount, totalCartAmount,
    cartItems, setCartItems, removeFromCart, updateCartItem,
    axios, user,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [totalSpending, setTotalSpending] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const getCart = useCallback(() => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
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
    } catch {
      setCoupons([]);
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
      toast.success(`Coupon ${coupon.code} applied!`);
    }
  };

  const getNextTier = () => {
    if (totalSpending < 100) return { tier: "Bronze", target: 100, needed: 100 - totalSpending };
    else if (totalSpending < 250) return { tier: "Silver", target: 250, needed: 250 - totalSpending };
    else if (totalSpending < 500) return { tier: "Gold", target: 500, needed: 500 - totalSpending };
    else return { tier: "Gold Max", target: 500, needed: 0 };
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) return toast.error("Please select an address");
      setIsProcessing(true);
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({ product: item._id, quantity: item.quantity })),
          address: selectedAddress._id,
          couponCode: selectedCoupon?.code,
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    try {
      if (!selectedAddress) return toast.error("Please select an address");
      setIsProcessing(true);
      const { data } = await axios.post("/api/order/paypal/create", {
        items: cartArray.map((item) => ({ product: item._id, quantity: item.quantity })),
        address: selectedAddress._id,
        couponCode: selectedCoupon?.code,
      });

      if (data.success && data.approvalUrl) {
        localStorage.setItem("pendingOrder", JSON.stringify({ orderId: data.orderId, paypalOrderId: data.paypalOrderId }));
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

  const handleUpiPayment = async () => {
    try {
      if (!selectedAddress) return toast.error("Please select an address");
      if (upiTransactionId.trim().length < 6) {
        return toast.error("Enter your UPI transaction/reference ID");
      }

      setIsProcessing(true);
      const { data } = await axios.post("/api/order/upi", {
        items: cartArray.map((item) => ({ product: item._id, quantity: item.quantity })),
        address: selectedAddress._id,
        couponCode: selectedCoupon?.code,
        upiTransactionId,
      });

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        setUpiTransactionId("");
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to place UPI order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (products.length === 0) return null;

  if (cartArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center mt-6 bg-white border border-gray-100 rounded-3xl shadow-sm max-w-4xl mx-auto animate-slide-in-up">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-[#0c831f]/10 rounded-full flex items-center justify-center text-5xl">🛒</div>
          <span className="absolute -top-1 -right-1 badge-orange shadow-sm">🧡</span>
          <span className="absolute -bottom-1 -left-1 badge-yellow shadow-sm">⚡</span>
        </div>
        <h2 className="text-xl font-black text-[#1a1a1a] mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm font-medium max-w-xs leading-relaxed mb-6">
          Fresh groceries are waiting! Start shopping and get them delivered in 10 minutes.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#0c831f] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0a7019] active:scale-95 transition-all cursor-pointer shadow-md text-sm"
        >
          Start Shopping
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
  const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Grocery order payment")}`;
  const submitOrder = () => {
    if (paymentOption === "PayPal") return handlePayPalPayment();
    if (paymentOption === "UPI") return handleUpiPayment();
    return placeOrder();
  };

  return (
    <div className="mt-6 pb-16 max-w-6xl w-full mx-auto animate-slide-in-up">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
            <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Review Cart</h1>
            <span className="bg-[#1a1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {cartCount()} Items
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6 p-3 bg-[#0c831f]/10 rounded-2xl border border-[#0c831f]/20">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-black text-sm text-[#0c831f] leading-tight">Delivery in 10 minutes</h3>
              <p className="text-xs text-[#0c831f]/80 font-medium">Shipment of {cartCount()} items</p>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {cartArray.map((product, index) => (
              <div key={index} className="py-5 flex gap-4">
                <div
                  onClick={() => navigate(`/product/${product.category.toLowerCase()}/${product._id}`)}
                  className="cursor-pointer w-20 h-20 shrink-0 flex items-center justify-center border border-gray-100 rounded-2xl bg-white hover:border-[#F8C008] transition-all p-1"
                >
                  <img className="max-h-full object-contain" src={getImageUrl(product.image?.[0])} alt={product.name} />
                </div>
                
                <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 onClick={() => navigate(`/product/${product.category.toLowerCase()}/${product._id}`)} className="font-bold text-sm text-[#1a1a1a] cursor-pointer leading-snug hover:text-[#0c831f]">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-[11px] font-bold mt-1 uppercase tracking-wider">{product.category}</p>
                    <p className="font-black text-sm text-[#1a1a1a] mt-2">₹{(product.offerPrice * product.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start">
                    {/* Add/Remove buttons (Blinkit style) */}
                    <div className="flex items-center bg-white border border-[#0c831f] rounded-lg overflow-hidden h-8 shadow-sm">
                      <button
                        onClick={() => {
                          if (product.quantity > 1) updateCartItem(product._id, product.quantity - 1);
                          else removeFromCart(product._id);
                        }}
                        className="w-8 h-full flex items-center justify-center text-[#0c831f] hover:bg-[#0c831f]/10 font-bold cursor-pointer"
                      >−</button>
                      <span className="w-8 h-full flex items-center justify-center bg-[#0c831f] text-white text-xs font-black">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(product._id, product.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-[#0c831f] hover:bg-[#0c831f]/10 font-bold cursor-pointer"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate("/products")} className="mt-6 text-[#0c831f] font-bold text-sm flex items-center gap-1 hover:underline underline-offset-2 w-fit cursor-pointer">
            + Add more items
          </button>
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
          
          {/* Address Box */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F8C008]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 flex items-center gap-1">
                <span>📍</span> Delivery Address
              </span>
              <button 
                onClick={() => selectedAddress ? setShowAddress(!showAddress) : navigate("/add-address")} 
                className="text-xs font-bold text-[#FC8019] hover:underline cursor-pointer"
              >
                {selectedAddress ? "Change" : "Add Address"}
              </button>
            </div>
            
            {selectedAddress ? (
              <div className="relative z-10 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <p className="font-bold text-sm text-[#1a1a1a]">{selectedAddress.street}</p>
                <p className="text-gray-500 font-medium text-xs mt-1 leading-relaxed truncate">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}
                </p>
              </div>
            ) : (
              <div className="relative z-10 bg-red-50 border border-red-100 rounded-xl p-3 text-xs font-bold text-red-600 flex items-center gap-1.5">
                <span>⚠️</span> No delivery address found. Please add one.
              </div>
            )}

            {/* Address Dropdown */}
            {showAddress && (
              <div className="absolute left-0 right-0 top-full mt-2 mx-5 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 divide-y divide-gray-50 overflow-hidden">
                {address.map((addr, idx) => (
                  <div key={idx} onClick={() => { setSelectedAddress(addr); setShowAddress(false); }} className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="font-bold text-sm text-[#1a1a1a]">{addr.street}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{addr.city}, {addr.zipCode}</p>
                  </div>
                ))}
                <div onClick={() => navigate("/add-address")} className="p-3 text-center text-[#0c831f] font-black text-xs hover:bg-gray-50 cursor-pointer">
                  + Add New Address
                </div>
              </div>
            )}
          </div>

          {/* Loyalty & Coupons */}
          {user && coupons.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block mb-3">Offers & Benefits</span>
              <div className="space-y-2">
                {coupons.map((coupon, idx) => (
                  <div 
                    key={idx}
                    onClick={() => coupon.unlocked && applyCoupon(coupon)}
                    className={`p-3 rounded-xl border flex justify-between items-center transition-all duration-200 ${
                      selectedCoupon?.code === coupon.code 
                        ? "bg-[#FC8019] border-[#FC8019] text-white shadow-md scale-[1.02] cursor-pointer" 
                        : coupon.unlocked
                          ? "bg-white hover:bg-gray-50 border-gray-200 text-[#1a1a1a] cursor-pointer"
                          : "bg-gray-50 border-gray-100 text-gray-400 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <p className="font-black text-sm flex items-center gap-1.5">
                        <span>🎟️</span> {coupon.code}
                        {!coupon.unlocked && <span className="text-gray-400 text-[8px] font-black bg-gray-100 px-1 py-0.5 rounded uppercase border border-gray-200">Locked</span>}
                      </p>
                      <p className={`text-[10px] font-medium mt-0.5 ${selectedCoupon?.code === coupon.code ? "text-white/80" : "text-gray-500"}`}>
                        {coupon.description}
                      </p>
                    </div>
                    <span className="font-black text-sm">{coupon.discount}% OFF</span>
                  </div>
                ))}
              </div>
              {nextTier.needed > 0 && (
                <div className="mt-3 bg-[#F8C008]/10 border border-[#F8C008]/20 rounded-xl p-2.5 text-[10px] font-bold text-[#1a1a1a] flex items-start gap-1.5">
                  <span className="mt-0.5 text-[#FC8019]">⭐</span>
                  <p>Spend <span className="text-[#0c831f]">₹{nextTier.needed.toFixed(2)}</span> more to unlock {nextTier.tier} offers!</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block mb-3">Payment Method</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentOption("COD")}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  paymentOption === "COD" ? "border-[#0c831f] bg-[#0c831f]/5 text-[#0c831f]" : "border-gray-100 hover:border-gray-200 text-gray-600 bg-white"
                }`}
              >
                <span>💵</span> Cash
              </button>
              <button
                onClick={() => setPaymentOption("UPI")}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  paymentOption === "UPI" ? "border-[#0c831f] bg-[#0c831f]/5 text-[#0c831f]" : "border-gray-100 hover:border-gray-200 text-gray-600 bg-white"
                }`}
              >
                <span>₹</span> UPI
              </button>
              <button
                onClick={() => setPaymentOption("PayPal")}
                className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  paymentOption === "PayPal" ? "border-[#003087] bg-[#003087]/5 text-[#003087]" : "border-gray-100 hover:border-gray-200 text-gray-600 bg-white"
                }`}
              >
                <span>💳</span> PayPal
              </button>
            </div>
            {paymentOption === "UPI" && (
              <div className="mt-4 rounded-2xl border border-[#0c831f]/20 bg-[#0c831f]/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#0c831f]">Pay using any UPI app</p>
                    <p className="mt-1 text-sm font-bold text-[#1a1a1a]">{upiId}</p>
                    <p className="mt-1 text-[11px] font-medium text-gray-500">After payment, enter the transaction/reference ID below.</p>
                  </div>
                  <a
                    href={upiPaymentUrl}
                    className="shrink-0 rounded-xl bg-[#0c831f] px-3 py-2 text-xs font-black text-white shadow-sm"
                  >
                    Open UPI
                  </a>
                </div>
                <input
                  type="text"
                  value={upiTransactionId}
                  onChange={(e) => setUpiTransactionId(e.target.value)}
                  placeholder="UPI transaction/reference ID"
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#0c831f]"
                />
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
            <h3 className="font-black text-[#1a1a1a] text-sm mb-4">Bill Details</h3>
            <div className="space-y-3 text-xs font-semibold text-gray-500 mb-4">
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="text-[#1a1a1a]">₹{subtotal.toFixed(2)}</span>
              </div>
              {selectedCoupon && (
                <div className="flex justify-between text-[#0c831f]">
                  <span>Coupon discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery charge</span>
                <span className="text-[#0c831f]">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Handling fee (2%)</span>
                <span className="text-[#1a1a1a]">₹{taxAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-sm text-[#1a1a1a]">Grand Total</span>
                <span className="text-[#1a1a1a] text-lg font-black">₹{grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Inclusive of all taxes</p>
            </div>
          </div>

          {/* Checkout Action */}
          <div className="sticky bottom-4 z-40 bg-white md:bg-transparent rounded-3xl p-4 md:p-0 border border-gray-100 shadow-xl md:border-none md:shadow-none">
            <button
              onClick={submitOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-[#0c831f] text-white font-black rounded-2xl shadow-xl hover:bg-[#0a7019] transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Processing...
                </>
              ) : (
                <>
                  {paymentOption === "PayPal" ? "Pay with PayPal" : paymentOption === "UPI" ? "Confirm UPI Order" : "Place Order"}
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg ml-1">₹{grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-3 mt-3 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              <span>💳 Secure Checkout</span>
              <span>•</span>
              <span>⚡ 10 Min Delivery</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
