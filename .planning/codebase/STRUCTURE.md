# Cấu trúc Dự án

## Thư mục gốc
- `backend/`: Mã nguồn ứng dụng Spring Boot.
- `frontend/`: Mã nguồn ứng dụng React.
- `render.yaml`: Định nghĩa hạ tầng cho Render.com.
- `Dockerfile`: (Trong backend) Đóng gói container cho môi trường production.

## Cấu trúc Backend
- `src/main/java/com/elitan/backend/`:
    - `controller/`: Các bộ điều khiển REST.
    - `service/`: Triển khai logic nghiệp vụ.
    - `repository/`: Các giao diện kho lưu trữ JPA.
    - `entity/`: Các thực thể JPA.
    - `config/`: Cấu hình bảo mật, CORS và Cloudinary.
    - `dto/`: Đối tượng chuyển đổi dữ liệu cho yêu cầu API.
- `src/main/resources/`:
    - `application.properties`: Cấu hình chính.

## Cấu trúc Frontend
- `src/`:
    - `components/`: Các thành phần UI có thể tái sử dụng (ReactBits, UI chuẩn).
    - `pages/`: Các thành phần cấp trang (Shop, Home, ProductDetail).
    - `context/`: Các nhà cung cấp ngữ cảnh React.
    - `services/`: Các hàm client API (vỏ bọc axios).
    - `store/`: Trạng thái Zustand/Redux (ví dụ: useStore).
    - `assets/`: Các tệp tĩnh.
