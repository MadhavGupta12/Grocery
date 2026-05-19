import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { getImageUrl } from "../../utils/getImageUrl";
import toast from "react-hot-toast";

const Orders = () => {
  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  const [orders, setOrders] = useState([]);
  const { axios } = useContext(AppContext);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/order/admin");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success(data.message);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  ...(newStatus === "Delivered" ? { isPaid: true, paymentStatus: "completed" } : {}),
                }
              : order
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    }
  }, [axios]);

  const handleRiderUpdate = useCallback(async (orderId, newRider) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        rider: newRider,
      });
      if (data.success) {
        toast.success("Rider updated successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, rider: newRider }
              : order
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update rider");
    }
  }, [axios]);

  return (
    <div className="md:p-10 p-4 space-y-4 w-full">
      <h2 className="text-lg font-medium">Orders List</h2>
      {orders.map((order, index) => (
        <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1.2fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800 bg-white"
        >
          <div className="flex gap-5">
            <img
              className="w-12 h-12 object-cover opacity-60"
              src={getImageUrl(order.items[0]?.product?.image?.[0]) || boxIcon}
              alt="boxIcon"
            />
            <div className="flex flex-col gap-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col justify-center">
                  <p className="font-medium text-sm">
                    {item.product?.name || "Deleted Product"}{" "}
                    <span className={`text-indigo-500 ${item.quantity < 2 && "hidden"}`}>
                      x {item.quantity}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">
              {order.address?.firstName || "N/A"} {order.address?.lastName || ""}
            </p>
            {order.address ? (
              <p>
                {order.address.street}, {order.address.city},{" "}
                {order.address.state}, {order.address.zipCode || order.address.zipcode || ""},{" "}
                {order.address.country}
              </p>
            ) : (
              <p className="text-gray-400 italic">No address details</p>
            )}
          </div>

          <p className="font-medium text-base my-auto text-black/70">
            ${order.amount}
          </p>

          <div className="flex flex-col text-sm gap-1">
            <p><span className="font-semibold text-gray-500">Method:</span> {order.paymentType}</p>
            <p><span className="font-semibold text-gray-500">Date:</span> {order.orderDate || new Date(order.createdAt).toLocaleDateString()}</p>
            <p><span className="font-semibold text-gray-500">Payment:</span> <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>{order.isPaid ? "Paid" : "Pending"}</span></p>
            
            <div className="mt-2 flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Assign Rider</label>
              <input
                type="text"
                placeholder="Enter rider name"
                defaultValue={order.rider || ""}
                onBlur={(e) => handleRiderUpdate(order._id, e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-xs font-bold text-gray-700 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Order Status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-xs font-bold text-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Orders;
