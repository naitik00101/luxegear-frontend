# LuxeGear — Premium E-Commerce Experience (INR Edition)

LuxeGear is a full-stack, professional-grade e-commerce platform designed for high-performance tech enthusiasts. It features a sleek, responsive UI, robust backend architecture, and an enterprise-grade security suite.

## 🚀 Key Features

- **Full-Stack Integration**: React frontend powered by an Express/Node.js REST API.
- **Enterprise Security (Passport.js)**: 
  - **JWT Rotation**: 15-minute access tokens + 7-day refresh tokens.
  - **Account Lockout**: 5 failed login attempts lock the account for 30 minutes.
  - **Defensive Middleware**: Helmet (Security Headers), Rate Limiting, NoSQL Injection protection (Mongo Sanitize), and HPP.
- **Currency Localization**: Fully localized for the Indian market with **Rupee (₹)** currency and regional shipping thresholds (Free shipping over ₹10,000).
- **Role-Based Access Control (RBAC)**: Dedicated interfaces and permissions for Customers and Administrators.
- **Comprehensive Admin Panel**: Real-time dashboard for managing products, users, and order fulfillment.
- **Premium User Experience**:
  - Secure and intuitive Checkout flow with Razorpay integration.
  - Silent Token Refresh Interceptor for seamless user sessions.
  - Persistent shopping cart and wishlist.
  - Advanced product filtering and sorting.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Context API, Vanilla CSS.
- **Backend**: Node.js, Express, Passport.js, Mongoose.
- **Database**: MongoDB Atlas (Cloud Hosted).
- **Automation**: GitHub Actions (CI/CD Pipeline).

## 📂 Project Structure

- `server/`: Express API, Passport strategies, Models, and Middleware.
- `src/`: React frontend with Components, Hooks, Context, Pages, and Services.
- `.github/workflows/`: CI/CD automation scripts.

## 🏗️ Getting Started

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/naitik00101/luxegear-frontend.git
    cd luxegear-frontend
    npm install
    cd server && npm install
    ```
2.  **Environment Setup**:
    Configure `.env` files for both frontend and backend using the provided templates (`.env.example`). Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set.
3.  **Seed Data**:
    ```bash
    cd server
    npm run seed
    ```
4.  **Launch**:
    ```bash
    # Backend (from /server)
    npm run dev
    # Frontend (from root)
    npm run dev
    ```

## 🤖 CI/CD
This project uses **GitHub Actions** to automatically verify builds on every push to the `main` branch.

---
Built for professional excellence. Localized for India.
