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
      "potato_image_1.png",
      "potato_image_2.png",
      "potato_image_3.png",
      "potato_image_4.png",
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
      "tomato_image.png",
      "tomato_image_2.png",
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
      "carrot_image.png",
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
      "spinach_image_1.png",
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
      "onion_image_1.png",
    ],
    inStock: true,
  },
  {
    name: "Broccoli 1pc",
    price: 60,
    offerPrice: 50,
    description: ["High in fiber and protein", "Fresh green broccoli heads", "Perfect for salads and steaming"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400",
    ],
    inStock: true,
  },
  {
    name: "Capsicum Mix 500g",
    price: 45,
    offerPrice: 40,
    description: ["Fresh red, yellow, and green bell peppers", "Rich in antioxidants", "Great for stir-fry"],
    category: "Vegetables",
    image: [
      "capsicum_mix.png",
    ],
    inStock: true,
  },
  {
    name: "Cauliflower 1pc",
    price: 50,
    offerPrice: 42,
    description: ["Farm fresh cauliflower", "Rich in vitamin C and K", "Great for roasted cauliflower or curries"],
    category: "Vegetables",
    image: [
      "cauliflower.png",
    ],
    inStock: true,
  },
  {
    name: "Sweet Corn 2pcs",
    price: 35,
    offerPrice: 30,
    description: ["Golden sweet corn cobs", "Naturally sweet and juicy", "Perfect for boiling, grilling or salads"],
    category: "Vegetables",
    image: [
      "sweet_corn.png",
    ],
    inStock: true,
  },
  {
    name: "Cucumber 500g",
    price: 25,
    offerPrice: 20,
    description: ["Crunchy and hydrating cucumbers", "High water content", "Great for green salads and raita"],
    category: "Vegetables",
    image: [
      "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400",
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
      "apple_image.png",
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
      "orange_image.png",
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
      "banana_image_1.png",
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
      "mango_image_1.png",
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
      "grapes_image_1.png",
    ],
    inStock: true,
  },
  {
    name: "Strawberries 250g",
    price: 90,
    offerPrice: 80,
    description: ["Sweet and slightly tart red strawberries", "Packed with vitamins and fiber", "Great for desserts"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
    ],
    inStock: true,
  },
  {
    name: "Pineapple 1pc",
    price: 100,
    offerPrice: 85,
    description: ["Sweet tropical pineapple", "Juicy and ready to slice", "Rich in Vitamin C"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400",
    ],
    inStock: true,
  },
  {
    name: "Watermelon 1pc",
    price: 90,
    offerPrice: 75,
    description: ["Sweet and highly hydrating watermelon", "Perfect for hot summer days", "Rich in lycopene"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    ],
    inStock: true,
  },
  {
    name: "Avocado 2pcs",
    price: 180,
    offerPrice: 160,
    description: ["Creamy Hass avocados", "Rich in healthy monounsaturated fats", "Perfect for guacamole or toast"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400",
    ],
    inStock: true,
  },
  {
    name: "Pomegranate 1kg",
    price: 160,
    offerPrice: 145,
    description: ["Juicy ruby-red arils", "Loaded with powerful antioxidants", "Great for snacking or salads"],
    category: "Fruits",
    image: [
      "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400",
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
      "amul_milk_image.png",
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
      "paneer_image.png",
      "paneer_image_2.png",
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
      "eggs_image.png",
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
      "cheese_image.png",
    ],
    inStock: true,
  },
  {
    name: "Greek Yogurt 500g",
    price: 110,
    offerPrice: 95,
    description: ["Thick and creamy unsweetened Greek yogurt", "High in protein", "Perfect with honey and fruits"],
    category: "Dairy",
    image: [
      "yogurt_image_1.png",
    ],
    inStock: true,
  },
  {
    name: "Salted Butter 500g",
    price: 180,
    offerPrice: 165,
    description: ["Rich and creamy butter", "Perfect for baking and spreading", "Slightly salted"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400",
    ],
    inStock: true,
  },
  {
    name: "Mozzarella Cheese 200g",
    price: 150,
    offerPrice: 135,
    description: ["Classic fresh stretch mozzarella", "Perfect for pizza toppings and salads", "Deliciously mild and creamy"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1559561853-084cf17f2882?w=400",
    ],
    inStock: true,
  },
  {
    name: "Almond Milk 1L",
    price: 199,
    offerPrice: 175,
    description: ["Unsweetened dairy-free almond milk", "Great source of Vitamin E", "Perfect vegan alternative"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=400",
    ],
    inStock: true,
  },
  {
    name: "Fresh Cream 200g",
    price: 65,
    offerPrice: 58,
    description: ["Thick and rich milk cream", "Enhances taste of curries and desserts", "Great for whipping"],
    category: "Dairy",
    image: [
      "https://images.unsplash.com/photo-1528642637335-125916304897?w=400",
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
      "coca_cola_image.png",
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
      "pepsi_image.png",
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
  {
    name: "Green Tea Pack (25 bags)",
    price: 150,
    offerPrice: 130,
    description: ["Antioxidant-rich green tea bags", "100% natural green tea leaves", "Calming and refreshing"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400",
    ],
    inStock: true,
  },
  {
    name: "Sparkling Water 500ml",
    price: 45,
    offerPrice: 35,
    description: ["Crisp and zero-calorie sparkling water", "Perfect alternative to sodas", "Best served chilled"],
    category: "Drinks",
    image: [
      "sprite_image_1.png",
    ],
    inStock: true,
  },
  {
    name: "Cold Brew Coffee 250ml",
    price: 110,
    offerPrice: 95,
    description: ["Steeped overnight for maximum smoothness", "Bold and strong black coffee", "Ready to drink"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400",
    ],
    inStock: true,
  },
  {
    name: "Lemon Iced Tea 1L",
    price: 99,
    offerPrice: 85,
    description: ["Classic iced tea brewed with lemon extracts", "Sweet and refreshing", "Best served over ice"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
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
      "basmati_rice_image.png",
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
      "wheat_flour_image.png",
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
      "brown_rice_image.png",
    ],
    inStock: true,
  },
  {
    name: "Organic Oats 1kg",
    price: 140,
    offerPrice: 125,
    description: ["100% whole grain rolled oats", "High in soluble fiber", "Perfect for a healthy breakfast"],
    category: "Grains",
    image: [
      "maggi_oats_image.png",
    ],
    inStock: true,
  },
  {
    name: "Organic Quinoa 500g",
    price: 199,
    offerPrice: 180,
    description: ["High in protein and gluten-free", "Rich in amino acids", "Perfect grain replacement"],
    category: "Grains",
    image: [
      "quinoa_image.png",
    ],
    inStock: true,
  },
  {
    name: "Red Lentils (Masoor) 1kg",
    price: 90,
    offerPrice: 80,
    description: ["Premium split red lentils", "Cooks quickly and digests easily", "Essential source of vegan protein"],
    category: "Grains",
    image: [
      "https://images.unsplash.com/photo-1515942900766-b2a8ed0db35f?w=400",
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
      "brown_bread_image.png",
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
      "butter_croissant_image.png",
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
      "chocolate_cake_image.png",
    ],
    inStock: true,
  },
  {
    name: "Chocolate Chip Cookies (10pcs)",
    price: 80,
    offerPrice: 70,
    description: ["Crispy edges with soft centers", "Loaded with real chocolate chips", "Freshly baked daily"],
    category: "Bakery",
    image: [
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
    ],
    inStock: true,
  },
  {
    name: "Garlic Bread Sticks",
    price: 75,
    offerPrice: 65,
    description: ["Buttered bread sticks with garlic and herb seasoning", "Crispy on the outside, soft on the inside", "Best served warm"],
    category: "Bakery",
    image: [
      "garlic_bread.png",
    ],
    inStock: true,
  },
  {
    name: "Blueberry Muffins (4pcs)",
    price: 140,
    offerPrice: 120,
    description: ["Freshly baked soft muffins with blueberries", "Sweet and moist crumbs", "Great tea-time snack"],
    category: "Bakery",
    image: [
      "vanilla_muffins_image.png",
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
      "maggi_image.png",
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
      "knorr_soup_image.png",
    ],
    inStock: true,
  },
  {
    name: "Pasta Kit 300g",
    price: 110,
    offerPrice: 90,
    description: ["Instant pasta with cheese and tomato sauce mix", "Made in 5 minutes", "Delicious Italian seasoning"],
    category: "Instant",
    image: [
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
    ],
    inStock: true,
  },
  {
    name: "Salted Potato Chips 150g",
    price: 45,
    offerPrice: 38,
    description: ["Thinly sliced crispy potato chips", "Perfectly salted", "Great side-snack for movies and parties"],
    category: "Instant",
    image: [
      "https://images.unsplash.com/photo-1566478989037-eec170784d20?w=400",
    ],
    inStock: true,
  },
  {
    name: "Instant Cup Noodles 80g",
    price: 40,
    offerPrice: 35,
    description: ["Just add hot water and eat", "Flavored with delicious spices and dried veggies", "Ideal travel food"],
    category: "Instant",
    image: [
      "yippee_image.png",
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
