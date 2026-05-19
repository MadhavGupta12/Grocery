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
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
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
      "https://images.unsplash.com/photo-1595855759920-86582396756a?w=400",
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
      "https://images.unsplash.com/photo-1538582709238-0a503bd5ae04?w=400",
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
      "https://images.unsplash.com/photo-1551304725-6f16801f1086?w=400",
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
      "https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=400",
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
      "https://images.unsplash.com/photo-1515671029095-2c8d2ee132a8?w=400",
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
      "https://images.unsplash.com/photo-1563565080-1acab42a70e5?w=400",
      "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400",
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
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400",
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
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400",
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
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400",
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
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400",
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
      "https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=400",
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
      "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400",
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
      "https://images.unsplash.com/photo-1587883012610-e2dbf3cd1431?w=400",
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
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
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
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400",
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
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400",
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
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400",
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
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      "https://images.unsplash.com/photo-1571244856353-fb06f699327e?w=400",
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

  // Drinks
  {
    name: "Coca-Cola 1.5L",
    price: 80,
    offerPrice: 75,
    description: ["Refreshing and fizzy", "Perfect for parties", "Best served chilled"],
    category: "Drinks",
    image: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
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
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
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
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400",
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
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400",
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
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
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
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
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
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
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
  {
    name: "Organic Oats 1kg",
    price: 140,
    offerPrice: 125,
    description: ["100% whole grain rolled oats", "High in soluble fiber", "Perfect for a healthy breakfast"],
    category: "Grains",
    image: [
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400",
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
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
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
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
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
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
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
      "https://images.unsplash.com/photo-1558961309-dbdf000a127b?w=400",
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
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
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
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
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
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
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
