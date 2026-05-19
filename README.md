<div align="center">
  
  # 🛋️ Etalian - 3D Furniture E-Commerce Platform

  <p align="center">
    A modern, feature-rich e-commerce platform for furniture with an integrated 3D Room Designer. Built with Spring Boot and React.
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17" />
    <img src="https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  </p>

  <p align="center">
    <a href="README_vn.md">🇻🇳 Xem phiên bản Tiếng Việt</a>
  </p>

</div>

---

## 🌟 Overview

**Etalian** is an advanced e-commerce application tailored for furniture and home decor. It goes beyond the traditional shopping experience by incorporating a powerful **3D Room Designer**, allowing customers to visualize furniture in a customizable 3D space before making a purchase. The platform includes a robust customer storefront and a comprehensive administration dashboard.

---

## ✨ Key Features

### 🛒 E-Commerce Customer Experience
- **Product Catalog:** Browse, filter, and search for furniture items by collections, colors, and materials.
- **Shopping Cart & Checkout:** Seamless shopping cart management and secure checkout process.
- **User Accounts:** JWT-based authentication, Google OAuth integration, profile management, and order history tracking.
- **Wishlist & Reviews:** Save favorite products and leave ratings/reviews.
- **Invoice Generation:** Automatic PDF invoice generation for completed orders.

### 🏠 3D Room Designer
- **Interactive 3D Environment:** Built with Three.js (`@react-three/fiber`), allowing users to design rooms in the browser.
- **Drag & Drop Furniture:** Place, rotate, and move 3D furniture models (`.gltf`/`.glb`).
- **Save Designs:** Save and revisit custom room layouts in "My Designs".
- **Physics & Collisions:** Real-time physics engine using Rapier.

### 🛡️ Comprehensive Admin Dashboard
- **Analytics & Metrics:** Visual data representation using Recharts.
- **Inventory Management:** Full CRUD for Products, Collections, Colors, and Materials.
- **Bulk Operations:** Import/Export products easily via Excel spreadsheets (powered by Apache POI).
- **Order Management:** Track and update order statuses.
- **Media Hosting:** Cloudinary integration for scalable image and 3D model hosting.

---

## 🛠️ Technology Stack

| Area | Technologies |
| :--- | :--- |
| **Backend Core** | Java 17, Spring Boot 3.4.3, Spring Security |
| **Database & Cache** | MySQL (Spring Data JPA), Redis |
| **Authentication** | JSON Web Tokens (JWT), Google OAuth2 |
| **Frontend Framework** | React 19, Vite, React Router DOM |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei, Rapier (Physics) |
| **Styling & UI** | Tailwind CSS v4, Shadcn UI, Framer Motion, GSAP |
| **State Management**| Zustand |
| **Media & Storage** | Cloudinary (Images & 3D assets), Thumbnailator (Image compression) |
| **Utilities** | Apache POI (Excel), OpenHTMLToPDF (Invoices), Lombok |

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js** (v18+)
- **MySQL** and **Redis** installed and running
- A **Cloudinary** account

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your environment variables in `application.properties` or `application.yml` (Database URL, Redis port, Cloudinary keys, JWT Secret).
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (e.g., `.env.local` for API endpoints).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
C:\DOAN_J2EE\etalian website\
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/elitan/backend/
│   │   ├── config/           # Security, Cloudinary, Cors configs
│   │   ├── controller/       # REST API Endpoints
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Data Access Layer
│   │   ├── service/          # Business Logic
│   │   └── BackendApplication.java
│   └── pom.xml               # Maven dependencies
└── frontend/                 # React SPA
    ├── src/
    │   ├── components/       # Reusable UI & 3D Components
    │   ├── pages/            # Page Views (Shop, Admin, 3D Designer)
    │   ├── services/         # API integration (Axios)
    │   ├── store/            # Zustand state management
    │   └── App.jsx           # Main Router
    └── package.json          # Node dependencies
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

<div align="center">
  <p><i>Made with ❤️ by the Etalian Team</i></p>
</div>
