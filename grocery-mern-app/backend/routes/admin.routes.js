import express from "express";
import {
  checkAuth,
  adminLogin,
  adminLogout,
} from "../controller/admin.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/is-auth", authAdmin, checkAuth);
router.get("/logout", authAdmin, adminLogout);

export default router;
