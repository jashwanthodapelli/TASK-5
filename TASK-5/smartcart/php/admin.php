<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['user']) || ($_SESSION['user']['role'] ?? '') !== 'admin') {
    redirect_with_status('../login.html', 'error', 'Admin access required.');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | SmartCart</title>
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/responsive.css">
  <link rel="stylesheet" href="../css/animations.css">
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
  <main class="admin-shell">
    <aside class="admin-sidebar">
      <a class="brand" href="../index.html"><img class="brand-logo" src="../assets/logo.svg" alt="SmartCart logo"><span>SmartCart</span></a>
      <nav class="admin-menu">
        <a class="active" href="#">Dashboard</a>
        <a href="#products">Products</a>
        <a href="#orders">Orders</a>
        <a href="#users">Users</a>
        <a href="logout.php">Logout</a>
      </nav>
    </aside>
    <section class="admin-main">
      <div class="admin-top">
        <div>
          <span class="eyebrow">Admin panel</span>
          <h1>Commerce overview</h1>
          <p class="muted">Welcome, <?php echo htmlspecialchars($_SESSION['user']['name'] ?? 'Admin', ENT_QUOTES, 'UTF-8'); ?>. Product management, analytics cards, sales chart UI, users and orders are now behind login.</p>
        </div>
        <div class="inline-actions">
          <button class="icon-btn" data-theme-toggle title="Toggle theme">&#9680;</button>
          <button class="btn" data-add-admin>Add product</button>
        </div>
      </div>
      <div class="analytics-grid">
        <div class="analytics-card"><span class="muted">Revenue</span><strong>₹48.2L</strong></div>
        <div class="analytics-card"><span class="muted">Orders</span><strong>1,248</strong></div>
        <div class="analytics-card"><span class="muted">Customers</span><strong>8,940</strong></div>
        <div class="analytics-card"><span class="muted">Conversion</span><strong>7.8%</strong></div>
      </div>
      <div class="admin-grid">
        <div class="admin-card">
          <h2>Sales overview</h2>
          <div class="chart-ui">
            <div class="chart-bar" style="height:45%"></div>
            <div class="chart-bar" style="height:72%"></div>
            <div class="chart-bar" style="height:58%"></div>
            <div class="chart-bar" style="height:84%"></div>
            <div class="chart-bar" style="height:64%"></div>
            <div class="chart-bar" style="height:92%"></div>
          </div>
        </div>
        <div class="admin-card">
          <h2>Recent orders</h2>
          <p class="summary-row"><span>#SC-2048</span><strong>₹28,999</strong></p>
          <p class="summary-row"><span>#SC-2047</span><strong>₹5,499</strong></p>
          <p class="summary-row"><span>#SC-2046</span><strong>₹2,499</strong></p>
        </div>
      </div>
      <div class="admin-card" id="products" style="margin-top:18px">
        <div class="section-head">
          <div><span class="eyebrow">Inventory</span><h2>Manage products</h2></div>
          <input class="field" data-admin-search placeholder="Search inventory" style="max-width:320px">
        </div>
        <div class="table-wrap">
          <table class="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales</th><th>Actions</th></tr></thead>
            <tbody data-admin-products></tbody>
          </table>
        </div>
      </div>
      <div class="admin-grid" style="margin-top:18px">
        <div class="admin-card" id="users">
          <h2>Manage users</h2>
          <p class="summary-row"><span>Aisha Rao</span><strong>Customer</strong></p>
          <p class="summary-row"><span>Demo Admin</span><strong>Admin</strong></p>
          <p class="summary-row"><span>Maya Kim</span><strong>Customer</strong></p>
        </div>
        <div class="admin-card" id="orders">
          <h2>Product statistics</h2>
          <p class="summary-row"><span>Top product</span><strong>PulseFit Watch</strong></p>
          <p class="summary-row"><span>Wishlist saves</span><strong>2,408</strong></p>
          <p class="summary-row"><span>Return rate</span><strong>1.2%</strong></p>
        </div>
      </div>
    </section>
  </main>
  <div class="modal" data-modal></div>
  <script src="../js/api.js"></script>
  <script src="../js/app.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/dashboard.js"></script>
  <script src="../js/animations.js"></script>
</body>
</html>
