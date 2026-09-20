import React from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { DailyScheduleItem, BookItem, ExamScoreRecord } from '../../shared/types';
import { Clock, BookOpen, AlertTriangle, Calendar, FileSpreadsheet, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  schedule: DailyScheduleItem[];
  books: BookItem[];
  examScores: ExamScoreRecord[];
  onNavigateTab: (tab: string) => void;
  onExportExcel: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  schedule,
  books,
  examScores,
  onNavigateTab,
  onExportExcel,
}) => {
  const targetHours = 135;
  const actualHours = Number(schedule.reduce((sum, s) => sum + s.actualHours, 0).toFixed(1));
  const plannedToDate = Number(schedule.slice(0, 7).reduce((sum, s) => sum + s.plannedHours, 0).toFixed(1));
  const weekendBufferNeeded = Number(schedule.reduce((sum, s) => sum + s.catchUpBufferHours, 0).toFixed(1));
  const readinessPercent = Math.min(100, Math.round((actualHours / targetHours) * 100));

  const latestMock = examScores.length > 0 ? examScores[examScores.length - 1] : null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Kickstart Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sumi-900 via-sumi-850 to-sumi-900 border border-sumi-700/80 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="emerald">FE SYLLABUS VER 9.1</Badge>
              <Badge variant="amber">KICKSTART WEEK 2026/09/21 - 09/27</Badge>
              <span className="text-xs font-mono text-sumi-400">Target: 135 Hours</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sumi-100 flex items-center gap-2">
              基本情報技術者試験 (FE) 統合ダッシュボード
            </h1>
            <p className="text-xs text-sumi-400 max-w-2xl">
              Chiến lược song song: かやのき (Lý thuyết) + 福嶋 (Thuật toán B) + パーフェクトラーニング (Luyện đề). 
              Nghỉ trọn vẹn tuần này (21-27/09) để bứt tốc 2.5 - 3h/ngày!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={<FileSpreadsheet size={16} className="text-emerald-400" />}
              onClick={onExportExcel}
              className="text-xs"
            >
              Xuất File Excel (.xlsx)
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={16} />}
              onClick={() => onNavigateTab('scanner')}
              className="text-xs"
            >
              Scan & Gemini OCR
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Grid Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Study Hours */}
        <BentoCard
          title="総学習時間 (Giờ đã học)"
          subtitle="Tích lũy thực tế"
          badge={<Badge variant="blue"><Clock size={12} /> Live</Badge>}
        >
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-mono font-bold text-sumi-100">{actualHours}</span>
            <span className="text-xs font-mono text-sumi-400">/ {targetHours}h Mục tiêu</span>
          </div>
          <div className="w-full bg-sumi-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (actualHours / targetHours) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-sumi-400 mt-2 flex justify-between">
            <span>Kế hoạch tuần này: {plannedToDate}h</span>
            <span className="font-mono text-blue-400">{readinessPercent}%</span>
          </p>
        </BentoCard>

        {/* KPI 2: Readiness Status */}
        <BentoCard
          title="試験準備度 (Readiness)"
          subtitle="Dự báo mức độ sẵn sàng"
          badge={<Badge variant={readinessPercent >= 70 ? 'emerald' : 'amber'}>CBT Ready</Badge>}
        >
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">{readinessPercent}%</span>
            <span className="text-xs text-sumi-400 font-mono">Ngưỡng an toàn: 70%+</span>
          </div>
          <div className="w-full bg-sumi-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-sumi-400 mt-2">
            {readinessPercent < 40 ? 'Giai đoạn xây gốc lý thuyết & thuật toán' : 'Giai đoạn bứt tốc luyện đề quá khứ'}
          </p>
        </BentoCard>

        {/* KPI 3: Weekend Buffer Needed */}
        <BentoCard
          title="週末補修時間 (Giờ bù cuối tuần)"
          subtitle="Dồn giờ khi bận việc"
          badge={<Badge variant={weekendBufferNeeded > 0 ? 'rose' : 'emerald'}><AlertTriangle size={12} /> Buffer</Badge>}
        >
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-3xl font-mono font-bold ${weekendBufferNeeded > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {weekendBufferNeeded}h
            </span>
            <span className="text-xs text-sumi-400 font-mono">T7 & CN tuần này</span>
          </div>
          <p className="text-[11px] text-sumi-400 mt-4 leading-relaxed">
            {weekendBufferNeeded > 0 
              ? `⚠️ Cần bù thêm ${weekendBufferNeeded}h vào Thứ 7/CN để không trễ lịch.`
              : '✅ Tiến độ ngày thường đang đạt 100%! Không cần bù giờ.'}
          </p>
        </BentoCard>

        {/* KPI 4: Streak & Focus */}
        <BentoCard
          title="学習継続日数 (Study Streak)"
          subtitle="Kỷ luật hàng ngày"
          badge={<Badge variant="amber">🔥 STREAK</Badge>}
        >
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-mono font-bold text-amber-400">1 Ngày</span>
            <Button variant="ghost" size="sm" onClick={triggerCelebration} className="text-xs text-amber-400 hover:text-amber-300">
              <Award size={14} /> Điểm danh
            </Button>
          </div>
          <p className="text-[11px] text-sumi-400 mt-4">
            Bắt đầu: Thứ Hai 2026/09/21. Duy trì liên tục để nhận huy hiệu Samurai FE!
          </p>
        </BentoCard>
      </div>

      {/* Bento Grid Row 2: 3-Book Progress & Mock Exam Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3 Books Detailed Status */}
        <div className="lg:col-span-2 space-y-4">
          <BentoCard
            title="📚 3冊の教材・進捗サマリー (3 Books Progress)"
            subtitle="Tổng quan tiến độ đọc và trạng thái scan PDF sách giấy"
            action={
              <Button variant="outline" size="sm" onClick={() => onNavigateTab('curriculum')} className="text-xs">
                Chi tiết chương
              </Button>
            }
          >
            <div className="space-y-4 mt-2">
              {books.map((book) => {
                const total = book.chapters.length;
                const completed = book.chapters.filter((c) => c.studyStatus === 'completed').length;
                const scanned = book.chapters.filter((c) => c.scanStatus === 'scanned').length;
                const pct = Math.round((completed / total) * 100);

                return (
                  <div key={book.id} className="p-3.5 bg-sumi-850/60 border border-sumi-800 rounded-md">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-sumi-100">{book.title}</span>
                          <Badge variant={book.targetSubject === '科目B' ? 'rose' : 'blue'}>
                            {book.targetSubject}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-sumi-400 mt-0.5">
                          {book.author} | {book.publisher}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-sumi-200">{pct}%</span>
                    </div>

                    <div className="w-full bg-sumi-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-sumi-400 mt-2.5 pt-2 border-t border-sumi-800/40">
                      <span>Đã học: <strong className="text-sumi-200 font-mono">{completed}/{total}</strong> chương</span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={12} className={scanned === total ? 'text-emerald-400' : 'text-amber-400'} />
                        Scan PDF: <strong className="text-sumi-200 font-mono">{scanned}/{total}</strong>
                        {scanned < total && (
                          <span className="text-amber-400 text-[10px] ml-1">(Cần scan thêm)</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>
        </div>

        {/* Right Col: Latest Mock Exam IPA Score */}
        <div className="space-y-4">
          <BentoCard
            title="📝 模擬試験スコア (Latest Mock Score)"
            subtitle="Đánh giá quy đổi theo chuẩn IPA thang 1000 điểm"
            action={
              <Button variant="outline" size="sm" onClick={() => onNavigateTab('exam-simulator')} className="text-xs">
                Luyện đề
              </Button>
            }
          >
            {latestMock ? (
              <div className="space-y-4 mt-2">
                <div className="p-3 bg-sumi-850 border border-sumi-800 rounded-md">
                  <span className="text-xs font-medium text-sumi-300">{latestMock.examName}</span>
                  <p className="text-[11px] text-sumi-400">Ngày làm: {latestMock.dateTaken}</p>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-sumi-800/60">
                    <div>
                      <p className="text-[10px] text-sumi-400">科目A (Lý thuyết)</p>
                      <p className="text-lg font-mono font-bold text-emerald-400">{latestMock.subjectAScore1000} <span className="text-xs text-sumi-400">/1000</span></p>
                      <span className="text-[10px] text-sumi-400">{latestMock.subjectACorrect}/60 câu đúng</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-sumi-400">科目B (Thuật toán)</p>
                      <p className="text-lg font-mono font-bold text-emerald-400">{latestMock.subjectBScore1000} <span className="text-xs text-sumi-400">/1000</span></p>
                      <span className="text-[10px] text-sumi-400">{latestMock.subjectBCorrect}/20 câu đúng</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-sumi-800/60 flex items-center justify-between">
                    <span className="text-xs text-sumi-400">Kết quả tổng thể:</span>
                    <Badge variant={latestMock.overallPass ? 'emerald' : 'rose'}>
                      {latestMock.overallPass ? '★ 合格 (PASS)' : '✕ 不合格 (FAIL)'}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-sumi-850/60 border border-sumi-800 rounded text-xs text-sumi-300 space-y-1">
                  <p className="font-semibold text-sumi-200">Chuẩn đỗ IPA:</p>
                  <p className="text-[11px] text-sumi-400">• Cả 2 môn đều phải đạt tối thiểu <strong>600/1000</strong>.</p>
                  <p className="text-[11px] text-sumi-400">• Môn B gồm 16 câu Thuật toán + 4 câu Bảo mật.</p>
                  <p className="text-[11px] text-emerald-400 font-mono">• Điểm thi thử: Đang ở vùng an toàn!</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-sumi-400 text-xs">
                <p>Chưa có dữ liệu thi thử.</p>
                <Button variant="outline" size="sm" onClick={() => onNavigateTab('exam-simulator')} className="mt-3">
                  Tạo bài thi thử đầu tiên
                </Button>
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      {/* Bento Grid Row 3: Upcoming Holidays & Survival Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Japanese Holidays Schedule */}
        <BentoCard
          title="🎌 今後の祝日・集中学習チャンス (Lịch Nghỉ Lễ Nhật Bản)"
          subtitle="Tận dụng các ngày nghỉ đỏ và kỳ nghỉ Tết dài ngày"
          badge={<Badge variant="amber"><Calendar size={12} /> Holidays</Badge>}
        >
          <div className="space-y-2.5 mt-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-amber-950/20 border border-amber-800/50 rounded">
              <div>
                <span className="font-semibold text-amber-300">2026/09/21 - 09/27 (Tuần này)</span>
                <p className="text-[11px] text-sumi-400">★ Tuần nghỉ trọn vẹn (Kickstart 7 ngày liên tục)</p>
              </div>
              <span className="font-mono text-amber-400 font-bold">2.5 - 3h/ngày</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-sumi-850 border border-sumi-800 rounded">
              <div>
                <span className="font-medium text-sumi-200">2026/10/12: スポーツの日 (Sports Day)</span>
                <p className="text-[10px] text-sumi-400">Nghỉ 1 ngày thứ Hai</p>
              </div>
              <span className="font-mono text-sumi-300">2.5h</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-sumi-850 border border-sumi-800 rounded">
              <div>
                <span className="font-medium text-sumi-200">2026/11/03: 文化の日 (Culture Day)</span>
                <p className="text-[10px] text-sumi-400">Nghỉ 1 ngày thứ Ba</p>
              </div>
              <span className="font-mono text-sumi-300">2.5h</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-blue-950/20 border border-blue-800/50 rounded">
              <div>
                <span className="font-semibold text-blue-300">2026/12/28 - 2027/01/03: 年末年始 (Nghỉ Tết)</span>
                <p className="text-[11px] text-sumi-400">Kỳ nghỉ Tết Dương lịch 7 ngày liên tục</p>
              </div>
              <span className="font-mono text-blue-400 font-bold">3.5 - 4h/ngày</span>
            </div>
          </div>
        </BentoCard>

        {/* 5 Blind Spots Survival Guide Preview */}
        <BentoCard
          title="🛡️ FE試験の盲点ガイド (Cẩm Nang 5 Điểm Mù Kỳ Thi FE)"
          subtitle="Những kinh nghiệm xương máu khi thi CBT tại Nhật"
          action={
            <Button variant="outline" size="sm" onClick={() => onNavigateTab('survival-guide')} className="text-xs">
              Xem cẩm nang
            </Button>
          }
        >
          <div className="space-y-2.5 mt-2 text-xs">
            <div className="p-2.5 bg-sumi-850 border border-sumi-800 rounded">
              <strong className="text-sumi-100 flex items-center gap-1.5">
                <span className="text-amber-400 font-mono">01</span> Bảng mica phòng thi Prometric
              </strong>
              <p className="text-[11px] text-sumi-400 mt-1">
                Không có giấy nháp! Prometric chỉ phát 2 bảng mica A4 và bút lông đen. Cần rèn kỹ năng viết tắt bảng Trace để không hết chỗ.
              </p>
            </div>

            <div className="p-2.5 bg-sumi-850 border border-sumi-800 rounded">
              <strong className="text-sumi-100 flex items-center gap-1.5">
                <span className="text-emerald-400 font-mono">02</span> Mỏ điểm Management & Strategy môn A
              </strong>
              <p className="text-[11px] text-sumi-400 mt-1">
                20 câu Quản lý dự án, ITIL và Luật IT có tỷ lệ câu hỏi lặp lại cực cao. Đừng để mất điểm ở phần dễ ăn nhất này.
              </p>
            </div>

            <div className="p-2.5 bg-sumi-850 border border-sumi-800 rounded">
              <strong className="text-sumi-100 flex items-center gap-1.5">
                <span className="text-blue-400 font-mono">03</span> Đặt chỗ thi trước 1 tháng tại Tokyo/Osaka
              </strong>
              <p className="text-[11px] text-sumi-400 mt-1">
                Lệ phí 7,500 Yên. Các điểm thi lớn ở Shinjuku, Shibuya thường hết slot cuối tuần trước 3-4 tuần!
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
