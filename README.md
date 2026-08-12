# Fashionify

Fashionify is a clean, beginner-friendly full-stack e-commerce platform built with **Spring Boot 3** on the backend and **React.js** on the frontend. The project demonstrates a robust, production-grade e-commerce architecture with two roles (**USER** and **ADMIN**), zero-trust backend security validation, automatic stock deduction, session-based authentication, and comprehensive UML documentation.

> [!IMPORTANT]
> **Fashionify uses Spring Boot `HttpSession`-based session authentication with CORS credential sharing (`withCredentials: true`), paired with zero-trust server-side validation.**

---

## 🛠 Tech Stack

### Backend
* **Language & JDK:** Java 21
* **Framework:** Spring Boot 3 (Spring Web MVC, Spring Data JPA, Bean Validation)
* **Database:** MySQL 8.0 / H2 Relational Database
* **Authentication & Hashing:** Spring `HttpSession`, Salted BCrypt (`jBCrypt`)
* **DTO Pattern:** Clean Request (`dto.request`) and Response (`dto.response`) separation
* **Build Tool:** Maven (`./mvnw`)

### Frontend
* **Library & Bundler:** React.js (v19) + Vite
* **Routing:** React Router DOM (v7) with strict Role & Guest Route Protection
* **HTTP Client:** Axios (`withCredentials: true`)
* **State Management:** React Context API (`AuthContext`, `CartContext`)
* **Currency:** Indian Rupee (`₹`) formatting across all store views
* **Styling & UI:** Tailwind CSS (v4), shadcn/ui components, Lucide React icons

---

## 🔒 Zero-Trust Architecture & Data Flow

```text
               FRONTEND (React SPA)
                      │
             ┌─────────┴─────────┐
             │                   │
        Request DTO         Response DTO
             │                   ▲
             ▼                   │
        Controller ─────────────┘
             │ (Session Authentication Verification)
             ▼
          Service Layer (Zero-Trust Validation & Business Logic)
             │ (DB Price Verification, Stock Check & Deduction)
             ▼
         Repository Layer (Spring Data JPA)
             │
             ▼
          Entities (User, Product, Cart, CartItem, Order, OrderItem)
             │
             ▼
          Database (MySQL / H2)
```

### Core Security Guarantees
1. **Zero-Trust Backend Validation:** The backend **never** trusts client-supplied prices, stock counts, or user IDs. All calculations utilize authoritative database prices (`product.getPrice()`).
2. **Atomic Stock Management:** Order placement verifies stock availability ($\text{currentStock} \ge \text{requestedQuantity}$), deducts stock, and saves updated product stock atomically in DB.
3. **Session-Based Authentication:** Standard `HttpSession` stores `"userId"` and `"role"`. Axios sends `JSESSIONID` cookies automatically via `withCredentials: true`.
4. **DTO Data Masking:** JPA Entities are never exposed directly to the REST API. `UserResponse` strips password hashes before returning user data.
5. **Real-Time Input Sanitization:**
   - Phone numbers strictly filtered to 10 numeric digits (`maxLength={10}`, `inputMode="numeric"`).
   - Product Price ($> 0$) and Stock ($\ge 0$) cleansed in real-time on frontend and enforced on backend.

---

## 📐 UML Diagrams & Documentation

