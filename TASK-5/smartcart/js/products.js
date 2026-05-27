let allProducts = [];
let filteredProducts = [];

function setLoading(target, count = 8) {
  const node = document.querySelector(target);
  if (node) node.innerHTML = Array.from({ length: count }, () => "<div class='skeleton'></div>").join("");
}

function applyProductFilters() {
  const search = document.querySelector("[data-search]")?.value.toLowerCase() || "";
  const category = document.querySelector("[data-category]")?.value || "all";
  const sort = document.querySelector("[data-sort]")?.value || "popular";
  const max = Number(document.querySelector("[data-price]")?.value || 9999);

  filteredProducts = allProducts
    .filter((product) => product.title.toLowerCase().includes(search) || product.category.toLowerCase().includes(search))
    .filter((product) => category === "all" || product.category === category)
    .filter((product) => product.price <= max);

  const sorters = {
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    ratings: (a, b) => b.rating.rate - a.rating.rate,
    popular: (a, b) => b.popularity - a.popularity
  };
  filteredProducts.sort(sorters[sort]);
  renderProductGrid("[data-products-grid]", filteredProducts);
}

function renderProductGrid(target, products) {
  const node = document.querySelector(target);
  if (!node) return;
  node.innerHTML = products.length
    ? products.map(productCard).join("")
    : `<div class="empty-state"><div><h2>No products found</h2><p class="muted">Try another search or filter.</p></div></div>`;
  revealNow();
}

async function initProductsPage() {
  const grid = document.querySelector("[data-products-grid]");
  if (!grid) return;
  setLoading("[data-products-grid]", 8);
  allProducts = await fetchProducts();
  filteredProducts = [...allProducts];
  const categorySelect = document.querySelector("[data-category]");
  if (categorySelect) {
    const categories = ["all", ...new Set(allProducts.map((product) => product.category))];
    categorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
  }
  applyProductFilters();
  document.querySelectorAll("[data-search], [data-category], [data-sort], [data-price]").forEach((input) => {
    input.addEventListener("input", debounce(applyProductFilters));
  });
}

async function initHomeProducts() {
  const trending = document.querySelector("[data-trending]");
  if (!trending) return;
  setLoading("[data-trending]", 4);
  allProducts = await fetchProducts();
  renderProductGrid("[data-trending]", allProducts.sort((a, b) => b.popularity - a.popularity).slice(0, 4));
}

async function initProductDetails() {
  const details = document.querySelector("[data-product-details]");
  if (!details) return;
  details.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
  allProducts = await fetchProducts();
  const product = allProducts.find((item) => Number(item.id) === Number(getParam("id"))) || allProducts[0];
  addRecentlyViewed(product);
  details.innerHTML = `
    <div>
      <div class="gallery-main glass"><img data-main-image src="${product.image}" alt="${product.title}"></div>
      <div class="thumb-row">
        ${[product.image, product.image, product.image, product.image].map((image) => `<button class="thumb"><img src="${image}" alt=""></button>`).join("")}
      </div>
    </div>
    <div>
      <span class="badge">${product.badge}</span>
      <h1>${product.title}</h1>
      <div class="rating">★ ${product.rating.rate} <span class="muted">(${product.rating.count} verified reviews)</span></div>
      <p class="muted">${product.description}</p>
      <p class="price">${formatMoney(product.price)}</p>
      <ul class="spec-list">
        <li><span>Category</span><strong>${product.category}</strong></li>
        <li><span>Delivery</span><strong>2-4 business days</strong></li>
        <li><span>Warranty</span><strong>12 months</strong></li>
        <li><span>Returns</span><strong>30-day easy returns</strong></li>
      </ul>
      <div class="inline-actions">
        <div class="quantity">
          <button data-detail-minus>-</button>
          <input data-detail-qty value="1" readonly>
          <button data-detail-plus>+</button>
        </div>
        <button class="btn" data-detail-add="${product.id}">Add to cart</button>
        <button class="btn secondary" data-buy-now="${product.id}">Buy now</button>
      </div>
    </div>`;

  const related = allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  renderProductGrid("[data-related]", related.length ? related : allProducts.slice(0, 4));
}

document.addEventListener("click", async (event) => {
  const add = event.target.closest("[data-add]");
  const quick = event.target.closest("[data-quick]");
  const wish = event.target.closest("[data-wishlist]");
  const detailAdd = event.target.closest("[data-detail-add], [data-buy-now]");
  const plus = event.target.closest("[data-detail-plus]");
  const minus = event.target.closest("[data-detail-minus]");

  if (plus || minus) {
    const input = document.querySelector("[data-detail-qty]");
    input.value = Math.max(1, Number(input.value) + (plus ? 1 : -1));
  }

  if (add || quick || wish || detailAdd) {
    if (!allProducts.length) allProducts = await fetchProducts();
    const id = add?.dataset.add || quick?.dataset.quick || wish?.dataset.wishlist || detailAdd?.dataset.detailAdd || detailAdd?.dataset.buyNow;
    const product = allProducts.find((item) => Number(item.id) === Number(id));
    if (!product) return;
    if (add) addToCart(product, 1);
    if (quick) renderQuickView(product);
    if (wish) toggleWishlist(product);
    if (detailAdd) {
      const qty = Number(document.querySelector("[data-detail-qty]")?.value || 1);
      addToCart(product, qty);
      if (detailAdd.matches("[data-buy-now]")) window.location.href = "checkout.html";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initHomeProducts();
  initProductsPage();
  initProductDetails();
});
