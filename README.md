# ShopEasy – Full-Stack Modern E-Commerce Platform

ShopEasy is a complete, enterprise-grade e-commerce platform built with a high-performance **React Native / Expo Go** mobile application, a scalable **Node.js / Express / TypeScript** REST API backend with **MongoDB** and **Cloudinary**, and a web-based **Admin Dashboard** built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 🏗 Platform Architecture

```
shopeasy/
├── app/                  # Expo Router Customer Mobile Screens
├── components/           # Mobile UI Components (Cards, Inputs, Headers)
├── context/              # Cart, Auth, Orders, Favorites State Contexts
├── services/             # Mobile API Client & Cloud Sync
├── backend/              # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/       # MongoDB Connection, Environment Variables
│   │   ├── controllers/  # Products, Orders, Categories, Customers, Analytics, Cloudinary
│   │   ├── middleware/   # JWT Auth, Roles, Multer Upload, Zod Validation
│   │   ├── models/       # Mongoose Schemas (Admin, Product, Order, Customer, etc.)
│   │   ├── routes/       # Admin, Customer, and Payment Routes
│   │   ├── services/     # Cloudinary, Paystack, Email Services
│   │   ├── utils/        # Seed script, Currency, Audit logging, Tokens
│   │   └── app.ts, server.ts
│   ├── package.json
│   └── .env
├── admin/                # React + Vite + Tailwind CSS Admin Web Dashboard
│   ├── src/
│   │   ├── pages/        # Login, Dashboard, Products, Orders, Customers, Categories, Analytics, Marketing, Settings
│   │   ├── layouts/      # Purple Sidebar Navigation & Top Header
│   │   ├── components/   # Metrics Sparklines, Modals
│   │   ├── services/     # Axios API Client & Mock Fallbacks
│   │   ├── context/      # Admin Auth Context
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
└── package.json          # Root Mobile App Configuration
```

---

## 🔐 Default Admin Credentials

- **Email**: `admin@shopeasy.com`
- **Password**: `Admin@123456`
- **Role**: `Super Admin`
- **Access**: Full platform control (Products, Orders, Customers, Categories, Marketing, Analytics, Cloudinary & Settings)

---

## 🚀 Quick Start Guide

### 1. Backend REST API (`backend/`)

```bash
# Navigate to backend
cd backend

# Install dependencies (already installed)
npm install

# Seed MongoDB with initial admin, products, categories & orders
npm run seed

# Start development server
npm run dev
# Running on http://localhost:5000
```

### 2. Admin Web Dashboard (`admin/`)

```bash
# Navigate to admin
cd admin

# Start Vite dev server
npm run dev
# Running on http://localhost:5173
```

Log in with `admin@shopeasy.com` / `Admin@123456`.

### 3. Customer Mobile Application (Root)

```bash
# In the root project directory:
npx expo start -c
```
- Scan the QR code using the **Expo Go** app on your iOS or Android mobile device.
- For remote testing outside your local Wi-Fi, run:
```bash
npx expo start --tunnel
```

---

## 🍃 MongoDB & ☁️ Cloudinary Integration

### MongoDB Database
Configure your connection string in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopeasy?retryWrites=true&w=majority
```
*Health Check*: Visit `http://localhost:5000/api/v1/health/db` to verify database status.

### Cloudinary Image Storage
Configure your Cloudinary credentials in `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
*Upload Endpoints*:
- `POST /api/v1/admin/upload` (Single image upload with automated WEBP optimization)
- `POST /api/v1/admin/upload/multiple` (Up to 8 product gallery images)
- `DELETE /api/v1/admin/upload` (Delete asset by public ID)

---

## 📊 Admin Dashboard Features

1. **Admin Login**: Faithful recreation of the split purple branding panel, 3D analytics podium graphic, and secure access card.
2. **Dashboard Overview**: 4 sparkline metric cards, Recharts sales overview curve, top selling products list, customer growth donut chart.
3. **Products Management**: Live search, category & stock filters, responsive product card grid, and Add/Edit product modal with Cloudinary upload.
4. **Orders Management**: Status filter tabs (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), order status updater, item thumbnails, and customer details modal.
5. **Customers Management**: Spending analytics, total orders counter, active/inactive status toggle, and registration modal.
6. **Categories Management**: 8 retail categories (Phones, Fashion, Beauty, Home, Electronics, Shoes, Accessories, Others) with live product counts and active badges.
7. **Analytics**: Dual-series Recharts sales & orders curve, sales by category donut chart, customer growth weekly bar chart, recent activities feed.
8. **Marketing**: Active campaign banners (10% Off Everything & Free Delivery Campaign), marketing performance area chart, discount codes table (`SHOP10`, `FREESHIP`, `WELCOME5`), quick action tiles.
9. **Settings**: Store profile, Paystack API keys, Cloudinary credentials, and MongoDB connection manager.

---

## 🧪 Verification & Build Status

- **Mobile App**: `npx tsc --noEmit` passed with 0 errors. Compatible with Expo Go.
- **Backend API**: `npm run build` passed with 0 errors (`dist/` generated).
- **Admin Dashboard**: `npm run build` passed with 0 errors (`dist/` generated).
