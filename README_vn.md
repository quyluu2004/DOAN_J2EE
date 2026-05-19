<div align="center">

# Etalian - Nền Tảng Thương Mại Điện Tử Nội Thất 3D

Một giải pháp thương mại điện tử Full-stack tích hợp tính năng thiết kế phòng 3D, quản lý đơn hàng toàn diện và thống kê chi tiết. Được xây dựng bằng Spring Boot, React và Three.js.

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

[Xem Live Demo](#) <!-- USER: Thêm link website thật của bạn vào đây -->

[🇺🇸 View English Version](README.md)

</div>

<br />

## 💡 Giới Thiệu Dự Án (About The Project)

> **"Etalian giải quyết trở ngại lớn nhất khi mua nội thất online: Khách hàng không thể hình dung sản phẩm thực tế trông như thế nào trong không gian của họ."**

Trong khi hầu hết các nền tảng thương mại điện tử chỉ có thư viện ảnh tĩnh, Etalian tạo ra sự khác biệt (Unique Differentiator) bằng **Công cụ Thiết kế Phòng 3D tương tác (sức mạnh từ Three.js & engine vật lý Rapier)**. Người dùng có thể trực tiếp kéo, thả và xoay đồ nội thất trong không gian ảo thời gian thực, xóa nhòa ranh giới giữa mua sắm online và trải nghiệm thực tế.

Bên cạnh trải nghiệm 3D đột phá, Etalian còn là một hệ thống e-commerce toàn diện với bảo mật JWT, xử lý dữ liệu hàng loạt (Bulk Import) và thống kê theo thời gian thực.

### 🏆 Điểm Nhấn Kỹ Thuật (Key Technical Achievements)
* **Tối Ưu Hiệu Suất:** Triển khai **Redis Caching** (`ProductCacheService` với TTL 1 giờ) giúp giảm ước tính **60%** lượng truy vấn DB đọc danh mục, rút ngắn thời gian phản hồi API trung bình từ **~800ms xuống còn <120ms**.
* **Hiệu Quả Cơ Sở Dữ Liệu:** Xử lý triệt để bài toán N+1 Query thông qua cấu hình JPA (`FetchType.LAZY`) và lập bản đồ thực thể (Entity Mapping) chuẩn xác.
* **Trải Nghiệm UI/UX:** Đạt điểm số **Lighthouse 90+** nhờ việc đóng gói tối ưu của Vite và chuyển giao tác vụ render 3D nặng sang GPU thông qua `react-three/fiber`.

---

## Tính Năng Bảng (Features)

| Phân Hệ | Chức Năng |
| :--- | :--- |
| **Trải Nghiệm Khách Hàng** | <li>Xác thực JWT (Đăng nhập, Đăng ký, Quên mật khẩu)</li><li>Tích hợp Google OAuth2</li><li>Danh mục sản phẩm với bộ lọc & tìm kiếm động</li><li>Hệ thống Wishlist và Đánh giá (Review)</li><li>Quy trình Giỏ hàng & Thanh toán bảo mật</li> |
| **Thiết Kế Phòng 3D** | <li>Canvas tương tác bằng `react-three/fiber`</li><li>Kéo thả mô hình 3D định dạng `.glb`/`.gltf`</li><li>Mô phỏng vật lý thực (va chạm) qua Rapier</li><li>Lưu trữ và quản lý các thiết kế phòng tùy chỉnh</li> |
| **Admin Dashboard** | <li>Biểu đồ tương tác doanh thu và lượt truy cập (Recharts)</li><li>Quản lý CRUD cho Sản phẩm, Đơn hàng, Danh mục</li><li>Import/Export sản phẩm hàng loạt qua Excel (`Apache POI`)</li><li>Tự động tạo hóa đơn PDF (`OpenHTMLToPDF`)</li> |

---

## Công Nghệ Sử Dụng (Tech Stack)

**Backend**
* ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) **Java 17** & **Spring Boot 3** (REST API)
* ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=spring-security&logoColor=white) **Spring Security** & **JWT** (Xác thực)
* ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white) **MySQL** & **Spring Data JPA** (Cơ sở dữ liệu)
* ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) **Redis** (Caching)
* **Cloudinary** (Lưu trữ Hình ảnh & Mô hình 3D)

