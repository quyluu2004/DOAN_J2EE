# Các vấn đề quan ngại và Nợ kỹ thuật

## Ưu tiên cao
- **Hiệu năng:** Việc khởi động lạnh (cold start) của gói Render miễn phí gây ra độ trễ ban đầu lớn (30-50 giây).
- **Hiệu quả:** Vấn đề truy vấn N+1 được phát hiện khi lấy dữ liệu `Product -> Variants` (tải EAGER).
- **Bộ nhớ đệm:** Redis caching trước đây bị tắt (annotation Service bị comment).

## Ưu tiên trung bình
- **Bảo mật:** Đảm bảo `JWT_SECRET` và các khóa nhạy cảm khác không bao giờ được commit và chỉ được quản lý qua biến môi trường.
- **Tính toàn vẹn dữ liệu:** Thiếu ràng buộc khóa ngoại trong một số hoạt động xóa thủ công (deleteProduct sử dụng cập nhật JDBC thủ công).
- **Độ bao phủ kiểm thử:** Việc không có kiểm thử tự động làm tăng rủi ro lỗi khi tái cấu trúc mã nguồn.

## Ưu tiên thấp
- **Tính nhất quán:** Một số thành phần sử dụng CSS thuần, một số khác có thể hưởng lợi từ một hệ thống thiết kế thống nhất.
- **Tính di động:** Việc lạm dụng Native SQL (như `DATE_FORMAT`) có thể gây lỗi khi chuyển đổi giữa các hệ quản trị DB khác nhau (ví dụ MySQL sang PostgreSQL).

## Các vấn đề đã giải quyết
- [x] **Lỗi Admin Dashboard 400:** Đã khắc phục bằng cách chuyển đổi Native Query sang Repository pattern và chuẩn hóa Exception Handling.
