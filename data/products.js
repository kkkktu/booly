export const products = [
    {
        id: 1, title: "Tội Ác Và Hình Phạt", author: "Fyodor Dostoevsky", category: "Văn học", subcategory: "Tiểu thuyết cổ điển", price: 185000,
        description: "Tác phẩm kinh điển đào sâu vào diễn biến tâm lý phức tạp của một sinh viên nghèo sau khi phạm tội ác. Một trong những cuốn tiểu thuyết vĩ đại nhất mọi thời đại của văn học Nga. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 50, sold: 450, rating: 4.8, publicationYear: 1866,
        cover: "../assets/images/toi-ac-va-hinh-phat.jpg",
        reviews: [ { user: "Nguyễn Văn A", rating: 5, comment: "Một kiệt tác vượt thời gian." } ]
    },
    {
        id: 2, title: "Lược Sử Thời Gian", author: "Stephen Hawking", category: "Khoa học", subcategory: "Vũ trụ - Thiên văn", price: 155000,
        description: "Chuyến du hành kỳ diệu khám phá vũ trụ từ vụ nổ Big Bang đến các lỗ đen. Stephen Hawking giải thích những bí ẩn của vũ trụ theo cách dễ hiểu nhất. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 30, sold: 820, rating: 4.7, publicationYear: 1988,
        cover: "../assets/images/luoc-su-thoi-gian.jpg",
        reviews: [ { user: "Hoàng Minh", rating: 5, comment: "Giải thích các khái niệm vật lý phức tạp rất dễ hiểu." } ]
    },
    {
        id: 3, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", category: "Tâm lý", subcategory: "Kỹ năng sống", price: 210000,
        description: "Khám phá hai hệ thống tư duy điều khiển cách chúng ta suy nghĩ và ra quyết định. Cuốn sách thay đổi cách bạn nhìn nhận về bản thân và thế giới. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 120, sold: 610, rating: 4.9, publicationYear: 2011,
        cover: "../assets/images/tu-duy-nhanh-va-cham.jpg",
        reviews: [ { user: "Lý Đức", rating: 5, comment: "Rất hay! Giúp tôi nhận ra nhiều lỗ hổng trong suy nghĩ." } ]
    },
    {
        id: 4, title: "Khởi Nghiệp Tinh Gọn", author: "Eric Ries", category: "Kinh doanh", subcategory: "Khởi nghiệp", price: 165000,
        description: "Phương pháp luận đột phá giúp các startup xây dựng sản phẩm linh hoạt, học hỏi nhanh và thích nghi với thị trường. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 85, sold: 340, rating: 4.6, publicationYear: 2011,
        cover: "../assets/images/khoi-nghiep-tinh-gon.jpg",
        reviews: [ { user: "Quốc Vượng", rating: 5, comment: "Cuốn sách phải đọc đối với startup." } ]
    },
    {
        id: 5, title: "Harry Potter và Hòn Đá Phù Thủy", author: "J.K. Rowling", category: "Văn học", subcategory: "Tiểu thuyết hiện đại", price: 145000,
        description: "Cuộc phiêu lưu kỳ diệu bắt đầu khi cậu bé mồ côi Harry Potter nhận được thư nhập học vào trường Hogwarts và bước vào thế giới phù thủy. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 200, sold: 1250, rating: 4.9, publicationYear: 1997,
        cover: "../assets/images/harry-potter-va-hon-da-phu-thuy.jpg",
        reviews: [ { user: "Gia Bảo", rating: 5, comment: "Tuổi thơ của tôi!" } ]
    },
    {
        id: 6, title: "Nhà Giả Kim", author: "Paulo Coelho", category: "Văn học", subcategory: "Kỹ năng sống - Self-help", price: 95000,
        description: "Hành trình theo đuổi giấc mơ và vận mệnh của cậu bé chăn cừu Santiago. Câu chuyện về sự dũng cảm lắng nghe trái tim. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 150, sold: 980, rating: 4.8, publicationYear: 1988,
        cover: "../assets/images/nha-gia-kim.jpg",
        reviews: [ { user: "Đình Trọng", rating: 5, comment: "Thông điệp về theo đuổi ước mơ rất sâu sắc." } ]
    },
    {
        id: 7, title: "Nguồn Gốc Các Loài", author: "Charles Darwin", category: "Khoa học", subcategory: "Sinh học - Tiến hóa", price: 195000,
        description: "Công trình nền tảng của sinh học tiến hóa, giới thiệu lý thuyết chọn lọc tự nhiên — một trong những khám phá vĩ đại nhất trong lịch sử khoa học. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 45, sold: 290, rating: 4.5, publicationYear: 1859,
        cover: "../assets/images/nguon-goc-cac-loai.jpg",
        reviews: [ { user: "Minh Trí", rating: 5, comment: "Nền tảng của sinh học hiện đại." } ]
    },
    {
        id: 8, title: "Đắc Nhân Tâm", author: "Dale Carnegie", category: "Tâm lý", subcategory: "Kỹ năng sống", price: 110000,
        description: "Nghệ thuật thu phục lòng người, nghệ thuật giao tiếp và xây dựng các mối quan hệ. Cuốn sách kỹ năng sống bán chạy nhất mọi thời đại. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 300, sold: 1450, rating: 4.7, publicationYear: 1936,
        cover: "../assets/images/dac-nhan-tam.jpg",
        reviews: [ { user: "Anh Thư", rating: 5, comment: "Những bài học giao tiếp chưa bao giờ lỗi thời." } ]
    },
    {
        id: 9, title: "Nhà Lãnh Đạo Không Chức Danh", author: "Robin Sharma", category: "Kinh doanh", subcategory: "Lãnh đạo", price: 135000,
        description: "Khám phá bí quyết để tỏa sáng và dẫn dắt ở bất kỳ vị trí nào trong tổ chức, không cần chức danh hay quyền lực chính thức. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 60, sold: 410, rating: 4.6, publicationYear: 2010,
        cover: "../assets/images/nha-lanh-dao-khong-chuc-danh.jpg",
        reviews: [ { user: "Đức Phát", rating: 5, comment: "Truyền động lực mạnh mẽ." } ]
    },
    {
        id: 10, title: "Hoàng Tử Bé", author: "Antoine de Saint-Exupéry", category: "Thiếu nhi", subcategory: "Tiểu thuyết", price: 85000,
        description: "Câu chuyện trong trẻo nhưng chứa đựng những triết lý sâu sắc về tình bạn, tình yêu và ý nghĩa cuộc sống. Tác phẩm được dịch ra nhiều thứ tiếng nhất thế giới. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 180, sold: 890, rating: 4.9, publicationYear: 1943,
        cover: "../assets/images/hoang-tu-be.jpg",
        reviews: [ { user: "Tiến Đạt", rating: 5, comment: "Mỗi lần đọc lại khám phá ra một ý nghĩa mới." } ]
    },
    {
        id: 11, title: "Giết Con Chim Nhại", author: "Harper Lee", category: "Văn học", subcategory: "Tiểu thuyết cổ điển", price: 140000,
        description: "Một tác phẩm lay động lòng người về sự bất công chủng tộc ở miền Nam nước Mỹ, nhìn qua đôi mắt ngây thơ của một cô bé. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 90, sold: 560, rating: 4.8, publicationYear: 1960,
        cover: "../assets/images/giet-con-chim-nhai.jpg",
        reviews: [ { user: "Nhật Minh", rating: 5, comment: "Nhân vật Atticus Finch là hình mẫu lý tưởng." } ]
    },
    {
        id: 12, title: "Vũ Trụ Của Carl Sagan", author: "Carl Sagan", category: "Khoa học", subcategory: "Vũ trụ - Thiên văn", price: 220000,
        description: "Hành trình khám phá quy mô vĩ đại của vũ trụ với văn phong nên thơ và đầy cảm hứng của nhà thiên văn học huyền thoại Carl Sagan. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 40, sold: 310, rating: 4.9, publicationYear: 1980,
        cover: "../assets/images/vu-tru-cua-carl-sagan.jpg",
        reviews: [ { user: "Thành Đạt", rating: 5, comment: "Văn phong của Carl Sagan rất nên thơ." } ]
    },
    {
        id: 13, title: "Sức Mạnh Của Thói Quen", author: "Charles Duhigg", category: "Tâm lý", subcategory: "Kỹ năng sống", price: 160000,
        description: "Khám phá khoa học đằng sau quá trình hình thành thói quen và cách thay đổi chúng để cải thiện cuộc sống, sự nghiệp và kinh doanh. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 110, sold: 720, rating: 4.6, publicationYear: 2012,
        cover: "../assets/images/suc-manh-cua-thoi-quen.jpg",
        reviews: [ { user: "Bảo Trâm", rating: 5, comment: "Giải thích cơ chế thói quen cực logic." } ]
    },
    {
        id: 14, title: "Từ Tốt Đến Vĩ Đại", author: "Jim Collins", category: "Kinh doanh", subcategory: "Lãnh đạo", price: 185000,
        description: "Phân tích những yếu tố then chốt giúp các công ty vươn lên thành tổ chức vĩ đại dựa trên nghiên cứu 5 năm với dữ liệu thuyết phục. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 75, sold: 540, rating: 4.8, publicationYear: 2001,
        cover: "../assets/images/tu-tot-den-vi-dai.jpg",
        reviews: [ { user: "Hoàng Tôn", rating: 5, comment: "Nghiên cứu công phu, dữ liệu thuyết phục." } ]
    },
    {
        id: 15, title: "Charlie Và Nhà Máy Sôcôla", author: "Roald Dahl", category: "Thiếu nhi", subcategory: "Tiểu thuyết", price: 90000,
        description: "Cuộc phiêu lưu kỳ lạ và đầy ngọt ngào bên trong nhà máy sôcôla kỳ bí của ông Willy Wonka — tác phẩm thiếu nhi kinh điển. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 130, sold: 680, rating: 4.7, publicationYear: 1964,
        cover: "../assets/images/charlie-va-nha-may-socola.jpg",
        reviews: [ { user: "Tuấn Lâm", rating: 4, comment: "Vừa hài hước vừa giáo dục sâu sắc." } ]
    },
    {
        id: 16, title: "Truyện Kiều", author: "Nguyễn Du", category: "Văn học", subcategory: "Thi ca - Thơ", price: 75000,
        description: "Kiệt tác thi ca của văn học Việt Nam, kể về cuộc đời trầm luân của Thúy Kiều — người con gái tài sắc vẹn toàn nhưng bất hạnh. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 150, sold: 900, rating: 5.0, publicationYear: 1820,
        cover: "../assets/images/Truyen-Kieu.jpg",
        reviews: [ { user: "Hải Yến", rating: 5, comment: "Văn thơ tuyệt mỹ, đỉnh cao văn học Việt Nam." } ]
    },
    {
        id: 31, title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", author: "Nguyễn Nhật Ánh", category: "Văn học", subcategory: "Tiểu thuyết Việt Nam", price: 79000,
        description: "Một câu chuyện đầy cảm xúc về tuổi thơ ở làng quê Việt Nam, về tình anh em, tình bạn và những kỷ niệm đẹp không bao giờ phai. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 100, sold: 1500, rating: 4.9, publicationYear: 2010,
        cover: "../assets/images/toi_thay_hoa_vang_tren_co_xanh__nguyen_nhat_anh.jpg",
        reviews: []
    },
    {
        id: 32, title: "Mắt Biếc", author: "Nguyễn Nhật Ánh", category: "Văn học", subcategory: "Tiểu thuyết Việt Nam", price: 75000,
        description: "Câu chuyện tình buồn giữa Ngạn và Hà Lan — mối tình đơn phương da diết, trong sáng và đau đớn qua những tháng năm tuổi trẻ. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 80, sold: 2000, rating: 4.8, publicationYear: 1990,
        cover: "../assets/images/mat-biec.jpg",
        reviews: []
    },
    {
        id: 33, title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ", author: "Nguyễn Nhật Ánh", category: "Văn học", subcategory: "Tiểu thuyết Việt Nam", price: 72000,
        description: "Chuyến du hành ngược thời gian về những ngày thơ bé hồn nhiên, về thế giới kỳ diệu mà chỉ trẻ em mới thực sự cảm nhận được. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 120, sold: 1800, rating: 4.9, publicationYear: 2008,
        cover: "../assets/images/cho_toi_xin_mot_ve_di_tuoi_tho.jpg",
        reviews: []
    },
    {
        id: 34, title: "Chiến Tranh Và Hòa Bình", author: "Lev Tolstoy", category: "Văn học", subcategory: "Tiểu thuyết cổ điển", price: 199000,
        description: "Kiệt tác văn học Nga, bức tranh toàn cảnh về cuộc chiến tranh Napoleon và số phận con người trong bối cảnh lịch sử hào hùng. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 40, sold: 300, rating: 4.7, publicationYear: 1869,
        cover: "../assets/images/chien_tranh_va_hoa_binh.jpg",
        reviews: []
    },
    {
        id: 35, title: "Thám Tử Lừng Danh Conan (T.1)", author: "Gosho Aoyama", category: "Thiếu nhi", subcategory: "Truyện tranh", price: 22000,
        description: "Hành trình phá án của thám tử Shinichi Kudo bị teo nhỏ thành cậu bé Conan. Bộ truyện trinh thám huyền thoại Nhật Bản. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 500, sold: 5000, rating: 4.9, publicationYear: 1994,
        cover: "../assets/images/tham-tu-lung-danh-conan-tap-1.jpg",
        reviews: []
    },
    {
        id: 36, title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", category: "Thiếu nhi", subcategory: "Phiêu lưu", price: 55000,
        description: "Cuộc phiêu lưu kỳ thú của chú Dế Mèn qua thế giới loài vật. Tác phẩm thiếu nhi kinh điển của văn học Việt Nam. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 200, sold: 3000, rating: 4.8, publicationYear: 1941,
        cover: "../assets/images/de_men_phieu_luu_ki.jpg",
        reviews: []
    },
    {
        id: 37, title: "Cây Cam Ngọt Của Tôi", author: "José Mauro de Vasconcelos", category: "Văn học", subcategory: "Tiểu thuyết hiện đại", price: 95000,
        description: "Câu chuyện xúc động về cậu bé Zezé nghịch ngợm nhưng đầy yêu thương, và người bạn đặc biệt — cây cam ngọt biết nói chuyện. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 150, sold: 1200, rating: 5.0, publicationYear: 1968,
        cover: "../assets/images/cay_cam_ngot_cua_toi.jpg",
        reviews: []
    },
    {
        id: 29, title: "Doraemon Tập 1", author: "Fujiko F. Fujio", category: "Thiếu nhi", subcategory: "Truyện tranh", price: 25000,
        description: "Hành trình đầu tiên của mèo máy đến từ tương lai giúp đỡ cậu bé Nobita với những bảo bối kỳ diệu từ túi thần kỳ. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 500, sold: 2500, rating: 5.0, publicationYear: 1970,
        cover: "../assets/images/Doraemon1.jpg",
        reviews: []
    },
    {
        id: 38, title: "The Alchemist", author: "Paulo Coelho", category: "Văn học", subcategory: "Tiểu thuyết hiện đại", price: 125000,
        description: "Câu chuyện hấp dẫn về cậu bé Santiago tìm kiếm kho báu ở Ai Cập, học hỏi từng bước về sự sống và vận mệnh. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 100, sold: 800, rating: 4.8, publicationYear: 1988,
        cover: "../assets/images/The-Alchemist.jpg",
        reviews: [ { user: "Ngọc Hà", rating: 5, comment: "Cùng tinh thần với Nhà Giả Kim." } ]
    },
    {
        id: 39, title: "The Bosnia List", author: "Kenan Trebinčević", category: "Văn học", subcategory: "Hồi ký", price: 135000,
        description: "Hồi ký tác động về cuộc sống tại Bosnia trong thời kỳ chiến tranh và hành trình tìm lại hy vọng. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 50, sold: 280, rating: 4.6, publicationYear: 2014,
        cover: "../assets/images/the-bosnia-list.jpg",
        reviews: [ { user: "Trung Kiên", rating: 5, comment: "Những trang sách xúc động." } ]
    },
    {
        id: 40, title: "Đường Xưa Mây Trắng", author: "Hạ Minh Huân", category: "Văn học", subcategory: "Tiểu thuyết Việt Nam", price: 95000,
        description: "Truyện ngôn tình lãng mạn kết hợp các yếu tố thần thoại và lịch sử, kể chuyện tình yêu vượt thời gian. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 80, sold: 650, rating: 4.7, publicationYear: 2015,
        cover: "../assets/images/duong-xua-may-trang.jpg",
        reviews: [ { user: "Linh Nhi", rating: 5, comment: "Rất lãng mạn!" } ]
    },
    {
        id: 41, title: "The Origin Of Species", author: "Charles Darwin", category: "Khoa học", subcategory: "Sinh học - Tiến hóa", price: 225000,
        description: "Tác phẩm kinh điển thay đổi toàn bộ nhận thức của nhân loại về sự sống và tiến hóa. Nền tảng của sinh học hiện đại. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 35, sold: 245, rating: 4.9, publicationYear: 1859,
        cover: "../assets/images/The-Origin-Of-Species.jpg",
        reviews: [ { user: "Anh Tuấn", rating: 5, comment: "Kiệt tác khoa học." } ]
    },
    {
        id: 42, title: "Sapiens - Lược Sử Loài Người", author: "Yuval Noah Harari", category: "Khoa học", subcategory: "Lịch sử - Xã hội", price: 235000,
        description: "Hành trình từ Thời đá cho đến thế kỷ 21, khám phá cách loài người thống trị thế giới thông qua những câu chuyện huyền thoại. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 60, sold: 910, rating: 4.9, publicationYear: 2011,
        cover: "../assets/images/sapiens-luoc-su-loai-nguoi.jpg",
        reviews: [ { user: "Quốc Bảo", rating: 5, comment: "Tầm nhìn chiến lược về lịch sử." } ]
    },
    {
        id: 43, title: "QED - Lý Thuyết Kỳ Lạ Về Ánh Sáng Và Vật Chất", author: "Richard Feynman", category: "Khoa học", subcategory: "Vật lý - Cơ học lượng tử", price: 180000,
        description: "Nhà vật lý huyền thoại Richard Feynman giải thích những bí ẩn của điện động lực học lượng tử một cách đầy sáng tạo. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 45, sold: 310, rating: 4.7, publicationYear: 1985,
        cover: "../assets/images/qed-ly-thuyet-ky-la-ve-anh-sang-va-vat-chat.jpg",
        reviews: [ { user: "Minh Đức", rating: 5, comment: "Vật lý được giải thích rất thú vị." } ]
    },
    {
        id: 44, title: "Cấu Trúc Các Cuộc Cách Mạng Khoa Học", author: "Thomas S. Kuhn", category: "Khoa học", subcategory: "Khoa học - Triết học", price: 165000,
        description: "Tác phẩm phá vỡ những quan niệm truyền thống về tiến bộ khoa học, giới thiệu khái niệm paradigm shift. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 40, sold: 275, rating: 4.6, publicationYear: 1962,
        cover: "../assets/images/cau-truc-cac-cuoc-cach-mang-khoa-hoc.jpg",
        reviews: [ { user: "Tường Vy", rating: 4, comment: "Khái niệm rất mới mẻ." } ]
    },
    {
        id: 45, title: "Gen: Liêu Pháp Cho Bệnh Tật", author: "Siddhartha Mukherjee", category: "Khoa học", subcategory: "Di truyền - Y học", price: 195000,
        description: "Cuộc hành trình tìm hiểu gen, từ những khám phá đầu tiên cho đến những tiến bộ y học hiện đại nhất. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 50, sold: 380, rating: 4.8, publicationYear: 2016,
        cover: "../assets/images/gen-lic-su-mat-thiet.jpg",
        reviews: [ { user: "Khoa Bảo", rating: 5, comment: "Khoa học y học giải thích dễ hiểu." } ]
    },
    {
        id: 46, title: "Những Tư Nhân Của Địa Lý", author: "James Diamond", category: "Khoa học", subcategory: "Địa lý - Lịch sử", price: 210000,
        description: "Giải thích tại sao một số khu vực thế giới phát triển hơn những khu vực khác thông qua lăng kính địa lý và lịch sử. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 55, sold: 420, rating: 4.8, publicationYear: 1997,
        cover: "../assets/images/Nhung_tu_nhan_cua_dia_ly.jpg",
        reviews: [ { user: "Hương Giang", rating: 5, comment: "Góc nhìn lịch sử địa lý rất sâu sắc." } ]
    },
    {
        id: 47, title: "Ogilvy Về Quảng Cáo", author: "David Ogilvy", category: "Kinh doanh", subcategory: "Marketing - Quảng cáo", price: 150000,
        description: "Những bí quyết marketing từ ông vua quảng cáo David Ogilvy - hướng dẫn thiết thực cho các nhà quảng cáo hiện đại. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 70, sold: 520, rating: 4.7, publicationYear: 1983,
        cover: "../assets/images/ogilvy-ban-ve-quang-cao.jpg",
        reviews: [ { user: "Anh Sơn", rating: 5, comment: "Kinh điển marketing." } ]
    },
    {
        id: 48, title: "Kinh Tế Học Hài Hước", author: "Ha-Joon Chang", category: "Kinh doanh", subcategory: "Kinh tế học", price: 155000,
        description: "Khám phá kinh tế học qua những câu chuyện hài hước, giáo dục, giúp bạn hiểu rõ hơn về thế giới tài chính. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 65, sold: 445, rating: 4.6, publicationYear: 2014,
        cover: "../assets/images/kinh-te-hoc-hai-huoc.jpg",
        reviews: [ { user: "Linh Chi", rating: 5, comment: "Vừa vui vừa học được nhiều." } ]
    },
    {
        id: 49, title: "Kinh Tế Vĩ Mô", author: "N. Gregory Mankiw", category: "Kinh doanh", subcategory: "Kinh tế học", price: 185000,
        description: "Giáo trình đầu tiên về kinh tế vĩ mô - cách thế giới hoạt động thông qua những nguyên lý kinh tế cơ bản. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 55, sold: 380, rating: 4.7, publicationYear: 2010,
        cover: "../assets/images/kinh-te-vix-mo.jpg",
        reviews: [ { user: "Duy Tân", rating: 5, comment: "Giáo trình kinh tế vĩ mô hay nhất." } ]
    },
    {
        id: 50, title: "Nghĩ Giàu Và Làm Giàu", author: "Napoleon Hill", category: "Kinh doanh", subcategory: "Kinh doanh - Tư duy", price: 125000,
        description: "Cuốn sách huyền thoại về tư duy khởi nghiệp, khám phá cách những triệu phú tư duy và hành động khác biệt. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        stock: 120, sold: 1200, rating: 4.9, publicationYear: 1937,
        cover: "../assets/images/nghi-giau-va-lam-giau.jpg",
        reviews: [ { user: "Thiên Ân", rating: 5, comment: "Thay đổi cách tôi nhìn tiền bạc." } ]
    }
];

