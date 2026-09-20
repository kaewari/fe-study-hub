# 🌸 FE Study Hub (基本情報技術者試験 統合学習ハブ)

> **Hệ sinh thái học và luyện thi Kỹ sư Công nghệ Thông tin Cơ bản Nhật Bản (IPA Fundamental Information Technology Engineer Examination - FE Syllabus Ver. 9.1)**
> Thiết kế theo triết lý Kỹ sư Nhật Bản: **Sumi & Slate Bento Box (Anti-AI-Slop)**, tích hợp Gemini 2.5 Flash Vision OCR cho 3 đầu sách giấy, bộ mô phỏng chấm điểm IPA 1000 điểm, sổ tay câu sai lặp lại ngắt quãng (SRS Leitner) và liên kết từ vựng Mazii IT.

---

## 🎯 Chiến Lược 3 Mũi Nhọn (Triple-Track Study System)

1. **Giáo trình Lý thuyết Môn A**: *かやのき先生の基本情報技術者教室* (Chiến lược 35h - Phân loại theo Syllabus 9.1).
2. **Chuyên sâu Thuật toán & Mã giả Môn B**: *福嶋先生の集中ゼミ 科目B・アルゴリズム編* (Chiến lược 50h - 16 Thuật toán cốt lõi & Bảng Trace Table).
3. **Thực chiến Đề thi Quá khứ & CBT**: *パーフェクトラーニング過去問題集* (Chiến lược 50h - 60 câu môn A + 20 câu môn B).

---

## 🚀 Tính Năng Chính Của Hệ Thống

- **📊 Dashboard Bento KPIs**: Theo dõi 135 giờ học mục tiêu, tỷ lệ sẵn sàng thi CBT, tiến độ 3 đầu sách và cảnh báo bù giờ cuối tuần.
- **📅 Planner & Weekend Buffer**: Lịch học 100 ngày từ 2026-09-21 (Tuần kickstart nghỉ lễ 2.5-3h/ngày, ngày thường 1h/ngày, cuối tuần 2.5h/ngày). Tự động dồn thiếu hụt ngày thường vào đệm cuối tuần.
- **📷 Camera Scan & Gemini Vision OCR**:
  - Hỗ trợ chụp/tải ảnh trang sách từ điện thoại (vFlat / Adobe Scan).
  - Tự động luân chuyển **6 Gemini API Keys (Omniroute Failover)**: tự động chuyển key khi gặp lỗi HTTP 429 Rate Limit.
  - 3 bộ prompt chuyên biệt chuẩn hóa Markdown theo cấu trúc riêng của 3 đầu sách.
- **🧮 Xưởng Luyện Thuật Toán (Subject B Workshop)**:
  - Bảng chạy biến Trace Table tương tác trực tiếp (hỗ trợ nhập từng bước biến `i, j, m, arr`, phát hiện bẫy mảng bắt đầu từ 1).
  - 5 bài toán mẫu tích hợp: Tìm kiếm nhị phân, Sắp xếp nổi bọt, Euclid USCLN, Tháp Hà Nội, Duyệt cây nhị phân.
  - Bộ đếm thời gian thực chiến (6-8 phút/câu).
- **🛡️ Phân Tích Case Study Bảo Mật Môn B**:
  - 4 kịch bản phân tích log: Web Server (SQL Injection), Firewall, DNS (Cache Poisoning), Email (SPF/DKIM/DMARC).
  - Chiến lược "Bảo mật trước - Thuật toán sau" đảm bảo ăn trọn 4/4 câu bảo mật.
- **📝 Mô Phỏng Kỳ Thi & Chấm Điểm IPA Chuẩn**:
  - Thang điểm chuẩn hóa CBT 0 - 1000 điểm.
  - Đánh giá độc lập 2 môn: Cả Môn A và Môn B đều phải $\ge 600$ điểm mới đỗ, ngưỡng an toàn $\ge 700$ điểm.
- **🔁 Sổ Tay Câu Sai (SRS Leitner 3 Chu Kỳ)**:
  - Ôn tập ngắt quãng: Lần 1 (+1 ngày) $\to$ Lần 2 (+3 ngày) $\to$ Lần 3 (+7 ngày) $\to$ Mastered.
  - Phân loại 4 nguyên nhân sai sót: Đọc hiểu tiếng Nhật, Thuật toán, Lý thuyết, Bất cẩn.
- **📖 Từ Điển Thuật Ngữ IT FE (Mazii Data)**:
  - Trích xuất hơn 113 từ vựng cốt lõi từ cơ sở dữ liệu từ điển Mazii SQLite cục bộ.
  - Flashcard song ngữ Nhật - Việt - Anh kèm phát âm tiếng Nhật (Web Speech Synthesis).
- **💡 Cẩm Nang Sống Còn (5 Điểm Mù)**:
  - Quy chế thi thực tế Prometric (Bảng mica A4 + bút lông dạ).
  - Mỏ điểm Management & Strategy (20 câu môn A).
  - Chiến lược làm bài Môn B.
  - Cảnh báo đặt chỗ thi Tokyo/Osaka trước 3-4 tuần.
  - Ngân sách và lệ phí thi 7,500 Yên.
- **⏱️ Đồng Hồ Pomodoro Kỹ Sư**:
  - Chu kỳ 25 phút tập trung / 5 phút nghỉ.
  - Tự động tích lũy số phút học thực tế vào Dashboard.
- **🔒 Bảo Mật & Xuất Dữ Liệu**:
  - Màn hình khóa mã PIN (mặc định: `2026`).
  - Xuất bảng tính Excel `.xlsx` 7 sheet chuẩn hóa hoặc file sao lưu JSON 1-click.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu môi trường
- Node.js $\ge$ 18.0 (khuyên dùng Node 20+)
- npm hoặc yarn/pnpm

### 2. Khởi chạy nhanh
Chỉ cần chạy script khởi động tự động:
```bash
./start.sh
```
Hoặc chạy thủ công:
```bash
npm install
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173`
Nhập mã PIN: **`2026`**

---

## 🧪 Kiểm Thử & Kiểm Tra Bí Mật

Toàn bộ logic tính toán và chuyển đổi dữ liệu được bảo đảm bằng test suite Vitest:
```bash
# Chạy kiểm thử tự động
npm test

# Build kiểm tra kiểu TypeScript và đóng gói
npm run build

# Quét kiểm tra rò rỉ API key và bí mật
npm run check-secrets
```

---

## 🌐 Hướng Dẫn Đưa Lên Mạng (Deploy)

### Triển khai lên Vercel (Khuyên dùng - Miễn phí)
1. Cài đặt Vercel CLI (hoặc liên kết repo GitHub vào Vercel Dashboard):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Cấu hình các biến môi trường (Environment Variables) trên Vercel nếu muốn sử dụng Gemini API OCR:
   - `VITE_GEMINI_KEY_1` đến `VITE_GEMINI_KEY_6`
3. Đã có sẵn file cấu hình `vercel.json` phục vụ SPA routing.

### Triển khai lên GitHub Pages
Thêm `"base": "/fe-study-hub/"` vào `vite.config.ts` và chạy `npm run build` rồi push thư mục `dist` lên nhánh `gh-pages`.

---

## 📂 File Excel Kèm Theo Trên Desktop

File Excel kế hoạch học tập chi tiết 7 sheet được tạo tự động và lưu tại:
```
/Users/hoangson/Desktop/FE_Exam_Study_Tracker.xlsx
```
Được xác thực cú pháp và cấu trúc bảng tính bằng công cụ CLI `officecli validate`.
