# Fashionify

Fashionify is a simple, beginner-friendly full-stack fashion e-commerce MVP built with **Spring Boot** on the backend and **React.js** on the frontend. The project demonstrates a clean e-commerce flow with two roles (**USER** and **ADMIN**) while keeping the code readable, structured, and easy to maintain.

---

## 🛠 Tech Stack

### Backend
* **Language:** Java 21
* **Framework:** Spring Boot 4.1.0 (Spring Web, Spring Data JPA, Bean Validation)
* **Database:** MySQL 8.0
* **Authentication & Hashing:** Spring `HttpSession`, BCrypt
* **Build Tool:** Maven

### Frontend
* **Library & Bundler:** React.js (v19) + Vite
* **Routing:** React Router DOM (v7)
* **HTTP Client:** Axios (`withCredentials: true`)
* **State Management:** React Context API
* **Styling & UI:** Tailwind CSS (v4), shadcn/ui components, Lucide React icons

---

## 🌟 Features

### User Features
* **Authentication:** Account registration, login, logout, and session check (`/api/auth/me`).
* **Catalog Browsing:** Browse latest collections on Home page and view detailed product information.
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
│   │   ├── pages/                   # User pages (Home, Login, Register, ProductDetails, Cart, Checkout, MyOrders)
│   │   │   └── admin/               # Admin pages (AdminDashboard, AdminProducts, AdminOrders)
│   │   └── services/
│   │       └── api.js               # Axios instance configuration
│   └── package.json
│
└── README.md
```

---

## 🏗 Architecture & Flow

### General Flow
```
React Frontend (Vite)
       ↓ (Axios requests with credentials)
Spring Boot REST Controllers
       ↓
  Service Layer
       ↓
 Spring Data JPA Repository
       ↓
   MySQL Database
```

### Authentication Flow
* **Session-Based:** Uses standard Spring `HttpSession` (no JWT).
* **Credentials:** Axios passes `withCredentials: true` with every request to send the `JSESSIONID` cookie automatically.
* **Security:** User passwords are hashed using BCrypt before database persistence.

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

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register a new user |
| **Auth** | `POST` | `/api/auth/login` | Log in user & initialize session |
| **Auth** | `POST` | `/api/auth/logout` | Invalidate current session |
| **Auth** | `GET` | `/api/auth/me` | Retrieve currently authenticated user |
| **Product** | `GET` | `/api/products` | Retrieve all products |
| **Product** | `GET` | `/api/products/{id}` | Retrieve single product details |
| **Product** | `POST` | `/api/products` | Create a new product (ADMIN) |
| **Product** | `PUT` | `/api/products/{id}` | Update product details (ADMIN) |
| **Product** | `DELETE` | `/api/products/{id}` | Delete product (ADMIN) |
| **Order** | `POST` | `/api/orders` | Create order & calculate total amount |
| **Order** | `GET` | `/api/orders/my` | Retrieve logged-in user's orders |
| **Order** | `GET` | `/api/orders` | Retrieve all orders (ADMIN) |
| **Order** | `PUT` | `/api/orders/{id}/status` | Update order status (ADMIN) |

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
* Implementing session-based authentication in full-stack applications.
* Managing client-side state with React Context API and `localStorage`.
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