// ============================================================
// COMBO PACKS DATA
// ============================================================
export const comboPacks = [
    {
        id: "combo-1",
        name: "Combo Văn Học Kinh Điển",
        description: "Bộ 3 cuốn tiểu thuyết kinh điển thế giới — hành trình qua những trang sách bất hủ. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        bookIds: [1, 6, 10],
        discountPct: 20,
        badge: "🏆 Best Combo",
        theme: "linear-gradient(135deg, #1a1a2e, #16213e)"
    },
    {
        id: "combo-2",
        name: "Combo Khoa Học Vũ Trụ",
        description: "Khám phá vũ trụ qua góc nhìn của Hawking và Sagan — bộ đôi không thể thiếu. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        bookIds: [2, 12, 7],
        discountPct: 18,
        badge: "🔬 Science Pack",
        theme: "linear-gradient(135deg, #0d1b2a, #1b4332)"
    },
    {
        id: "combo-3",
        name: "Combo Phát Triển Bản Thân",
        description: "3 cuốn sách thay đổi tư duy — đầu tư tốt nhất cho bản thân bạn. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        bookIds: [3, 8, 13],
        discountPct: 22,
        badge: "⭐ Top Pick",
        theme: "linear-gradient(135deg, #3d0c02, #6b1a0f)"
    },
    {
        id: "combo-4",
        name: "Combo Thiếu Nhi Yêu Thích",
        description: "Món quà hoàn hảo cho trẻ — bộ sưu tập thiếu nhi được yêu thích nhất. Tác phẩm phù hợp với độc giả muốn đọc sâu hơn, vừa nắm được nội dung chính vừa rút ra những góc nhìn hữu ích cho học tập, công việc và đời sống. Khi mua tại Bookly, bạn có thể xem nhanh thông tin tác giả, năm xuất bản, đánh giá của người đọc và tình trạng còn hàng để lựa chọn dễ dàng hơn.",
        bookIds: [35, 36, 29],
        discountPct: 25,
        badge: "👶 Kids Favorite",
        theme: "linear-gradient(135deg, #1a0033, #2d1b69)"
    }
];

