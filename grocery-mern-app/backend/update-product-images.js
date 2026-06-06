import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";
import { buildProductImages } from "./services/productImages.js";

dotenv.config();

const updateProductImages = async () => {
  try {
    await connectDB();

    const products = await Product.find({});
    const updates = products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            image: buildProductImages(product.name, product.category),
          },
        },
      },
    }));

    if (updates.length > 0) {
      await Product.bulkWrite(updates);
    }

    console.log(`Updated images for ${updates.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to update product images:", error);
    process.exit(1);
  }
};

updateProductImages();
