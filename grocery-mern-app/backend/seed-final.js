import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

import { buildProductImages } from "./services/productImages.js";

const baseProducts = [
  // Vegetables (17 items)
  { name: "Organic Potato 1kg", category: "Vegetables", price: 30 },
  { name: "Fresh Tomato 1kg", category: "Vegetables", price: 45 },
  { name: "Sweet Carrot 500g", category: "Vegetables", price: 35 },
  { name: "Green Spinach Bunch", category: "Vegetables", price: 20 },
  { name: "Red Onion 1kg", category: "Vegetables", price: 25 },
  { name: "Green Broccoli 1pc", category: "Vegetables", price: 65 },
  { name: "Cauliflower 1pc", category: "Vegetables", price: 55 },
  { name: "Bell Peppers Mix 3pc", category: "Vegetables", price: 50 },
  { name: "Fresh Cucumber 500g", category: "Vegetables", price: 28 },
  { name: "Sweet Corn 2pc", category: "Vegetables", price: 40 },
  { name: "Fresh Ginger 250g", category: "Vegetables", price: 15 },
  { name: "Garlic Bulbs 200g", category: "Vegetables", price: 18 },
  { name: "Green Chilli 100g", category: "Vegetables", price: 10 },
  { name: "Fresh Cabbage 1pc", category: "Vegetables", price: 32 },
  { name: "Zucchini Green 500g", category: "Vegetables", price: 48 },
  { name: "Yellow Bell Pepper 2pc", category: "Vegetables", price: 42 },
  { name: "Organic Spinach 250g", category: "Vegetables", price: 24 },

  // Fruits (17 items)
  { name: "Red Apple 1kg", category: "Fruits", price: 130 },
  { name: "Fresh Orange 1kg", category: "Fruits", price: 85 },
  { name: "Ripe Banana 1 Dozen", category: "Fruits", price: 55 },
  { name: "Alphonso Mango 1kg", category: "Fruits", price: 160 },
  { name: "Seedless Grapes 500g", category: "Fruits", price: 75 },
  { name: "Strawberries Pack 250g", category: "Fruits", price: 95 },
  { name: "Sweet Pineapple 1pc", category: "Fruits", price: 105 },
  { name: "Watermelon 1pc", category: "Fruits", price: 95 },
  { name: "Hass Avocado 2pc", category: "Fruits", price: 190 },
  { name: "Pomegranate 1kg", category: "Fruits", price: 165 },
  { name: "Blueberries Box 125g", category: "Fruits", price: 140 },
  { name: "Kiwi Fruit 3pc", category: "Fruits", price: 80 },
  { name: "Fresh Papaya 1pc", category: "Fruits", price: 70 },
  { name: "Sweet Pear 1kg", category: "Fruits", price: 90 },
  { name: "Green Lime 250g", category: "Fruits", price: 15 },
  { name: "Green Apple 1kg", category: "Fruits", price: 120 },
  { name: "Sweet Cherry 250g", category: "Fruits", price: 85 },

  // Dairy (15 items)
  { name: "Whole Milk 1L", category: "Dairy", price: 65 },
  { name: "Organic Paneer 200g", category: "Dairy", price: 95 },
  { name: "Fresh Eggs 12pc", category: "Dairy", price: 95 },
  { name: "Cheddar Cheese 200g", category: "Dairy", price: 145 },
  { name: "Greek Yogurt 500g", category: "Dairy", price: 115 },
  { name: "Salted Butter 500g", category: "Dairy", price: 185 },
  { name: "Mozzarella Cheese 200g", category: "Dairy", price: 155 },
  { name: "Almond Milk 1L", category: "Dairy", price: 210 },
  { name: "Fresh Cream 200ml", category: "Dairy", price: 70 },
  { name: "Soy Milk Organic 1L", category: "Dairy", price: 180 },
  { name: "Cottage Cheese 250g", category: "Dairy", price: 85 },
  { name: "Sour Cream 200g", category: "Dairy", price: 75 },
  { name: "Buttermilk Fresh 1L", category: "Dairy", price: 40 },
  { name: "Whipped Cream Spray", category: "Dairy", price: 120 },
  { name: "Pure Ghee 1L", category: "Dairy", price: 650 },

  // Drinks (14 items)
  { name: "Coca-Cola 1.5L", category: "Drinks", price: 85 },
  { name: "Pepsi Cola 1.5L", category: "Drinks", price: 80 },
  { name: "Orange Juice 1L", category: "Drinks", price: 125 },
  { name: "Green Tea Pack (25 Bags)", category: "Drinks", price: 155 },
  { name: "Sparkling Water 500ml", category: "Drinks", price: 50 },
  { name: "Cold Brew Coffee 250ml", category: "Drinks", price: 115 },
  { name: "Lemon Iced Tea 1L", category: "Drinks", price: 105 },
  { name: "Apple Cider 1L", category: "Drinks", price: 140 },
  { name: "Coconut Water 500ml", category: "Drinks", price: 60 },
  { name: "Tomato Juice 1L", category: "Drinks", price: 95 },
  { name: "Pineapple Juice 1L", category: "Drinks", price: 110 },
  { name: "Ginger Ale 330ml", category: "Drinks", price: 70 },
  { name: "Energy Drink Can", category: "Drinks", price: 120 },
  { name: "Mineral Water 1L", category: "Drinks", price: 20 },

  // Grains (13 items)
  { name: "Basmati Rice 5kg", category: "Grains", price: 560 },
  { name: "Wheat Flour 5kg", category: "Grains", price: 260 },
  { name: "Brown Rice 1kg", category: "Grains", price: 125 },
  { name: "Organic Oats 1kg", category: "Grains", price: 145 },
  { name: "Organic Quinoa 500g", category: "Grains", price: 205 },
  { name: "Red Lentils 1kg", category: "Grains", price: 95 },
  { name: "Yellow Moong Dal 1kg", category: "Grains", price: 110 },
  { name: "Chickpeas 1kg", category: "Grains", price: 120 },
  { name: "Black Beans 1kg", category: "Grains", price: 130 },
  { name: "Barley Seeds 1kg", category: "Grains", price: 85 },
  { name: "Chia Seeds 250g", category: "Grains", price: 150 },
  { name: "Flax Seeds 250g", category: "Grains", price: 90 },
  { name: "White Rice Premium 5kg", category: "Grains", price: 420 },

  // Bakery (12 items)
  { name: "Whole Wheat Bread 400g", category: "Bakery", price: 45 },
  { name: "Croissants Butter 4pc", category: "Bakery", price: 120 },
  { name: "Chocolate Cake 500g", category: "Bakery", price: 360 },
  { name: "Chocolate Cookies 10pc", category: "Bakery", price: 85 },
  { name: "Garlic Bread Loaf", category: "Bakery", price: 80 },
  { name: "Blueberry Muffins 4pc", category: "Bakery", price: 145 },
  { name: "Bagels Pack 5pc", category: "Bakery", price: 110 },
  { name: "Burger Buns 4pc", category: "Bakery", price: 50 },
  { name: "Apple Pie 500g", category: "Bakery", price: 280 },
  { name: "Sourdough Bread 500g", category: "Bakery", price: 95 },
  { name: "Pita Bread Pack 6pc", category: "Bakery", price: 70 },
  { name: "Vanilla Muffins 4pc", category: "Bakery", price: 130 },

  // Instant (12 items)
  { name: "Maggi Noodles 280g", category: "Instant", price: 60 },
  { name: "Tomato Soup Pack 4pc", category: "Instant", price: 38 },
  { name: "Pasta Kit Italian", category: "Instant", price: 115 },
  { name: "Potato Chips Salted 150g", category: "Instant", price: 48 },
  { name: "Cup Noodles Spicy 80g", category: "Instant", price: 45 },
  { name: "Instant Oatmeal 1kg", category: "Instant", price: 120 },
  { name: "Mac & Cheese Cup", category: "Instant", price: 80 },
  { name: "Popcorn Butter Pack", category: "Instant", price: 65 },
  { name: "Instant Ramen Bowl", category: "Instant", price: 110 },
  { name: "Corn Flakes Pack 500g", category: "Instant", price: 150 },
  { name: "Muesli Fruit Mix 500g", category: "Instant", price: 220 },
  { name: "Instant Poha Pack 200g", category: "Instant", price: 40 },
];

