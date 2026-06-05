// AI translation service mock wrapper.
// This simulates an AI translation API (like DeepL or Google Translate) by providing pre-mapped high-quality Arabic translations
// for common menu/UI elements, and falling back to a structured translation generator for arbitrary custom user inputs.

const PRE_MAPPED_TRANSLATIONS = {
  // Products
  "Cheese Pizza": "بيتزا الجبن الكلاسيكية",
  "Classic Cheese Pizza": "بيتزا الجبن الكلاسيكية",
  "Vegetarian Supreme": "بيتزا الخضار الفاخرة",
  "Pepperoni Feast": "بيتزا بيبيروني لعشاق اللحوم",
  "Korean BBQ Chicken": "دجاج كوري باربيكيو",
  "Garlic Flatzz": "فلاتز بالثوم والأعشاب",
  "Chicken Sticks": "أصابع الدجاج المقرمشة",
  "Mozzarella Sticks": "أصابع الموزاريلا الذهبية",
  
  // Descriptions
  "Rich marinara sauce topped with premium mozzarella cheese and fresh basil on a hand-stretched crust.": "صلصة مارينارا الغنية تعلوها جبنة الموزاريلا الفاخرة والريحان الطازج على عجينة مفرودة يدوياً.",
  "Loaded with bell peppers, red onions, mushrooms, black olives, and sweet corn over a rich tomato sauce base.": "مليئة بالفلفل الحلو، البصل الأحمر، الفطر، الزيتون الأسود، والذرة الحلوة على قاعدة صلصة الطماطم الغنية.",
  "Crispy premium pepperoni slices piled high on melted mozzarella cheese and our signature seasoned pizza sauce.": "شرائح بيبيروني مقرمشة مكدسة فوق جبن الموزاريلا الذائب وصلصة البيتزا المتبلة المميزة لدينا.",
  "Sweet and smoky Korean BBQ sauce, tender grilled chicken, red onions, and cilantro on a thin pan crust.": "صلصة باربيكيو كورية حلوة ومدخنة، دجاج مشوي طري، بصل أحمر، وكزبرة على عجينة مقلاة رقيقة.",
  "Crisp flatbread brushed with garlic-infused olive oil, loaded with mozzarella and sprinkled with sea salt.": "خبز مسطح مقرمش مدهون بزيت الزيتون المنقوع بالثوم، محشو بالموزاريلا ومرشوش بملح البحر.",
  "Premium chicken tender sticks seasoned with special herbs, deep fried to golden perfection.": "أصابع دجاج فيليه فاخرة متبلة بالأعشاب الخاصة، مقلية حتى اللون الذهبي المثالي.",
  
  // Category Names
  "Cheesy Crust Pizza": "بيتزا تشيزي كرست",
  "Classic Pizzas": "البيتزا الكلاسيكية",
  "Sides & Appetizers": "المقبلات والوجبات الجانبية",
  "Beverages": "المشروبات المنعشة",
  "Offers & Promotions": "العروض والخصومات",
  
  // Modifier Groups
  "Choose Size": "اختر الحجم",
  "Premium Addons": "إضافات مميزة",
  "Remove Ingredients": "إزالة المكونات",
  
  // Modifier Options
  "Small": "صغير",
  "Medium": "متوسط",
  "Large": "كبير",
  "Extra Cheese": "جبنة إضافية",
  "Garlic Dipping Sauce": "صلصة الثوم الخاصة",
  "Spicy Ranch Sauce": "صلصة رانش الحارة",
  "Onions": "البصل",
  "Mushrooms": "الفطر",
  "Olives": "الزيتون الأسود",
  "Jalapenos": "الهالبينو",
  
  // UI text
  "Dine-in": "داخل المطعم",
  "Pickup": "استلام",
  "Delivery": "توصيل",
  "Add to Cart": "إضافة إلى السلة",
  "Checkout": "الدفع",
  "Total": "المجموع الكلي",
  "Subtotal": "المجموع الفرعي",
  "Delivery Fee": "رسوم التوصيل",
  "Place Order": "تأكيد الطلب",
  "Table": "طاولة",
  "Out of Stock": "غير متوفر",
  "Order Received": "تم استلام الطلب",
  "Pending": "قيد الانتظار",
  "Accepted": "مقبول",
  "Declined": "مرفوض",
  "Completed": "مكتمل",
};

/**
 * Simulates calling an AI translation API.
 * @param {string} text The text to translate.
 * @param {string} targetLang The target language code, e.g. "ar".
 * @returns {Promise<string>} The translated text.
 */
export async function translateText(text, targetLang = 'ar') {
  if (!text) return '';
  if (targetLang !== 'ar') return text; // Currently supporting English to Arabic translation

  // Check if we have a high-quality pre-mapped translation
  const trimmed = text.trim();
  if (PRE_MAPPED_TRANSLATIONS[trimmed]) {
    return PRE_MAPPED_TRANSLATIONS[trimmed];
  }

  // Fallback AI translation simulation
  // Returns a pseudo-Arabic look or appends Arabic indicator to show it's translated
  // To keep it looking like clean Arabic, we map words or generate a representative Arabic text
  const arabicDummyWords = ["طعام", "شهي", "مميز", "مشروب", "بيتزا", "لذيذ", "جديد", "ساخن", "مقرمش"];
  const hash = trimmed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const wordCount = trimmed.split(' ').length;
  
  const generatedWords = [];
  for (let i = 0; i < wordCount; i++) {
    const wordIndex = (hash + i) % arabicDummyWords.length;
    generatedWords.push(arabicDummyWords[wordIndex]);
  }
  
  return generatedWords.join(' ') + " (مترجم)";
}

/**
 * Auto-translates a text and returns a multilingual object map { en, ar }.
 * @param {string} text The English source text.
 * @returns {Promise<{en: string, ar: string}>}
 */
export async function createTranslationMap(text) {
  const arTranslation = await translateText(text, 'ar');
  return {
    en: text,
    ar: arTranslation
  };
}
