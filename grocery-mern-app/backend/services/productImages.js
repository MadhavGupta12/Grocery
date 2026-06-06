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

const CURATED_IMAGE_FILES = [
  ["potato", "potato_image_1.png"],
  ["tomato", "tomato_image.png"],
  ["carrot", "carrot_image.png"],
  ["spinach", "spinach_image_1.png"],
  ["onion", "onion_image_1.png"],
  ["cauliflower", "cauliflower.png"],
  ["pepper", "capsicum_mix.png"],
  ["corn", "sweet_corn.png"],
  ["apple", "apple_image.png"],
  ["orange", "orange_image.png"],
  ["banana", "banana_image_1.png"],
  ["mango", "mango_image_1.png"],
  ["grapes", "grapes_image_1.png"],
  ["grape", "grapes_image_1.png"],
  ["milk", "amul_milk_image.png"],
  ["paneer", "paneer_image.png"],
  ["eggs", "eggs_image.png"],
  ["cheese", "cheese_image.png"],
  ["coca-cola", "coca_cola_image.png"],
  ["coca cola", "coca_cola_image.png"],
  ["pepsi", "pepsi_image.png"],
  ["sprite", "sprite_image_1.png"],
  ["fanta", "fanta_image_1.png"],
  ["7 up", "seven_up_image_1.png"],
  ["basmati rice", "basmati_rice_image.png"],
  ["wheat flour", "wheat_flour_image.png"],
  ["quinoa", "quinoa_image.png"],
  ["brown rice", "brown_rice_image.png"],
  ["barley", "barley_image.png"],
  ["brown bread", "brown_bread_image.png"],
  ["whole wheat bread", "whole_wheat_bread_image.png"],
  ["bread", "whole_wheat_bread_image.png"],
  ["croissant", "butter_croissant_image.png"],
  ["chocolate cake", "chocolate_cake_image.png"],
  ["muffins", "vanilla_muffins_image.png"],
  ["garlic bread", "garlic_bread.png"],
  ["maggi", "maggi_image.png"],
  ["top ramen", "top_ramen_image.png"],
  ["ramen", "top_ramen_image.png"],
  ["soup", "knorr_soup_image.png"],
  ["yippee", "yippee_image.png"],
  ["oats", "maggi_oats_image.png"],
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

export const getCuratedImageFile = (name) => {
  const normalizedName = cleanProductName(name).toLowerCase();
  const match = CURATED_IMAGE_FILES.find(([needle]) => normalizedName.includes(needle));
  return match?.[1] || null;
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

export const buildProductImages = (name, category) => {
  const curatedImage = getCuratedImageFile(name);
  const internetImage = buildProductImageUrl(name, category);

  return curatedImage ? [curatedImage, internetImage] : [internetImage];
};
