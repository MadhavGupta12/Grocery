import express from "express";
import {
  checkAuth,
  adminLogin,
  adminLogout,
  getAnalytics,
  getRecentEvents,
} from "../controller/admin.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/is-auth", authAdmin, checkAuth);
router.get("/logout", authAdmin, adminLogout);
router.get("/analytics", authAdmin, getAnalytics);
router.get("/events", authAdmin, getRecentEvents);

export default router;
