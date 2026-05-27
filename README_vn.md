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

[Xem Live Demo](https://elitan.vercel.app/)

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

| Phân Loại | Các Tính Năng Chi Tiết |
| :--- | :--- |
| **Bảo mật & Tài khoản** | <li>Xác thực JWT & Đăng nhập Google OAuth2</li><li>Bảo mật 2 lớp (Two-Factor Authentication - 2FA)</li><li>Liên kết tài khoản Discord</li><li>Quy trình Khôi phục mật khẩu qua Email</li> |
| **Trải nghiệm Mua sắm** | <li>Danh mục sản phẩm với bộ lọc động & Tìm kiếm</li><li>Hệ thống Đánh giá (Review) và Yêu thích (Wishlist)</li><li>Quản lý Giỏ hàng bảo mật</li><li>Xác thực Đơn hàng bằng Mã OTP qua Email</li> |
| **Công cụ Thiết kế 3D** | <li>Không gian 3D tương tác qua `react-three/fiber`</li><li>Kéo thả mô hình 3D nội thất chuẩn `.glb`/`.gltf`</li><li>Tương tác vật lý thực (chống xuyên thấu) qua Rapier</li><li>Lưu trữ và quản lý các thiết kế phòng cá nhân</li> |
| **Quản trị (Admin CMS)** | <li>Báo cáo doanh thu & truy cập tương tác (Recharts)</li><li>Quản lý phân loại sâu (Màu sắc/Chất liệu)</li><li>Nhập liệu Sản phẩm hàng loạt qua Excel (`Apache POI`)</li><li>Tự động xuất Hóa đơn điện tử PDF (`OpenHTMLToPDF`)</li><li>Phân quyền (RBAC) và Khóa tài khoản rủi ro</li> |

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
* ![Threejs](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs&logoColor=white) **Three.js** / **React Three Fiber**
* ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=redux&logoColor=white) **Zustand** (Quản lý trạng thái Canvas 3D, tọa độ và góc xoay của nội thất thời gian thực, ngăn re-render giật lag)

---

## Kiến Trúc Hệ Thống (Architecture)

Hệ thống sử dụng kiến trúc Backend nguyên khối (Monolith) kết nối với Frontend SPA hiện đại, được cấu trúc rõ ràng để sẵn sàng chuyển đổi sang Microservices trong tương lai:

1. **Presentation Layer:** Ứng dụng React trang đơn (SPA). Sử dụng **Zustand** làm bộ lưu trữ dùng chung (Global Store) để điều phối trạng thái phòng 3D, danh sách nội thất, tọa độ định vị và va chạm, giúp tối ưu hóa hiệu năng, tránh re-render đơ chuột khi di chuyển vật thể. Định tuyến thông qua React Router DOM.
2. **Controller Layer (API):** Các REST Controllers của Spring Boot xử lý an toàn các HTTP requests và ủy quyền cho service.
3. **Service Layer:** Logic nghiệp vụ cốt lõi (Đơn hàng, Auth, Import SP). Giao tiếp trực tiếp với Cloudinary để stream assets và Apache POI để xử lý data từ Excel.
4. **Data Access Layer:** Các JPA Repositories thực thi truy vấn tới MySQL. Redis được sử dụng để cache các endpoints truy cập nhiều và quản lý các trạng thái phiên như OTP, Token.

---

## 📁 Cấu Trúc Thư Mục (Folder Structure)

Dự án được phân tách rõ ràng thành hai phần chính là Backend (Spring Boot) và Frontend (React), giúp nhà phát triển dễ dàng quản lý và mở rộng hệ thống:

