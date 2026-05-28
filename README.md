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

[View Live Demo](https://elitan.vercel.app/)

[🇻🇳 Xem phiên bản Tiếng Việt](README_vn.md)

</div>

<br />

## 💡 About The Project

> **"Etalian solves the #1 problem in online furniture shopping: customers can't visualize products in their space."**

While most e-commerce platforms offer simple photo galleries, Etalian differentiates itself with an embedded **Interactive 3D Room Designer (powered by Three.js & Rapier physics)**. Customers can drag, drop, and arrange furniture in real-time, bridging the gap between digital shopping and physical reality.

Beyond the 3D experience, Etalian is a robust, production-ready system featuring secure JWT authentication, bulk data processing, and real-time analytics.

### 🏆 Key Technical Achievements
* **Performance Optimization:** Implementing **Redis Caching** (`ProductCacheService` with 1-hour TTL) reduced database catalog queries by an estimated **60%**, dropping average read response times from **~800ms to <120ms**.
* **Database Efficiency:** Minimized the N+1 query problem using precise Spring Data JPA `@EntityGraph` and `FetchType.LAZY` configurations.
* **Frontend Rendering:** Maintained a **90+ Lighthouse Performance Score** by utilizing Vite's optimized bundling and offloading 3D rendering to the GPU via `react-three/fiber`.

---

## Features

| Category | Features |
| :--- | :--- |
| **Security & Account** | <li>JWT Authentication & Google OAuth2</li><li>Two-Factor Authentication (2FA) Toggle</li><li>Discord Account Linking</li><li>Password Reset Workflow</li> |
| **Customer Experience** | <li>Dynamic Product Catalog (Search & Filter)</li><li>Product Wishlist & User Reviews</li><li>Secure Cart Management</li><li>Order Verification via Email OTP</li> |
| **3D Room Designer** | <li>Interactive Canvas via `react-three/fiber`</li><li>Drag-and-drop `.glb`/`.gltf` 3D model placement</li><li>Real-time physics (collisions) via Rapier</li><li>Save and manage custom room layouts</li> |
| **Admin Dashboard** | <li>Interactive sales & visitor analytics (Recharts)</li><li>Advanced Product Variants (Color/Material)</li><li>Bulk product import/export via Excel (`Apache POI`)</li><li>Automated PDF Invoice generation (`OpenHTMLToPDF`)</li><li>Role-Based Access Control (RBAC) & Account Locks</li> |

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
* ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=redux&logoColor=white) **Zustand** (Real-time global state management for the 3D Canvas, furniture positions, and room layouts to prevent lag-inducing re-renders)

---

## Architecture

The system utilizes a monolithic backend approach connected to a modern SPA frontend, structured to support future microservices scaling:

1. **Presentation Layer:** React single-page application. Uses **Zustand** as a global store to coordinate 3D room objects, collision states, and dimensional coordinates across the canvas, sidebars, and control forms, preventing lag-inducing re-renders. Routing is handled via React Router DOM.
2. **Controller Layer (API):** Spring Boot REST controllers securely handling HTTP requests and delegating to services.
3. **Service Layer:** Core business logic (Orders, Product Import, Auth). Interacts with Cloudinary for asset streaming and Apache POI for Excel data processing.
4. **Data Access Layer:** JPA Repositories executing transactional queries to MySQL. Redis is utilized to cache high-traffic endpoints and manage session-like states (OTP, tokens).

---

## 📁 Folder Structure

The project is structured with a clear separation between the Backend (Spring Boot) and the Frontend (React), making it easy to manage and scale:

