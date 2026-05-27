# SmartCart

SmartCart is a complete responsive e-commerce web application built with HTML, CSS, vanilla JavaScript, and PHP. It is designed as a professional internship, GitHub portfolio, LinkedIn, and resume project.

## Features

- Modern startup-style landing page with sticky navigation, hero CTA, category cards, flash sale, testimonials, newsletter, and footer
- Dynamic product catalog using Fake Store API with curated fallback products
- Indian rupee pricing across product cards, cart, checkout, and dashboard UI
- Product search, category filtering, price filtering, sorting, ratings, badges, quick view, and wishlist
- Product details page with image gallery, specifications, quantity selector, add to cart, buy now, reviews-ready UI, and related products
- Shopping cart with LocalStorage persistence, quantity updates, removal, empty state, and live totals
- Checkout page with billing/shipping form, coupon UI, payment selection, order summary, and success animation
- PHP signup, login, logout, session handling, password hashing, validation, and admin access guard
- PHP-protected admin dashboard with analytics cards, sidebar, chart UI, product CRUD demo, responsive table, users, and orders
- Dark/light mode, toast notifications, skeleton loaders, loading spinner, back-to-top button, hamburger menu, image zoom, scroll reveal, debounced search, recently viewed storage

## Technologies Used

- HTML5 semantic pages
- CSS3 with variables, Grid, Flexbox, glassmorphism, responsive breakpoints, and animations
- Vanilla JavaScript with ES6 modules-style organization, Fetch API, Async/Await, LocalStorage, event delegation, and debouncing
- PHP sessions, password hashing, form validation, and JSON-backed demo user storage
- Fake Store API for product data
- Unsplash-hosted images for hero and product visuals

## Folder Structure

```text
smartcart/
├── index.html
├── products.html
├── product-details.html
├── cart.html
├── checkout.html
├── login.html
├── signup.html
├── admin.html              # redirects visitors to login
├── about.html
├── contact.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── animations.css
│   └── admin.css
├── js/
│   ├── app.js
│   ├── cart.js
│   ├── auth.js
│   ├── products.js
│   ├── api.js
│   ├── dashboard.js
│   └── animations.js
├── php/
│   ├── db.php
│   ├── login.php
│   ├── register.php
│   ├── logout.php
│   └── admin.php           # protected admin dashboard
├── images/
├── assets/
└── README.md
```

## Installation

1. Install PHP 8 or later.
2. Open a terminal in the `smartcart` folder.
3. Start the PHP development server:

```bash
php -S localhost:8000
```

4. Visit `http://localhost:8000`.
5. Open the dashboard only by logging in as admin. Direct `admin.html` access redirects to login.

Demo admin login:

```text
Email: admin@smartcart.dev
Password: admin123
```

## Screenshots

Add screenshots of:

- Home page
- Product catalog
- Product details
- Cart and checkout
- Admin dashboard
- Mobile navigation

## Performance Optimizations

- Lazy-loaded images
- Skeleton loading states
- Debounced product and admin search
- Event delegation for product, cart, and admin actions
- Reduced DOM updates through targeted render functions
- CSS variables and shared components for smaller repeated styling
- Responsive grids and stable dimensions to prevent layout shifts
- LocalStorage persistence for fast cart, wishlist, and admin demo interactions

## Deployment

Static pages can be hosted on Netlify, Vercel, or GitHub Pages, but PHP auth requires a PHP-capable host such as InfinityFree, 000webhost, Hostinger, XAMPP, WAMP, MAMP, or a VPS.

For PHP hosting:

1. Upload the `smartcart` folder to your server.
2. Ensure the `assets` directory is writable so `users.json` can be created.
3. Open `index.html` from the hosted root.
4. Use the login and signup forms through the PHP server.

## Future Improvements

- Replace JSON demo storage with MySQL tables for users, products, carts, and orders
- Add real payment integration with Stripe or Razorpay
- Add server-side product APIs and admin authentication middleware
- Add email-based password reset
- Add order history and invoice generation
- Add image uploads for admin product management
- Add automated tests and Lighthouse performance auditing