// ============================================================
// BLOG POSTS DATA
// ============================================================
export const blogPosts = [
    {
        id: "blog-1",
        title: "Top 5 Cuốn Sách Thay Đổi Tư Duy Năm 2025",
        excerpt: "Những cuốn sách không chỉ truyền cảm hứng mà còn thực sự thay đổi cách bạn nhìn nhận cuộc sống và công việc...",
        author: "Đội ngũ Bookly",
        date: "15/05/2025",
        readTime: "5 phút đọc",
        cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop",
        tags: ["Self-help", "Tư duy", "2025"],
        featured: true
    },
    {
        id: "blog-2",
        title: "Nguyễn Nhật Ánh — Người Kể Chuyện Tuổi Thơ Vĩ Đại Nhất",
        excerpt: "Hành trình từ một cây bút tài năng đến nhà văn được yêu mến nhất Việt Nam, Nguyễn Nhật Ánh và những trang văn không bao giờ già...",
        author: "Minh Thư",
        date: "10/05/2025",
        readTime: "7 phút đọc",
        cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
        tags: ["Văn học Việt", "Tác giả", "Review"],
        featured: false
    },
    {
        id: "blog-3",
        title: "Khoa Học Vũ Trụ Qua 3 Cuốn Sách Không Thể Bỏ Lỡ",
        excerpt: "Từ Big Bang đến lỗ đen, từ sự sống đến vũ trụ song song — ba cuốn sách này sẽ đưa bạn vào cuộc phiêu lưu khoa học đỉnh cao...",
        author: "Đức Thịnh",
        date: "05/05/2025",
        readTime: "6 phút đọc",
        cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
        tags: ["Khoa học", "Vũ trụ", "Review"],
        featured: false
    },
    {
        id: "blog-4",
        title: "Đọc Sách Gì Để Bắt Đầu Khởi Nghiệp?",
        excerpt: "Nếu bạn đang ấp ủ ý tưởng khởi nghiệp, đây là danh sách những cuốn sách các nhà sáng lập thành công nhất thế giới đều đã đọc...",
        author: "Khoa Nguyên",
        date: "01/05/2025",
        readTime: "8 phút đọc",
        cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
        tags: ["Khởi nghiệp", "Kinh doanh", "Gợi ý"],
        featured: false
    }
];