// Transform baseProducts into database-ready formats
const dummyProducts = baseProducts.map((p, index) => {
  const discountRate = 0.85 + (index % 10) * 0.01;
  const offerPrice = Math.round(p.price * discountRate);

  const reviews = [];
  if (index < 30) {
    const reviewers = ["Madhav", "Shreya", "Amit", "Kunal", "Aisha", "Divya", "Rahul", "Sara"];
    const comments = [
      "Outstanding quality! Exceeded my expectations.",
      "Very fresh and delivered super fast.",
      "Good product, value for money.",
      "Decent quality, packaging could be better.",
      "Great taste and extremely fresh!"
    ];
    const numReviews = 1 + (index % 4);
    for (let r = 0; r < numReviews; r++) {
      reviews.push({
        userId: new mongoose.Types.ObjectId(),
        userName: reviewers[(index + r) % reviewers.length],
        rating: 4 + (r % 2),
        comment: comments[(index + r) % comments.length],
        createdAt: new Date(Date.now() - (r * 24 * 60 * 60 * 1000)),
      });
    }
  }

  return {
    name: p.name,
    price: p.price,
    offerPrice: offerPrice,
    description: [
      `Fresh and selected premium ${p.name.toLowerCase()}`,
      `Handpicked high-quality source from our ${p.category} department`,
      `Stored under temperature-controlled delivery environment`
    ],
    category: p.category,
    image: buildProductImages(p.name, p.category),
    inStock: index % 20 !== 0,
    reviews: reviews,
  };
});

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    await Product.deleteMany({});
    console.log("Cleared existing products in database");

    const result = await Product.insertMany(dummyProducts);
    console.log(`✅ Successfully added ${result.length} products with LoremFlickr images!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
