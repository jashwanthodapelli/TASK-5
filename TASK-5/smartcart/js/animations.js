function revealNow() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

function initSaleTimer() {
  const nodes = document.querySelectorAll("[data-countdown]");
  if (!nodes.length) return;
  const end = Date.now() + 1000 * 60 * 60 * 26;
  const tick = () => {
    const remaining = Math.max(0, end - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    nodes.forEach((node) => {
      node.innerHTML = `
        <div class="time-box"><strong>${String(hours).padStart(2, "0")}</strong><span>Hours</span></div>
        <div class="time-box"><strong>${String(minutes).padStart(2, "0")}</strong><span>Minutes</span></div>
        <div class="time-box"><strong>${String(seconds).padStart(2, "0")}</strong><span>Seconds</span></div>`;
    });
  };
  tick();
  setInterval(tick, 1000);
}

function initCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) return;
  if (!getCart().length) {
    document.querySelector("[data-checkout-result]").innerHTML = `
      <div class="container section-tight">
        <div class="checkout-panel empty-state">
          <div>
            <h2>Your cart is empty</h2>
            <p class="muted">Add at least one product before opening checkout.</p>
            <a class="btn" href="products.html">Browse products</a>
          </div>
        </div>
      </div>`;
    return;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    document.querySelector("[data-checkout-result]").innerHTML = `
      <div class="empty-state">
        <div>
          <div class="success-mark">&#10003;</div>
          <h2>Order placed successfully</h2>
          <p class="muted">A polished confirmation flow is ready for payment integration.</p>
          <a class="btn" href="products.html">Continue shopping</a>
        </div>
      </div>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  revealNow();
  initSaleTimer();
  initCheckout();
});
