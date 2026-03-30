# 🛍️ LuxeWear — Premium Fashion E-Commerce Platform

A full-stack, production-ready e-commerce clothing website with a futuristic glassmorphism UI, Razorpay payments, JWT authentication, and a complete admin dashboard.

---

## ✨ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Auth** | JWT + bcryptjs |
| **Payments** | Razorpay (Test Mode) |

---

## 📁 Project Structure

```
luxe-wear/
├── frontend/                  # React application
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/        # CustomCursor, Loader, ProtectedRoute
│       │   ├── layout/        # Navbar, Footer
│       │   └── product/       # ProductCard
│       ├── context/           # AuthContext, CartContext, WishlistContext
│       ├── pages/             # Home, Products, ProductDetail, Cart, Checkout, Orders, Wishlist, Login, Admin
│       ├── styles/            # globals.css
│       ├── utils/             # api.js (Axios instance + all API calls)
│       └── App.js
│
└── backend/                   # Express API server
    ├── config/
    │   ├── db.js              # MySQL connection pool
    │   └── schema.sql         # Full DB schema + seed data
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── cartController.js
    │   └── extraControllers.js  # wishlist, orders, categories, admin stats
    ├── middleware/
    │   └── auth.js            # protect + adminOnly middleware
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   └── index.js           # cart, wishlist, orders, categories, admin
    └── server.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MySQL >= 8.0
- npm or yarn
- Razorpay account (test mode keys)

---

### 1. Clone & Navigate

```bash
git clone <your-repo-url> luxe-wear
cd luxe-wear
```

---

### 2. Database Setup

```bash
# Log into MySQL
mysql -u root -p

# Run the schema (creates DB, tables, and seeds ~30 products)
mysql -u root -p < backend/config/schema.sql
```

This creates:
- Database: `luxe_wear_db`
- All 8 tables (users, products, categories, cart, cart_items, wishlist, orders, order_items)
- 6 categories + 30+ curated products
- 2 demo users (admin + regular user)

---

### 3. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=luxe_wear_db

JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

CLIENT_URL=http://localhost:3000
```

```bash
# Start backend
npm run dev
# Server runs on http://localhost:5000
```

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install

# Copy and configure environment
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start frontend
npm start
# App runs on http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@luxewear.com | Admin@123 |
| User | john@example.com | Admin@123 |

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |
| PUT | /api/auth/profile | Protected |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/products | Public |
| GET | /api/products/featured | Public |
| GET | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/cart | Protected |
| POST | /api/cart | Protected |
| PUT | /api/cart/:itemId | Protected |
| DELETE | /api/cart/:itemId | Protected |
| DELETE | /api/cart/clear | Protected |

### Wishlist
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/wishlist | Protected |
| POST | /api/wishlist | Protected |
| DELETE | /api/wishlist/:productId | Protected |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders/create-razorpay-order | Protected |
| POST | /api/orders/verify-payment | Protected |
| GET | /api/orders/my-orders | Protected |
| GET | /api/orders/all | Admin |
| PUT | /api/orders/:id/status | Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/admin/stats | Admin |
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| DELETE | /api/categories/:id | Admin |

---

## 🎨 UI Features

- **Glassmorphism cards** with frosted translucent backgrounds
- **Liquid gradient background** with animated iridescent color shifts  
- **Floating orbs** with aurora-colored glow effects
- **Custom morphing cursor** (gold dot + lagging ring)
- **Scrollytelling** — sections reveal on scroll via IntersectionObserver
- **Framer Motion** animations — page transitions, staggered reveals, hover states
- **Kinetic typography** — animated text reveals in hero
- **Micro-interactions** — hover overlays on product cards, button ripples

---

## 🛒 Feature Checklist

### User Features
- [x] Browse all products with filtering & sorting
- [x] Category-based navigation
- [x] Product detail page with size/color selection
- [x] Add to cart with quantity management
- [x] Persistent cart (database-backed)
- [x] Wishlist (add/remove, login required)
- [x] Razorpay checkout (test mode)
- [x] Order history with status tracking
- [x] JWT authentication (register/login)
- [x] Protected routes

### Admin Features
- [x] Dashboard with stats (users, products, orders, revenue)
- [x] Full CRUD for products (add/edit/delete)
- [x] Order management (view all, update status)
- [x] Category management
- [x] Admin-only protected routes

---

## 💳 Razorpay Test Cards

| Card Number | Expiry | CVV |
|-------------|--------|-----|
| 4111 1111 1111 1111 | Any future | Any |
| 5267 3181 8797 5449 | Any future | Any |

UPI: Use `success@razorpay` for successful test payments.

---

## 🔧 Environment Variables Reference

### Backend
```
PORT                  Server port (default: 5000)
NODE_ENV              development | production
DB_HOST               MySQL host
DB_USER               MySQL username
DB_PASSWORD           MySQL password
DB_NAME               Database name (luxe_wear_db)
JWT_SECRET            Secret key for JWT signing (min 32 chars)
JWT_EXPIRES_IN        Token expiry (e.g. 7d, 24h)
RAZORPAY_KEY_ID       Your Razorpay key ID
RAZORPAY_KEY_SECRET   Your Razorpay secret key
CLIENT_URL            Frontend URL for CORS
```

### Frontend
```
REACT_APP_API_URL           Backend API base URL
REACT_APP_RAZORPAY_KEY_ID   Razorpay public key ID
```

---

## 🚢 Production Deployment

### Backend
```bash
NODE_ENV=production npm start
```

### Frontend
```bash
npm run build
# Serve the /build folder with nginx or a static host
```

### Recommended Stack
- **Backend**: Railway / Render / EC2
- **Frontend**: Vercel / Netlify
- **Database**: PlanetScale / AWS RDS

---

## 🔒 Security Features

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens with expiry
- Protected API routes via middleware
- Role-based access control (user/admin)
- Input validation on all endpoints
- SQL injection protection via parameterized queries
- CORS configured to frontend origin only

---

## 📦 Database Schema

```sql
users       → id, name, email, password, role, created_at
categories  → id, name, slug, description, image
products    → id, name, description, price, original_price, category_id, image, sizes(JSON), colors(JSON), stock, rating, featured, trending
cart        → id, user_id
cart_items  → id, cart_id, product_id, quantity, size, color
wishlist    → id, user_id, product_id
orders      → id, user_id, total_price, status, payment_id, razorpay_order_id, payment_status, shipping_address(JSON)
order_items → id, order_id, product_id, quantity, price, size, color
```

---

Built with ❤️ — LuxeWear