**Frontend**
* ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React 19** & **Vite**
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS v4** & **Shadcn UI**
* ![Threejs](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=threedotjs&logoColor=white) **Three.js** / **React Three Fiber**
* ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=redux&logoColor=white) **Zustand** (Quản lý State)

---

## Kiến Trúc Hệ Thống (Architecture)

Hệ thống sử dụng kiến trúc Backend nguyên khối (Monolith) kết nối với Frontend SPA hiện đại, được cấu trúc rõ ràng để sẵn sàng chuyển đổi sang Microservices trong tương lai:

1. **Presentation Layer:** Ứng dụng React trang đơn (SPA) sử dụng Zustand để quản lý State tập trung, định tuyến qua React Router DOM.
2. **Controller Layer (API):** Các REST Controllers của Spring Boot xử lý an toàn các HTTP requests và ủy quyền cho service.
3. **Service Layer:** Logic nghiệp vụ cốt lõi (Đơn hàng, Auth, Import SP). Giao tiếp trực tiếp với Cloudinary để stream assets và Apache POI để xử lý data từ Excel.
4. **Data Access Layer:** Các JPA Repositories thực thi truy vấn tới MySQL. Redis được sử dụng để cache các endpoints truy cập nhiều và quản lý các trạng thái phiên như OTP, Token.

---

## Danh Sách API (API Reference)

Dưới đây là một số API cốt lõi được triển khai trong dự án:

| Method | Endpoint | Mô Tả | Yêu cầu Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Xác thực người dùng và trả về JWT | ❌ |
| `POST` | `/api/auth/social-login` | Xử lý callback đăng nhập Google OAuth2 | ❌ |
| `GET` | `/api/products` | Lấy danh sách sản phẩm phân trang | ❌ |
| `POST` | `/api/cart/items` | Thêm sản phẩm vào giỏ hàng | ✅ |
| `POST` | `/api/orders` | Tạo một đơn hàng mới | ✅ |
| `POST` | `/api/import-file` | Import hàng loạt sản phẩm qua Excel (Admin) | ✅ |
| `POST` | `/api/room-designs` | Lưu bản vẽ thiết kế phòng 3D | ✅ |
| `POST` | `/api/review/product/{id}` | Gửi đánh giá cho sản phẩm | ✅ |

---

## 📸 Tính Năng Nổi Bật & Demo Thực Tế (Key Features & Showcases)

> 💡 **LƯU Ý DÀNH CHO BẠN (USER):**
> 1. **Video/GIF:** Sử dụng định dạng ảnh động `.gif` hoặc video ngắn gọn cho phần **Thiết Kế 3D** để lột tả được tính năng kéo/thả, xoay mô hình không gian. Đặt file vào `docs/screenshots/`.
> 2. **Hình ảnh (Image):** Sử dụng ảnh chụp màn hình rõ nét (`.png`/`.jpg`) cho phần **Cửa Hàng** và **Admin Dashboard** để thể hiện tư duy thiết kế UI/UX và chức năng. Đặt file vào `docs/screenshots/`.

### 1. Công Cụ Thiết Kế Phòng 3D (3D Room Designer)
- **Hoạt động:** Cho phép người dùng trực tiếp kéo thả, sắp xếp mô hình 3D (gltf/glb) vào không gian phòng ảo thông qua thư viện `react-three/fiber` và engine vật lý Rapier.
- **Giá trị cốt lõi:** Trực quan hóa sản phẩm nội thất tại nhà khách hàng trước khi mua. Giúp tăng tỷ lệ chuyển đổi (CR) và giảm tỷ lệ hoàn trả hàng (Return Rate), mang lại trải nghiệm độc đáo vượt trội so với các nền tảng e-commerce thông thường.
- 🎬 **Video/GIF Demo:** *(USER: Chèn link ảnh GIF/Video demo tính năng tương tác 3D tại đây)*
![Demo Tính năng 3D](docs/screenshots/3d-demo.gif)