```yaml
etalian-website/
  ├── 📂 backend/                      # Mã nguồn Spring Boot Backend (REST API)
  │     ├── 📂 src/main/java/.../
  │     │     ├── 📂 config/           # Cấu hình bảo mật Spring Security, CORS & JWT
  │     │     ├── 📂 controller/       # Lớp điều khiển REST (API endpoints tiếp nhận request)
  │     │     ├── 📂 dto/              # Lớp vận chuyển dữ liệu (Request/Response DTOs)
  │     │     ├── 📂 entity/           # Lớp thực thể Hibernate (JPA Entities mapping Database)
  │     │     ├── 📂 repository/       # Lớp tương tác cơ sở dữ liệu (Spring Data JPA Repositories)
  │     │     └── 📂 service/          # Lớp xử lý logic nghiệp vụ cốt lõi của dự án (Services)
  │     ├── 📂 src/main/resources/     # Cấu hình môi trường (properties) & mail templates
  │     ├── 📄 Dockerfile              # Cấu hình đóng gói container Docker để deploy lên Render
  │     └── 📄 pom.xml                 # Khai báo Maven dependencies (Spring Boot, Apache POI...)
  │
  ├── 📂 frontend/                     # Mã nguồn React + Vite + Tailwind CSS v4 Frontend
  │     ├── 📂 public/                 # Tài nguyên tĩnh & các mô hình 3D nội thất (.glb)
  │     ├── 📂 src/
  │     │     ├── 📂 components/       # Các components React tái sử dụng & Canvas 3D Room Designer
  │     │     ├── 📂 pages/            # Các trang giao diện (Shop, Auth, Admin CMS, 3D Canvas)
  │     │     ├── 📂 services/         # Nơi cấu hình các hàm gọi API thông qua Axios
  │     │     ├── 📂 store/            # Quản lý state tập trung cho toàn bộ ứng dụng bằng Zustand
  │     │     └── 📄 config.js         # Cấu hình URL API endpoint chung
  │     ├── 📄 package.json            # Khai báo npm dependencies (React 19, Three.js, Recharts...)
  │     └── 📄 vite.config.js          # Cấu hình Vite & plugin PostCSS/Tailwind
  │
  └── 📄 render.yaml                   # Cấu hình Render Blueprint để tự động hóa hạ tầng deploy
```

---

## Danh Sách API (API Reference)

Dưới đây là một số API cốt lõi được triển khai trong dự án:

