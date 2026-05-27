const API_URL = "https://fakestoreapi.com/products";

const fallbackProducts = [
  {
    id: 101,
    title: "SmartCart AirPods Max Pro",
    price: 28999,
    category: "electronics",
    description: "Premium wireless audio with spatial sound, soft-touch controls, and all-day comfort.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.8, count: 812 },
    popularity: 98,
    badge: "Trending"
  },
  {
    id: 102,
    title: "AeroFlex Minimal Backpack",
    price: 2499,
    category: "fashion",
    description: "Water-resistant daily backpack with laptop protection and premium recycled fabric.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.6, count: 441 },
    popularity: 84,
    badge: "New"
  },
  {
    id: 103,
    title: "LumaDesk Wireless Lamp",
    price: 5499,
    category: "home",
    description: "A sculptural desk lamp with wireless charging, dimming, and warm/cool light modes.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.7, count: 326 },
    popularity: 88,
    badge: "Sale"
  },
  {
    id: 104,
    title: "PulseFit Health Watch",
    price: 12999,
    category: "electronics",
    description: "Advanced fitness watch with sleep tracking, ECG-inspired insights, and seven-day battery.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80",
    rating: { rate: 4.9, count: 1250 },
    popularity: 99,
    badge: "Best Seller"
  }
];

const normalizeProduct = (product) => ({
  id: Number(product.id),
  title: product.title,
  price: product.id > 100 ? Number(product.price) : Math.round(Number(product.price) * 83),
  category: product.category || "lifestyle",
  description: product.description || "Premium quality product curated by SmartCart.",
  image: product.image,
  rating: product.rating || { rate: 4.5, count: 120 },
  popularity: product.popularity || Math.round((product.rating?.count || 150) / 10),
  badge: product.badge || (product.rating?.rate > 4.5 ? "Top Rated" : "Smart Pick")
});

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Product API unavailable");
    const products = await response.json();
    return [...products.map(normalizeProduct), ...fallbackProducts];
  } catch (error) {
    console.warn(error.message);
    return fallbackProducts;
  }
}

async function fetchProductById(id) {
  const products = await fetchProducts();
  return products.find((product) => Number(product.id) === Number(id)) || products[0];
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
