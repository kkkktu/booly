# Bookly - Cửa Hàng Sách Trực Tuyến Cao Cấp

Bookly là một dự án ứng dụng web thương mại điện tử chuyên bán sách, được xây dựng với mục tiêu mang lại trải nghiệm khám phá và mua sắm sách tuyệt vời nhất cho người dùng. Dự án áp dụng phong cách thiết kế **Editorial / Cao cấp**, tạo cảm giác sang trọng, thanh lịch nhưng vẫn vô cùng hiện đại.

## Cấu trúc thư mục

Dự án tuân theo cấu trúc tổ chức mã nguồn rõ ràng:

```text
/project
  /assets/          (Thư mục chứa icon, images - hiện sử dụng CDN và link ảnh trực tiếp)
  /css/             (Các file style)
    style.css       (Variables, Typography, Reset)
    components.css  (Cards, Buttons, Modals, Toasts)
    responsive.css  (Media Queries, Container Queries)
  /js/              (Logic JavaScript - ES6 Modules)
    main.js         (Khởi tạo app, sự kiện toàn cục)
    cart.js         (Quản lý giỏ hàng, LocalStorage, Wishlist)
    search.js       (Tìm kiếm, lọc, phân trang)
    products.js     (Render dữ liệu, Intersection Observer)
  /pages/           (Giao diện HTML)
    index.html      (Trang chủ)
    product-detail.html (Trang chi tiết)
    cart.html       (Trang giỏ hàng)
  /data/            (Dữ liệu giả lập)
    products.js     (Mock data với 15 cuốn sách)
  README.md         (Tài liệu dự án)
```

## Các tính năng nổi bật

1. **Giao diện (UI/UX):**
   - Phong cách Editorial: Sử dụng màu nền ngà (Ivory), màu nhấn nâu đất (Earth Brown) và Typography kết hợp giữa *Playfair Display* và *Source Serif Pro*.
   - Hoạt ảnh cuộn mượt mà: Áp dụng CSS `IntersectionObserver` cho hiệu ứng `fade-in-up` khi cuộn trang.
   - Hỗ trợ View Transitions API để chuyển đổi trang mượt mà (cần trình duyệt hỗ trợ).
   - Thiết kế Responsive với CSS Grid, Flexbox và Container Queries.

2. **Chức năng cốt lõi (JavaScript):**
   - Tìm kiếm thời gian thực (Real-time search) kết hợp với debounce.
   - Lọc sách theo danh mục (Thể loại) và Sắp xếp (Giá, Mới nhất).
   - "Xem nhanh" (Quick View) qua Modal.
   - Giỏ hàng và Danh sách yêu thích (Wishlist) lưu trữ với `localStorage`.
   - Thông báo (Toast Notification) và hiệu ứng Skeleton Loading khi tải sản phẩm.

## Công nghệ sử dụng

- **HTML5** & **CSS3** (Variables, Grid, Container Queries)
- **Vanilla JavaScript** (ES6 Modules, Array Methods, DOM Manipulation)
- **Phosphor Icons** (Sử dụng qua CDN)

## Cách chạy dự án

Dự án sử dụng ES6 Modules, do đó cần phải chạy thông qua một HTTP Server (không mở trực tiếp file `file://` trên trình duyệt).

1. Cài đặt một Live Server (ví dụ: extension *Live Server* trong VS Code, hoặc dùng Node.js/Python).
2. Chạy server tại thư mục `/project`.
3. Mở trình duyệt và truy cập `/pages/index.html`.

*Ví dụ với Python:*
```bash
cd project
python -m http.server 8000
# Mở http://localhost:8000/pages/index.html
```
