export type Language = "sw" | "en";
export type PageKey = "home" | "products" | "services" | "about" | "contact";

export const SITE_URL = "https://nafakahalisi.com";
export const PHONE = "255783250177";
export const PHONE_DISPLAY = "+255 783 250 177";
export const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Kwa+Mrefu+Baraa+CET+Garden+Arusha";

export interface RouteDefinition {
  path: string;
  language: Language;
  page: PageKey;
  alternatePath: string;
  title: string;
  description: string;
  image: string;
}

const swPaths: Record<PageKey, string> = {
  home: "/", products: "/products/", services: "/services/", about: "/about/", contact: "/contact/",
};
const enPaths: Record<PageKey, string> = {
  home: "/en/", products: "/en/products/", services: "/en/services/", about: "/en/about/", contact: "/en/contact/",
};

const metadata: Record<Language, Record<PageKey, [string, string, string]>> = {
  sw: {
    home: ["Nafaka Halisi Tanzania | Kiwanda cha Nafaka Arusha", "Unga bora wa sembe, dona na ngano pamoja na huduma za kusaga nafaka Arusha.", "/assets/images/hero-grain-mill.webp"],
    products: ["Bidhaa Zetu | Nafaka Halisi Tanzania", "Agiza unga wa sembe, dona, ngano na mahindi ya jumla kutoka Nafaka Halisi Tanzania.", "/assets/images/sembe.webp"],
    services: ["Huduma za Kusaga na Usambazaji | Nafaka Halisi", "Huduma za kukoboa na kusaga nafaka, mizani ya kidijitali na usambazaji kutoka Baraa, Arusha.", "/assets/images/milling-service.webp"],
    about: ["Kuhusu Nafaka Halisi Tanzania | Kiwanda cha Arusha", "Fahamu kiwanda chetu cha Arusha kinachoshirikiana na wakulima kuzalisha chakula safi.", "/assets/images/hero-grain-mill.webp"],
    contact: ["Wasiliana Nasi | Nafaka Halisi Tanzania", "Pata bei za bidhaa, huduma za kusaga na maelekezo ya kufika kiwandani Baraa, Arusha.", "/assets/images/maize-wholesale.webp"],
  },
  en: {
    home: ["Nafaka Halisi Tanzania | Grain Milling and Flour in Arusha", "Premium maize and wheat flour plus dependable grain-milling services in Arusha.", "/assets/images/hero-grain-mill.webp"],
    products: ["Our Products | Nafaka Halisi Tanzania", "Order premium sembe, whole-grain dona, wheat flour and wholesale maize in Arusha.", "/assets/images/sembe.webp"],
    services: ["Grain Milling and Distribution Services | Nafaka Halisi", "Grain dehulling, milling, verified digital weighing and wholesale distribution from Arusha.", "/assets/images/milling-service.webp"],
    about: ["About Nafaka Halisi Tanzania | Arusha Grain Mill", "Meet our Arusha mill working with local farmers to produce clean and dependable food products.", "/assets/images/hero-grain-mill.webp"],
    contact: ["Contact Us | Nafaka Halisi Tanzania", "Request product prices, milling services or directions to our factory in Baraa, Arusha.", "/assets/images/maize-wholesale.webp"],
  },
};

export const routes: RouteDefinition[] = (["sw", "en"] as const).flatMap((language) =>
  (["home", "products", "services", "about", "contact"] as const).map((page) => {
    const [title, description, image] = metadata[language][page];
    return {
      path: language === "sw" ? swPaths[page] : enPaths[page],
      alternatePath: language === "sw" ? enPaths[page] : swPaths[page],
      language,
      page,
      title,
      description,
      image,
    };
  }),
);

export function normalizePath(pathname: string) {
  if (pathname === "/") return pathname;
  return `${pathname.replace(/\/+$/, "")}/`;
}

export function getRoute(pathname: string) {
  return routes.find((route) => route.path === normalizePath(pathname));
}

export const common = {
  sw: {
    skip: "Ruka hadi maudhui",
    nav: { home: "Mwanzo", products: "Bidhaa", services: "Huduma", about: "Kuhusu", contact: "Mawasiliano" },
    announcement: "Nafaka za Tanzania · Zimesindikwa kwa uangalifu Arusha",
    announcementLink: "Ulizia bei ya leo",
    openMenu: "Fungua menyu", closeMenu: "Funga menyu", language: "English",
    footerLead: "Chakula bora huanza na nafaka halisi.",
    footerBody: "Nafaka safi, usagaji wa kuaminika na usambazaji unaojali biashara yako.",
    explore: "Chunguza", find: "Tufikie", hours: "Muda wa kazi", factory: "Ofisi na kiwanda",
    address: "Kwa Mrefu, Kata ya Baraa, mkabala na CET Garden, Arusha.", map: "Fungua ramani",
    weekdays: "Jumatatu–Jumamosi", sunday: "Jumapili", closed: "Tumefungwa",
    rights: "Haki zote zimehifadhiwa.", chat: "Tuandikie WhatsApp", cta: "Unahitaji bei au huduma ya kusaga?",
  },
  en: {
    skip: "Skip to content",
    nav: { home: "Home", products: "Products", services: "Services", about: "About", contact: "Contact" },
    announcement: "Tanzanian grain · Carefully processed in Arusha",
    announcementLink: "Request today's price",
    openMenu: "Open menu", closeMenu: "Close menu", language: "Kiswahili",
    footerLead: "Better food starts with authentic grain.",
    footerBody: "Clean grain, dependable milling and distribution built around your business.",
    explore: "Explore", find: "Find us", hours: "Opening hours", factory: "Office and factory",
    address: "Kwa Mrefu, Baraa Ward, opposite CET Garden, Arusha.", map: "Open map",
    weekdays: "Monday–Saturday", sunday: "Sunday", closed: "Closed",
    rights: "All rights reserved.", chat: "Message us on WhatsApp", cta: "Need a product quote or milling service?",
  },
} as const;

