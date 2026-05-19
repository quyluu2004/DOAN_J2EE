<div align="center">

# Etalian - 3D Furniture E-Commerce Platform

A robust, full-stack e-commerce solution integrating interactive 3D room design, comprehensive order management, and detailed analytics. Built with Spring Boot, React, and Three.js.

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs&logoColor=white)](#)

[View Live Demo](#) <!-- USER: Add your live deployment URL here -->

[🇻🇳 Xem phiên bản Tiếng Việt](README_vn.md)

</div>

<br />

## About The Project

Etalian is an end-to-end e-commerce platform designed for modern furniture retail. It solves the traditional problem of online furniture shopping by offering a **3D Room Designer**, allowing customers to visualize and arrange real products in a virtual space before purchasing. 

The system handles everything from authentication, catalog browsing, and cart management to complex bulk imports, Cloudinary media processing, and real-time analytics tracking for administrators. 

### Key Achievements (Fill these with real data if applicable)
* **Performance:** Handled concurrent connections using Spring Boot optimizations.
* **Database:** Reduced redundant queries through proper JPA mapping and Redis caching.
* **UI/UX:** Maintained a consistently high Lighthouse score via Vite and Tailwind CSS.

---

## Features

| Category | Features |
| :--- | :--- |
| **Customer Experience** | <li>JWT Authentication (Login, Register, Password Reset)</li><li>Google OAuth2 Integration</li><li>Product catalog with dynamic filtering & search</li><li>Wishlist and Review system</li><li>Cart and Secure Checkout process</li> |
| **3D Room Designer** | <li>Interactive Canvas via `react-three/fiber`</li><li>Drag-and-drop `.glb`/`.gltf` 3D model placement</li><li>Real-time physics (collisions) via Rapier</li><li>Save and manage custom room layouts</li> |
| **Admin Dashboard** | <li>Interactive sales and visitor analytics (Recharts)</li><li>CRUD management for Products, Orders, Categories</li><li>Bulk product import/export via Excel (`Apache POI`)</li><li>Automated PDF Invoice generation (`OpenHTMLToPDF`)</li> |

---

## Tech Stack

**Backend**
* ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) **Java 17** & **Spring Boot 3** (REST API)
* ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=spring-security&logoColor=white) **Spring Security** & **JWT** (Authentication)
* ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white) **MySQL** & **Spring Data JPA** (Database)
* ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) **Redis** (Caching)
* **Cloudinary** (Media & 3D Model Hosting)

**Frontend**
* ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React 19** & **Vite**
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS v4** & **Shadcn UI**
* ![Threejs](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=threedotjs&logoColor=white) **Three.js** / **React Three Fiber**
* ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=redux&logoColor=white) **Zustand** (State Management)

---

## Architecture

The system utilizes a monolithic backend approach connected to a modern SPA frontend, structured to support future microservices scaling:

1. **Presentation Layer:** React single-page application using Zustand for centralized state, routing via React Router DOM.
2. **Controller Layer (API):** Spring Boot REST controllers securely handling HTTP requests and delegating to services.
3. **Service Layer:** Core business logic (Orders, Product Import, Auth). Interacts with Cloudinary for asset streaming and Apache POI for Excel data processing.
4. **Data Access Layer:** JPA Repositories executing transactional queries to MySQL. Redis is utilized to cache high-traffic endpoints and manage session-like states (OTP, tokens).

---

## API Reference

Below are some of the core endpoints implemented in this project:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticates a user and returns JWT | ❌ |
| `POST` | `/api/auth/social-login` | Handles Google OAuth2 login callback | ❌ |
| `GET` | `/api/products` | Retrieves paginated product catalog | ❌ |
| `POST` | `/api/cart/items` | Adds a specific product to cart | ✅ |
| `POST` | `/api/orders` | Creates a new order | ✅ |
| `POST` | `/api/import-file` | Bulk import products via Excel (Admin) | ✅ |
| `POST` | `/api/room-designs` | Saves user's 3D room layout | ✅ |
| `POST` | `/api/review/product/{id}` | Submits a product review | ✅ |

---

## Screenshots

> **Note for USER:** Please add your real screenshots or GIF/Video demonstrations into a `docs/screenshots/` folder and link them here to impress HR.

### Storefront & 3D Designer
![3D Designer Demo](docs/screenshots/designer.gif) <!-- Replace with real image/video path -->
*The interactive 3D Room Designer where users customize layouts.*

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin.png) <!-- Replace with real image/video path -->
*Comprehensive analytics and inventory management.*

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Java 17+
* Node.js v18+
* MySQL Server
* Redis Server

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-username/etalian-website.git
   ```

2. **Setup Backend**
   ```sh
   cd backend
   # Configure your application.yml with DB, Redis, and Cloudinary credentials
   ./mvnw spring-boot:run
   ```

3. **Setup Frontend**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

---

## Contact

**Your Name** - [LinkedIn](https://linkedin.com/in/your-profile) - your.email@example.com

Project Link: [https://github.com/your-username/etalian-website](https://github.com/your-username/etalian-website)
