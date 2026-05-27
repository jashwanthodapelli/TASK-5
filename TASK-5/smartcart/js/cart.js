const CART_KEY = "smartcart_cart";
const WISHLIST_KEY = "smartcart_wishlist";
const RECENT_KEY = "smartcart_recent";

const store = {
  get(key, fallback = []) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

function getCart() {
  return store.get(CART_KEY);
}

function saveCart(cart) {
  store.set(CART_KEY, cart);
  updateCartCount();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => Number(item.id) === Number(product.id));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity
    });
  }
  saveCart(cart);
  showToast(`${product.title} added to cart`);
}

function removeFromCart(id) {
  saveCart(getCart().filter((item) => Number(item.id) !== Number(id)));
  showToast("Item removed from cart");
  renderCartPage();
}

function updateQuantity(id, quantity) {
  const cart = getCart().map((item) =>
    Number(item.id) === Number(id) ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  saveCart(cart);
  renderCartPage();
}

function cartTotals() {
  const subtotal = getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 1500 ? 99 : 0;
  const tax = subtotal * 0.18;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = getCart().reduce((sum, item) => sum + item.quantity, 0);
  });
}

function toggleWishlist(product) {
  const list = store.get(WISHLIST_KEY);
  const exists = list.some((item) => Number(item.id) === Number(product.id));
  const next = exists ? list.filter((item) => Number(item.id) !== Number(product.id)) : [...list, product];
  store.set(WISHLIST_KEY, next);
  showToast(exists ? "Removed from wishlist" : "Saved to wishlist");
  return !exists;
}

function addRecentlyViewed(product) {
  const compact = {
    id: product.id,
    title: product.title,
    image: product.image,
    price: product.price
  };
  const next = [compact, ...store.get(RECENT_KEY).filter((item) => Number(item.id) !== Number(product.id))].slice(0, 6);
  store.set(RECENT_KEY, next);
}

function renderSummary(target = "[data-cart-summary]") {
  const totals = cartTotals();
  const node = document.querySelector(target);
  if (!node) return;
  node.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${formatMoney(totals.subtotal)}</strong></div>
    <div class="summary-row"><span>Estimated tax</span><strong>${formatMoney(totals.tax)}</strong></div>
    <div class="summary-row"><span>Shipping</span><strong>${totals.shipping ? formatMoney(totals.shipping) : "Free"}</strong></div>
    <div class="summary-row total"><span>Total</span><strong>${formatMoney(totals.total)}</strong></div>
  `;
  syncCheckoutAccess();
}

function syncCheckoutAccess() {
  const link = document.querySelector("[data-checkout-link]");
  if (!link) return;
  const empty = getCart().length === 0;
  link.setAttribute("aria-disabled", String(empty));
  link.style.opacity = empty ? "0.55" : "1";
  link.style.pointerEvents = empty ? "none" : "auto";
  link.textContent = empty ? "Add items to checkout" : "Checkout";
}

function renderCartPage() {
  const list = document.querySelector("[data-cart-items]");
  if (!list) return;
  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div>
          <h2>Your cart is ready for something brilliant.</h2>
          <p class="muted">Explore curated products and add your favorites.</p>
          <a class="btn" href="products.html">Browse products</a>
        </div>
      </div>`;
  } else {
    list.innerHTML = cart.map((item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div>
          <h3>${item.title}</h3>
          <p class="muted">${item.category}</p>
          <strong>${formatMoney(item.price)}</strong>
        </div>
        <div class="cart-controls">
          <div class="quantity">
            <button data-qty-minus="${item.id}" aria-label="Decrease quantity">-</button>
            <input value="${item.quantity}" readonly aria-label="Quantity">
            <button data-qty-plus="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn secondary small" data-remove="${item.id}" style="margin-top:10px">Remove</button>
        </div>
      </article>
    `).join("");
  }
  renderSummary();
}

document.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  const plus = event.target.closest("[data-qty-plus]");
  const minus = event.target.closest("[data-qty-minus]");
  if (remove) removeFromCart(remove.dataset.remove);
  if (plus) {
    const item = getCart().find((cartItem) => Number(cartItem.id) === Number(plus.dataset.qtyPlus));
    updateQuantity(item.id, item.quantity + 1);
  }
  if (minus) {
    const item = getCart().find((cartItem) => Number(cartItem.id) === Number(minus.dataset.qtyMinus));
    updateQuantity(item.id, item.quantity - 1);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();
  renderSummary();
});
