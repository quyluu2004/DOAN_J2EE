# Quy ước Lập trình

## Chung
- **Đặt tên:** camelCase cho biến và hàm, PascalCase cho lớp và thành phần (component).
- **Tổ chức:** Tổ chức dựa trên tính năng hoặc dựa trên lớp (layer).

## Backend (Java/Spring)
- **API REST:** Sử dụng các phương thức HTTP tiêu chuẩn (GET, POST, PUT, DELETE).
- **Lombok:** Sử dụng `@Getter`, `@Setter`, `@Builder`, và `@Slf4j` để giảm mã lặp.
- **Xử lý ngoại lệ:** Xử lý lỗi tập trung hoặc tại Controller, trả về phản hồi JSON nhất quán.
- **Lưu trữ:** Cân nhắc giữa tải dữ liệu Eager và Lazy (Sửa lỗi N+1).

## Frontend (React/JS)
- **Thành phần chức năng:** Ưu tiên sử dụng hooks (useEffect, useState) thay vì class component.
- **Props:** Sử dụng destructuring cho props trong khai báo thành phần.
- **Services:** Các cuộc gọi API được tách biệt vào các tệp dịch vụ để giữ cho thành phần gọn gàng.
- **Định dạng:** Sử dụng lớp CSS cho bố cục, inline style hoặc utility class cho định dạng động.

## Git
- Sử dụng thông điệp commit có tính mô tả cao.
