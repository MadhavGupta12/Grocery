import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  createPayPalOrder,
  verifyPayPalPayment,
  updateOrderStatus,
} from "../controller/order.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.get("/user", authUser, getUserOrders);
router.get("/admin", authAdmin, getAllOrders);
router.post("/status", authAdmin, updateOrderStatus);
router.post("/paypal/create", authUser, createPayPalOrder);
router.post("/paypal/verify", authUser, verifyPayPalPayment);

export default router;