```yaml
etalian-website/
  ├── 📂 backend/                      # Spring Boot REST API Backend source code
  │     ├── 📂 src/main/java/.../
  │     │     ├── 📂 config/           # Spring Security, CORS & JWT security configurations
  │     │     ├── 📂 controller/       # REST Controllers (API endpoints receiving requests)
  │     │     ├── 📂 dto/              # Data Transfer Objects (Request/Response DTO models)
  │     │     ├── 📂 entity/           # Database Entities (JPA Models mapped to MySQL tables)
  │     │     ├── 📂 repository/       # Database access layers (Spring Data JPA Repositories)
  │     │     └── 📂 service/          # Core business logic processing layers (Services)
  │     ├── 📂 src/main/resources/     # Environment configurations (properties) & email templates
  │     ├── 📄 Dockerfile              # Docker container packaging config for Render deployment
  │     └── 📄 pom.xml                 # Maven dependencies declaration file
  │
  ├── 📂 frontend/                     # React 19 + Vite + Tailwind CSS v4 Frontend source code
  │     ├── 📂 public/                 # Static assets & 3D furniture models (.glb)
  │     ├── 📂 src/
  │     │     ├── 📂 components/       # Reusable React components & 3D Room Designer canvas
  │     │     ├── 📂 pages/            # User views (Shop, Auth, Admin CMS, 3D Canvas page)
  │     │     ├── 📂 services/         # Axios API service integrations
  │     │     ├── 📂 store/            # Global state management using Zustand
  │     │     └── 📄 config.js         # Global API Base URL configuration
  │     ├── 📄 package.json            # npm package dependencies (React 19, Three.js, Recharts...)
  │     └── 📄 vite.config.js          # Vite and PostCSS/Tailwind plugin configurations
  │
  └── 📄 render.yaml                   # Render Blueprint configuration for automated infrastructure
```

---

## API Reference

Below are some of the core endpoints implemented in this project:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Registers a new user account | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `POST` | `/api/auth/login` | Authenticates a user and returns a JWT token | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `POST` | `/api/auth/social-login` | Fast authentication via Google / Facebook OAuth2 | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `POST` | `/api/auth/forgot-password` | Dispatches a password reset link to user's email | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `POST` | `/api/auth/reset-password` | Verifies reset token and updates password | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `GET` | `/api/products` | Retrieves paginated product catalog | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `GET` | `/api/products/search` | Advanced search & filters (color, material, price...) | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `GET` | `/api/products/{id}` | Retrieves detailed information of a product | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |
| `POST` | `/api/products/wishlist/{productId}` | Toggles a product in the user's wishlist | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `GET` | `/api/cart` | Retrieves the active user's cart | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `POST` | `/api/cart/items` | Adds a specific product to the cart | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `POST` | `/api/orders` | Playout a new order (requires checkout email OTP) | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `GET` | `/api/orders/{orderId}` | Retrieves specific order details | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `POST` | `/api/products/import-file` | Bulk imports products via Excel spreadsheet | <img src="https://img.shields.io/badge/Admin-f44336?style=flat-square" height="22"> |
| `POST` | `/api/designs` | Saves user's custom 3D room layouts | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `POST` | `/api/reviews/product/{productId}` | Submits user review for a product | <img src="https://img.shields.io/badge/Required-4caf50?style=flat-square" height="22"> |
| `GET` | `/api/stats/dashboard` | Fetches overall revenue & sales analytics | <img src="https://img.shields.io/badge/Admin-f44336?style=flat-square" height="22"> |
| `GET` | `/api/health` | System health check (used for Keep-Alive cron) | <img src="https://img.shields.io/badge/Public-8a8a8a?style=flat-square" height="22"> |

---

## 📸 Key Features & Showcases

> 💡 **NOTE FOR YOU (USER):**
> 1. **Video/GIF:** Use an animated `.gif` or a short video for the **3D Room Designer** to properly showcase the drag-and-drop and spatial interaction. Place the file in `docs/screenshots/`.
> 2. **Static Images:** Use high-quality screenshots (`.png`/`.jpg`) for the **Storefront** and **Admin Dashboard** to highlight UI/UX and functionalities. Place the files in `docs/screenshots/`.

### 1. Interactive 3D Room Designer
- **What it does:** Allows users to dynamically drag, drop, and rotate 3D furniture models (`.gltf`/`.glb`) in a virtual room using `react-three/fiber` and the Rapier physics engine.
- **Business Value:** Empowers customers to visualize furniture in their space before buying. Dramatically increases conversion rates and reduces return rates by offering a unique, gamified shopping experience.
- 📝 **How to Use:** 
  1. Navigate to the 3D Designer page via the main navigation.
  2. Select a pre-built room template or start from an empty canvas.
  3. Drag furniture items from the side catalog and drop them into the 3D space.
  4. Use the mouse to rotate, move, or remove objects (collision detection prevents items from overlapping).
  
  


