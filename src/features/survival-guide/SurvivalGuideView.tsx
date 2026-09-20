import React from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { MapPin, JapaneseYen } from 'lucide-react';

export const SurvivalGuideView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-sumi-900 border border-sumi-800 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber">Cẩm Nang Sống Còn</Badge>
          <Badge variant="blue">5 Điểm Mù Kỳ Thi FE</Badge>
        </div>
        <h2 className="text-base font-bold text-sumi-100">
          5 Điểm Mù Thí Sinh Thi FE Tại Nhật Bản Thường Bỏ Quên
        </h2>
        <p className="text-xs text-sumi-400">
          Tổng hợp từ kinh nghiệm thực chiến của các sensei Nhật và thí sinh đã đỗ kỳ thi Kỹ sư CNTT Cơ bản (IPA).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blind Spot 1 */}
        <BentoCard
          title="1. Quy Chế Phòng Thi Prometric & Bảng Mica Viết Bút Dạ"
          subtitle="Điều kiện thi thực tế trên máy tính CBT"
          badge={<Badge variant="rose">Phòng Thi</Badge>}
        >
          <div className="space-y-3 mt-2 text-xs text-sumi-300 leading-relaxed">
            <p>
              • <strong>Tuyệt đối không có giấy nháp và bút riêng:</strong> Giám thị sẽ phát cho bạn 2 tấm bảng mica A4 (Whiteboard) và 1 cây bút lông đen có đầu gôm.
            </p>
            <p>
              • <strong>Chiến thuật viết bảng mica:</strong> Đầu bút lông khá to, nếu viết chữ to hoặc viết cả câu sẽ hết diện tích rất nhanh. Hãy viết tắt biến số: <code className="text-emerald-400 font-mono">i, j, m, arr</code> thành 1 ký tự, kẻ cột thật nhỏ.
            </p>
            <p>
              • <strong>Màn hình CBT:</strong> Giao diện chia đôi, đề bài bên trái, câu hỏi trắc nghiệm bên phải. Sử dụng phím tắt chuyển câu và nút đánh dấu câu hỏi cần xem lại (Review Flag).
            </p>
          </div>
        </BentoCard>

        {/* Blind Spot 2 */}
        <BentoCard
          title="2. 'Mỏ Điểm' Management & Strategy Môn A"
          subtitle="20 câu hỏi dễ ăn điểm nhất trong đề thi"
          badge={<Badge variant="emerald">Chiến Thuật Điểm</Badge>}
        >
          <div className="space-y-3 mt-2 text-xs text-sumi-300 leading-relaxed">
            <p>
              • Thí sinh thường sa đà vào học toán nhị phân, số bù ở chương 1 mà quên mất rằng <strong>20 câu Management & Strategy</strong> chiếm tới 33% số điểm môn A!
            </p>
            <p>
              • <strong>Quản lý dự án (WBS, Critical path, EVM)</strong> và <strong>ITIL / SLA</strong> có ngân hàng câu hỏi lặp lại từ đề thi quá khứ lên đến 70-80%.
            </p>
            <p>
              • <strong>Chiến lược:</strong> Chỉ cần nắm chắc từ vựng và thuật ngữ chuyên ngành là có thể lấy trọn vẹn 18/20 câu ở phần này, tạo đệm an toàn cực lớn cho môn A.
            </p>
          </div>
        </BentoCard>

        {/* Blind Spot 3 */}
        <BentoCard
          title="3. Lộ Trình Tuần Nghỉ Đầu Tiên (Chống Kiệt Sức - Burnout)"
          subtitle="Hiệu ứng đà tăng tiến (Ramping Cadence)"
          badge={<Badge variant="amber">Tâm Lý Học</Badge>}
        >
          <div className="space-y-3 mt-2 text-xs text-sumi-300 leading-relaxed">
            <p>
              • Tuần này (21/09 - 27/09) bạn được nghỉ trọn vẹn cả tuần. Tuy nhiên, nếu lao vào giải thuật toán khó ngay trong 3 ngày đầu, bạn rất dễ bị ngợp và mất hứng thú khi quay lại đi làm vào tuần tới!
            </p>
            <p>
              • <strong>Phân bổ tỷ trọng vàng:</strong> 60% đọc lý thuyết tranh vẽ dễ hiểu của sách かやのき先生 + 40% làm quen cú pháp ngôn ngữ giả cơ bản sách 福嶋先生.
            </p>
            <p>
              • Mục tiêu tối thượng của tuần nghỉ: <strong>Thiết lập chuỗi Streak 7 ngày học liên tục</strong> và tạo cảm giác tự tin "mình hoàn toàn có thể làm chủ chứng chỉ này".
            </p>
          </div>
        </BentoCard>

        {/* Blind Spot 4 */}
        <BentoCard
          title="4. Cảnh Báo Đặt Chỗ Thi Prometric Tại Tokyo & Osaka"
          subtitle="Kỳ thi CBT quanh năm nhưng slot cuối tuần rất khan hiếm"
          badge={<Badge variant="blue"><MapPin size={12} /> CBT Booking</Badge>}
        >
          <div className="space-y-3 mt-2 text-xs text-sumi-300 leading-relaxed">
            <p>
              • Kỳ thi FE tổ chức quanh năm trên máy tính CBT của Prometric, bạn có thể tự do chọn ngày và giờ thi.
            </p>
            <p>
              • <strong>Tuy nhiên:</strong> Các điểm thi lớn tại trung tâm (Shinjuku, Shibuya, Akihabara, Umeda) vào các ngày Thứ 7 và Chủ Nhật thường <strong>hết chỗ trước 3 đến 4 tuần!</strong>
            </p>
            <p>
              • <strong>Hành động cần làm:</strong> Khi số giờ học tích lũy đạt khoảng 70-80 giờ (khoảng giữa tháng 12), hãy lên website Prometric đăng ký đặt trước ngày thi mong muốn (ví dụ giữa tháng 1 hoặc sau Tết).
            </p>
          </div>
        </BentoCard>

        {/* Blind Spot 5 */}
        <BentoCard
          title="5. Quản Lý Ngân Sách Đầu Tư & Lệ Phí Thi"
          subtitle="Chi phí 7,500 Yên và tài liệu"
          badge={<Badge variant="slate"><JapaneseYen size={12} /> Budget</Badge>}
        >
          <div className="space-y-3 mt-2 text-xs text-sumi-300 leading-relaxed">
            <div className="flex justify-between py-1.5 border-b border-sumi-800">
              <span className="text-sumi-300">Lệ phí thi FE chính thức IPA:</span>
              <span className="font-mono font-bold text-sumi-100">7,500 円 (đã gồm thuế)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sumi-800">
              <span className="text-sumi-300">Sách giáo trình かやのき先生:</span>
              <span className="font-mono font-bold text-sumi-100">~ 2,000 円</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sumi-800">
              <span className="text-sumi-300">Sách thuật toán 福嶋先生:</span>
              <span className="font-mono font-bold text-sumi-100">~ 2,000 円</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-sumi-300">Sách đề thi パーフェクトラーニング:</span>
              <span className="font-mono font-bold text-sumi-100">1,540 円</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2">
              Tổng đầu tư khoảng ~13,000 Yên. Chứng chỉ có giá trị vĩnh viễn, được cộng 5 điểm Visa kỹ năng tay nghề cao (高度人材ポイント) và trợ cấp bằng cấp tại các công ty IT Nhật Bản.
            </p>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
