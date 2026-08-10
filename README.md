# Fashionify

Fashionify is a simple, beginner-friendly full-stack fashion e-commerce MVP built with **Spring Boot** on the backend and **React.js** on the frontend. The project demonstrates a clean e-commerce flow with two roles (**USER** and **ADMIN**) while keeping the code readable, structured, and easy to maintain.

> [!IMPORTANT]
> **Fashionify uses basic Spring Boot HttpSession-based session authentication, not JWT or Spring Security.**

---

## 🛠 Tech Stack

### Backend
* **Language:** Java 21
* **Framework:** Spring Boot (Spring Web, Spring Data JPA, Bean Validation)
* **Database:** MySQL 8.0
* **Authentication & Hashing:** Spring `HttpSession`, BCrypt
* **Build Tool:** Maven

### Frontend
* **Library & Bundler:** React.js (v19) + Vite
* **Routing:** React Router DOM (v7)
* **HTTP Client:** Axios (`withCredentials: true`)
* **State Management:** React Context API (`AuthContext`, `CartContext`)
* **Styling & UI:** Tailwind CSS (v4), shadcn/ui components, Lucide React icons

---

## 🔒 Authentication Architecture

```
React
  ↓
Axios
  ↓
Spring Boot REST API
  ↓
HttpSession
  ↓
MySQL
```

* **Session-Based Authentication:** Fashionify uses standard Spring Boot `HttpSession`. After successful login, the backend stores session attributes (`"userId"` and `"role"`) in the HTTP session. The session is used to identify the currently logged-in user and enforce authorization.
* **Cookie-Based Credentials:** The frontend Axios instance configures `withCredentials: true` so that the browser automatically sends the HTTP session cookie (`JSESSIONID`) with every cross-origin API request.
* **No Tokens:** The frontend does **NOT** store a JWT. There is **NO** JWT in `localStorage`, and there is **NO** `Authorization: Bearer` header.
* **Password Hashing:** Passwords are intended to be hashed using BCrypt. BCrypt is strictly used for password hashing—it is **NOT** an authentication or session mechanism.
* **Frontend State Management:** React uses `AuthContext` to maintain the currently logged-in user in React state. On application startup or refresh, the frontend calls `GET /api/auth/me` (which checks `"userId"` in `HttpSession`). If the session is valid, the user object is stored in `AuthContext`; if there is no valid session, user state is set to `null`.

> [!NOTE]
> **Security Disclaimer:** Because this is a beginner-friendly academic MVP, the project intentionally avoids Spring Security and JWT. This is not production-grade authentication. A future production version could use a more robust security architecture, but no such system currently exists in this implementation.

---

## 🌟 Features

### User Features
* **Authentication:** Account registration, login, logout, and session validation (`/api/auth/me`).
* **Catalog Browsing:** Browse latest collections on the Home page and view detailed product information.
* **Shopping Cart:** Add products, update quantities, remove items, and clear cart (persisted via `localStorage`).
* **Checkout & Orders:** Submit delivery address and phone number to place orders, view order history (`My Orders`), and track status.