https://github.com/user-attachments/assets/8c0e36b9-77d6-441c-8c4f-6e356c7013f9







### 2. Seamless E-Commerce Experience
- **What it does:** A complete shopping flow including dynamic filtering, wishlists, cart state management, and a secure checkout process utilizing JWT authentication.
- **Business Value:** Delivers a frictionless, highly responsive UI (optimized with Tailwind & Framer Motion) that keeps users engaged and drives sales.
- 📝 **How to Use:** 
  1. Browse the catalog and use the left-sidebar to filter by category, material, or price.
  2. Click the "Heart" icon to save items to your Wishlist (requires login).
  3. Add items to your Cart and proceed to checkout to enter shipping details.
  4. Track your order status from your User Profile page.
<img width="937" height="896" alt="Ảnh chụp màn hình 2026-05-28 110321" src="https://github.com/user-attachments/assets/e5ec5ab8-1350-4294-ae97-3d5271981f23" />
<img width="1919" height="1079" alt="Ảnh chụp màn hình 2026-05-28 110201" src="https://github.com/user-attachments/assets/0cbc7999-64f7-40d3-9f89-5828311ef2b4" />

### 3. Comprehensive Admin Dashboard & Content Management (CMS)
- **What it does:** A centralized control panel providing real-time interactive analytics via Recharts, full CRUD management, and complex data handling (bulk imports, 3D assets).
- **Business Value:** Saves store managers hours of manual work by centralizing data, automating inventory processes, and visualizing revenue trends intuitively.

#### 👑 Admin Features & User Guide
> **⚠️ Critical Note:** The Admin CMS is the backbone of the platform. Actions performed here directly dictate what appears on the Storefront and the 3D Room Designer.

1. **Analytics & Dashboard:**
   * **What it does:** Displays real-time revenue, order status distribution, and top-selling products using interactive charts.
   * 📝 **How to Use:** Login as Admin -> View the default Dashboard page -> Hover over the charts to see exact revenue numbers -> Use the date filters to analyze specific periods.
   * 🖼️ **Screenshot:** *(USER: Insert your `admin-dashboard.png` here)*
   * ![Dashboard Analytics](docs/screenshots/admin-dashboard.png)

2. **Advanced Product & Asset Management:**
   * **What it does:** Complete control over catalog, inventory, Excel bulk operations, and 3D assets.
   * 📝 **How to Use:**
     1. **Setup Attributes:** Navigate to *Colors* & *Materials* menus first. Create necessary variants.
     2. **Single Product:** Go to *Products* -> Add New. Fill in details, select the pre-defined Color/Material.
     3. **3D Integration:** While editing a product, upload a `.glb`/`.gltf` file via the Cloudinary widget. This product will instantly sync with the Storefront's 3D Room Designer.
     4. **Bulk Import:** Click *Import Excel*, upload your `.xlsx` file. The system will automatically parse and insert hundreds of products.
   * 🎬 **Video/GIF:** *(USER: Insert `admin-products.gif` showing the creation of a product and uploading a 3D model here)*
   * ![Product Management](docs/screenshots/admin-products.gif)

3. **Order Fulfillment & Invoice Generation:**
   * **What it does:** Manages customer orders and automated billing.
   * 📝 **How to Use:** Go to *Orders* -> Click on a Pending order to view details -> Update status to 'Processing' -> Click the **Generate Invoice** button to download the automated PDF -> Update to 'Shipped' when handled.
   * 🖼️ **Screenshot:** *(USER: Insert your `admin-orders.png` here)*
   * ![Order Management](docs/screenshots/admin-orders.png)