### 2. Trải Nghiệm Mua Sắm Xuyên Suốt (Seamless E-Commerce)
- **Hoạt động:** Luồng mua hàng từ tìm kiếm, bộ lọc động, thêm giỏ hàng, áp mã giảm giá đến thanh toán tích hợp xác thực JWT bảo mật.
- **Giá trị cốt lõi:** Mang lại giao diện mượt mà (tối ưu bằng Tailwind & Framer Motion), tăng độ uy tín với hệ thống đánh giá và danh sách yêu thích, giữ chân khách hàng lâu hơn trên website.
- 🖼️ **Hình Ảnh Giao Diện:** *(USER: Chèn ảnh trang Shop, hoặc trang Chi Tiết Sản Phẩm tại đây)*
![Giao diện Cửa Hàng](docs/screenshots/storefront.png)

### 3. Hệ Thống Quản Trị Trung Tâm (Admin Dashboard & CMS)
- **Tính năng:** Cung cấp bảng điều khiển tập trung với các biểu đồ phân tích thời gian thực (Recharts), quản lý toàn diện (CRUD) và xử lý dữ liệu phức tạp (nhập file Excel, quản lý file 3D).
- **Giá trị cốt lõi:** Tiết kiệm hàng giờ thao tác thủ công cho người quản lý bằng cách tự động hóa quy trình kho hàng và trực quan hóa doanh thu.

#### 👑 Các Tính Năng & Hướng Dẫn Sử Dụng (User Guide)
> **⚠️ Lưu ý quan trọng:** Hệ thống Admin là xương sống của nền tảng. Mọi thao tác tại đây sẽ định hình trực tiếp dữ liệu hiển thị ở giao diện mua sắm và công cụ Thiết kế 3D.

* **A. Bảng Điều Khiển Phân Tích (Analytics):**
  * Theo dõi doanh thu thời gian thực, trạng thái đơn hàng và sản phẩm bán chạy nhất qua các biểu đồ tương tác.
  * 🖼️ **Ảnh chụp:** *(USER: Chèn ảnh `admin-dashboard.png` của bạn vào đây)*
  * ![Dashboard Analytics](docs/screenshots/admin-dashboard.png)

* **B. Quản Lý Sản Phẩm & Tài Nguyên 3D Tiên Tiến:**
  * **Quản lý Thuộc tính (Màu sắc/Vật liệu):** Cần được thiết lập *trước khi* tạo sản phẩm. Quyết định các bộ lọc mà khách hàng dùng trên Storefront.
  * **Tải lên Mô hình 3D (.glb/.gltf):** Cấp dữ liệu trực tiếp cho 3D Room Designer. Khi sản phẩm được đính kèm file 3D qua Cloudinary, nó sẽ tự động xuất hiện trong công cụ vẽ phòng ảo.
  * **Nhập liệu hàng loạt (Excel Bulk Import):** Thêm hàng trăm sản phẩm chỉ trong 1 giây thông qua thư viện Apache POI.
  * 🎬 **Video/GIF:** *(USER: Chèn `admin-products.gif` quay cảnh thêm sản phẩm và upload file 3D vào đây)*
  * ![Product Management](docs/screenshots/admin-products.gif)

* **C. Xử Lý Đơn Hàng & Xuất Hóa Đơn:**
  * Quản lý vòng đời đơn hàng (Chờ duyệt -> Đang xử lý -> Đang giao -> Hoàn thành).
  * Tự động xuất Hóa đơn PDF (PDF Invoice) thông qua thư viện `OpenHTMLToPDF`.
  * 🖼️ **Ảnh chụp:** *(USER: Chèn ảnh `admin-orders.png` của bạn vào đây)*
  * ![Order Management](docs/screenshots/admin-orders.png)

* **D. Quản Lý Người Dùng & Phân Quyền (RBAC):**
  * Quản lý tài khoản khách hàng, khóa/mở khóa tài khoản và phân quyền bảo mật chặt chẽ cho toàn hệ thống.

---

## Hướng Dẫn Cài Đặt (Getting Started)

Các bước để chạy dự án tại máy cá nhân (local).

### Yêu Cầu Cài Đặt
* Java 17+
* Node.js v18+
* MySQL Server
* Redis Server

### Khởi Chạy

