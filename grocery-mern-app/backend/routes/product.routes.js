import express from "express";

import { authAdmin } from "../middlewares/authAdmin.js";
import authUser from "../middlewares/authUser.js";
import {
  addProduct,
  changeStock,
  getProductById,
  getProducts,
  addProductReview,
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/add-product", authAdmin, upload.array("image", 4), addProduct);
router.get("/list", getProducts);
router.get("/id", getProductById);
router.post("/stock", authAdmin, changeStock);
router.post("/:id/review", authUser, addProductReview);

export default router;
