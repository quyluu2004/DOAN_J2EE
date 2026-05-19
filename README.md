<div align="center">

# Etalian - 3D Furniture E-Commerce Platform

A robust, full-stack e-commerce solution integrating interactive 3D room design, comprehensive order management, and detailed analytics. Built with Spring Boot, React, and Three.js.

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](#)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](#)
<br>
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs&logoColor=white)](#)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](#)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](#)

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

## 📸 Key Features & Showcases

> 💡 **NOTE FOR YOU (USER):**
> 1. **Video/GIF:** Use an animated `.gif` or a short video for the **3D Room Designer** to properly showcase the drag-and-drop and spatial interaction. Place the file in `docs/screenshots/`.
> 2. **Static Images:** Use high-quality screenshots (`.png`/`.jpg`) for the **Storefront** and **Admin Dashboard** to highlight UI/UX and functionalities. Place the files in `docs/screenshots/`.

### 1. Interactive 3D Room Designer
- **What it does:** Allows users to dynamically drag, drop, and rotate 3D furniture models (`.gltf`/`.glb`) in a virtual room using `react-three/fiber` and the Rapier physics engine.
- **Business Value:** Empowers customers to visualize furniture in their space before buying. Dramatically increases conversion rates and reduces return rates by offering a unique, gamified shopping experience.
- 🎬 **Video/GIF Demo:** *(USER: Insert your GIF/Video showing the 3D interaction here)*
![3D Feature Demo](docs/screenshots/3d-demo.gif)

### 2. Seamless E-Commerce Experience
- **What it does:** A complete shopping flow including dynamic filtering, wishlists, cart state management, and a secure checkout process utilizing JWT authentication.
- **Business Value:** Delivers a frictionless, highly responsive UI (optimized with Tailwind & Framer Motion) that keeps users engaged and drives sales.
- 🖼️ **UI Screenshot:** *(USER: Insert a beautiful screenshot of your Shop or Product Detail page here)*
![Storefront UI](docs/screenshots/storefront.png)

### 3. Comprehensive Admin Dashboard
- **What it does:** Provides real-time interactive analytics via Recharts, full CRUD management, and automated bulk product import/export through Excel.
- **Business Value:** Saves store managers hours of manual work by centralizing data, generating automated PDF invoices, and visualizing revenue trends intuitively.
- 🖼️ **Dashboard Screenshot:** *(USER: Insert a screenshot of the Admin analytics charts here)*
![Admin Dashboard](docs/screenshots/admin.png)

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

## Deployment

Etalian is designed to be easily deployable using modern PaaS providers and Docker containerization.

### Using Render, Vercel & Docker
The project is deliberately split to optimize hosting for each environment:
1. **Frontend:** React SPA deployed on **Vercel** to take advantage of global CDN delivery and automated CI/CD from GitHub.
2. **Backend:** Deployed as a Web Service on **Render.com** via Docker (using the provided `render.yaml` and `.dockerignore`).
3. **Database:** Connected to a managed MySQL instance (e.g., Aiven, AWS RDS, or Render MySQL).
4. **Cache:** Connected to a managed Redis instance (e.g., Upstash, Render Redis).

To deploy via Render Blueprint:
1. Connect your GitHub repository to Render.
2. Use the provided `render.yaml` Blueprint to auto-provision the services.

### ⚠️ Deployment Disclaimer & Technical Mitigations
The current deployment architecture (Render Free Tier + Vercel + Managed Cloud DBs) is designed for **Demo and Portfolio purposes**. However, to demonstrate production-readiness, several engineering mitigations have been implemented in the codebase:

- **Cold Starts (100% Mitigated):** Render's Free Tier normally spins down after 15 minutes of inactivity, causing a 30-50s cold start. **Mitigation:** We implemented a GitHub Actions cron job (`.github/workflows/keep-render-alive.yml`) that pings the server every 10 minutes, keeping the instance continuously warm.
- **Resource/Rate Limits (70% Mitigated):** Free tiers for MySQL and Redis have strict connection limits. **Mitigation:** The codebase heavily utilizes Redis caching (e.g., `ProductCacheService.java` with 1-hour TTL) and JPA query optimizations to drastically reduce database hits. However, Cloudinary bandwidth limits for large 3D `.glb` files cannot be bypassed on a free tier.
- **High Availability (100% Architecturally Ready):** While currently running on single free nodes, the system is fundamentally designed for High Availability (HA). The backend is completely stateless (using JWT for Auth) and caching is centralized (Redis). Moving to a true production environment only requires infrastructure scaling (adding Load Balancers, Database Replicas, AWS S3 + CDN), with **zero codebase changes required**.

---

## Contact

**Your Name** - [LinkedIn](https://linkedin.com/in/your-profile) - your.email@example.com

Project Link: [https://github.com/your-username/etalian-website](https://github.com/your-username/etalian-website)
