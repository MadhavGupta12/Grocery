import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/connectDB.js";
import { buildProductImages } from "./services/productImages.js";

dotenv.config();

const catalog = [
  { category: "Vegetables", item: "Potato", variants: ["Farm Fresh", "Baby", "Washed", "Premium", "Red", "Golden", "Family Pack", "Budget Pack"], units: ["750g", "1.5kg", "2kg", "3kg"], price: 38 },
  { category: "Vegetables", item: "Tomato", variants: ["Roma", "Hybrid", "Salad", "Cherry", "Fresh", "Ripe", "Premium", "Family Pack"], units: ["500g", "750g", "1.5kg", "2kg"], price: 42 },
  { category: "Vegetables", item: "Carrot", variants: ["Orange", "Baby", "Crunchy", "Premium", "Washed", "Sweet", "Farm Fresh"], units: ["500g", "750g", "1kg", "1.5kg"], price: 34 },
  { category: "Vegetables", item: "Spinach", variants: ["Green", "Tender", "Organic", "Fresh", "Baby", "Washed"], units: ["250g", "500g", "750g"], price: 22 },
  { category: "Vegetables", item: "Onion", variants: ["Red", "Small", "Premium", "Fresh", "Family Pack", "Budget Pack"], units: ["750g", "1kg", "1.5kg", "2kg"], price: 30 },
  { category: "Vegetables", item: "Cauliflower", variants: ["Fresh", "Premium", "Farm Fresh", "White", "Tender"], units: ["1pc", "2pc"], price: 52 },
  { category: "Vegetables", item: "Bell Pepper", variants: ["Green", "Red", "Yellow", "Mixed", "Premium"], units: ["250g", "500g", "3pc"], price: 48 },
  { category: "Vegetables", item: "Sweet Corn", variants: ["Tender", "Fresh", "Golden", "Premium", "Family Pack"], units: ["2pc", "4pc", "500g"], price: 44 },

  { category: "Fruits", item: "Apple", variants: ["Royal Gala", "Green", "Red", "Premium", "Juicy", "Crunchy", "Family Pack", "Value Pack"], units: ["500g", "1kg", "1.5kg", "2kg"], price: 125 },
  { category: "Fruits", item: "Orange", variants: ["Nagpur", "Sweet", "Juicy", "Premium", "Seedless", "Family Pack"], units: ["500g", "1kg", "1.5kg", "2kg"], price: 85 },
  { category: "Fruits", item: "Banana", variants: ["Robusta", "Elaichi", "Ripe", "Premium", "Value Pack", "Family Pack"], units: ["6pc", "12pc", "1kg", "1.5kg"], price: 58 },
  { category: "Fruits", item: "Mango", variants: ["Alphonso", "Kesar", "Dasheri", "Sweet", "Premium", "Family Pack"], units: ["500g", "1kg", "1.5kg", "2kg"], price: 155 },
  { category: "Fruits", item: "Grapes", variants: ["Green", "Black", "Seedless", "Premium", "Sweet", "Fresh"], units: ["250g", "500g", "750g", "1kg"], price: 78 },
  { category: "Fruits", item: "Pear", variants: ["Sweet", "Green", "Premium", "Juicy", "Fresh"], units: ["500g", "1kg", "1.5kg"], price: 92 },
  { category: "Fruits", item: "Pineapple", variants: ["Sweet", "Sliced", "Premium", "Fresh"], units: ["1pc", "2pc"], price: 110 },

  { category: "Dairy", item: "Milk", variants: ["Full Cream", "Toned", "Fresh", "Organic", "Family Pack", "Double Toned"], units: ["500ml", "1L", "2L"], price: 65 },
  { category: "Dairy", item: "Paneer", variants: ["Fresh", "Malai", "Organic", "Premium", "Soft", "Family Pack"], units: ["200g", "400g", "500g"], price: 95 },
  { category: "Dairy", item: "Eggs", variants: ["Farm Fresh", "Brown", "White", "Organic", "Protein Pack"], units: ["6pc", "12pc", "18pc"], price: 92 },
  { category: "Dairy", item: "Cheese", variants: ["Cheddar", "Mozzarella", "Processed", "Slice", "Premium", "Family Pack"], units: ["100g", "200g", "400g"], price: 145 },
  { category: "Dairy", item: "Yogurt", variants: ["Greek", "Natural", "Low Fat", "Premium", "Fresh"], units: ["200g", "400g", "500g", "1kg"], price: 85 },
  { category: "Dairy", item: "Butter", variants: ["Salted", "Unsalted", "Premium", "Table", "Family Pack"], units: ["100g", "200g", "500g"], price: 110 },

  { category: "Drinks", item: "Coca-Cola", variants: ["Classic", "Zero Sugar", "Party Pack", "Chilled"], units: ["500ml", "750ml", "1.25L", "2L"], price: 82 },
  { category: "Drinks", item: "Pepsi", variants: ["Classic", "Black", "Party Pack", "Chilled"], units: ["500ml", "750ml", "1.25L", "2L"], price: 80 },
  { category: "Drinks", item: "Sprite", variants: ["Lemon Lime", "Chilled", "Party Pack"], units: ["500ml", "750ml", "1.25L", "2L"], price: 79 },
  { category: "Drinks", item: "Fanta", variants: ["Orange", "Chilled", "Party Pack"], units: ["500ml", "750ml", "1.25L", "2L"], price: 78 },
  { category: "Drinks", item: "7 Up", variants: ["Lemon", "Chilled", "Party Pack"], units: ["500ml", "750ml", "1.25L", "2L"], price: 76 },
  { category: "Drinks", item: "Orange Juice", variants: ["Fresh", "No Added Sugar", "Premium", "Family Pack"], units: ["250ml", "500ml", "1L"], price: 120 },
  { category: "Drinks", item: "Mineral Water", variants: ["Pure", "Family Pack", "Travel Pack", "Chilled"], units: ["500ml", "1L", "2L"], price: 22 },

  { category: "Grains", item: "Basmati Rice", variants: ["Premium", "Long Grain", "Classic", "Family Pack", "Aromatic"], units: ["1kg", "2kg", "5kg", "10kg"], price: 145 },
  { category: "Grains", item: "Wheat Flour", variants: ["Whole Wheat", "Premium", "Stone Ground", "Family Pack"], units: ["1kg", "2kg", "5kg", "10kg"], price: 65 },
  { category: "Grains", item: "Brown Rice", variants: ["Organic", "Premium", "Healthy", "Long Grain"], units: ["1kg", "2kg", "5kg"], price: 125 },
  { category: "Grains", item: "Quinoa", variants: ["Organic", "White", "Premium", "Healthy"], units: ["250g", "500g", "1kg"], price: 220 },
  { category: "Grains", item: "Barley", variants: ["Pearl", "Organic", "Premium", "Healthy"], units: ["500g", "1kg", "2kg"], price: 95 },
  { category: "Grains", item: "Oats", variants: ["Rolled", "Instant", "Organic", "Premium"], units: ["500g", "1kg", "1.5kg"], price: 140 },

  { category: "Bakery", item: "Whole Wheat Bread", variants: ["Fresh", "Soft", "Sandwich", "Premium", "Family Pack"], units: ["300g", "400g", "600g"], price: 48 },
  { category: "Bakery", item: "Brown Bread", variants: ["Fresh", "Soft", "Sandwich", "Premium"], units: ["300g", "400g", "600g"], price: 45 },
  { category: "Bakery", item: "Croissant", variants: ["Butter", "Chocolate", "Fresh", "Premium"], units: ["2pc", "4pc", "6pc"], price: 90 },
  { category: "Bakery", item: "Chocolate Cake", variants: ["Rich", "Premium", "Party", "Slice Pack"], units: ["250g", "500g", "1kg"], price: 320 },
  { category: "Bakery", item: "Vanilla Muffins", variants: ["Fresh", "Soft", "Premium", "Family Pack"], units: ["4pc", "6pc", "8pc"], price: 115 },
  { category: "Bakery", item: "Garlic Bread", variants: ["Fresh", "Cheese", "Herb", "Premium"], units: ["200g", "400g", "1 loaf"], price: 78 },

  { category: "Instant", item: "Maggi Noodles", variants: ["Masala", "Family Pack", "Hot Heads", "Classic"], units: ["70g", "280g", "560g"], price: 58 },
  { category: "Instant", item: "Top Ramen", variants: ["Curry", "Masala", "Family Pack", "Spicy"], units: ["70g", "280g", "560g"], price: 50 },
  { category: "Instant", item: "Yippee Noodles", variants: ["Magic Masala", "Mood Masala", "Family Pack"], units: ["70g", "280g", "560g"], price: 52 },
  { category: "Instant", item: "Cup Soup", variants: ["Tomato", "Sweet Corn", "Mixed Vegetable", "Classic"], units: ["70g", "140g", "4pc"], price: 38 },
  { category: "Instant", item: "Oats Noodles", variants: ["Masala", "Healthy", "Family Pack", "Classic"], units: ["72g", "288g", "576g"], price: 44 },
  { category: "Instant", item: "Potato Chips", variants: ["Salted", "Masala", "Classic", "Family Pack"], units: ["50g", "100g", "150g"], price: 45 },
];

