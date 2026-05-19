import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
import { connectDB } from "./config/connectDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

// Create uploads directory if it doesn't exist (needed for Render)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";

import { connectCloudinary } from "./config/cloudinary.js";
import { autoProgressOrders } from "./services/orderAutomation.js";

const app = express();

await connectCloudinary();
// allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true); // Allow any origin dynamically
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Grocery API is running" });
});

// Api endpoints
app.use("/images", express.static(uploadsDir));
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// Manual admin trigger for auto-progression
app.post("/api/admin/auto-progress-orders", async (req, res) => {
  await autoProgressOrders();
  res.json({ success: true, message: "Orders auto-progressed" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);

  // Auto-progress orders every 2 minutes
  setInterval(autoProgressOrders, 2 * 60 * 1000);
  console.log("[AutoOrder] Order automation started — runs every 2 minutes");

  // Keep-alive ping every 10 minutes to prevent Render free-tier sleep
  const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || `https://grocery-backend-mz5b.onrender.com`;
  setInterval(() => {
    fetch(`${BACKEND_URL}/`)
      .then(() => console.log("[KeepAlive] Ping sent to prevent sleep"))
      .catch((err) => console.warn("[KeepAlive] Ping failed:", err.message));
  }, 10 * 60 * 1000); // every 10 minutes
  console.log("[KeepAlive] Keep-alive ping scheduled every 10 minutes");
});
