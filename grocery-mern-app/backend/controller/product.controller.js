import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;
    // const image = req.files?.map((file) => `/uploads/${file.filename}`);
    const image = req.files?.map((file) => file.filename);
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      image,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// submit a review: /api/product/:id/review
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReviewIndex > -1) {
      // Update existing review
      product.reviews[existingReviewIndex].rating = ratingVal;
      product.reviews[existingReviewIndex].comment = comment;
      product.reviews[existingReviewIndex].createdAt = new Date();
    } else {
      // Create new review
      product.reviews.push({
        userId,
        userName: user.name,
        rating: ratingVal,
        comment,
        createdAt: new Date(),
      });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("Error in addProductReview:", error);
    return res.status(500).json({ success: false, message: "Server error while adding review" });
  }
};
