# Chiến lược Kiểm thử

## Trạng thái hiện tại
- Mã nguồn hiện đang thiếu một bộ kiểm thử tự động toàn diện.
- Kiểm thử thủ công đang được sử dụng để xác minh tính năng.

## Cải thiện theo kế hoạch
- **Backend:**
    - JUnit 5 để kiểm thử đơn vị (unit test) logic nghiệp vụ trong các Service.
    - Mockito để giả lập (mock) các Repository.
    - TestRestTemplate để kiểm thử tích hợp các Controller.
- **Frontend:**
    - Vitest/Jest cho logic thành phần.
    - Playwright/Cypress cho các luồng E2E (Đăng nhập, Thanh toán).
