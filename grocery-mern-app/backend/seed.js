import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

const dummyProducts = [
  {
    name: "Fresh Tomatoes",
    price: 50,
    offerPrice: 40,
    description: "Fresh and juicy tomatoes, handpicked from our farms",
    category: "Organic veggies",
    image: ["tomato1.jpg"],
    inStock: true,
  },
  {
    name: "Organic Carrots",
    price: 30,
    offerPrice: 25,
    description: "Crispy and sweet organic carrots",
    category: "Organic veggies",
    image: ["carrot1.jpg"],
    inStock: true,
  },
  {
    name: "Fresh Apples",
    price: 100,
    offerPrice: 80,
    description: "Delicious and crispy red apples",
    category: "Fresh Fruits",
    image: ["apple1.jpg"],
    inStock: true,
  },
  {
    name: "Banana Bunch",
    price: 40,
    offerPrice: 30,
    description: "Yellow ripe bananas, perfect for smoothies",
    category: "Fresh Fruits",
    image: ["banana1.jpg"],
    inStock: true,
  },
  {
    name: "Orange Juice",
    price: 60,
    offerPrice: 50,
    description: "Fresh orange juice packed with vitamin C",
    category: "Cold Drinks",
    image: ["juice1.jpg"],
    inStock: true,
  },
  {
    name: "Iced Tea",
    price: 35,
    offerPrice: 30,
    description: "Refreshing iced tea with natural flavors",
    category: "Cold Drinks",
    image: ["tea1.jpg"],
    inStock: true,
  },
  {
    name: "Instant Noodles",
    price: 20,
    offerPrice: 15,
    description: "Quick and delicious instant noodles",
    category: "Instant Food",
    image: ["noodles1.jpg"],
    inStock: true,
  },
  {
    name: "Canned Soup",
    price: 80,
    offerPrice: 70,
    description: "Ready-to-eat delicious canned soup",
    category: "Instant Food",
    image: ["soup1.jpg"],
    inStock: true,
  },
  {
    name: "Fresh Milk",
    price: 50,
    offerPrice: 45,
    description: "Pure and fresh milk from our farms",
    category: "Dairy Products",
    image: ["milk1.jpg"],
    inStock: true,
  },
  {
    name: "Cheese Block",
    price: 200,
    offerPrice: 180,
    description: "Creamy cheese block for all your cooking needs",
    category: "Dairy Products",
    image: ["cheese1.jpg"],
    inStock: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert dummy products
    const result = await Product.insertMany(dummyProducts);
    console.log(`Successfully added ${result.length} products to the database`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
