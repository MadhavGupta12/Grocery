import express from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
  getUserCoupons,
  toggleWishlist,
  getWishlist,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);
router.get("/coupons", authUser, getUserCoupons);
router.post("/wishlist/toggle", authUser, toggleWishlist);
router.get("/wishlist", authUser, getWishlist);

export default router;
