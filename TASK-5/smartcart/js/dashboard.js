const ADMIN_PRODUCTS_KEY = "smartcart_admin_products_inr";

function adminProducts() {
  const seeded = store.get(ADMIN_PRODUCTS_KEY, null);
  if (seeded) return seeded;
  const initial = fallbackProducts.map((product) => ({ ...product, stock: 42, sales: Math.round(product.popularity * 12) }));
  store.set(ADMIN_PRODUCTS_KEY, initial);
  return initial;
}

function saveAdminProducts(products) {
  store.set(ADMIN_PRODUCTS_KEY, products);
}

function renderAdmin() {
  const table = document.querySelector("[data-admin-products]");
  if (!table) return;
  const search = document.querySelector("[data-admin-search]")?.value.toLowerCase() || "";
  const products = adminProducts().filter((product) => product.title.toLowerCase().includes(search));
  table.innerHTML = products.map((product) => `
    <tr>
      <td><div class="admin-product"><img src="${product.image}" alt=""><strong>${product.title}</strong></div></td>
      <td>${product.category}</td>
      <td>${formatMoney(product.price)}</td>
      <td>${product.stock}</td>
      <td>${product.sales}</td>
      <td>
        <button class="btn secondary small" data-edit-admin="${product.id}">Edit</button>
        <button class="btn danger small" data-delete-admin="${product.id}">Delete</button>
      </td>
    </tr>
  `).join("");
}

function openAdminModal(product = {}) {
  const modal = document.querySelector("[data-modal]");
  modal.innerHTML = `
    <form class="modal-card glass" data-admin-form>
      <button class="icon-btn" type="button" data-close-modal style="float:right">×</button>
      <h2>${product.id ? "Edit product" : "Add product"}</h2>
      <input type="hidden" name="id" value="${product.id || Date.now()}">
      <input class="field" name="title" placeholder="Product name" value="${product.title || ""}" required>
      <input class="field" name="category" placeholder="Category" value="${product.category || ""}" required>
      <input class="field" name="price" type="number" step="0.01" placeholder="Price" value="${product.price || ""}" required>
      <input class="field" name="stock" type="number" placeholder="Stock" value="${product.stock || 20}" required>
      <input class="field" name="image" placeholder="Image URL" value="${product.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"}" required>
      <textarea class="textarea" name="description" placeholder="Description">${product.description || ""}</textarea>
      <button class="btn" type="submit">Save product</button>
    </form>`;
  modal.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAdmin();
  document.querySelector("[data-admin-search]")?.addEventListener("input", debounce(renderAdmin));
  document.querySelector("[data-add-admin]")?.addEventListener("click", () => openAdminModal());
});

document.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit-admin]");
  const del = event.target.closest("[data-delete-admin]");
  if (edit) {
    const product = adminProducts().find((item) => Number(item.id) === Number(edit.dataset.editAdmin));
    openAdminModal(product);
  }
  if (del) {
    saveAdminProducts(adminProducts().filter((item) => Number(item.id) !== Number(del.dataset.deleteAdmin)));
    showToast("Product deleted");
    renderAdmin();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-admin-form]");
  if (!form) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const product = {
    id: Number(data.id),
    title: data.title,
    category: data.category,
    price: Number(data.price),
    stock: Number(data.stock),
    image: data.image,
    description: data.description,
    sales: 0,
    rating: { rate: 4.6, count: 48 },
    popularity: 72,
    badge: "Admin"
  };
  const products = adminProducts();
  const exists = products.some((item) => item.id === product.id);
  saveAdminProducts(exists ? products.map((item) => item.id === product.id ? product : item) : [product, ...products]);
  document.querySelector("[data-modal]")?.classList.remove("active");
  showToast("Product saved", "success");
  renderAdmin();
});
