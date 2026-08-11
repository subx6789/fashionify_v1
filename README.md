# Fashionify

Fashionify is a simple, beginner-friendly full-stack fashion e-commerce MVP built with **Spring Boot** on the backend and **React.js** on the frontend. The project demonstrates a clean e-commerce flow with two roles (**USER** and **ADMIN**) while keeping the code readable, structured, and easy to maintain.

> [!IMPORTANT]
> **Fashionify uses basic Spring Boot `HttpSession`-based session authentication, not JWT or Spring Security.**

---

## 🛠 Tech Stack

### Backend
* **Language:** Java 21
* **Framework:** Spring Boot (Spring Web, Spring Data JPA, Bean Validation)
* **Database:** MySQL 8.0
* **Authentication & Hashing:** Spring `HttpSession`, BCrypt (`jBCrypt`)
* **DTO Pattern:** Clean Request (`dto.request`) and Response (`dto.response`) separation
* **Build Tool:** Maven

### Frontend
* **Library & Bundler:** React.js (v19) + Vite
* **Routing:** React Router DOM (v7) with strict Role & Guest Route Protection
* **HTTP Client:** Axios (`withCredentials: true`)
* **State Management:** React Context API (`AuthContext`, `CartContext`)
* **Currency:** Indian Rupee (`₹`) formatting across the app
* **Styling & UI:** Tailwind CSS (v4), shadcn/ui components, Lucide React icons

---

## 🔒 Architecture & Data Flow

```text
               FRONTEND (React)
                      │
            ┌─────────┴─────────┐
            │                   │
       Request DTO         Response DTO
            │                   ▲
            ▼                   │
        Controller ─────────────┘
            │
            ▼
         Service (Beginner-Friendly Logic & Try-Catch)
            │
            ▼
        Repository
            │
            ▼
         Entity (User, Product, Order, OrderItem)
            │
            ▼
         Database (MySQL)
```

* **Session-Based Authentication:** Fashionify uses standard Spring Boot `HttpSession`. After successful login, the backend stores session attributes (`"userId"` and `"role"`).
* **DTO Response Safety:** Entities are never returned directly from controllers. `UserResponse` strips the password hash before sending user data to React.
* **Role & Guest Protection:** `ProtectedRoute.jsx` intercepts request routing:
  * Guests can view public store pages (`/`, `/product/:id`).
  * Logged-in `ADMIN` users are strictly redirected to `/admin` dashboard and cannot access user store pages.
  * Non-admin users cannot access `/admin` dashboard routes.
* **Cookie Credentials:** Axios uses `withCredentials: true` so the browser sends the HTTP session cookie (`JSESSIONID`) automatically.

---

## 🌟 Features

### User Features
* **Authentication:** Account registration, login, logout, and session validation (`/api/auth/me`).
* **Catalog Browsing:** Browse latest collections in Indian Rupee (`₹`) pricing and view product details.
* **Shopping Cart:** Add products, update quantities, remove items, and clear cart (persisted via `localStorage`).
* **Checkout & Orders:** Submit delivery address and phone number to place orders, view order history (`My Orders`), and view ordered product thumbnails & item prices.

### Admin Features
* **Admin Dashboard:** Overview cards for Total Products, Total Orders, Pending Orders, Delivered Orders, and Recent Orders.
* **Product Management:** Add new products with cover image link at top and multi-line description textarea, edit existing products, and delete products (protected by `verifyAdmin(session)` check).
* **Order Management:** View all customer orders with customer details (Name, Email, Phone, Address), item thumbnails, and update status (`PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

---

## 📁 Project Structure

```text
Fashionify/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/fashionify/
│   │       │   ├── controller/      # REST API Controllers (Auth, Product, Order)
│   │       │   ├── service/         # Service Layer with simple loops & try-catch
│   │       │   ├── repository/      # Spring Data JPA Repositories
│   │       │   ├── entity/          # JPA Entities (User, Product, Order, OrderItem)
│   │       │   │   └── enums/       # Enums (Role, OrderStatus)
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   │   ├── request/     # Incoming DTOs (Register, Login, Product, Order, OrderStatusUpdate)
│   │       │   │   └── response/    # Outgoing DTOs (UserResponse, ProductResponse, OrderResponse, OrderItemResponse)
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
│   │       └── api.js               # Axios instance configuration (withCredentials: true)
│   └── package.json
│
└── README.md
```

---

## 🗄 Database Entities & DTOs

### Entities
* **User:** `id`, `name`, `email`, `password`, `role`
* **Product:** `id`, `name`, `description`, `price`, `imageUrl`, `stock`
* **Order:** `id`, `user` (ManyToOne), `address`, `phone`, `totalAmount`, `status`, `createdAt`, `items` (OneToMany)
* **OrderItem:** `id`, `order` (ManyToOne), `product` (ManyToOne), `quantity`, `price`

### Response DTOs
* **UserResponse:** `id`, `name`, `email`, `role` *(password hash excluded)*
* **ProductResponse:** `id`, `name`, `description`, `price`, `imageUrl`, `stock`
* **OrderItemResponse:** `id`, `productId`, `productName`, `productImageUrl`, `quantity`, `price`
* **OrderResponse:** `id`, `userId`, `userName`, `userEmail`, `address`, `phone`, `totalAmount`, `status`, `createdAt`, `items`

---

## 🔌 API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user (`RegisterRequest` -> `UserResponse`) |
| `POST` | `/api/auth/login` | Public | Authenticates user & sets `HttpSession` (`LoginRequest` -> `UserResponse`) |
| `POST` | `/api/auth/logout` | Authenticated | Invalidates the current `HttpSession` |
| `GET` | `/api/auth/me` | Authenticated | Returns logged-in user response from current session |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Retrieve all products in catalog (`List<ProductResponse>`) |
| `GET` | `/api/products/{id}` | Public | Retrieve single product details (`ProductResponse`) |
| `POST` | `/api/products` | Admin | Create a new product (`ProductRequest` -> `ProductResponse`) |
| `PUT` | `/api/products/{id}` | Admin | Update product details (`ProductRequest` -> `ProductResponse`) |
| `DELETE` | `/api/products/{id}` | Admin | Delete product from catalog |

### Order Endpoints (`/api/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer | Create new order & calculate total amount (`OrderRequest` -> `OrderResponse`) |
| `GET` | `/api/orders/my` | Customer | Retrieve current user's orders (`List<OrderResponse>`) |
| `GET` | `/api/orders` | Admin | Retrieve all customer orders (`List<OrderResponse>`) |
| `PUT` | `/api/orders/{id}/status` | Admin | Update order status (`OrderStatusUpdateRequest` -> `OrderResponse`) |

---

## 🌐 Frontend Routes

| Route | Access | Component |
| :--- | :--- | :--- |
| `/` | Public / Guest | Home |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/product/:id` | Public / Guest | ProductDetails |
| `/cart` | Customer | Cart |
| `/checkout` | Customer | Checkout |
| `/my-orders` | Customer | MyOrders |
| `/admin` | Admin | AdminDashboard |
| `/admin/products` | Admin | AdminProducts |
| `/admin/orders` | Admin | AdminOrders |

---

## 🚀 Getting Started

### 1. Database Setup
Create a local MySQL database:

```sql
CREATE DATABASE fashionify;
```

Connection settings in `backend/src/main/resources/application.properties`:
* **Database Name:** `fashionify`
* **Username:** `root`
* **Password:** `root123`
* **Host / Port:** `localhost:3306`

### 2. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.
