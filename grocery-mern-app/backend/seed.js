import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

const dummyProducts = [
  // Vegetables
  {
    name: "Potato 500g",
    price: 25,
    offerPrice: 20,
    description: ["Fresh and organic", "Rich in carbohydrates", "Ideal for curries and fries"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
      "https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=400",
    ],
    inStock: true,
  },
  {
    name: "Tomato 1kg",
    price: 40,
    offerPrice: 35,
    description: ["Juicy and ripe", "Rich in Vitamin C", "Perfect for salads and sauces"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1546094096-0df4bcabd42c?w=400",
      "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400",
    ],
    inStock: true,
  },
  {
    name: "Carrot 500g",
    price: 30,
    offerPrice: 28,
    description: ["Sweet and crunchy", "Good for eyesight", "Ideal for juices and salads"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400",
    ],
    inStock: true,
  },
  {
    name: "Spinach 500g",
    price: 18,
    offerPrice: 15,
    description: ["Rich in iron", "High in vitamins", "Perfect for soups and salads"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
    ],
    inStock: true,
  },
  {
    name: "Onion 500g",
    price: 22,
    offerPrice: 19,
    description: ["Fresh and pungent", "Perfect for cooking", "A kitchen staple"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
    ],
    inStock: true,
  },

  // Fruits
  {
    name: "Apple 1kg",
    price: 120,
    offerPrice: 110,
    description: ["Crisp and juicy", "Rich in fiber", "Boosts immunity", "Organic and farm fresh"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400",
    ],
    inStock: true,
  },
  {
    name: "Orange 1kg",
    price: 80,
    offerPrice: 75,
    description: ["Juicy and sweet", "Rich in Vitamin C", "Perfect for juices"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
    ],
    inStock: true,
  },
  {
    name: "Banana 1kg",
    price: 50,
    offerPrice: 45,
    description: ["Sweet and ripe", "High in potassium", "Great for smoothies"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    ],
    inStock: true,
  },
  {
    name: "Mango 1kg",
    price: 150,
    offerPrice: 140,
    description: ["Sweet and flavorful", "Perfect for smoothies and desserts", "Rich in Vitamin A"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
    ],
    inStock: true,
  },
  {
    name: "Grapes 500g",
    price: 70,
    offerPrice: 65,
    description: ["Fresh and juicy", "Rich in antioxidants", "Perfect for snacking"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400",
    ],
    inStock: true,
  },

  // Dairy
  {
    name: "Fresh Milk 1L",
    price: 60,
    offerPrice: 55,
    description: ["Pure and fresh", "Rich in calcium", "Ideal for tea, coffee, and desserts"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    ],
    inStock: true,
  },
  {
    name: "Paneer 200g",
    price: 90,
    offerPrice: 85,
    description: ["Soft and fresh", "Rich in protein", "Ideal for curries and snacks"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    ],
    inStock: true,
  },
  {
    name: "Eggs 12 pcs",
    price: 90,
    offerPrice: 85,
    description: ["Farm fresh", "Rich in protein", "Ideal for breakfast and baking"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400",
    ],
    inStock: true,
  },
  {
    name: "Cheese 200g",
    price: 140,
    offerPrice: 130,
    description: ["Creamy and delicious", "Perfect for pizzas and sandwiches", "Rich in calcium"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400",
    ],
    inStock: true,
  },

  // Drinks
  {
    name: "Coca-Cola 1.5L",
    price: 80,
    offerPrice: 75,
    description: ["Refreshing and fizzy", "Perfect for parties", "Best served chilled"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
    ],
    inStock: true,
  },
  {
    name: "Pepsi 1.5L",
    price: 78,
    offerPrice: 73,
    description: ["Chilled and refreshing", "Perfect for celebrations", "Best served cold"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400",
    ],
    inStock: true,
  },
  {
    name: "Orange Juice 1L",
    price: 120,
    offerPrice: 110,
    description: ["Fresh squeezed", "Rich in Vitamin C", "No added sugar"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
    ],
    inStock: true,
  },

  // Grains
  {
    name: "Basmati Rice 5kg",
    price: 550,
    offerPrice: 520,
    description: ["Long grain and aromatic", "Perfect for biryani and pulao", "Premium quality"],
    category: "Grains",
    image: [
      "https://images.unsplash.com/photo-1536304993881-ff86e0c9b7e6?w=400",
    ],
    inStock: true,
  },
  {
    name: "Wheat Flour 5kg",
    price: 250,
    offerPrice: 230,
    description: ["High-quality whole wheat", "Soft and fluffy rotis", "Rich in nutrients"],
    category: "Grains",
    image: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    ],
    inStock: true,
  },
  {
    name: "Brown Rice 1kg",
    price: 120,
    offerPrice: 110,
    description: ["Whole grain and nutritious", "Helps in weight management", "Good source of magnesium"],
    category: "Grains",
    image: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    ],
    inStock: true,
  },

  // Bakery
  {
    name: "Brown Bread 400g",
    price: 40,
    offerPrice: 35,
    description: ["Soft and healthy", "Made from whole wheat", "Ideal for breakfast and sandwiches"],
    category: "Bakery",
    image: [
      "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400",
    ],
    inStock: true,
  },
  {
    name: "Butter Croissant",
    price: 50,
    offerPrice: 45,
    description: ["Flaky and buttery", "Freshly baked", "Perfect for breakfast or snacks"],
    category: "Bakery",
    image: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    ],
    inStock: true,
  },
  {
    name: "Chocolate Cake 500g",
    price: 350,
    offerPrice: 325,
    description: ["Rich and moist", "Made with premium cocoa", "Ideal for celebrations"],
    category: "Bakery",
    image: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    ],
    inStock: true,
  },

  // Instant
  {
    name: "Maggi Noodles 280g",
    price: 55,
    offerPrice: 50,
    description: ["Instant and easy to cook", "Delicious taste", "Popular among kids and adults"],
    category: "Instant",
    image: [
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400",
    ],
    inStock: true,
  },
  {
    name: "Instant Soup 70g",
    price: 35,
    offerPrice: 30,
    description: ["Convenient for on-the-go", "Healthy and nutritious", "Variety of flavors"],
    category: "Instant",
    image: [
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    ],
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