export interface Product {
  id: string;
  image: string;
  name: Record<Language, string>;
  category: Record<Language, string>;
  description: Record<Language, string>;
  alt: Record<Language, string>;
  quantities: Record<Language, string[]>;
}

export const products: Product[] = [
  {
    id: "sembe", image: "/assets/images/sembe.webp",
    name: { sw: "Unga wa Sembe Premium", en: "Premium Sembe" }, category: { sw: "Unga wa mahindi", en: "Maize flour" },
    description: { sw: "Unga mweupe uliokobolewa na kusagwa kwa kiwango cha juu kwa ugali laini majumbani, shuleni na hotelini.", en: "Clean, highly refined white flour for smooth ugali in homes, schools and hotels." },
    alt: { sw: "Unga mweupe wa sembe pamoja na mahindi", en: "Fine white sembe maize flour" },
    quantities: { sw: ["Mfuko wa kilo 25", "Mfuko wa kilo 50", "Tani 1 au zaidi"], en: ["25 kg bag", "50 kg bag", "1 tonne or more"] },
  },
  {
    id: "dona", image: "/assets/images/dona.webp",
    name: { sw: "Unga wa Dona Safi", en: "Pure Dona Flour" }, category: { sw: "Nafaka nzima", en: "Whole grain" },
    description: { sw: "Unga wa mahindi yasiyokobolewa unaobakiza kiini, nyuzi na virutubisho vya asili.", en: "Whole-maize flour retaining the germ, bran, natural fibre and nutrients." },
    alt: { sw: "Unga wa dona na mahindi mazima", en: "Whole-grain dona flour and maize" },
    quantities: { sw: ["Mfuko wa kilo 25", "Mfuko wa kilo 50", "Tani 1 au zaidi"], en: ["25 kg bag", "50 kg bag", "1 tonne or more"] },
  },
  {
    id: "wheat", image: "/assets/images/wheat-flour.webp",
    name: { sw: "Unga wa Ngano Maalum", en: "Special Wheat Flour" }, category: { sw: "Kwa waokaji", en: "For bakeries" },
    description: { sw: "Unga laini wenye kiwango bora cha gluten kwa mikate, maandazi, chapati na keki.", en: "Fine flour with reliable gluten for bread, mandazi, chapati and well-risen cakes." },
    alt: { sw: "Unga wa ngano, mkate na masuke", en: "Wheat flour, bread and wheat heads" },
    quantities: { sw: ["Mfuko wa kilo 25", "Mfuko wa kilo 50", "Tani 1 au zaidi"], en: ["25 kg bag", "50 kg bag", "1 tonne or more"] },
  },
  {
    id: "maize", image: "/assets/images/maize-wholesale.webp",
    name: { sw: "Mahindi ya Jumla", en: "Wholesale Maize" }, category: { sw: "Nafaka ghafi", en: "Raw grain" },
    description: { sw: "Mahindi makavu yenye kiwango sahihi cha unyevu kwa wafanyabiashara, maghala na wanunuzi wa viwandani.", en: "Properly dried maize for traders, warehouses and industrial buyers." },
    alt: { sw: "Mahindi makavu katika gunia kubwa", en: "Dry maize in a wholesale sack" },
    quantities: { sw: ["Mifuko ya kilo 50 au zaidi", "Tani 1 hadi 5", "Zaidi ya tani 5"], en: ["50 kg bags or more", "1 to 5 tonnes", "More than 5 tonnes"] },
  },
];

export function whatsappUrl(message?: string) {
  return `https://wa.me/${PHONE}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function productMessage(language: Language, product: string, quantity: string) {
  return language === "en"
    ? `Hello Nafaka Halisi Tanzania, I would like today's quotation for:\n\nProduct: ${product}\nQuantity: ${quantity}\n\nPlease share the price, current availability and delivery options. Thank you.`
    : `Habari Nafaka Halisi Tanzania, ningependa kupata bei ya leo ya:\n\nBidhaa: ${product}\nKiasi: ${quantity}\n\nTafadhali nitumie bei, upatikanaji wa mzigo na utaratibu wa usafirishaji. Asante.`;
}
