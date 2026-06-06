import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

const baseProducts = [
  { name: "Organic Potato 1kg", category: "Vegetables", price: 30, id: 201 },
  { name: "Fresh Tomato 1kg", category: "Vegetables", price: 45, id: 202 },
  { name: "Sweet Carrot 500g", category: "Vegetables", price: 35, id: 203 },
  { name: "Green Spinach Bunch", category: "Vegetables", price: 20, id: 204 },
  { name: "Red Onion 1kg", category: "Vegetables", price: 25, id: 205 },
  { name: "Green Broccoli 1pc", category: "Vegetables", price: 65, id: 206 },
  { name: "Cauliflower 1pc", category: "Vegetables", price: 55, id: 207 },
  { name: "Bell Peppers Mix 3pc", category: "Vegetables", price: 50, id: 208 },
  { name: "Fresh Cucumber 500g", category: "Vegetables", price: 28, id: 209 },
  { name: "Sweet Corn 2pc", category: "Vegetables", price: 40, id: 210 },
  { name: "Fresh Ginger 250g", category: "Vegetables", price: 15, id: 211 },
  { name: "Garlic Bulbs 200g", category: "Vegetables", price: 18, id: 212 },
  { name: "Green Chilli 100g", category: "Vegetables", price: 10, id: 213 },
  { name: "Fresh Cabbage 1pc", category: "Vegetables", price: 32, id: 214 },
  { name: "Zucchini Green 500g", category: "Vegetables", price: 48, id: 215 },
  { name: "Yellow Bell Pepper 2pc", category: "Vegetables", price: 42, id: 216 },
  { name: "Organic Spinach 250g", category: "Vegetables", price: 24, id: 217 },
  { name: "Red Apple 1kg", category: "Fruits", price: 130, id: 218 },
  { name: "Fresh Orange 1kg", category: "Fruits", price: 85, id: 219 },
  { name: "Ripe Banana 1 Dozen", category: "Fruits", price: 55, id: 220 },
  { name: "Alphonso Mango 1kg", category: "Fruits", price: 160, id: 221 },
  { name: "Seedless Grapes 500g", category: "Fruits", price: 75, id: 222 },
  { name: "Strawberries Pack 250g", category: "Fruits", price: 95, id: 223 },
  { name: "Sweet Pineapple 1pc", category: "Fruits", price: 105, id: 224 },
  { name: "Watermelon 1pc", category: "Fruits", price: 95, id: 225 },
  { name: "Hass Avocado 2pc", category: "Fruits", price: 190, id: 226 },
  { name: "Pomegranate 1kg", category: "Fruits", price: 165, id: 227 },
  { name: "Blueberries Box 125g", category: "Fruits", price: 140, id: 228 },
  { name: "Kiwi Fruit 3pc", category: "Fruits", price: 80, id: 229 },
  { name: "Fresh Papaya 1pc", category: "Fruits", price: 70, id: 230 },
  { name: "Sweet Pear 1kg", category: "Fruits", price: 90, id: 231 },
  { name: "Green Lime 250g", category: "Fruits", price: 15, id: 232 },
  { name: "Green Apple 1kg", category: "Fruits", price: 120, id: 233 },
  { name: "Sweet Cherry 250g", category: "Fruits", price: 85, id: 234 },
  { name: "Whole Milk 1L", category: "Dairy", price: 65, id: 235 },
  { name: "Organic Paneer 200g", category: "Dairy", price: 95, id: 236 },
  { name: "Fresh Eggs 12pc", category: "Dairy", price: 95, id: 237 },
  { name: "Cheddar Cheese 200g", category: "Dairy", price: 145, id: 238 },
  { name: "Greek Yogurt 500g", category: "Dairy", price: 115, id: 239 },
  { name: "Salted Butter 500g", category: "Dairy", price: 185, id: 240 },
  { name: "Mozzarella Cheese 200g", category: "Dairy", price: 155, id: 241 },
  { name: "Almond Milk 1L", category: "Dairy", price: 210, id: 242 },
  { name: "Fresh Cream 200ml", category: "Dairy", price: 70, id: 243 },
  { name: "Soy Milk Organic 1L", category: "Dairy", price: 180, id: 244 },
  { name: "Cottage Cheese 250g", category: "Dairy", price: 85, id: 245 },
  { name: "Sour Cream 200g", category: "Dairy", price: 75, id: 246 },
  { name: "Buttermilk Fresh 1L", category: "Dairy", price: 40, id: 247 },
  { name: "Whipped Cream Spray", category: "Dairy", price: 120, id: 248 },
  { name: "Pure Ghee 1L", category: "Dairy", price: 650, id: 249 },
  { name: "Coca-Cola 1.5L", category: "Drinks", price: 85, id: 250 },
  { name: "Pepsi Cola 1.5L", category: "Drinks", price: 80, id: 251 },
  { name: "Orange Juice 1L", category: "Drinks", price: 125, id: 252 },
  { name: "Green Tea Pack (25 Bags)", category: "Drinks", price: 155, id: 253 },
  { name: "Sparkling Water 500ml", category: "Drinks", price: 50, id: 254 },
  { name: "Cold Brew Coffee 250ml", category: "Drinks", price: 115, id: 255 },
  { name: "Lemon Iced Tea 1L", category: "Drinks", price: 105, id: 256 },
  { name: "Apple Cider 1L", category: "Drinks", price: 140, id: 257 },
  { name: "Coconut Water 500ml", category: "Drinks", price: 60, id: 258 },
  { name: "Tomato Juice 1L", category: "Drinks", price: 95, id: 259 },
  { name: "Pineapple Juice 1L", category: "Drinks", price: 110, id: 260 },
  { name: "Ginger Ale 330ml", category: "Drinks", price: 70, id: 261 },
  { name: "Energy Drink Can", category: "Drinks", price: 120, id: 262 },
  { name: "Mineral Water 1L", category: "Drinks", price: 20, id: 263 },
  { name: "Basmati Rice 5kg", category: "Grains", price: 560, id: 264 },
  { name: "Wheat Flour 5kg", category: "Grains", price: 260, id: 265 },
  { name: "Brown Rice 1kg", category: "Grains", price: 125, id: 266 },
  { name: "Organic Oats 1kg", category: "Grains", price: 145, id: 267 },
  { name: "Organic Quinoa 500g", category: "Grains", price: 205, id: 268 },
  { name: "Red Lentils 1kg", category: "Grains", price: 95, id: 269 },
  { name: "Yellow Moong Dal 1kg", category: "Grains", price: 110, id: 270 },
  { name: "Chickpeas 1kg", category: "Grains", price: 120, id: 271 },
  { name: "Black Beans 1kg", category: "Grains", price: 130, id: 272 },
  { name: "Barley Seeds 1kg", category: "Grains", price: 85, id: 273 },
  { name: "Chia Seeds 250g", category: "Grains", price: 150, id: 274 },
  { name: "Flax Seeds 250g", category: "Grains", price: 90, id: 275 },
  { name: "White Rice Premium 5kg", category: "Grains", price: 420, id: 276 },
  { name: "Whole Wheat Bread 400g", category: "Bakery", price: 45, id: 277 },
  { name: "Croissants Butter 4pc", category: "Bakery", price: 120, id: 278 },
  { name: "Chocolate Cake 500g", category: "Bakery", price: 360, id: 279 },
  { name: "Chocolate Cookies 10pc", category: "Bakery", price: 85, id: 280 },
  { name: "Garlic Bread Loaf", category: "Bakery", price: 80, id: 281 },
  { name: "Blueberry Muffins 4pc", category: "Bakery", price: 145, id: 282 },
  { name: "Bagels Pack 5pc", category: "Bakery", price: 110, id: 283 },
  { name: "Burger Buns 4pc", category: "Bakery", price: 50, id: 284 },
  { name: "Apple Pie 500g", category: "Bakery", price: 280, id: 285 },
  { name: "Sourdough Bread 500g", category: "Bakery", price: 95, id: 286 },
  { name: "Pita Bread Pack 6pc", category: "Bakery", price: 70, id: 287 },
  { name: "Vanilla Muffins 4pc", category: "Bakery", price: 130, id: 288 },
  { name: "Maggi Noodles 280g", category: "Instant", price: 60, id: 289 },
  { name: "Tomato Soup Pack 4pc", category: "Instant", price: 38, id: 290 },
  { name: "Pasta Kit Italian", category: "Instant", price: 115, id: 291 },
  { name: "Potato Chips Salted 150g", category: "Instant", price: 48, id: 292 },
  { name: "Cup Noodles Spicy 80g", category: "Instant", price: 45, id: 293 },
  { name: "Instant Oatmeal 1kg", category: "Instant", price: 120, id: 294 },
  { name: "Mac & Cheese Cup", category: "Instant", price: 80, id: 295 },
  { name: "Popcorn Butter Pack", category: "Instant", price: 65, id: 296 },
  { name: "Instant Ramen Bowl", category: "Instant", price: 110, id: 297 },
  { name: "Corn Flakes Pack 500g", category: "Instant", price: 150, id: 298 },
  { name: "Muesli Fruit Mix 500g", category: "Instant", price: 220, id: 299 },
  { name: "Instant Poha Pack 200g", category: "Instant", price: 40, id: 300 },
];

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
    image: [`https://picsum.photos/400/300?random=${p.id}`],
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
    console.log(`✅ Successfully added ${result.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
