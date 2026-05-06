# Tích hợp Hệ thống

## Dịch vụ bên ngoài
- **Cloudinary:** Sử dụng để lưu trữ và truy xuất hình ảnh sản phẩm và mô hình 3D GLB.
- **Aiven:** Nhà cung cấp đám mây cho các phiên bản MySQL và Redis.
- **Render:** Nền tảng hosting cho backend và tiềm năng cho frontend.
- **Gmail (SMTP):** Sử dụng để gửi email giao dịch (đặt lại mật khẩu, v.v.).

## Nhà cung cấp xác thực
- **Google OAuth:** Tích hợp đăng nhập mạng xã hội.
- **Facebook SDK:** Tích hợp đăng nhập mạng xã hội.
- **Discord:** Sử dụng để xác minh bot 2FA.

## API nội bộ
- **/api/auth:** Xác thực và quản lý người dùng.
- **/api/products:** Danh mục sản phẩm, tìm kiếm và chi tiết.
- **/api/wishlist:** Sản phẩm đã lưu của người dùng.
- **/api/cart:** Quản lý giỏ hàng.
- **/api/orders:** Xử lý đơn hàng bán hàng.
- **/api/upload:** Xử lý tải tệp lên Cloudinary.