Comprehensive UML documentation is available in **[uml_diagrams.md](file:///Users/subhajit/Developer/Development/fsp_sec-b/fashionify_v1/uml_diagrams.md)**:
- **System Architecture Overview Diagram**
- **Database Entity-Relationship Diagram (ERD)**
- **Full Backend UML Class Diagram**
- **Frontend & Component Architecture Diagram**
- **13-Step Secure Order Processing Sequence Diagram**
- **Shopping Cart & Authentication Sequence Diagrams**

---

## 🌟 Features

### Customer Features
* **Authentication:** Registration, login, logout, and session check (`/api/auth/me`).
* **Catalog Browsing:** Browse collections in Indian Rupee (`₹`) pricing with dynamic stock badges (*IN STOCK (count)* vs. *SOLD OUT*).
* **Shopping Cart:** Add products, update quantities, remove items, and clear cart with real-time stock limit error alerts (`/api/cart`).
* **Checkout & Orders:** Submit 10-digit phone number and delivery address, place orders with automatic stock reduction, and view order history with thumbnails (`/my-orders`).

### Admin Features
* **Admin Dashboard:** Overview statistics for Total Products, Total Orders, Pending Orders, Delivered Orders, and Recent Orders.
* **Product Catalog Management:** Add new products, update prices ($> 0$) and stock ($\ge 0$), delete products with cascading cleanup.
* **Order Management:** View all customer orders with customer details (Name, Email, Phone, Address), item thumbnails, and update order statuses (`PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

---

## 📁 Project Structure

```text
Fashionify/
│
├── backend/
│   ├── src/
│   │   ├── java/com/fashionify/
│   │   │   ├── controller/      # REST Controllers (Auth, Product, Cart, Order)
│   │   │   ├── service/         # Service Layer (AuthService, ProductService, CartService, OrderService)
│   │   │   │   └── serviceimpl/ # Beginner-friendly, zero-trust service implementations
│   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   ├── entity/          # JPA Entities (User, Product, Cart, CartItem, Order, OrderItem)
│   │   │   │   └── enums/       # Enums (Role, OrderStatus)
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── request/     # Request DTOs (Register, Login, Product, CartItem, Order, OrderStatusUpdate)
│   │   │   │   └── response/    # Response DTOs (UserResponse, ProductResponse, CartResponse, OrderResponse)
│   │   │   ├── mapper/          # Entity-to-DTO Mappers (UserMapper, ProductMapper, CartMapper, OrderMapper)
│   │   │   └── FashionifyApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Shared UI (Navbar, Footer, ProductCard, ProtectedRoute, AdminLayout)
│   │   ├── components/ui/       # shadcn/ui components (Button, Card, Input, Table, Dialog, etc.)
│   │   ├── context/             # AuthContext & CartContext
│   │   ├── pages/               # User pages (Home, ProductDetails, Cart, Checkout, MyOrders, Login, Register)
│   │   │   └── admin/           # Admin pages (AdminDashboard, AdminProducts, AdminOrders)
│   │   └── services/
│   │       └── api.js           # Axios instance configuration (withCredentials: true)
│   └── package.json
│
├── uml_diagrams.md              # Detailed Mermaid UML documentation
└── README.md
```

---

## 🗄 Database Entities & DTOs

### Entities
* **User:** `id`, `name`, `email`, `password`, `role` (`USER` | `ADMIN`)
* **Product:** `id`, `name`, `description`, `price`, `imageUrl`, `stock`, `createdAt`
* **Cart:** `id`, `user` (OneToOne), `items` (OneToMany)
* **CartItem:** `id`, `cart` (ManyToOne), `product` (ManyToOne), `quantity`
* **Order:** `id`, `user` (ManyToOne), `address`, `phone`, `totalAmount`, `status`, `createdAt`, `items` (OneToMany)
* **OrderItem:** `id`, `order` (ManyToOne), `product` (ManyToOne), `quantity`, `price`

---

## 🔌 API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & start `HttpSession` |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate current `HttpSession` |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user details |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List all catalog products |
| `GET` | `/api/products/{id}` | Public | Get product details by ID |
| `POST` | `/api/products` | Admin | Create product ($\text{price} > 0, \text{stock} \ge 0$) |
| `PUT` | `/api/products/{id}` | Admin | Update product details |
| `DELETE` | `/api/products/{id}` | Admin | Delete product from catalog |

### Cart Endpoints (`/api/cart`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Customer | Fetch current user's shopping cart |
| `POST` | `/api/cart/items` | Customer | Add item to cart with stock validation |
| `PUT` | `/api/cart/items/{productId}` | Customer | Update item quantity in cart |
| `DELETE` | `/api/cart/items/{productId}` | Customer | Remove item from cart |
| `DELETE` | `/api/cart` | Customer | Clear all items from cart |

### Order Endpoints (`/api/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer | Create order, deduct stock & compute trusted total |
| `GET` | `/api/orders/my` | Customer | Get customer's order history |
| `GET` | `/api/orders` | Admin | Get all customer orders |
| `PUT` | `/api/orders/{id}/status` | Admin | Update order status |

---

## 🚀 Getting Started

### 1. Database Setup
Create local MySQL database:

```sql
CREATE DATABASE fashionify;
```

Configure `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fashionify
spring.datasource.username=root
spring.datasource.password=root123
```

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