const makeProduct = (entry, index, variant, unit) => {
  const price = entry.price + (index % 9) * 6 + (unit.includes("10kg") ? 380 : 0) + (unit.includes("5kg") ? 160 : 0);
  const offerPrice = Math.max(5, Math.round(price * (0.84 + (index % 6) * 0.015)));
  const name = `${variant} ${entry.item} ${unit}`;

  return {
    name,
    category: entry.category,
    price,
    offerPrice,
    image: buildProductImages(name, entry.category),
    description: [
      `Freshly selected ${entry.item.toLowerCase()} for everyday grocery needs`,
      `Quality checked and packed for reliable ${entry.category.toLowerCase()} delivery`,
      `Great value ${unit} pack delivered quickly to your door`,
    ],
    inStock: index % 17 !== 0,
  };
};

const buildExtraProducts = () => {
  const products = [];

  for (const entry of catalog) {
    for (const variant of entry.variants) {
      for (const unit of entry.units) {
        products.push(makeProduct(entry, products.length, variant, unit));
      }
    }
  }

  return products;
};

const assertUniqueNames = (products) => {
  const names = products.map((product) => product.name);
  const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);

  if (duplicateNames.length > 0) {
    throw new Error(`Generated product names are not unique: ${[...new Set(duplicateNames)].join(", ")}`);
  }
};

const addProducts = async () => {
  try {
    await connectDB();

    const generatedProducts = buildExtraProducts();
    assertUniqueNames(generatedProducts);

    const names = generatedProducts.map((product) => product.name);
    const existingProducts = await Product.find({ name: { $in: names } }).select("name");
    const existingNames = new Set(existingProducts.map((product) => product.name));
    const productsToInsert = generatedProducts
      .filter((product) => !existingNames.has(product.name))
      .slice(0, 200);

    if (productsToInsert.length !== 200) {
      throw new Error(`Expected 200 new unique products, but only found ${productsToInsert.length} unique names after removing existing products.`);
    }

    if (productsToInsert.length > 0) {
      await Product.insertMany(productsToInsert);
    }

    const totalProducts = await Product.countDocuments();
    console.log(`Generated: ${generatedProducts.length}`);
    console.log(`Inserted: ${productsToInsert.length}`);
    console.log(`Skipped duplicates: ${generatedProducts.length - productsToInsert.length}`);
    console.log(`Total products now: ${totalProducts}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to add products:", error);
    process.exit(1);
  }
};

addProducts();