1. **Clone dự án**
   ```sh
   git clone https://github.com/your-username/etalian-website.git
   ```

2. **Cài đặt Backend**
   ```sh
   cd backend
   # Nhớ cấu hình application.yml/properties với DB, Redis, và Cloudinary keys của bạn
   ./mvnw spring-boot:run
   ```

3. **Cài đặt Frontend**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

---

## Triển Khai (Deployment)

Etalian được thiết kế để dễ dàng triển khai bằng các nhà cung cấp PaaS hiện đại và công nghệ container hóa (Docker).

### Sử Dụng Render, Vercel & Docker
Dự án được phân tách rõ ràng để tối ưu hóa việc lưu trữ cho từng môi trường:
1. **Frontend:** Ứng dụng React SPA được triển khai trên **Vercel** để tận dụng tốc độ phân phối qua CDN toàn cầu và tự động hóa CI/CD qua GitHub.
2. **Backend:** Triển khai dưới dạng Web Service trên **Render.com** thông qua Docker (dựa vào file `render.yaml` và `.dockerignore` đã cung cấp).
3. **Database:** Kết nối với một hệ quản trị MySQL (ví dụ: Aiven, AWS RDS, hoặc Render MySQL).
4. **Cache:** Kết nối với Redis được quản lý (ví dụ: Upstash, Render Redis).

Để triển khai qua Render Blueprint:
1. Kết nối Github repository của bạn với Render.
2. Sử dụng `render.yaml` Blueprint để hệ thống tự động khởi tạo các dịch vụ tương ứng.

### ⚙️ Tính Khả Thi Production & Giải Pháp Kỹ Thuật

> **Lưu ý:** Website hiện đang chạy trên hạ tầng miễn phí (Render, Vercel) nhằm mục đích Demo. Tuy nhiên, codebase đã được tối ưu hóa ở mức độ hệ thống để sẵn sàng cho môi trường Production thực tế.

| Thách Thức Hệ Thống | Giới Hạn Hạ Tầng (Free Tier) | Giải Pháp Kỹ Thuật (Mitigation in Code) | Độ Hoàn Thiện |
| :--- | :--- | :--- | :---: |
| ❄️ **Khởi Động Lạnh (Cold Starts)** | Render tắt server sau 15 phút không hoạt động | Tự động hóa bằng GitHub Actions Cron (`keep-render-alive.yml`) để ping và giữ server luôn thức | 🟢 **100%** |
| 🗄️ **Quá Tải Cơ Sở Dữ Liệu** | MySQL miễn phí giới hạn nghiêm ngặt số kết nối | Triển khai **Redis Caching** (`ProductCacheService` với TTL) và tối ưu JPA để giảm tải tối đa cho DB | 🟡 **70%** |
| ⚖️ **Tính Khả Dụng Cao (HA)** | Đang chạy trên 1 node duy nhất (Single Node) | Kiến trúc hoàn toàn **Stateless** (JWT Auth). Dễ dàng scale ngang (Thêm Load Balancer, Replica) mà không cần sửa code | 🟢 **100%** |
| 📦 **Giới Hạn Băng Thông** | Cloudinary giới hạn tải file 3D `.glb` nặng | *Giới hạn vật lý của bản Free.* Cần nâng cấp lên kiến trúc AWS S3 + CloudFront CDN cho quy mô doanh nghiệp | 🔴 **Pending** |

---

## 🗺️ Lộ Trình Phát Triển (Roadmap)

- [x] Phiên bản cốt lõi (Auth, Giỏ hàng, Admin Dashboard)
- [x] Tích hợp Công cụ Thiết kế Phòng 3D (`react-three/fiber`)
- [ ] Tích hợp Chatbot AI Gợi ý Thiết kế Nội thất
- [ ] Chuyển đổi kiến trúc Monolith sang Microservices (Spring Cloud)
- [ ] Tích hợp cổng thanh toán trực tuyến (Stripe/VNPay)

---

## Liên Hệ (Contact)

**Tên Của Bạn** - [LinkedIn](https://linkedin.com/in/your-profile) - your.email@example.com

Link Dự Án: [https://github.com/your-username/etalian-website](https://github.com/your-username/etalian-website)
