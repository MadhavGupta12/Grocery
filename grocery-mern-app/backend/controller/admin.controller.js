import jwt from "jsonwebtoken";
// admin login :/api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SELLER_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.SELLER_PASSWORD || "admin123";
    if (
      password === adminPassword &&
      email === adminEmail
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "Login successful", success: true, token });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check admin auth  : /api/admin/is-auth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// logout admin: /api/admin/logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get analytics data for admin dashboard: /api/admin/analytics
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate({
      path: "items.product",
      model: "Product",
    });

    const totalOrders = orders.length;
    let totalSales = 0;
    const statusCounts = {
      placed: 0,
      packed: 0,
      shipped: 0,
      outForDelivery: 0,
      delivered: 0,
    };

    const categorySales = {};
    const dailySalesMap = {};

    // Advanced Order Analysis Metrics
    const paymentMethods = { cod: 0, paypal: 0 };
    const couponStats = {
      usageCount: 0,
      totalDiscount: 0,
      codes: {}
    };
    const orderValueDistribution = {
      under50: 0,
      fiftyTo100: 0,
      hundredTo200: 0,
      over200: 0
    };

    // Initialize last 7 days of daily sales
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailySalesMap[dateStr] = 0;
    }

    orders.forEach((order) => {
      totalSales += order.amount;

      // Payment Type aggregation
      const pType = (order.paymentType || "").toLowerCase();
      if (pType.includes("paypal")) {
        paymentMethods.paypal++;
      } else {
        paymentMethods.cod++;
      }

      // Order value distribution
      const amt = order.amount;
      if (amt < 50) orderValueDistribution.under50++;
      else if (amt >= 50 && amt < 100) orderValueDistribution.fiftyTo100++;
      else if (amt >= 100 && amt < 200) orderValueDistribution.hundredTo200++;
      else orderValueDistribution.over200++;

      // Coupon details
      if (order.couponCode) {
        couponStats.usageCount++;
        couponStats.totalDiscount += (order.discount || 0);
        couponStats.codes[order.couponCode] = (couponStats.codes[order.couponCode] || 0) + 1;
      }

      // Status aggregation
      const status = (order.status || "").toLowerCase();
      if (status.includes("placed")) statusCounts.placed++;
      else if (status.includes("packed")) statusCounts.packed++;
      else if (status.includes("shipped")) statusCounts.shipped++;
      else if (status.includes("delivery")) statusCounts.outForDelivery++;
      else if (status.includes("delivered")) statusCounts.delivered++;

      // Daily sales aggregation
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dailySalesMap[orderDate] !== undefined) {
        dailySalesMap[orderDate] += order.amount;
      }

      // Category sales aggregation
      order.items.forEach((item) => {
        let category = "Unknown";
        if (item.product && typeof item.product === "object") {
          category = item.product.category || "Unknown";
        }
        categorySales[category] = (categorySales[category] || 0) + (item.quantity || 1);
      });
    });

    const outOfStockProducts = await Product.find({ inStock: false }).limit(10);

    const dailySalesTrend = Object.keys(dailySalesMap).map((date) => ({
      date,
      sales: parseFloat(dailySalesMap[date].toFixed(2)),
    }));

    const categoryBreakdown = Object.keys(categorySales).map((name) => ({
      name,
      value: categorySales[name],
    }));

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalSales: parseFloat(totalSales.toFixed(2)),
        statusCounts,
        dailySalesTrend,
        categoryBreakdown,
        outOfStockProducts,
        paymentMethods,
        couponStats: {
          usageCount: couponStats.usageCount,
          totalDiscount: parseFloat(couponStats.totalDiscount.toFixed(2)),
          codes: Object.keys(couponStats.codes).map((code) => ({
            code,
            count: couponStats.codes[code]
          }))
        },
        orderValueDistribution
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ message: "Failed to load analytics data", success: false });
  }
};
export const getRecentEvents = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({ path: "items.product", model: "Product", select: "name" });

    const events = recentOrders.map((order) => {
      const productName = order.items?.[0]?.product?.name || "a product";
      const status = order.status || "Order Placed";
      const timeDiff = Date.now() - new Date(order.updatedAt).getTime();
      const minutesAgo = Math.floor(timeDiff / 60000);
      const timeLabel =
        minutesAgo < 1
          ? "Just now"
          : minutesAgo < 60
          ? `${minutesAgo} min ago`
          : `${Math.floor(minutesAgo / 60)}h ago`;

      let badge = "INFO";
      let message = "";

      if (status === "Order Placed") {
        badge = "SUCCESS";
        message = `New order placed — ${productName} ($${order.amount.toFixed(2)})`;
      } else if (status === "Order Packed") {
        badge = "INFO";
        message = `Order packed and ready for dispatch — $${order.amount.toFixed(2)}`;
      } else if (status === "Order Shipped") {
        badge = "INFO";
        message = `Shipment dispatched — ${productName}`;
      } else if (status === "Out for Delivery") {
        badge = "WARNING";
        message = `Out for delivery${order.rider ? ` via ${order.rider}` : ""} — $${order.amount.toFixed(2)}`;
      } else if (status === "Delivered") {
        badge = "SUCCESS";
        message = `Order delivered successfully — ${productName}`;
      }

      const payType = (order.paymentType || "").toLowerCase();
      if (payType.includes("paypal") && order.isPaid) {
        badge = "PAYMENT";
        message = `PayPal payment confirmed — $${order.amount.toFixed(2)}`;
      }

      return { id: order._id, time: timeLabel, message, badge, status };
    });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error in getRecentEvents:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};
