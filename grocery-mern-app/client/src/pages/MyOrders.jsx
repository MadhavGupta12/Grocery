import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const statusConfig = {
  "order placed": { color: "#F8C008", bg: "#FFF8E1", icon: "📋" },
  "order packed": { color: "#FC8019", bg: "#FFF3E0", icon: "📦" },
  "order shipped": { color: "#1565C0", bg: "#E3F2FD", icon: "🚚" },
  "out for delivery": { color: "#6A1B9A", bg: "#F3E5F5", icon: "🛵" },
  delivered: { color: "#0c831f", bg: "#E8F5E9", icon: "✅" },
};

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user, navigate } = useContext(AppContext);

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) setMyOrders(data.orders);
      else if (!silent) toast.error(data.message);
    } catch (error) {
      if (!silent) toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    if (user) {
      fetchOrders(false);
      const interval = setInterval(() => fetchOrders(true), 5000);
      return () => clearInterval(interval);
    }
  }, [user, fetchOrders]);

  const stepMapping = {
    "order placed": "Placed",
    "order packed": "Packed",
    "order shipped": "Shipped",
    "out for delivery": "Out for Delivery",
    "delivered": "Delivered"
  };

  const steps = ["Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

  const getStepIdx = (status) => {
    const mappedLabel = stepMapping[status?.toLowerCase()] || "Placed";
    const idx = steps.findIndex(s => s.toLowerCase() === mappedLabel.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  const getStatusStyle = (status) =>
    statusConfig[status?.toLowerCase()] || { color: "#6b7280", bg: "#f9fafb", icon: "🔄" };

  return (
    <div className="mt-6 pb-16 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">My Orders</h1>
          <p className="text-gray-500 font-medium text-sm mt-0.5">{myOrders.length} order{myOrders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0c831f]/10 text-[#0c831f] px-3 py-2 rounded-xl border border-[#0c831f]/20">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          <span className="font-black text-xs">Live Tracking</span>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
          <div className="w-24 h-24 bg-[#F8C008]/10 rounded-full flex items-center justify-center text-5xl mb-5">📦</div>
          <h2 className="text-xl font-black text-[#1a1a1a] mb-2">No Orders Yet</h2>
          <p className="text-gray-500 font-medium text-sm max-w-xs leading-relaxed mb-6">
            You haven't placed any orders. Start shopping — delivery in 10 minutes!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#0c831f] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0a7019] active:scale-95 transition-all cursor-pointer shadow-md"
          >
            Start Shopping →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {myOrders.map((order, index) => {
            const stepIdx = getStepIdx(order.status);
            const style = getStatusStyle(order.status);
            return (
              <div key={index} className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: style.bg }}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="font-black text-[#1a1a1a] text-sm truncate max-w-[180px]">#{order._id?.slice(-8)?.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                      <p className="font-black text-[#0c831f] text-base">₹{order.amount?.toFixed(2)}</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide" style={{ backgroundColor: style.bg, color: style.color }}>
                      {style.icon} {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center shrink-0">
                          <img src={getImageUrl(item.product?.image?.[0])} alt={item.product?.name} className="max-h-full object-contain"/>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1a1a1a] leading-snug">{item.product?.name || "Product"}</p>
                          <p className="text-gray-400 text-xs font-medium mt-0.5">Qty: {item.quantity} · {item.product?.category}</p>
                        </div>
                      </div>
                      <p className="font-black text-sm text-[#1a1a1a] shrink-0">₹{((item.product?.offerPrice || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4">Delivery Progress</p>
                  <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-100 z-0">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(stepIdx / (steps.length - 1)) * 100}%`, background: "linear-gradient(90deg, #F8C008, #FC8019, #0c831f)" }}
                      />
                    </div>
                    {steps.map((step, i) => {
                      const done = i <= stepIdx;
                      const active = i === stepIdx;
                      return (
                        <div key={i} className="flex flex-col items-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
                              active ? "border-[#FC8019] scale-110 shadow-md" : done ? "border-[#0c831f]" : "border-gray-200"
                            }`}
                            style={{
                              backgroundColor: done ? (active ? "#FC8019" : "#0c831f") : "white",
                              color: done ? "white" : "#9ca3af",
                            }}
                          >
                            {done ? (active ? "●" : "✓") : i + 1}
                          </div>
                          <p className={`text-[9px] font-bold mt-1.5 text-center max-w-[50px] leading-tight hidden sm:block ${
                            active ? "text-[#FC8019] font-black" : done ? "text-[#0c831f]" : "text-gray-400"
                          }`}>{step}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    💳 {order.paymentType}
                    {order.paymentStatus === "pending_verification" && (
                      <span className="text-amber-600 font-black ml-2">UPI verification pending</span>
                    )}
                    {order.couponCode && <span className="text-[#0c831f] font-black ml-2">🎟️ {order.couponCode} applied</span>}
                  </span>
                  {order.rider && <span className="flex items-center gap-1">🛵 Rider: <span className="text-[#1a1a1a] font-black">{order.rider}</span></span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
