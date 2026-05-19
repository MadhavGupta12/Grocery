import Order from "../models/order.model.js";

const STATUS_PIPELINE = [
  "Order Placed",
  "Order Packed",
  "Order Shipped",
  "Out for Delivery",
  "Delivered",
];

const RIDERS = [
  "Rahul Kumar",
  "Amit Singh",
  "Priya Sharma",
  "Suresh Patel",
  "Kavya Nair",
  "Vikram Rao",
  "Deepak Mehta",
  "Anjali Gupta",
];

/**
 * Automatically advances orders through the delivery pipeline
 * Called on a schedule — each order advances one step every ~2 minutes
 */
export const autoProgressOrders = async () => {
  try {
    // Get all active (not delivered) paid orders
    const activeOrders = await Order.find({
      status: { $ne: "Delivered" },
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    });

    for (const order of activeOrders) {
      const currentIdx = STATUS_PIPELINE.indexOf(order.status);
      if (currentIdx === -1 || currentIdx >= STATUS_PIPELINE.length - 1) continue;

      const nextStatus = STATUS_PIPELINE[currentIdx + 1];

      // Auto-assign a rider when moving to "Out for Delivery"
      const updates = { status: nextStatus };
      if (nextStatus === "Out for Delivery" && !order.rider) {
        updates.rider = RIDERS[Math.floor(Math.random() * RIDERS.length)];
      }

      await Order.findByIdAndUpdate(order._id, updates);
    }

    console.log(`[AutoOrder] Progressed ${activeOrders.length} orders`);
  } catch (err) {
    console.error("[AutoOrder] Error:", err.message);
  }
};