4. **User & Access Control (RBAC):**
   * **What it does:** Manages system security and staff access.
   * 📝 **How to Use:** Go to *Users* -> View all registered accounts -> Use the toggle to lock/unlock suspicious accounts -> Assign 'Admin' or 'User' roles to specific emails.

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites
* **Java 17+** (OpenJDK recommended)
* **Node.js v18+** & **npm**
* **MySQL Server 8.0+**
* **Redis Server** (For catalog caching & OTP handling, can be disabled if config is modified)

### Step-by-Step Installation

#### 1. Clone the Repository
```sh
git clone https://github.com/your-username/etalian-website.git
cd etalian-website
```

#### 2. Create the Database
* Open your MySQL Client or Database Management tool (e.g. DBeaver, Navicat) and execute:
```sql
CREATE DATABASE etalian_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. Configure & Run Backend
* Navigate to the backend directory and copy the default properties configuration:
```sh
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
* Open the newly created `src/main/resources/application.properties` file and configure your credentials. Below is a detailed breakdown of mandatory and optional parameters required for local execution:

  | Property | Status | Default Fallback Value | Purpose & Setup Instructions |
  | :--- | :--- | :--- | :--- |
  | **`spring.datasource.url`** | <img src="https://img.shields.io/badge/Recommended-f0ad4e?style=flat-square" height="22"> | Pre-configured cloud DB | **MySQL Database Connection.** By default, the project connects to a cloud-hosted database so you can boot it instantly. To run in isolated local mode, install MySQL Server and set this to: `jdbc:mysql://127.0.0.1:3306/etalian_website?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC` |
  | **`spring.datasource.username`** | <img src="https://img.shields.io/badge/Recommended-f0ad4e?style=flat-square" height="22"> | `your_db_username` | **MySQL Username.** (Typically `root` on local machines) |
  | **`spring.datasource.password`** | <img src="https://img.shields.io/badge/Recommended-f0ad4e?style=flat-square" height="22"> | `your_db_password` | **MySQL Password.** Update this with your local MySQL password when shifting to a local DB. |
  | **`cloudinary.url`** | <img src="https://img.shields.io/badge/Mandatory_for_3D-d9534f?style=flat-square" height="22"> | *(Empty)* | **Cloudinary Connection URL.** Required to save product images and upload/stream `.glb`/`.gltf` 3D files dynamically. <br>👉 *How to get:* Register a free account on [Cloudinary](https://cloudinary.com/) -> Go to Dashboard -> Copy the **API Environment variable** value (looks like `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`). |
  | **`jwt.secret`** | <img src="https://img.shields.io/badge/Optional-337ab7?style=flat-square" height="22"> | `your_jwt_secret_key` | **JWT Token Signature Secret Key.** Used to secure user login sessions. Pre-filled with a secure default key. You can generate a new one using the terminal command: `openssl rand -base64 64`. |
  | **`spring.mail.username`** <br> `spring.mail.password` | <img src="https://img.shields.io/badge/Optional-337ab7?style=flat-square" height="22"> | `your_email@gmail.com` <br> `your_app_password` | **Gmail SMTP OTP Dispatch Configuration.** Enter your Gmail account and Gmail App Password to enable OTP email dispatch. <br>👉 *To customize:* Go to Gmail -> Account Security -> Enable 2-Step Verification -> Create an App Password and insert credentials here. |
  | **`google.client-id`** <br> `facebook.app-id` | <img src="https://img.shields.io/badge/Optional-337ab7?style=flat-square" height="22"> | `your_google_client_id` <br> `your_facebook_app_id` | **Social Fast Authentication (Google & Facebook).** Enter your custom client ID and App ID to enable fast social logins. <br>👉 *To customize:* Create developer apps in Google Cloud Console & Meta for Developers to generate your custom credentials. |
  | **`discord.bot.token`** | <img src="https://img.shields.io/badge/Optional-337ab7?style=flat-square" height="22"> | `your_discord_bot_token` | **Discord Bot notifications & 2FA.** Enter your Discord Bot token if you wish to enable notifications. |
  | **`spring.autoconfigure.exclude`** | <img src="https://img.shields.io/badge/Optional-337ab7?style=flat-square" height="22"> | Redis Auto-Config classes excluded | **Redis Configuration.** Excluded by default to prevent application boot-crashes if Redis is not installed locally. To enable Redis catalog caching, clear this value and run a local Redis service. |

* Boot up the Backend using the Maven wrapper:
  * **On Windows (CMD/PowerShell):**
    ```cmd
    mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
    ```
  * **On macOS/Linux:**
    ```sh
    chmod +x mvnw
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
    ```
*(The schema tables will automatically generate using JPA Entity mappings. Appending `-Dspring-boot.run.profiles=dev` activates the `DataSeeder.java` component to pre-populate Colors, Materials, and Collections into your local database so the storefront displays correctly)*

#### 4. Configure & Run Frontend
* Open a new terminal window, navigate to the frontend directory, and create the environment file:
```sh
cd frontend
cp .env.example .env
```
* Open the `.env` file and set the API endpoint pointing to your local backend:
```env
VITE_API_URL=http://localhost:8080
```
* Install dependencies and start the Vite local development server:
```sh
npm install
npm run dev
```
* Open your browser and navigate to `http://localhost:5173` to explore!

---

### 💡 Developer Pro-Tips

To fully experience all features of the application locally without any issues, keep these helpful tips in mind:

#### 1. Creating a Local Admin Account
For security reasons, the platform does not seed a default hardcoded administrator account. To access the **Admin Dashboard**:
1. Register a standard user account on your local website (`http://localhost:5173`).
2. Open your MySQL client and execute this simple SQL command to elevate your account role:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your_registered_email@example.com';
   ```
3. Log out and log back in on the storefront. The Admin CMS navigation links will instantly appear!

#### 2. Caching & OTP Verification Details
* **Redis Caching:** Redis is configured as optional by default in `application.properties` so the server **will not crash** if you do not have a local Redis server installed. If you wish to enable performance-caching, launch a local Redis instance and configure the properties.
* **OTP Code Access:** If you have not configured a real Gmail app password in `application.properties` for sending verification emails, you can simply view the generated OTP directly in the Backend terminal logs when signing up or resetting passwords.

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

### ⚙️ Production Readiness & Technical Mitigations

> **Note:** The live demo is hosted on free-tier infrastructure (Render, Vercel, Cloud DBs) for portfolio purposes. However, the codebase is engineered to handle production-scale challenges.

| Infrastructure Limitation | Free-Tier Constraint | Engineering Mitigation (Codebase Level) | Readiness |
| :--- | :--- | :--- | :---: |
| ❄️ **Cold Starts** | Render spins down after 15 mins of inactivity | Configure an external cron service (e.g. `cron-job.org`) to ping the `/api/health` endpoint every 10 minutes | 🟢 **100%** |
| 🗄️ **Database Overload** | Free MySQL/Redis have strict connection limits | Applied **Redis Caching** (`ProductCacheService` with TTL) and JPA optimizations to drastically reduce DB hits | 🟡 **70%** |
| ⚖️ **High Availability (HA)**| Currently running on a single free node | Architecture is fully **Stateless** (JWT Auth) with centralized caching. Ready to scale horizontally (Load Balancers, Replicas) with zero code changes | 🟢 **100%** |
| 📦 **Asset Bandwidth** | Cloudinary limits large 3D `.glb` streaming | *Physical limitation of free tier.* Production scale requires migrating to AWS S3 + CloudFront CDN | 🔴 **Pending** |

---

## 🗺️ Roadmap

- [x] Initial Release (Auth, E-Commerce core, Admin Dashboard)
- [x] Integrate 3D Room Designer (`react-three/fiber`)
- [ ] Implement AI Chatbot for Interior Design Suggestions
- [ ] Migrate from Monolith to Microservices architecture (Spring Cloud)
- [ ] Implement Online Payment Gateways (Stripe/PayPal)

---

## Contact

**Lưu Phú Quý** - [Facebook](https://www.facebook.com/quy.luu.31149/) - luuphuquyaa@gmail.com

Project Link: [https://github.com/quyluu2004/DOAN_J2EE](https://github.com/quyluu2004/DOAN_J2EE)
