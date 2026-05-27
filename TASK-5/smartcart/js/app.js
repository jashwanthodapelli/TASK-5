function showToast(message, type = "info") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.borderLeftColor = type === "success" ? "var(--success)" : type === "error" ? "var(--accent)" : "var(--primary)";
  toast.textContent = message;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function debounce(fn, delay = 260) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function productCard(product) {
  return `
    <article class="product-card reveal" data-product-id="${product.id}">
      <div class="product-media">
        <span class="badge">${product.badge}</span>
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <div class="product-actions">
          <button class="icon-btn" data-wishlist="${product.id}" title="Save to wishlist" aria-label="Save to wishlist">♡</button>
          <button class="icon-btn" data-quick="${product.id}" title="Quick view" aria-label="Quick view">⌕</button>
        </div>
      </div>
      <div class="product-body">
        <div class="rating">★ ${product.rating.rate} <span class="muted">(${product.rating.count})</span></div>
        <h3><a href="product-details.html?id=${product.id}">${product.title}</a></h3>
        <div class="price-row">
          <span class="price">${formatMoney(product.price)}</span>
          <button class="btn small" data-add="${product.id}">Add</button>
        </div>
      </div>
    </article>`;
}

function bindGlobalUi() {
  const theme = localStorage.getItem("smartcart_theme") || "light";
  document.documentElement.dataset.theme = theme;

  const params = new URLSearchParams(window.location.search);
  if (params.has("message")) {
    showToast(params.get("message"), params.get("status") || "info");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("smartcart_theme", next);
      showToast(`${next === "dark" ? "Dark" : "Light"} mode enabled`);
    });
  });

  document.querySelectorAll("[data-nav-toggle]").forEach((button) => {
    button.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  });

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  const backTop = document.querySelector("[data-back-top]");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 520);
    }, { passive: true });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      showToast("You're on the SmartCart list.", "success");
    });
  });
}

function renderQuickView(product) {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;
  modal.innerHTML = `
    <div class="modal-card glass">
      <button class="icon-btn" data-close-modal style="float:right" aria-label="Close">×</button>
      <div class="details-grid">
        <div class="gallery-main glass"><img src="${product.image}" alt="${product.title}"></div>
        <div>
          <span class="badge">${product.badge}</span>
          <h2>${product.title}</h2>
          <div class="rating">★ ${product.rating.rate} <span class="muted">(${product.rating.count} reviews)</span></div>
          <p class="muted">${product.description}</p>
          <p class="price">${formatMoney(product.price)}</p>
          <div class="inline-actions">
            <button class="btn" data-add="${product.id}">Add to cart</button>
            <a class="btn secondary" href="product-details.html?id=${product.id}">View details</a>
          </div>
        </div>
      </div>
    </div>`;
  modal.classList.add("active");
}

document.addEventListener("click", async (event) => {
  const close = event.target.closest("[data-close-modal]");
  if (close || event.target.matches("[data-modal]")) {
    document.querySelector("[data-modal]")?.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", bindGlobalUi);
