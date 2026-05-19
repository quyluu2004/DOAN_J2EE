<div align="center">
  
  # 🛋️ Etalian - Nền Tảng Thương Mại Điện Tử Nội Thất 3D

  <p align="center">
    Một nền tảng thương mại điện tử hiện đại, giàu tính năng dành cho nội thất với công cụ Thiết Kế Phòng 3D tích hợp. Xây dựng bằng Spring Boot và React.
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
    <a href="README.md">🇺🇸 View English Version</a>
  </p>

</div>

---

## 🌟 Tổng Quan

**Etalian** là một ứng dụng thương mại điện tử nâng cao được thiết kế riêng cho ngành nội thất và trang trí nhà cửa. Ứng dụng vượt qua trải nghiệm mua sắm truyền thống bằng cách tích hợp **Công cụ Thiết kế Phòng 3D** (3D Room Designer) mạnh mẽ, cho phép khách hàng hình dung nội thất trong một không gian 3D có thể tùy chỉnh trước khi quyết định mua hàng. Nền tảng bao gồm giao diện cửa hàng cho khách hàng và bảng điều khiển quản trị toàn diện.

---

## ✨ Tính Năng Chính

### 🛒 Trải Nghiệm Khách Hàng (E-Commerce)
- **Danh Mục Sản Phẩm:** Duyệt, lọc và tìm kiếm nội thất theo bộ sưu tập, màu sắc và chất liệu.
- **Giỏ Hàng & Thanh Toán:** Quản lý giỏ hàng mượt mà và quy trình thanh toán an toàn.
- **Tài Khoản Người Dùng:** Xác thực qua JWT, tích hợp Google OAuth, quản lý hồ sơ và lịch sử đơn hàng.
- **Danh Sách Yêu Thích & Đánh Giá:** Lưu các sản phẩm yêu thích và để lại đánh giá/xếp hạng.
- **Xuất Hóa Đơn:** Tự động tạo hóa đơn PDF cho các đơn hàng đã hoàn tất.

### 🏠 Công Cụ Thiết Kế Phòng 3D
- **Môi Trường 3D Tương Tác:** Được xây dựng bằng Three.js (`@react-three/fiber`), cho phép người dùng thiết kế phòng trực tiếp trên trình duyệt.
- **Kéo & Thả Nội Thất:** Đặt, xoay và di chuyển các mô hình nội thất 3D (`.gltf`/`.glb`).
- **Lưu Thiết Kế:** Lưu và xem lại các bản thiết kế phòng trong mục "My Designs".
- **Vật Lý & Va Chạm:** Engine vật lý thời gian thực sử dụng Rapier.

### 🛡️ Bảng Điều Khiển Quản Trị (Admin Dashboard)
- **Phân Tích & Thống Kê:** Biểu diễn dữ liệu trực quan bằng Recharts.
- **Quản Lý Kho Hàng:** Đầy đủ thao tác CRUD cho Sản phẩm, Bộ sưu tập, Màu sắc, và Chất liệu.
- **Thao Tác Hàng Loạt:** Dễ dàng Import/Export sản phẩm thông qua file Excel (sử dụng Apache POI).
- **Quản Lý Đơn Hàng:** Theo dõi và cập nhật trạng thái đơn hàng.
- **Lưu Trữ Đa Phương Tiện:** Tích hợp Cloudinary để mở rộng lưu trữ hình ảnh và mô hình 3D.

---

## 🛠️ Công Nghệ Sử Dụng

| Phân Hệ | Công Nghệ |
| :--- | :--- |
| **Backend Core** | Java 17, Spring Boot 3.4.3, Spring Security |
| **Database & Cache** | MySQL (Spring Data JPA), Redis |
| **Xác Thực (Auth)** | JSON Web Tokens (JWT), Google OAuth2 |
| **Frontend Framework** | React 19, Vite, React Router DOM |
| **Đồ Họa 3D** | Three.js, React Three Fiber, React Three Drei, Rapier (Vật lý) |
| **Styling & UI** | Tailwind CSS v4, Shadcn UI, Framer Motion, GSAP |
| **Quản Lý Trạng Thái** | Zustand |
| **Media & Storage** | Cloudinary (Ảnh & 3D assets), Thumbnailator (Nén ảnh) |
| **Tiện Ích Khác** | Apache POI (Excel), OpenHTMLToPDF (Hóa đơn), Lombok |

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu cầu hệ thống
- **Java 17** hoặc mới hơn
- **Node.js** (v18+)
- **MySQL** và **Redis** đã cài đặt và đang chạy
- Tài khoản **Cloudinary**

### 1. Cài đặt Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cấu hình các biến môi trường trong file `application.properties` hoặc `application.yml` (URL Database, Cổng Redis, Cloudinary keys, JWT Secret).
3. Chạy ứng dụng Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Cài đặt Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Thiết lập các biến môi trường (vd: `.env.local` cho API endpoints).
4. Khởi động development server:
   ```bash
   npm run dev
   ```

---

## 📁 Cấu Trúc Dự Án

```text
C:\DOAN_J2EE\etalian website\
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/elitan/backend/
│   │   ├── config/           # Cấu hình Security, Cloudinary, Cors
│   │   ├── controller/       # Các REST API Endpoints
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Data Access Layer
│   │   ├── service/          # Logic Nghiệp Vụ
│   │   └── BackendApplication.java
│   └── pom.xml               # Dependencies của Maven
└── frontend/                 # React SPA
    ├── src/
    │   ├── components/       # Các UI Component & 3D Component tái sử dụng
    │   ├── pages/            # Các trang giao diện (Shop, Admin, 3D Designer)
    │   ├── services/         # Gọi API (Axios)
    │   ├── store/            # Quản lý state bằng Zustand
    │   └── App.jsx           # Main Router
    └── package.json          # Dependencies của Node
```

---

## 🤝 Đóng Góp (Contributing)
Mọi đóng góp, báo cáo lỗi (issues), và yêu cầu tính năng đều được hoan nghênh! Vui lòng kiểm tra trang issues nếu bạn muốn đóng góp cho dự án.

<div align="center">
  <p><i>Được tạo bằng ❤️ bởi Etalian Team</i></p>
</div>
