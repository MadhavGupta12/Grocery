import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import axios from "axios";

// PayPal Configuration
const PAYPAL_API = process.env.PAYPAL_MODE === "live"
  ? "https://api.paypal.com"
  : "https://api.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Get PayPal Access Token
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw new Error("Failed to get PayPal access token");
  }
};

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, couponCode } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    // calculate amount using items;
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Apply Coupon discount if valid
    let discountPct = 0;
    if (couponCode) {
      const deliveredOrders = await Order.find({ userId, status: "Delivered" });
      const totalSpending = deliveredOrders.reduce((sum, order) => sum + order.amount, 0);
      if (couponCode === "BRONZE10" && totalSpending >= 100) discountPct = 10;
      else if (couponCode === "SILVER20" && totalSpending >= 250) discountPct = 20;
      else if (couponCode === "GOLD30" && totalSpending >= 500) discountPct = 30;
    }

    let discountAmount = 0;
    if (discountPct > 0) {
      discountAmount = Math.floor(((amount * discountPct) / 100) * 100) / 100;
      amount -= discountAmount;
    }

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);

    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
      couponCode: discountPct > 0 ? couponCode : undefined,
      discount: discountAmount,
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    console.error("Error in placeOrderCOD:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create PayPal Order :/api/order/paypal/create
export const createPayPalOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, couponCode } = req.body;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // Calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // Apply Coupon discount if valid
    let discountPct = 0;
    if (couponCode) {
      const deliveredOrders = await Order.find({ userId, status: "Delivered" });
      const totalSpending = deliveredOrders.reduce((sum, order) => sum + order.amount, 0);
      if (couponCode === "BRONZE10" && totalSpending >= 100) discountPct = 10;
      else if (couponCode === "SILVER20" && totalSpending >= 250) discountPct = 20;
      else if (couponCode === "GOLD30" && totalSpending >= 500) discountPct = 30;
    }

    let discountAmount = 0;
    if (discountPct > 0) {
      discountAmount = Math.floor(((amount * discountPct) / 100) * 100) / 100;
      amount -= discountAmount;
    }

    // Add tax 2%
    const taxAmount = Math.floor((amount * 2) / 100);
    const totalAmount = amount + taxAmount;

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (totalAmount / 100).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: (amount / 100).toFixed(2),
              },
              tax_total: {
                currency_code: "USD",
                value: (taxAmount / 100).toFixed(2),
              },
            },
          },
          items: items.map((item) => ({
            name: item.product,
            quantity: item.quantity,
            unit_amount: {
              currency_code: "USD",
              value: (item.offerPrice / 100).toFixed(2), // We can send standard item price, PayPal will verify the breakdowns sum up. If not, we can adjust.
            },
          })),
        },
      ],
      application_context: {
        return_url: `${CLIENT_URL}/verify-payment`,
        cancel_url: `${CLIENT_URL}/cart`,
      },
    };

    // To prevent mismatch errors in PayPal items sum vs item_total, let's simplify purchase_units if breakdown is sent, or just avoid items array and send subtotal & tax only.
    // Yes, sending purchase_units without items array is much safer to avoid any precision mismatch exceptions from PayPal!
    const simplifiedPaypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (totalAmount / 100).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: (amount / 100).toFixed(2),
              },
              tax_total: {
                currency_code: "USD",
                value: (taxAmount / 100).toFixed(2),
              },
            },
          },
        },
      ],
      application_context: {
        return_url: `${CLIENT_URL}/verify-payment`,
        cancel_url: `${CLIENT_URL}/cart`,
      },
    };

    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, simplifiedPaypalOrder, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const orderId = response.data.id;

    // Save pending order
    const order = await Order.create({
      userId,
      items,
      address,
      amount: totalAmount,
      paymentType: "PayPal",
      isPaid: false,
      paypalOrderId: orderId,
      couponCode: discountPct > 0 ? couponCode : undefined,
      discount: discountAmount,
    });

    res.status(201).json({
      success: true,
      orderId: order._id,
      paypalOrderId: orderId,
      approvalUrl: response.data.links.find((link) => link.rel === "approve")?.href,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ message: "Failed to create PayPal order", success: false });
  }
};

// Verify PayPal Payment :/api/order/paypal/verify
export const verifyPayPalPayment = async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body;
    const userId = req.user;

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture PayPal order
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "COMPLETED") {
      // Update order as paid
      const order = await Order.findByIdAndUpdate(
        orderId,
        { isPaid: true, paymentStatus: "completed" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    }

    res.status(400).json({ success: false, message: "Payment verification failed" });
  } catch (error) {
    console.error("Error verifying PayPal payment:", error);
    res.status(500).json({ message: "Payment verification failed", success: false });
  }
};

// Update Order Status (Seller): /api/order/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const updateData = { status };
    if (status === "Delivered") {
      updateData.isPaid = true;
      updateData.paymentStatus = "completed";
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

