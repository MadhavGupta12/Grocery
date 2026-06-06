import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

// Product-specific image mapping using Pexels CDN
const imageMap = {
  // Vegetables
  "Organic Potato 1kg": "https://images.pexels.com/photos/4552771/pexels-photo-4552771.jpeg?w=400",
  "Fresh Tomato 1kg": "https://images.pexels.com/photos/265827/pexels-photo-265827.jpeg?w=400",
  "Sweet Carrot 500g": "https://images.pexels.com/photos/3600607/pexels-photo-3600607.jpeg?w=400",
  "Green Spinach Bunch": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400",
  "Red Onion 1kg": "https://images.pexels.com/photos/3771808/pexels-photo-3771808.jpeg?w=400",
  "Green Broccoli 1pc": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400",
  "Cauliflower 1pc": "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?w=400",
  "Bell Peppers Mix 3pc": "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?w=400",
  "Fresh Cucumber 500g": "https://images.pexels.com/photos/5407667/pexels-photo-5407667.jpeg?w=400",
  "Sweet Corn 2pc": "https://images.pexels.com/photos/6298720/pexels-photo-6298720.jpeg?w=400",
  "Fresh Ginger 250g": "https://images.pexels.com/photos/5407624/pexels-photo-5407624.jpeg?w=400",
  "Garlic Bulbs 200g": "https://images.pexels.com/photos/5407623/pexels-photo-5407623.jpeg?w=400",
  "Green Chilli 100g": "https://images.pexels.com/photos/5407661/pexels-photo-5407661.jpeg?w=400",
  "Fresh Cabbage 1pc": "https://images.pexels.com/photos/6455814/pexels-photo-6455814.jpeg?w=400",
  "Zucchini Green 500g": "https://images.pexels.com/photos/5407662/pexels-photo-5407662.jpeg?w=400",
  "Yellow Bell Pepper 2pc": "https://images.pexels.com/photos/6456221/pexels-photo-6456221.jpeg?w=400",
  "Organic Spinach 250g": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=400",

  // Fruits
  "Red Apple 1kg": "https://images.pexels.com/photos/97294/pexels-photo-97294.jpeg?w=400",
  "Fresh Orange 1kg": "https://images.pexels.com/photos/5407629/pexels-photo-5407629.jpeg?w=400",
  "Ripe Banana 1 Dozen": "https://images.pexels.com/photos/5407636/pexels-photo-5407636.jpeg?w=400",
  "Alphonso Mango 1kg": "https://images.pexels.com/photos/5407637/pexels-photo-5407637.jpeg?w=400",
  "Seedless Grapes 500g": "https://images.pexels.com/photos/5407638/pexels-photo-5407638.jpeg?w=400",
  "Strawberries Pack 250g": "https://images.pexels.com/photos/5407627/pexels-photo-5407627.jpeg?w=400",
  "Sweet Pineapple 1pc": "https://images.pexels.com/photos/5407639/pexels-photo-5407639.jpeg?w=400",
  "Watermelon 1pc": "https://images.pexels.com/photos/5407640/pexels-photo-5407640.jpeg?w=400",
  "Hass Avocado 2pc": "https://images.pexels.com/photos/5407641/pexels-photo-5407641.jpeg?w=400",
  "Pomegranate 1kg": "https://images.pexels.com/photos/5407642/pexels-photo-5407642.jpeg?w=400",
  "Blueberries Box 125g": "https://images.pexels.com/photos/5407625/pexels-photo-5407625.jpeg?w=400",
  "Kiwi Fruit 3pc": "https://images.pexels.com/photos/5407643/pexels-photo-5407643.jpeg?w=400",
  "Fresh Papaya 1pc": "https://images.pexels.com/photos/5407644/pexels-photo-5407644.jpeg?w=400",
  "Sweet Pear 1kg": "https://images.pexels.com/photos/5407645/pexels-photo-5407645.jpeg?w=400",
  "Green Lime 250g": "https://images.pexels.com/photos/5407646/pexels-photo-5407646.jpeg?w=400",
  "Green Apple 1kg": "https://images.pexels.com/photos/4552771/pexels-photo-4552771.jpeg?w=400",
  "Sweet Cherry 250g": "https://images.pexels.com/photos/5407647/pexels-photo-5407647.jpeg?w=400",

  // Dairy
  "Whole Milk 1L": "https://images.pexels.com/photos/5407622/pexels-photo-5407622.jpeg?w=400",
  "Organic Paneer 200g": "https://images.pexels.com/photos/6935333/pexels-photo-6935333.jpeg?w=400",
  "Fresh Eggs 12pc": "https://images.pexels.com/photos/5407648/pexels-photo-5407648.jpeg?w=400",
  "Cheddar Cheese 200g": "https://images.pexels.com/photos/5407649/pexels-photo-5407649.jpeg?w=400",
  "Greek Yogurt 500g": "https://images.pexels.com/photos/5407650/pexels-photo-5407650.jpeg?w=400",
  "Salted Butter 500g": "https://images.pexels.com/photos/5407651/pexels-photo-5407651.jpeg?w=400",
  "Mozzarella Cheese 200g": "https://images.pexels.com/photos/5407652/pexels-photo-5407652.jpeg?w=400",
  "Almond Milk 1L": "https://images.pexels.com/photos/5407653/pexels-photo-5407653.jpeg?w=400",
  "Fresh Cream 200ml": "https://images.pexels.com/photos/5407654/pexels-photo-5407654.jpeg?w=400",
  "Soy Milk Organic 1L": "https://images.pexels.com/photos/5407655/pexels-photo-5407655.jpeg?w=400",
  "Cottage Cheese 250g": "https://images.pexels.com/photos/5407656/pexels-photo-5407656.jpeg?w=400",
  "Sour Cream 200g": "https://images.pexels.com/photos/5407657/pexels-photo-5407657.jpeg?w=400",
  "Buttermilk Fresh 1L": "https://images.pexels.com/photos/5407658/pexels-photo-5407658.jpeg?w=400",
  "Whipped Cream Spray": "https://images.pexels.com/photos/5407659/pexels-photo-5407659.jpeg?w=400",
  "Pure Ghee 1L": "https://images.pexels.com/photos/5407660/pexels-photo-5407660.jpeg?w=400",

  // Drinks
  "Coca-Cola 1.5L": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400",
  "Pepsi Cola 1.5L": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400",
  "Orange Juice 1L": "https://images.pexels.com/photos/5407621/pexels-photo-5407621.jpeg?w=400",
  "Green Tea Pack (25 Bags)": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=400",
  "Sparkling Water 500ml": "https://images.pexels.com/photos/5407620/pexels-photo-5407620.jpeg?w=400",
  "Cold Brew Coffee 250ml": "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?w=400",
  "Lemon Iced Tea 1L": "https://images.pexels.com/photos/5407619/pexels-photo-5407619.jpeg?w=400",
  "Apple Cider 1L": "https://images.pexels.com/photos/5407618/pexels-photo-5407618.jpeg?w=400",
  "Coconut Water 500ml": "https://images.pexels.com/photos/5407617/pexels-photo-5407617.jpeg?w=400",
  "Tomato Juice 1L": "https://images.pexels.com/photos/5407616/pexels-photo-5407616.jpeg?w=400",
  "Pineapple Juice 1L": "https://images.pexels.com/photos/5407615/pexels-photo-5407615.jpeg?w=400",
  "Ginger Ale 330ml": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400",
  "Energy Drink Can": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400",
  "Mineral Water 1L": "https://images.pexels.com/photos/5407614/pexels-photo-5407614.jpeg?w=400",

  // Grains
  "Basmati Rice 5kg": "https://images.pexels.com/photos/5407613/pexels-photo-5407613.jpeg?w=400",
  "Wheat Flour 5kg": "https://images.pexels.com/photos/5407612/pexels-photo-5407612.jpeg?w=400",
  "Brown Rice 1kg": "https://images.pexels.com/photos/5407611/pexels-photo-5407611.jpeg?w=400",
  "Organic Oats 1kg": "https://images.pexels.com/photos/5407610/pexels-photo-5407610.jpeg?w=400",
  "Organic Quinoa 500g": "https://images.pexels.com/photos/5407609/pexels-photo-5407609.jpeg?w=400",
  "Red Lentils 1kg": "https://images.pexels.com/photos/5407608/pexels-photo-5407608.jpeg?w=400",
  "Yellow Moong Dal 1kg": "https://images.pexels.com/photos/5407607/pexels-photo-5407607.jpeg?w=400",
  "Chickpeas 1kg": "https://images.pexels.com/photos/5407606/pexels-photo-5407606.jpeg?w=400",
  "Black Beans 1kg": "https://images.pexels.com/photos/5407605/pexels-photo-5407605.jpeg?w=400",
  "Barley Seeds 1kg": "https://images.pexels.com/photos/5407604/pexels-photo-5407604.jpeg?w=400",
  "Chia Seeds 250g": "https://images.pexels.com/photos/5407603/pexels-photo-5407603.jpeg?w=400",
  "Flax Seeds 250g": "https://images.pexels.com/photos/5407602/pexels-photo-5407602.jpeg?w=400",
  "White Rice Premium 5kg": "https://images.pexels.com/photos/5407601/pexels-photo-5407601.jpeg?w=400",

  // Bakery
  "Whole Wheat Bread 400g": "https://images.pexels.com/photos/5407600/pexels-photo-5407600.jpeg?w=400",
  "Croissants Butter 4pc": "https://images.pexels.com/photos/5407599/pexels-photo-5407599.jpeg?w=400",
  "Chocolate Cake 500g": "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?w=400",
  "Chocolate Cookies 10pc": "https://images.pexels.com/photos/5407597/pexels-photo-5407597.jpeg?w=400",
  "Garlic Bread Loaf": "https://images.pexels.com/photos/5407596/pexels-photo-5407596.jpeg?w=400",
  "Blueberry Muffins 4pc": "https://images.pexels.com/photos/5407595/pexels-photo-5407595.jpeg?w=400",
  "Bagels Pack 5pc": "https://images.pexels.com/photos/5407594/pexels-photo-5407594.jpeg?w=400",
  "Burger Buns 4pc": "https://images.pexels.com/photos/5407593/pexels-photo-5407593.jpeg?w=400",
  "Apple Pie 500g": "https://images.pexels.com/photos/5407592/pexels-photo-5407592.jpeg?w=400",
  "Sourdough Bread 500g": "https://images.pexels.com/photos/5407591/pexels-photo-5407591.jpeg?w=400",
  "Pita Bread Pack 6pc": "https://images.pexels.com/photos/5407590/pexels-photo-5407590.jpeg?w=400",
  "Vanilla Muffins 4pc": "https://images.pexels.com/photos/5407589/pexels-photo-5407589.jpeg?w=400",

  // Instant
  "Maggi Noodles 280g": "https://images.pexels.com/photos/5407588/pexels-photo-5407588.jpeg?w=400",
  "Tomato Soup Pack 4pc": "https://images.pexels.com/photos/5407587/pexels-photo-5407587.jpeg?w=400",
  "Pasta Kit Italian": "https://images.pexels.com/photos/5407586/pexels-photo-5407586.jpeg?w=400",
  "Potato Chips Salted 150g": "https://images.pexels.com/photos/5407585/pexels-photo-5407585.jpeg?w=400",
  "Cup Noodles Spicy 80g": "https://images.pexels.com/photos/5407584/pexels-photo-5407584.jpeg?w=400",
  "Instant Oatmeal 1kg": "https://images.pexels.com/photos/5407583/pexels-photo-5407583.jpeg?w=400",
  "Mac & Cheese Cup": "https://images.pexels.com/photos/5407582/pexels-photo-5407582.jpeg?w=400",
  "Popcorn Butter Pack": "https://images.pexels.com/photos/5407581/pexels-photo-5407581.jpeg?w=400",
  "Instant Ramen Bowl": "https://images.pexels.com/photos/5407580/pexels-photo-5407580.jpeg?w=400",
  "Corn Flakes Pack 500g": "https://images.pexels.com/photos/5407579/pexels-photo-5407579.jpeg?w=400",
  "Muesli Fruit Mix 500g": "https://images.pexels.com/photos/5407578/pexels-photo-5407578.jpeg?w=400",
  "Instant Poha Pack 200g": "https://images.pexels.com/photos/5407577/pexels-photo-5407577.jpeg?w=400",
};

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
    image: [imageMap[p.name] || "https://via.placeholder.com/400"],
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
    console.log(`✅ Successfully added ${result.length} products with specific images!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
