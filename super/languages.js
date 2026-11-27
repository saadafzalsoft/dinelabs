// Languages Dinelabs offers for the storefront menu and for the Manager / App interface.
// English and Arabic are written by people; every other language is filled in by the AI translation (Google Cloud Translation).
// rtl: true flips the layout right to left.
window.DL_LANGS = [
  ["en", "English", "English"], ["ar", "Arabic", "العربية", 1], ["fr", "French", "Français"], ["es", "Spanish", "Español"],
  ["de", "German", "Deutsch"], ["it", "Italian", "Italiano"], ["pt", "Portuguese", "Português"], ["nl", "Dutch", "Nederlands"],
  ["tr", "Turkish", "Türkçe"], ["ru", "Russian", "Русский"], ["uk", "Ukrainian", "Українська"], ["pl", "Polish", "Polski"],
  ["el", "Greek", "Ελληνικά"], ["ro", "Romanian", "Română"], ["hy", "Armenian", "Հայերեն"], ["ka", "Georgian", "ქართული"],
  ["fa", "Persian", "فارسی", 1], ["ur", "Urdu", "اردو", 1], ["he", "Hebrew", "עברית", 1], ["ku", "Kurdish", "Kurdî"],
  ["hi", "Hindi", "हिन्दी"], ["bn", "Bengali", "বাংলা"], ["ta", "Tamil", "தமிழ்"], ["ml", "Malayalam", "മലയാളം"],
  ["tl", "Filipino", "Filipino"], ["id", "Indonesian", "Bahasa Indonesia"], ["ms", "Malay", "Bahasa Melayu"], ["th", "Thai", "ไทย"],
  ["vi", "Vietnamese", "Tiếng Việt"], ["zh", "Chinese", "中文"], ["ja", "Japanese", "日本語"], ["ko", "Korean", "한국어"],
  ["sw", "Swahili", "Kiswahili"], ["am", "Amharic", "አማርኛ"], ["sv", "Swedish", "Svenska"], ["no", "Norwegian", "Norsk"],
  ["da", "Danish", "Dansk"], ["fi", "Finnish", "Suomi"], ["cs", "Czech", "Čeština"], ["hu", "Hungarian", "Magyar"]
].map(([code, name, native, rtl]) => ({ code, name, native, rtl: !!rtl, value: name, label: name, meta: native }));
