import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/getImageUrl";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AppContext);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const getTimelineSteps = (status) => {
    const steps = ["Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    
    // Default to "Placed" if status is not standard
    let currentIdx = steps.findIndex(step => step.toLowerCase() === status.toLowerCase());
    if (currentIdx === -1) {
      currentIdx = 0; // default to stage 1
    }

    return steps.map((step, idx) => ({
      name: step,
      completed: idx <= currentIdx,
      active: idx === currentIdx
    }));
  };

  return (
    <div className="mt-8 pb-16 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Your Orders</h1>
        <p className="text-gray-500 font-semibold text-xs mt-1">Track and manage your instant grocery orders</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-xs">
          <span className="text-5xl">📦</span>
          <h2 className="text-xl font-bold text-gray-800 mt-4">No Orders Placed Yet</h2>
          <p className="text-gray-400 font-semibold text-xs mt-1 max-w-xs mx-auto mb-6">
            You haven't ordered anything yet. Give it a try, we deliver in 10 minutes!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {myOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200"
            >
              {/* Header section */}
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-50 text-xs font-semibold text-gray-500">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Order ID</span>
                  <span className="font-bold text-black text-sm">{order._id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Payment</span>
                  <span className="font-bold text-black bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md mt-0.5 inline-block">{order.paymentType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Amount</span>
                  <span className="font-black text-primary text-base">${order.amount.toFixed(2)}</span>
                  {order.couponCode && (
                    <span className="text-[10px] text-emerald-600 block font-bold mt-0.5">
                      Saved ${order.discount?.toFixed(2)} ({order.couponCode})
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Order Status</span>
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase mt-0.5 inline-block ${
                    order.status.toLowerCase() === "delivered" 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items listing */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex items-center justify-between gap-4 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center">
                        <img
                          src={getImageUrl(item.product?.image?.[0])}
                          alt={item.product?.name || "Product"}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">{item.product?.name || "Product Item"}</h3>
                        <p className="text-gray-400 mt-0.5 font-medium">Qty: {item.quantity || 1} • {item.product?.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">
                      ${((item.product?.offerPrice || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Timeline Stepper */}
              <div className="mt-6 border-t border-gray-50 pt-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-5">Delivery Timeline Status</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                  {getTimelineSteps(order.status).map((step, idx) => (
                    <div key={idx} className="flex-1 w-full flex sm:flex-col items-center gap-3 sm:gap-1.5">
                      {/* Bubble with Line */}
                      <div className="flex items-center w-full">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition duration-200 shrink-0 ${
                          step.completed ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-400"
                        }`}>
                          {step.completed ? "✓" : idx + 1}
                        </div>
                        {idx < 4 && (
                          <div className={`hidden sm:block h-0.5 flex-1 ml-2 ${
                            step.completed ? "bg-primary" : "bg-gray-100"
                          }`} />
                        )}
                      </div>
                      
                      {/* Label details */}
                      <div className="text-left sm:text-center">
                        <p className={`text-[11px] font-bold ${
                          step.active ? "text-primary font-black" : step.completed ? "text-gray-800" : "text-gray-400"
                        }`}>
                          {step.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
