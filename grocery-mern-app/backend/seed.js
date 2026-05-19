import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

const baseProducts = [
  // Vegetables (17 items)
  { name: "Organic Potato 1kg", category: "Vegetables", price: 30, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400" },
  { name: "Fresh Tomato 1kg", category: "Vegetables", price: 45, image: "https://images.unsplash.com/photo-1546470427083-8dd2ad83d97e?w=400" },
  { name: "Sweet Carrot 500g", category: "Vegetables", price: 35, image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400" },
  { name: "Green Spinach Bunch", category: "Vegetables", price: 20, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
  { name: "Red Onion 1kg", category: "Vegetables", price: 25, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400" },
  { name: "Green Broccoli 1pc", category: "Vegetables", price: 65, image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400" },
  { name: "Cauliflower 1pc", category: "Vegetables", price: 55, image: "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400" },
  { name: "Bell Peppers Mix 3pc", category: "Vegetables", price: 50, image: "https://images.unsplash.com/photo-1563565087-925b487a35c2?w=400" },
  { name: "Fresh Cucumber 500g", category: "Vegetables", price: 28, image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400" },
  { name: "Sweet Corn 2pc", category: "Vegetables", price: 40, image: "https://images.unsplash.com/photo-1551754655-cd27e38d20f6?w=400" },
  { name: "Fresh Ginger 250g", category: "Vegetables", price: 15, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400" },
  { name: "Garlic Bulbs 200g", category: "Vegetables", price: 18, image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400" },
  { name: "Green Chilli 100g", category: "Vegetables", price: 10, image: "https://images.unsplash.com/photo-1588252303782-cb80119cb665?w=400" },
  { name: "Fresh Cabbage 1pc", category: "Vegetables", price: 32, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400" },
  { name: "Zucchini Green 500g", category: "Vegetables", price: 48, image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400" },
  { name: "Yellow Bell Pepper 2pc", category: "Vegetables", price: 42, image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400" },
  { name: "Organic Spinach 250g", category: "Vegetables", price: 24, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },

  // Fruits (17 items)
  { name: "Red Apple 1kg", category: "Fruits", price: 130, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { name: "Fresh Orange 1kg", category: "Fruits", price: 85, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400" },
  { name: "Ripe Banana 1 Dozen", category: "Fruits", price: 55, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" },
  { name: "Alphonso Mango 1kg", category: "Fruits", price: 160, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400" },
  { name: "Seedless Grapes 500g", category: "Fruits", price: 75, image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400" },
  { name: "Strawberries Pack 250g", category: "Fruits", price: 95, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400" },
  { name: "Sweet Pineapple 1pc", category: "Fruits", price: 105, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400" },
  { name: "Watermelon 1pc", category: "Fruits", price: 95, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
  { name: "Hass Avocado 2pc", category: "Fruits", price: 190, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400" },
  { name: "Pomegranate 1kg", category: "Fruits", price: 165, image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400" },
  { name: "Blueberries Box 125g", category: "Fruits", price: 140, image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400" },
  { name: "Kiwi Fruit 3pc", category: "Fruits", price: 80, image: "https://images.unsplash.com/photo-1585059895524-72359e061381?w=400" },
  { name: "Fresh Papaya 1pc", category: "Fruits", price: 70, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400" },
  { name: "Sweet Pear 1kg", category: "Fruits", price: 90, image: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400" },
  { name: "Green Lime 250g", category: "Fruits", price: 15, image: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400" },
  { name: "Green Apple 1kg", category: "Fruits", price: 120, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { name: "Sweet Cherry 250g", category: "Fruits", price: 85, image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400" },

  // Dairy (15 items)
  { name: "Whole Milk 1L", category: "Dairy", price: 65, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400" },
  { name: "Organic Paneer 200g", category: "Dairy", price: 95, image: "https://images.unsplash.com/photo-1628294895550-90057bef8a9d?w=400" },
  { name: "Fresh Eggs 12pc", category: "Dairy", price: 95, image: "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=400" },
  { name: "Cheddar Cheese 200g", category: "Dairy", price: 145, image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400" },
  { name: "Greek Yogurt 500g", category: "Dairy", price: 115, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400" },
  { name: "Salted Butter 500g", category: "Dairy", price: 185, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400" },
  { name: "Mozzarella Cheese 200g", category: "Dairy", price: 155, image: "https://images.unsplash.com/photo-1559561853-084cf17f2882?w=400" },
  { name: "Almond Milk 1L", category: "Dairy", price: 210, image: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=400" },
  { name: "Fresh Cream 200ml", category: "Dairy", price: 70, image: "https://images.unsplash.com/photo-1528642637335-125916304897?w=400" },
  { name: "Soy Milk Organic 1L", category: "Dairy", price: 180, image: "https://images.unsplash.com/photo-1622484211148-716598e04141?w=400" },
  { name: "Cottage Cheese 250g", category: "Dairy", price: 85, image: "https://images.unsplash.com/photo-1552763421-2e6f470a1a0d?w=400" },
  { name: "Sour Cream 200g", category: "Dairy", price: 75, image: "https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=400" },
  { name: "Buttermilk Fresh 1L", category: "Dairy", price: 40, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400" },
  { name: "Whipped Cream Spray", category: "Dairy", price: 120, image: "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?w=400" },
  { name: "Pure Ghee 1L", category: "Dairy", price: 650, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400" },

  // Drinks (14 items)
  { name: "Coca-Cola 1.5L", category: "Drinks", price: 85, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" },
  { name: "Pepsi Cola 1.5L", category: "Drinks", price: 80, image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400" },
  { name: "Orange Juice 1L", category: "Drinks", price: 125, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400" },
  { name: "Green Tea Pack (25 Bags)", category: "Drinks", price: 155, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400" },
  { name: "Sparkling Water 500ml", category: "Drinks", price: 50, image: "https://images.unsplash.com/photo-1603266759536-4d455c54649e?w=400" },
  { name: "Cold Brew Coffee 250ml", category: "Drinks", price: 115, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400" },
  { name: "Lemon Iced Tea 1L", category: "Drinks", price: 105, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400" },
  { name: "Apple Cider 1L", category: "Drinks", price: 140, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400" },
  { name: "Coconut Water 500ml", category: "Drinks", price: 60, image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400" },
  { name: "Tomato Juice 1L", category: "Drinks", price: 95, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400" },
  { name: "Pineapple Juice 1L", category: "Drinks", price: 110, image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=400" },
  { name: "Ginger Ale 330ml", category: "Drinks", price: 70, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" },
  { name: "Energy Drink Can", category: "Drinks", price: 120, image: "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400" },
  { name: "Mineral Water 1L", category: "Drinks", price: 20, image: "https://images.unsplash.com/photo-1616118132261-e0c242e2b7e5?w=400" },

  // Grains (13 items)
  { name: "Basmati Rice 5kg", category: "Grains", price: 560, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  { name: "Wheat Flour 5kg", category: "Grains", price: 260, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
  { name: "Brown Rice 1kg", category: "Grains", price: 125, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  { name: "Organic Oats 1kg", category: "Grains", price: 145, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "Organic Quinoa 500g", category: "Grains", price: 205, image: "https://images.unsplash.com/photo-1515942900766-b2a8ed0db35f?w=400" },
  { name: "Red Lentils 1kg", category: "Grains", price: 95, image: "https://images.unsplash.com/photo-1515942900766-b2a8ed0db35f?w=400" },
  { name: "Yellow Moong Dal 1kg", category: "Grains", price: 110, image: "https://images.unsplash.com/photo-1515942900766-b2a8ed0db35f?w=400" },
  { name: "Chickpeas 1kg", category: "Grains", price: 120, image: "https://images.unsplash.com/photo-1547050605-2f88f82f8a2a?w=400" },
  { name: "Black Beans 1kg", category: "Grains", price: 130, image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400" },
  { name: "Barley Seeds 1kg", category: "Grains", price: 85, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" },
  { name: "Chia Seeds 250g", category: "Grains", price: 150, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "Flax Seeds 250g", category: "Grains", price: 90, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "White Rice Premium 5kg", category: "Grains", price: 420, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },

  // Bakery (12 items)
  { name: "Whole Wheat Bread 400g", category: "Bakery", price: 45, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
  { name: "Croissants Butter 4pc", category: "Bakery", price: 120, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
  { name: "Chocolate Cake 500g", category: "Bakery", price: 360, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
  { name: "Chocolate Cookies 10pc", category: "Bakery", price: 85, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400" },
  { name: "Garlic Bread Loaf", category: "Bakery", price: 80, image: "https://images.unsplash.com/photo-1573145959290-7db21f8a7d2e?w=400" },
  { name: "Blueberry Muffins 4pc", category: "Bakery", price: 145, image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400" },
  { name: "Bagels Pack 5pc", category: "Bakery", price: 110, image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400" },
  { name: "Burger Buns 4pc", category: "Bakery", price: 50, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "Apple Pie 500g", category: "Bakery", price: 280, image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400" },
  { name: "Sourdough Bread 500g", category: "Bakery", price: 95, image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400" },
  { name: "Pita Bread Pack 6pc", category: "Bakery", price: 70, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
  { name: "Vanilla Muffins 4pc", category: "Bakery", price: 130, image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400" },

  // Instant (12 items)
  { name: "Maggi Noodles 280g", category: "Instant", price: 60, image: "https://images.unsplash.com/photo-1612966608967-312ba599102e?w=400" },
  { name: "Tomato Soup Pack 4pc", category: "Instant", price: 38, image: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?w=400" },
  { name: "Pasta Kit Italian", category: "Instant", price: 115, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400" },
  { name: "Potato Chips Salted 150g", category: "Instant", price: 48, image: "https://images.unsplash.com/photo-1566478989037-eec170784d20?w=400" },
  { name: "Cup Noodles Spicy 80g", category: "Instant", price: 45, image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400" },
  { name: "Instant Oatmeal 1kg", category: "Instant", price: 120, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "Mac & Cheese Cup", category: "Instant", price: 80, image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400" },
  { name: "Popcorn Butter Pack", category: "Instant", price: 65, image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400" },
  { name: "Instant Ramen Bowl", category: "Instant", price: 110, image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400" },
  { name: "Corn Flakes Pack 500g", category: "Instant", price: 150, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "Muesli Fruit Mix 500g", category: "Instant", price: 220, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400" },
  { name: "Instant Poha Pack 200g", category: "Instant", price: 40, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400" },
];

// Transform baseProducts into database-ready formats
const dummyProducts = baseProducts.map((p, index) => {
  const discountRate = 0.85 + (index % 10) * 0.01; // Varying discount (10% to 15%)
  const offerPrice = Math.round(p.price * discountRate);

  // Generate realistic reviews for first 30 products
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
        rating: 4 + (r % 2), // 4 or 5 stars
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
    image: [p.image],
    inStock: index % 20 !== 0, // 95% in stock, others out of stock
    reviews: reviews,
  };
});

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products in database");

    // Insert dummy products
    const result = await Product.insertMany(dummyProducts);
    console.log(`Successfully added ${result.length} products to the database!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
