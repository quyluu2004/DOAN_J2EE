# Kiến trúc Hệ thống

## Tổng quan
Ứng dụng tuân theo kiến trúc monolithic (nguyên khối) truyền thống cho backend và Single Page Application (SPA) cho frontend.

## Kiến trúc Backend
- **Kiến trúc phân lớp (Layered Architecture):**
    - **Controller:** Các điểm cuối REST (ProductController, OrderController, v.v.)
    - **Service:** Logic nghiệp vụ (ProductService, AuthService, v.v.)
    - **Repository:** Truy cập dữ liệu bằng Spring Data JPA (ProductRepository)
    - **Entity:** Các mô hình cơ sở dữ liệu (Product, User, WebsiteVisit)
- **Hiệu năng:**
    - Lớp đệm Redis cho các thực thể có lượt đọc cao (Product).
    - Các tác vụ bất đồng bộ cho các hoạt động không nằm trên luồng xử lý quan trọng.

## Kiến trúc Frontend
- **Dựa trên thành phần (Component-Based):** Các thành phần chức năng React.
- **Quản lý trạng thái:**
    - `AuthContext`: Quản lý phiên và định danh người dùng.
    - `CartContext`: Quản lý các mặt hàng trong giỏ hàng.
    - `LocalizationContext`: Xử lý đa ngôn ngữ (i18n).
- **Điều hướng:** React Router.
- **Thẩm mỹ:** Thiết kế boutique cao cấp sử dụng các thành phần UI hiện đại và hiệu ứng Framer Motion.

## Luồng dữ liệu
1. Người dùng tương tác với frontend React.
2. Frontend gửi yêu cầu axios tới backend Spring Boot.
3. Backend xác thực thông qua JWT.
4. Logic nghiệp vụ truy xuất/lưu dữ liệu vào MySQL hoặc Redis.
5. Tài nguyên (ảnh/3D) được phục vụ qua Cloudinary.
