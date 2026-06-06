const CATEGORY_FALLBACKS = {
  Vegetables: "vegetable",
  Fruits: "fruit",
  Drinks: "drink",
  Instant: "food",
  Dairy: "dairy",
  Bakery: "bakery",
  Grains: "grain",
};

const PRODUCT_KEYWORDS = [
  ["coca-cola", "coca cola bottle"],
  ["coca cola", "coca cola bottle"],
  ["green tea", "green tea"],
  ["cold brew", "cold brew coffee"],
  ["coconut water", "coconut water"],
  ["tomato juice", "tomato juice"],
  ["pineapple juice", "pineapple juice"],
  ["orange juice", "orange juice"],
  ["apple cider", "apple cider"],
  ["ginger ale", "ginger ale"],
  ["energy drink", "energy drink"],
  ["basmati rice", "basmati rice"],
  ["wheat flour", "wheat flour"],
  ["brown rice", "brown rice"],
  ["red lentils", "red lentils"],
  ["moong dal", "moong dal"],
  ["black beans", "black beans"],
  ["chia seeds", "chia seeds"],
  ["flax seeds", "flax seeds"],
  ["white rice", "white rice"],
  ["whole wheat bread", "whole wheat bread"],
  ["garlic bread", "garlic bread"],
  ["chocolate cake", "chocolate cake"],
  ["chocolate cookies", "chocolate cookies"],
  ["blueberry muffins", "blueberry muffins"],
  ["burger buns", "burger buns"],
  ["apple pie", "apple pie"],
  ["sourdough bread", "sourdough bread"],
  ["pita bread", "pita bread"],
  ["vanilla muffins", "vanilla muffins"],
  ["maggi", "instant noodles"],
  ["top ramen", "ramen noodles"],
  ["cup noodles", "cup noodles"],
  ["mac & cheese", "macaroni cheese"],
  ["mac and cheese", "macaroni cheese"],
  ["corn flakes", "corn flakes cereal"],
  ["instant poha", "poha"],
  ["paneer", "paneer"],
  ["mozzarella", "mozzarella cheese"],
  ["cheddar", "cheddar cheese"],
  ["cottage cheese", "cottage cheese"],
  ["sour cream", "sour cream"],
  ["whipped cream", "whipped cream"],
  ["buttermilk", "buttermilk"],
  ["almond milk", "almond milk"],
  ["soy milk", "soy milk"],
  ["milk", "milk"],
  ["yogurt", "yogurt"],
  ["butter", "butter"],
  ["cheese", "cheese"],
  ["eggs", "eggs"],
  ["ghee", "ghee"],
  ["potato", "potato"],
  ["tomato", "tomato"],
  ["carrot", "carrot"],
  ["spinach", "spinach"],
  ["onion", "onion"],
  ["broccoli", "broccoli"],
  ["cauliflower", "cauliflower"],
  ["pepper", "bell pepper"],
  ["cucumber", "cucumber"],
  ["corn", "sweet corn"],
  ["ginger", "ginger"],
  ["garlic", "garlic"],
  ["chilli", "chilli pepper"],
  ["cabbage", "cabbage"],
  ["zucchini", "zucchini"],
  ["apple", "apple fruit"],
  ["orange", "orange fruit"],
  ["banana", "banana"],
  ["mango", "mango fruit"],
  ["grapes", "grapes"],
  ["grape", "grapes"],
  ["strawberries", "strawberry"],
  ["strawberry", "strawberry"],
  ["pineapple", "pineapple"],
  ["watermelon", "watermelon"],
  ["avocado", "avocado"],
  ["pomegranate", "pomegranate"],
  ["blueberries", "blueberry"],
  ["blueberry", "blueberry"],
  ["kiwi", "kiwi fruit"],
  ["papaya", "papaya"],
  ["pear", "pear fruit"],
  ["lime", "lime fruit"],
  ["cherry", "cherry fruit"],
  ["pepsi", "pepsi bottle"],
  ["sprite", "sprite bottle"],
  ["fanta", "fanta bottle"],
  ["7 up", "7up bottle"],
  ["juice", "juice"],
  ["tea", "tea"],
  ["water", "water bottle"],
  ["coffee", "coffee"],
  ["rice", "rice"],
  ["flour", "flour"],
  ["oats", "oats"],
  ["quinoa", "quinoa"],
  ["chickpeas", "chickpeas"],
  ["barley", "barley"],
  ["croissant", "croissant"],
  ["cookies", "cookies"],
  ["muffins", "muffins"],
  ["bagels", "bagels"],
  ["bread", "bread"],
  ["noodles", "noodles"],
  ["soup", "soup"],
  ["pasta", "pasta"],
  ["chips", "potato chips"],
  ["oatmeal", "oatmeal"],
  ["popcorn", "popcorn"],
  ["ramen", "ramen"],
  ["muesli", "muesli"],
];

const cleanProductName = (name = "") =>
  String(name)
    .replace(/\b\d+(\.\d+)?\s*(kg|g|gm|l|ml|pc|pcs|dozen|pack|box|bunch)\b/gi, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getProductKeyword = (name) => {
  const normalizedName = cleanProductName(name).toLowerCase();
  const match = PRODUCT_KEYWORDS.find(([needle]) => normalizedName.includes(needle));
  return match?.[1] || normalizedName || "grocery food";
};

const hashText = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash || 1;
};

export const buildProductImageUrl = (name, category) => {
  const productKeyword = getProductKeyword(name);
  const categoryKeyword = CATEGORY_FALLBACKS[category] || "grocery product";
  const query = encodeURIComponent(`${productKeyword} ${categoryKeyword} grocery product`);
  const lock = hashText(`${name}-${category}`);

  return `https://tse1.mm.bing.net/th?q=${query}&w=640&h=480&c=7&rs=1&p=${lock % 3}&o=5&pid=1.7`;
};

export const buildProductPlaceholderImage = (name, category) => {
  const escapeXml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
      <rect width="640" height="480" fill="#f6f8f4"/>
      <circle cx="320" cy="188" r="76" fill="#e4f3e8"/>
      <path d="M320 118c38 0 70 30 70 68 0 52-70 100-70 100s-70-48-70-100c0-38 32-68 70-68z" fill="#0c831f" opacity=".9"/>
      <circle cx="320" cy="180" r="28" fill="#f6f8f4"/>
      <text x="320" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111827">${escapeXml(name || "Product")}</text>
      <text x="320" y="374" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#0c831f">${escapeXml(category || "Grocery")}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
