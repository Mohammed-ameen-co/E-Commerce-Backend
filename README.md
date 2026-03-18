# E-Commerce Backend API

A scalable and secure backend for an E-Commerce application built using **Node.js, Express, and MongoDB**.
This project includes authentication, order management, cart system, inventory handling, and email-based workflows.

---

## Features

### Authentication & Security

* User Signup & Login (JWT based)
* Email Verification System
* Forgot Password (Token-based reset)
* Change Password (with session invalidation)
* Role-based access (User / Admin)
* Secure password hashing (bcrypt)

---

### Core Modules

* Product Categories
* Product Inventory & Variants
* Cart Management
* Order System (COD + Online)
* Order Cancellation
* Admin Order Control

---

### Order Flow

* Pending → Processing → Shipped → Delivered → Cancelled
* Auto stock update (order + cancellation)
* Shipping charge calculation

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Auth:** JWT (Access + Refresh Token)
* **Security:** bcrypt, crypto
* **Email:** Custom Email Utility

---

## Project Structure

```bash
E-COMMERCE/
│
├── config/
│   └── db.config.js
│
├── controllers/
│   ├── user.controller.js
│   ├── admin.controller.js
│   ├── order.controller.js
│   ├── cart.controller.js
│   ├── category.controller.js
│   ├── inventory.controller.js
│   ├── variant.controller.js
│   ├── address.controller.js
│   └── emailverify.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   ├── optional.middleware.js
│   └── esession.middleware.js
│
├── models/
│   ├── user.model.js
│   ├── session.model.js
│   ├── eSession.model.js
│   ├── verification.model.js
│   ├── orders.model.js
│   ├── cart.model.js
│   ├── category.model.js
│   ├── inventory.model.js
│   ├── variant.model.js
│   └── address.model.js
│
├── routes/
│   ├── user.routes.js
│   ├── admin.routes.js
│   ├── order.routes.js
│   ├── cart.routes.js
│   ├── category.routes.js
│   ├── inventory.routes.js
│   ├── variant.routes.js
│   ├── address.routes.js
│   └── emailverify.routes.js
│
├── utils/
│   ├── email.utils.js
│   └── token.utils.js
│
├── uploads/
│
├── app.js
├── index.js
├── package.json
└── README.md
```

---

## Installation

```bash
git clone https://github.com/Mohammed-ameen-co/E-Commerce-Backend
cd E-Commerce-Backend

npm install
npm run dev
```

---

## Environment Variables

```env
# Server
PORT=5000

#  Database
MONGO_URI=your_mongodb_connection

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Admin 
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# Email (Nodemailer - Google OAuth)
EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

# URLs
CLIENT_URL=http://localhost:3000 #frontend

BASE_URL=http://localhost:3000 #backend
```

---

## Important API Endpoints

### Auth

* `POST /api/e-user/signup`
* `POST /api/e-user/login`
* `POST /api/e-user/logout`
* `POST /api/e-user/refresh-token`
* `POST /api/e-user/change-password`
* `POST /api/e-user/forgot-password`
* `POST /api/e-user/reset-password/:userId/:token`

---

### Email Verify

* `GET /api/e-commerce/verify-email/:token`

---

### Admin

* `POST /api/e-admin/create-admin`

---

### Category

* `POST /api/e-category/create-category`
* `PUT /api/e-category/update-category/:categoryId`
* `GET /api/e-category/get-categorys`

---

### Inventory

* `POST /api/e-invantory/add-product`
* `PUT /api/e-invantory/update-product/:productId`
* `GET /api/e-invantory/`

---

### Variant

* `POST /api/e-invantory/create-variant`
* `PUT /api/e-invantory/update-variant/:variantId/variant`

---

### Cart

* `POST /api/e-cart/add-cart`
* `DELETE /api/e-cart/remove-item/:variantId`
* `DELETE /api/e-cart/remove-one-item/:variantId`
* `GET /api/e-cart/get-cart`

---

### Address

* `POST /api/e-address/add-address`
* `PUT /api/e-address/update-address`
* `DELETE /api/e-address/remove-address`
* `GET /api/e-address/get-user-address`


---

### Orders

* `POST /api/e-order/create`
* `PUT /api/e-order/update-order` (Admin)
* `POST /api/e-order/cancelled-order` (User)

---


## Security Features

* Password hashing with bcrypt
* Token-based authentication (JWT)
* Refresh token session storage
* One-time reset tokens (hashed)
* Session invalidation on password change
* Role-based authorization

---

## Future Improvements

* Payment Gateway Integration (Razorpay / Stripe)
* Order Return & Refund System
* Admin Dashboard APIs (analytics, user & order management)
* Rate Limiting & Brute Force Protection
* Logging & Monitoring (Winston / Morgan)

---

### E-Commerce Enhancements

* Product Reviews & Ratings System
* Coupon / Discount Code System
* Wishlist / Favorites Feature
* Advanced Product Search & Filters
* Order Tracking (real-time status updates)

---

### Security & Performance

* Refresh Token Rotation
* Account Lock after multiple failed login attempts
* Device & IP based session tracking
* Caching (Redis for performance boost)

---

### Notifications & Communication

* Email Notifications (order placed, shipped, delivered)
* Push Notifications (future scope)

---

### Scalability & DevOps

* Dockerization
* Cloud Deployment (AWS / Render / Vercel backend)
* API Documentation (Swagger / Postman)
* Unit & Integration Testing (Jest)

---

## Author

**Ameen Nilgar**

---

## Note

This backend is designed with real-world scalability and security practices.
Can be extended with a React / Next.js frontend.

---
