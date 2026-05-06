# Phase Plan: 3D Studio Banner Enhancement

## Objective
Redesign the "3D Studio" section on the Home Page to create a premium, interactive experience. The highlight is a miniature 3D room corner accompanied by an animated 3D pointing hand that guides the user to the "Try 3D Studio Now" functionality.

## Proposed Changes

### 1. New Component: `MiniRoom3D.jsx`
- **Location:** `frontend/src/components/MiniRoom3D.jsx`
- **Tech:** `@react-three/fiber`, `@react-three/drei`, `three`.
- **Features:**
    - **Isometric Room:** A 3D scene representing a room corner with hai bức tường và một sàn nhà.
    - **Furniture:** Một mô hình sofa hoặc ghế 3D đơn giản nhưng thanh lịch.
    - **3D Pointing Hand:** Một vật thể 3D hình bàn tay lơ lửng và "chỉ" xuống góc phòng.
    - **Animation:** Chuyển động "trôi nổi" nhẹ nhàng cho căn phòng và "nhấp nhô/chỉ" cho bàn tay.
    - **Lighting:** Spotlight ấm áp từ trên cao để tạo bóng đổ chân thực.

### 2. Update: `HomePage.jsx`
- Thay thế phần banner 3D hiện tại bằng component `MiniRoom3D` mới.
- **Thẩm mỹ:**
    - Sử dụng `SplitText` từ `ReactBits` cho tiêu đề phần.
    - Sắp xếp layout tinh tế (nền tối, độ tương phản cao).
    - Đảm bảo nút "TRY 3D STUDIO NOW" nổi bật và hoạt động tốt.

### 3. Localization
- Cập nhật `en.json` và `vi.json` nếu cần thiết.

## Verification Plan

### Automated Tests
- N/A cho giai đoạn hình ảnh này (Ưu tiên UAT thủ công).

### Manual Verification (UAT)
- [ ] **Visuals:** Góc phòng 3D có hiển thị chính xác trong banner không?
- [ ] **Interactivity:** Bàn tay 3D có hoạt động (chỉ xuống) không?
- [ ] **Performance:** Canvas Three.js có load mượt mà không?
- [ ] **Responsiveness:** Layout banner có điều chỉnh tốt trên di động không?
- [ ] **Navigation:** Bấm vào nút CTA có chuyển hướng đến `/3d-designer` không?