### Admin Features
* **Admin Dashboard:** Overview cards for Total Products, Total Orders, Pending Orders, Delivered Orders, and Recent Orders.
* **Product Management:** View product catalog, add new products, edit existing items, and delete products using interactive modals.
* **Order Management:** View all customer orders and update order status (`PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

---

## 📁 Project Structure

```
Fashionify/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/fashionify/
│   │       │   ├── controller/      # REST API Controllers (Auth, Product, Order)
│   │       │   ├── service/         # Service Layer (AuthService, ProductService, OrderService)
│   │       │   ├── repository/      # Spring Data JPA Repositories
│   │       │   ├── entity/          # JPA Entities (User, Product, Order, OrderItem)
│   │       │   │   └── enums/       # Enums (Role, OrderStatus)
│   │       │   ├── dto/             # Data Transfer Objects (Requests)
│   │       │   └── FashionifyApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Shared UI & Layout (Navbar, ProductCard, ProtectedRoute, AdminLayout)
│   │   ├── components/ui/           # Reusable shadcn/ui components (Button, Card, Input, Table, etc.)
│   │   ├── context/                 # AuthContext & CartContext
   │   ├── pages/                   # User pages (Home, Login, Register, ProductDetails, Cart, Checkout, MyOrders)
│   │   │   └── admin/               # Admin pages (AdminDashboard, AdminProducts, AdminOrders)
│   │   └── services/
│   │       └── api.js               # Axios instance configuration (withCredentials: true)
│   └── package.json
│
└── README.md
```

---

## 🗄 Database Entities & Enums

### Entities
* **User:** `id`, `name`, `email`, `password`, `role`
* **Product:** `id`, `name`, `description`, `price`, `imageUrl`, `stock`
* **Order:** `id`, `user` (ManyToOne), `address`, `phone`, `totalAmount`, `status`, `createdAt`, `items` (OneToMany)
* **OrderItem:** `id`, `order` (ManyToOne), `product` (ManyToOne), `quantity`, `price`

### Enums
* **Role:** `USER`, `ADMIN`
* **OrderStatus:** `PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## 🔌 API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user. The backend assigns the `USER` role during registration. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, creates/uses the `HttpSession`, and stores user info in the session. |
| `POST` | `/api/auth/logout` | Authenticated | Invalidates the current `HttpSession`. |
| `GET` | `/api/auth/me` | Authenticated | Checks the current `HttpSession` and returns the logged-in user (used by React `AuthContext` on startup). |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Retrieve all products in catalog |
| `GET` | `/api/products/{id}` | Public | Retrieve single product details |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/{id}` | Admin | Update product details |
| `DELETE` | `/api/products/{id}` | Admin | Delete product from catalog |

### Order Endpoints (`/api/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer | Create new order & calculate total amount |
| `GET` | `/api/orders/my` | Customer | Retrieve current user's orders |
| `GET` | `/api/orders` | Admin | Retrieve all customer orders |
| `PUT` | `/api/orders/{id}/status` | Admin | Update order status (`PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`) |

---

## 🌐 Frontend Routes

| Route | Access | Component |
| :--- | :--- | :--- |
| `/` | Public | Home |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/product/:id` | Public | ProductDetails |
| `/cart` | User | Cart |
| `/checkout` | User | Checkout |
| `/my-orders` | User | MyOrders |
| `/admin` | Admin | AdminDashboard |
| `/admin/products` | Admin | AdminProducts |
| `/admin/orders` | Admin | AdminOrders |

---

## 📋 Prerequisites

Ensure you have the following installed locally:
* **Java:** JDK 21+
* **Maven:** Maven 3.8+ (or use `./mvnw`)
* **Node.js:** v18+ & `npm`
* **MySQL Database:** Local MySQL server running on port `3306`

---

## 🚀 Getting Started

### 1. Database Setup
Create a MySQL database named `fashionify` on your local MySQL server:

```sql
CREATE DATABASE fashionify;
```

Database connection settings in `backend/src/main/resources/application.properties`:
* **Database Name:** `fashionify`
* **Username:** `root`
* **Password:** `root123`
* **Host / Port:** `localhost:3306`

> **Note:** `root123` is a development password intended strictly for local setup.

### 2. Run the Backend
From the root project directory:

```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows: `mvnw.cmd spring-boot:run`)*

The backend server will start at `http://localhost:8080`.

### 3. Run the Frontend
In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Admin Account Setup

An `ADMIN` user must be created/seeded according to the current backend setup or manually inserted in the `users` table with `role = 'ADMIN'`.

---

## 💡 Learning Purpose

Fashionify was built as an educational full-stack project to practice:
* Building RESTful APIs with Spring Boot and Spring Data JPA.
* Implementing basic `HttpSession`-based session authentication in full-stack applications.
* Managing client-side state with React Context API (`AuthContext`, `CartContext`) and `localStorage`.
* Designing responsive UIs with Tailwind CSS and shadcn/ui.
* End-to-end integration between React and Spring Boot.

---

## 🔮 Future Improvements

Potential enhancements planned for future releases:
* Product search and category filtering.
* Pagination for product lists and order tables.
* Online payment gateway integration (Stripe/PayPal).
* Image file upload and cloud storage integration.
* Product variants (sizes and colors).
* Ratings and user reviews.