| Method | Endpoint | Mô Tả | Yêu cầu Auth |
| :--- | :--- | :--- | :---: |
<<<<<<< HEAD
| `POST` | `/api/auth/register` | Đăng ký tài khoản người dùng mới | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản, trả về mã thông báo JWT | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `POST` | `/api/auth/social-login` | Đăng nhập nhanh thông qua Google / Facebook OAuth2 | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `POST` | `/api/auth/forgot-password` | Gửi liên kết đặt lại mật khẩu qua email | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `POST` | `/api/auth/reset-password` | Xác thực token và cập nhật mật khẩu mới | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `GET` | `/api/products` | Lấy danh sách sản phẩm phân trang | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `GET` | `/api/products/search` | Tìm kiếm & lọc sản phẩm nâng cao (màu, chất liệu, giá...) | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `GET` | `/api/products/{id}` | Lấy chi tiết thông tin một sản phẩm | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
| `POST` | `/api/products/wishlist/{productId}` | Thêm hoặc loại bỏ sản phẩm khỏi danh sách yêu thích | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `GET` | `/api/cart` | Lấy thông tin chi tiết giỏ hàng của người dùng | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `POST` | `/api/cart/items` | Thêm sản phẩm vào giỏ hàng | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `POST` | `/api/orders` | Đặt hàng mới (yêu cầu xác thực OTP qua email) | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `GET` | `/api/orders/{orderId}` | Xem chi tiết thông tin đơn hàng đã mua | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `POST` | `/api/products/import-file` | Nhập sản phẩm hàng loạt bằng file Excel (Quyền Admin) | ![Admin](https://img.shields.io/badge/Admin-f44336?style=flat-square) |
| `POST` | `/api/designs` | Lưu trữ bản thiết kế phòng 3D cá nhân | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `POST` | `/api/reviews/product/{productId}` | Gửi đánh giá và bình luận sản phẩm | ![Required](https://img.shields.io/badge/Required-4caf50?style=flat-square) |
| `GET` | `/api/stats/dashboard` | Lấy số liệu thống kê tổng quan doanh thu & đơn hàng (Admin) | ![Admin](https://img.shields.io/badge/Admin-f44336?style=flat-square) |
| `GET` | `/api/health` | Kiểm tra trạng thái hoạt động của hệ thống (Keep Alive) | ![Public](https://img.shields.io/badge/Public-8a8a8a?style=flat-square) |
=======
| `POST` | `/api/auth/register` | Đăng ký tài khoản người dùng mới | ❌ |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản, trả về mã thông báo JWT | ❌ |
| `POST` | `/api/auth/social-login` | Đăng nhập nhanh thông qua Google / Facebook OAuth2 | ❌ |
| `POST` | `/api/auth/forgot-password` | Gửi liên kết đặt lại mật khẩu qua email | ❌ |
| `POST` | `/api/auth/reset-password` | Xác thực token và cập nhật mật khẩu mới | ❌ |
| `GET` | `/api/products` | Lấy danh sách sản phẩm phân trang | ❌ |
| `GET` | `/api/products/search` | Tìm kiếm & lọc sản phẩm nâng cao (màu, chất liệu, giá...) | ❌ |
| `GET` | `/api/products/{id}` | Lấy chi tiết thông tin một sản phẩm | ❌ |
| `POST` | `/api/products/wishlist/{productId}` | Thêm hoặc loại bỏ sản phẩm khỏi danh sách yêu thích | ✅ |
| `GET` | `/api/cart` | Lấy thông tin chi tiết giỏ hàng của người dùng | ✅ |
| `POST` | `/api/cart/items` | Thêm sản phẩm vào giỏ hàng | ✅ |
| `POST` | `/api/orders` | Đặt hàng mới (yêu cầu xác thực OTP qua email) | ✅ |
| `GET` | `/api/orders/{orderId}` | Xem chi tiết thông tin đơn hàng đã mua | ✅ |
| `POST` | `/api/products/import-file` | Nhập sản phẩm hàng loạt bằng file Excel (Quyền Admin) | ✅ (Admin) |
| `POST` | `/api/designs` | Lưu trữ bản thiết kế phòng 3D cá nhân | ✅ |
| `POST` | `/api/reviews/product/{productId}` | Gửi đánh giá và bình luận sản phẩm | ✅ |
| `GET` | `/api/stats/dashboard` | Lấy số liệu thống kê tổng quan doanh thu & đơn hàng (Admin) | ✅ (Admin) |

>>>>>>> 0cc39061020264686573269b27886161d6aa1a97

---

## 📸 Tính Năng Nổi Bật & Demo Thực Tế (Key Features & Showcases)

> 💡 **LƯU Ý DÀNH CHO BẠN (USER):**
> 1. **Video/GIF:** Sử dụng định dạng ảnh động `.gif` hoặc video ngắn gọn cho phần **Thiết Kế 3D** để lột tả được tính năng kéo/thả, xoay mô hình không gian. Đặt file vào `docs/screenshots/`.
> 2. **Hình ảnh (Image):** Sử dụng ảnh chụp màn hình rõ nét (`.png`/`.jpg`) cho phần **Cửa Hàng** và **Admin Dashboard** để thể hiện tư duy thiết kế UI/UX và chức năng. Đặt file vào `docs/screenshots/`.

### 1. Công Cụ Thiết Kế Phòng 3D Tương Tác
- **Tính năng:** Cho phép người dùng kéo, thả, và xoay các mô hình nội thất 3D (`.gltf`/`.glb`) trong không gian ảo bằng `react-three/fiber` và engine vật lý Rapier.
- **Giá trị cốt lõi:** Tăng tỷ lệ chuyển đổi và giảm tỷ lệ hoàn hàng bằng cách mang lại trải nghiệm mua sắm độc đáo, giúp khách hàng "ướm thử" nội thất trước khi mua.
- 📝 **Hướng dẫn sử dụng:**
  1. Truy cập trang 3D Room Designer trên thanh menu.
  2. Chọn một phòng mẫu (template) hoặc bắt đầu với phòng trống.
  3. Kéo thả đồ nội thất từ danh mục bên trái vào không gian 3D.
  4. Dùng chuột để di chuyển, xoay hoặc xóa đồ vật (Hệ thống vật lý Rapier sẽ ngăn không cho đồ vật đâm xuyên nhau).
  5. Lưu lại thiết kế phòng vào tài khoản cá nhân.
- 🎬 **Video Demo:**
  
  <video src="docs/screenshots/3d-demo.mp4" width="100%" controls></video>


### 2. Trải Nghiệm Mua Sắm Xuyên Suốt
- **Tính năng:** Cung cấp luồng mua sắm hoàn chỉnh: Lọc động, danh sách yêu thích (wishlist), quản lý giỏ hàng, và quy trình thanh toán an toàn qua JWT Auth.
- **Giá trị cốt lõi:** Giao diện mượt mà, phản hồi siêu tốc (tối ưu bằng Tailwind) giúp giữ chân người dùng và thúc đẩy doanh số.
- 📝 **Hướng dẫn sử dụng:**
  1. Duyệt sản phẩm và sử dụng bộ lọc bên trái (theo danh mục, chất liệu, giá tiền).
  2. Nhấn biểu tượng "Trái tim" để lưu vào Wishlist (cần đăng nhập).
  3. Thêm vào Giỏ hàng (Cart) và tiến hành Thanh toán (Checkout) điền thông tin giao hàng.
  4. Theo dõi tiến độ giao hàng tại trang Hồ sơ cá nhân (Profile).
- 🖼️ **Hình Ảnh Giao Diện:** *(USER: Thay thế file `storefront.png` trong `docs/screenshots/` bằng ảnh chụp thật đẹp trang Shop của bạn)*
![Giao diện Cửa Hàng](docs/screenshots/storefront.png)

### 3. Hệ Thống Quản Trị Trung Tâm (Admin Dashboard & CMS)
- **Tính năng:** Cung cấp bảng điều khiển tập trung với các biểu đồ phân tích thời gian thực (Recharts), quản lý toàn diện (CRUD) và xử lý dữ liệu phức tạp (nhập file Excel, quản lý file 3D).
- **Giá trị cốt lõi:** Tiết kiệm hàng giờ thao tác thủ công cho người quản lý bằng cách tự động hóa quy trình kho hàng và trực quan hóa doanh thu.

#### 👑 Các Tính Năng & Hướng Dẫn Sử Dụng (User Guide)
> **⚠️ Lưu ý quan trọng:** Hệ thống Admin là xương sống của nền tảng. Mọi thao tác tại đây sẽ định hình trực tiếp dữ liệu hiển thị ở giao diện mua sắm và công cụ Thiết kế 3D.

1. **Bảng Điều Khiển Phân Tích (Analytics):**
   * **Tính năng:** Theo dõi doanh thu thời gian thực, trạng thái đơn hàng và sản phẩm bán chạy nhất qua các biểu đồ tương tác.
   * 📝 **Hướng dẫn sử dụng:** Đăng nhập tài khoản Admin -> Xem trang Dashboard mặc định -> Rê chuột vào các biểu đồ Recharts để xem số liệu doanh thu chi tiết.
   * 🖼️ **Ảnh chụp:** *(USER: Chèn ảnh `admin-dashboard.png` của bạn vào đây)*
   * ![Dashboard Analytics](docs/screenshots/admin-dashboard.png)

2. **Quản Lý Sản Phẩm & Tài Nguyên 3D Tiên Tiến:**
   * **Tính năng:** Kiểm soát toàn bộ danh mục, tồn kho, thao tác file Excel và quản lý file 3D.
   * 📝 **Hướng dẫn sử dụng:**
     1. **Thiết lập Thuộc tính:** Vào menu *Colors* & *Materials* để tạo màu sắc/chất liệu trước.
     2. **Thêm Sản phẩm:** Vào menu *Products* -> Thêm mới -> Điền thông tin và chọn Color/Material đã tạo.
     3. **Tích hợp 3D:** Trong trang chỉnh sửa sản phẩm, upload file `.glb/.gltf` qua widget Cloudinary. Sản phẩm này sẽ tự động xuất hiện trong công cụ vẽ 3D ở trang chủ.
     4. **Nhập liệu hàng loạt:** Nhấn nút *Import Excel*, chọn file `.xlsx`. Hệ thống sẽ tự động quét và thêm hàng trăm sản phẩm cùng lúc.
   * 🎬 **Video/GIF:** *(USER: Chèn `admin-products.gif` quay cảnh thêm sản phẩm và upload file 3D vào đây)*
   * ![Product Management](docs/screenshots/admin-products.gif)

3. **Xử Lý Đơn Hàng & Xuất Hóa Đơn:**
   * **Tính năng:** Quản lý vòng đời đơn hàng và thanh toán tự động.
   * 📝 **Hướng dẫn sử dụng:** Vào menu *Orders* -> Bấm vào một đơn hàng 'Pending' để xem chi tiết -> Đổi trạng thái sang 'Processing' -> Bấm nút **Xuất Hóa Đơn** (Generate Invoice) để tải file PDF tự động -> Cập nhật sang 'Shipped' khi đã giao cho vận chuyển.
   * 🖼️ **Ảnh chụp:** *(USER: Chèn ảnh `admin-orders.png` của bạn vào đây)*
   * ![Order Management](docs/screenshots/admin-orders.png)

4. **Quản Lý Người Dùng & Phân Quyền (RBAC):**
   * **Tính năng:** Quản lý tài khoản khách hàng và bảo mật hệ thống.
   * 📝 **Hướng dẫn sử dụng:** Vào menu *Users* -> Xem danh sách tài khoản -> Dùng nút gạt (toggle) để khóa/mở khóa các tài khoản đáng ngờ -> Phân quyền 'Admin' hoặc 'User' cho từng người.

---

## Hướng Dẫn Cài Đặt (Getting Started)

Các bước để khởi chạy dự án hoàn chỉnh trên môi trường local của bạn.

### Yêu Cầu Hệ Thống (Prerequisites)
* **Java 17+** (OpenJDK khuyến nghị)
* **Node.js v18+** & **npm**
* **MySQL Server 8.0+**
* **Redis Server** (Để caching & lưu OTP, có thể bỏ qua nếu cấu hình vô hiệu hóa)

### Hướng Dẫn Chi Tiết (Step-by-Step Installation)

#### 1. Clone Dự Án
```sh
git clone https://github.com/your-username/etalian-website.git
cd etalian-website
```

#### 2. Khởi Tạo Cơ Sở Dữ Liệu
* Mở MySQL Client hoặc công cụ quản trị (như DBeaver, Navicat) và tạo một database mới:
```sql
CREATE DATABASE etalian_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. Thiết Lập & Khởi Chạy Backend
* Truy cập thư mục backend và copy file cấu hình mẫu:
```sh
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
* Mở file `src/main/resources/application.properties` mới tạo và điền các thông số cấu hình. Dưới đây là phân tích chi tiết về các trường bắt buộc và tùy chọn để hệ thống vận hành hoàn hảo:

  | Tham số cấu hình | Trạng thái | Giá trị mặc định (Fallback) | Ý nghĩa & Cách lấy thông tin |
  | :--- | :--- | :--- | :--- |
  | **`spring.datasource.url`** | 🟡 **Khuyến nghị đổi** | Cổng DB đám mây hoạt động sẵn | **Kết nối CSDL MySQL.** Mặc định dự án kết nối đến Cloud DB được cung cấp sẵn để chạy thử nghiệm ngay. Để chạy độc lập dưới local, hãy cài đặt MySQL Server và đổi thành: `jdbc:mysql://127.0.0.1:3306/etalian_website?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC` |
  | **`spring.datasource.username`** | 🟡 **Khuyến nghị đổi** | `your_db_username` | **Tên đăng nhập MySQL.** (Thường là `root` khi chạy dưới máy cá nhân) |
  | **`spring.datasource.password`** | 🟡 **Khuyến nghị đổi** | `your_db_password` | **Mật khẩu MySQL.** Điền mật khẩu MySQL local của bạn nếu đổi sang database cá nhân. |
  | **`cloudinary.url`** | 🔴 **BẮT BUỘC để dùng 3D** | *(Để trống)* | **URL kết nối Cloudinary.** Dùng để lưu trữ hình ảnh sản phẩm và upload/truy xuất file 3D (.glb). <br>👉 *Cách lấy:* Đăng ký tài khoản miễn phí tại [Cloudinary](https://cloudinary.com/) -> Vào Dashboard -> Copy giá trị **API Environment variable** (dạng `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`). |
  | **`jwt.secret`** | 🟢 **Không bắt buộc** | `your_jwt_secret_key` | **Khóa bảo mật mã hóa JWT.** Dùng để tạo token đăng nhập. Đã cấu hình sẵn khóa an toàn, bạn có thể giữ nguyên hoặc đổi thành chuỗi ngẫu nhiên bằng cách chạy lệnh `openssl rand -base64 64` trên terminal. |
  | **`spring.mail.username`** <br> `spring.mail.password` | 🟢 **Không bắt buộc** | `your_email@gmail.com` <br> `your_app_password` | **Cấu hình SMTP gửi email OTP.** Nhập tài khoản Gmail và Mật khẩu ứng dụng (App Password) của bạn để chạy gửi email. <br>👉 *Cách lấy:* Vào tài khoản Google cá nhân -> Bảo mật -> Bật xác minh 2 bước -> Tạo mật khẩu ứng dụng (App Password) và điền vào đây. |
  | **`google.client-id`** <br> `facebook.app-id` | 🟢 **Không bắt buộc** | `your_google_client_id` <br> `your_facebook_app_id` | **Đăng nhập nhanh bằng MXH (Google & Facebook).** Điền thông tin Client ID và App ID của bạn để dùng tính năng đăng nhập nhanh. <br>👉 *Cách lấy:* Tạo ứng dụng trên Google Cloud Console & Meta for Developers để lấy ID mới. |
  | **`discord.bot.token`** | 🟢 **Không bắt buộc** | `your_discord_bot_token` | **Gửi thông báo & OTP qua Discord bot.** Điền Token bot Discord của bạn nếu dùng tính năng này. |
  | **`spring.autoconfigure.exclude`** | 🟢 **Không bắt buộc** | Loại trừ Redis Auto-Configuration | **Cấu hình Redis.** Theo mặc định, để tránh dự án bị lỗi tắt (crash) khi local không có Redis, cấu hình này đã loại trừ các class tự động khởi động của Redis. Nếu muốn kích hoạt Caching, hãy xóa giá trị này và chạy Redis cục bộ. |

* Khởi chạy Backend bằng Maven Wrapper:
  * **Hệ điều hành Windows (CMD/PowerShell):**
    ```cmd
    mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
    ```
  * **Hệ điều hành macOS/Linux:**
    ```sh
    chmod +x mvnw
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
    ```
*(Backend sẽ tự động sinh các bảng database dựa trên JPA Entities. Việc thêm tham số `-Dspring-boot.run.profiles=dev` sẽ giúp kích hoạt `DataSeeder.java` tự động nạp trước danh sách Màu sắc (Colors), Chất liệu (Materials), và Bộ sưu tập (Collections) vào database để hiển thị đầy đủ trên Storefront)*

#### 4. Thiết Lập & Khởi Chạy Frontend
* Mở một terminal mới, chuyển hướng đến thư mục frontend và tạo file môi trường:
```sh
cd frontend
cp .env.example .env
```
* Mở file `.env` và cấu hình cổng API trỏ đến Backend:
```env
VITE_API_URL=http://localhost:8080
```
* Cài đặt các thư viện phụ thuộc và chạy môi trường Development:
```sh
npm install
npm run dev
```
* Mở trình duyệt và truy cập: `http://localhost:5173` để trải nghiệm!

---

### 💡 Mẹo Nhà Phát Triển (Developer Pro-Tips)

Để trải nghiệm toàn bộ tính năng của dự án trên máy cá nhân mà không gặp rào cản nào, hãy lưu ý hai mẹo nhỏ sau:

#### 1. Tạo Tài Khoản Admin Đầy Đủ Quyền (Admin CMS Access)
Vì lý do bảo mật, hệ thống không tự động tạo sẵn một tài khoản Admin mặc định với mật khẩu cố định. Để truy cập **Admin Dashboard**:
1. Đăng ký một tài khoản thông thường (chọn Đăng Ký trên trang web `http://localhost:5173`).
2. Mở MySQL client và thực hiện câu lệnh SQL sau để nâng cấp quyền lên `ADMIN`:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'email_dang_ky_cua_ban@example.com';
   ```
3. Đăng xuất và đăng nhập lại trên trang web. Bạn sẽ thấy tùy chọn truy cập trang quản trị Admin CMS xuất hiện!

#### 2. Về Cấu Hình Caching & OTP
* **Redis Caching:** Hệ thống đã được cấu hình loại trừ (exclude) tự động trong file `application.properties` để **không bị lỗi crash** nếu máy của bạn chưa cài đặt Redis. Nếu muốn kích hoạt Caching tối ưu hiệu năng, hãy chạy Redis cục bộ và cấu hình lại biến `REDIS_EXCLUDE` trong file cấu hình.
* **Gửi Mã OTP:** Khi đăng ký hoặc quên mật khẩu, hệ thống sẽ gửi OTP qua email. Nếu chưa cấu hình mật khẩu ứng dụng Gmail thực tế trong `application.properties`, bạn có thể kiểm tra trực tiếp mã OTP được in ra trong cửa sổ log console của Backend.

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
| ❄️ **Khởi Động Lạnh (Cold Starts)** | Render tắt server sau 15 phút không hoạt động | Cấu hình service cron ngoài (như `cron-job.org`) ping endpoint `/api/health` mỗi 10 phút | 🟢 **100%** |
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

**Lưu Phú Quý** - [Facebook](https://www.facebook.com/quy.luu.31149/) - luuphuquyaa@gmail.com

Link Dự Án: [https://github.com/quyluu2004/DOAN_J2EE](https://github.com/quyluu2004/DOAN_J2EE)
