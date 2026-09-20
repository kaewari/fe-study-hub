import React from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { DailyScheduleItem, BookItem, ExamScoreRecord } from '../../shared/types';
import {
  Clock,
  BookOpen,
  FileSpreadsheet,
  NotebookPen,
  Award,
  Code2,
  ShieldCheck,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
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
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Welcome & Kickstart Header */}
      <div className="bg-sumi-900 border border-sumi-800 rounded-xl p-5 sm:p-6 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="slate" dot>FE Syllabus Ver 9.1</Badge>
              <Badge variant="emerald" dot>Chuẩn IPA 600/1000 Điểm</Badge>
              <span className="text-[11px] font-mono text-sumi-400">Mục tiêu: 135 giờ</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-sumi-100">
              基本情報技術者試験 (FE) 統合ダッシュボード
            </h1>
            <p className="text-xs sm:text-sm text-sumi-300 max-w-2xl leading-relaxed">
              Chiến lược học song song: <strong className="text-sumi-100 font-medium">かやのき</strong> (Lý thuyết A) +{' '}
              <strong className="text-sumi-100 font-medium">福嶋</strong> (Mã giả B) +{' '}
              <strong className="text-sumi-100 font-medium">パーフェクトラーニング</strong> (Luyện đề). Tận dụng tuần nghỉ 21-27/09 để bứt tốc 2.5 - 3h/ngày.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-sumi-400">
              <span className="text-[var(--theme-accent,#3b82f6)] font-medium">「千里の行も足下に始まる」</span>
              <span>— Hành trình ngàn dặm bắt đầu từ một bước chân.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 lg:pt-0">
            <Button
              variant="outline"
              size="sm"
              icon={<FileSpreadsheet size={14} className="text-emerald-500" />}
              onClick={onExportExcel}
              className="text-xs"
            >
              Xuất File Excel (.xlsx)
            </Button>
            <Button
              variant="gradient"
              size="sm"
              icon={<NotebookPen size={14} />}
              onClick={() => onNavigateTab('study-notes')}
              className="text-xs"
            >
              Ghi Chú Học Tập
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Jump Action Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('algorithm-workshop')}
          className="p-3.5 rounded-xl bg-sumi-900 border border-sumi-800 hover:border-sumi-700 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Code2 size={16} />
            </div>
            <ArrowUpRight size={14} className="text-sumi-500 group-hover:text-[var(--theme-accent,#3b82f6)] transition-colors" />
          </div>
          <span className="text-xs font-semibold text-sumi-100 block">擬似言語 B</span>
          <span className="text-[11px] text-sumi-400 block truncate mt-0.5">Mã giả & Bảng Trace</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('security-workshop')}
          className="p-3.5 rounded-xl bg-sumi-900 border border-sumi-800 hover:border-sumi-700 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <ArrowUpRight size={14} className="text-sumi-500 group-hover:text-[var(--theme-accent,#3b82f6)] transition-colors" />
          </div>
          <span className="text-xs font-semibold text-sumi-100 block">セキュリティ</span>
          <span className="text-[11px] text-sumi-400 block truncate mt-0.5">4 Case Bảo mật thực tế</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('vocab-hub')}
          className="p-3.5 rounded-xl bg-sumi-900 border border-sumi-800 hover:border-sumi-700 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <ArrowUpRight size={14} className="text-sumi-500 group-hover:text-[var(--theme-accent,#3b82f6)] transition-colors" />
          </div>
          <span className="text-xs font-semibold text-sumi-100 block">Mazii 用語集</span>
          <span className="text-[11px] text-sumi-400 block truncate mt-0.5">Flashcard Từ vựng IT</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('pomodoro')}
          className="p-3.5 rounded-xl bg-sumi-900 border border-sumi-800 hover:border-sumi-700 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
            <ArrowUpRight size={14} className="text-sumi-500 group-hover:text-[var(--theme-accent,#3b82f6)] transition-colors" />
          </div>
          <span className="text-xs font-semibold text-sumi-100 block">Pomodoro Focus</span>
          <span className="text-[11px] text-sumi-400 block truncate mt-0.5">Đếm giờ 25m & Tự log</span>
        </button>
      </div>

      {/* Bento Grid Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Study Hours */}
        <BentoCard
          title="総学習時間 (Giờ đã học)"
          subtitle="Tích lũy thực tế"
          badge={<Badge variant="blue" dot>Live</Badge>}
        >
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-sumi-100">{actualHours}</span>
            <span className="text-xs font-mono text-sumi-400">/ {targetHours}h Mục tiêu</span>
          </div>
          <div className="w-full bg-sumi-800 rounded-full h-1 mt-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (actualHours / targetHours) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-sumi-400 mt-2.5 flex justify-between">
            <span>Kế hoạch tuần: {plannedToDate}h</span>
            <span className="font-mono text-blue-400 font-medium">{readinessPercent}%</span>
          </div>
        </BentoCard>

        {/* KPI 2: Readiness Status */}
        <BentoCard
          title="試験準備度 (Readiness)"
          subtitle="Dự báo mức độ sẵn sàng"
          badge={<Badge variant={readinessPercent >= 70 ? 'emerald' : 'amber'} dot>CBT Ready</Badge>}
        >
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">{readinessPercent}%</span>
            <span className="text-xs text-sumi-400 font-mono">Ngưỡng: 70%+</span>
          </div>
          <div className="w-full bg-sumi-800 rounded-full h-1 mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-sumi-400 mt-2.5 truncate">
            {readinessPercent < 40 ? 'Giai đoạn xây gốc lý thuyết & thuật toán' : 'Giai đoạn bứt tốc luyện đề quá khứ'}
          </p>
        </BentoCard>

        {/* KPI 3: Weekend Buffer Needed */}
        <BentoCard
          title="週末補修時間 (Giờ bù cuối tuần)"
          subtitle="Dồn giờ khi bận việc"
          badge={<Badge variant={weekendBufferNeeded > 0 ? 'rose' : 'emerald'} dot>Buffer</Badge>}
        >
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-2xl sm:text-3xl font-mono font-bold ${weekendBufferNeeded > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {weekendBufferNeeded}h
            </span>
            <span className="text-xs text-sumi-400 font-mono">Thứ 7 & CN</span>
          </div>
          <p className="text-[11px] text-sumi-400 mt-3 leading-relaxed flex items-center gap-1.5">
            {weekendBufferNeeded > 0 ? (
              <>
                <AlertCircle size={13} className="text-rose-400 shrink-0" />
                <span>Cần bù {weekendBufferNeeded}h vào cuối tuần để giữ lịch.</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>Tiến độ ngày thường đạt 100%, không cần bù giờ.</span>
              </>
            )}
          </p>
        </BentoCard>

        {/* KPI 4: Streak & Focus */}
        <BentoCard
          title="学習継続日数 (Study Streak)"
          subtitle="Kỷ luật hàng ngày"
          badge={<Badge variant="amber" dot>Streak</Badge>}
        >
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">1 Ngày</span>
            <Button
              variant="outline"
              size="sm"
              onClick={triggerCelebration}
              icon={<Award size={13} className="text-amber-400" />}
              className="text-xs"
            >
              Điểm danh
            </Button>
          </div>
          <p className="text-[11px] text-sumi-400 mt-3 truncate">
            Khởi động: Thứ Hai 2026/09/21. Duy trì liên tục để nhận huy hiệu!
          </p>
        </BentoCard>
      </div>

      {/* Bento Grid Row 2: 3-Book Progress & Mock Exam Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: 3 Books Detailed Status */}
        <div className="lg:col-span-2 space-y-4">
          <BentoCard
            title="3冊の教材・進捗サマリー (3 Books Progress)"
            subtitle="Tổng quan tiến độ học và hoàn thành các chương sách"
            action={
              <Button variant="outline" size="sm" onClick={() => onNavigateTab('curriculum')} className="text-xs">
                Chi tiết chương
              </Button>
            }
          >
            <div className="space-y-3 mt-1">
              {books.map((book) => {
                const total = book.chapters.length;
                const completed = book.chapters.filter((c) => c.studyStatus === 'completed').length;
                const pct = Math.round((completed / total) * 100);

                return (
                  <div key={book.id} className="p-3 bg-sumi-850/60 border border-sumi-800 rounded-lg">
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

                    <div className="w-full bg-sumi-800 rounded-full h-1 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-sumi-400 mt-2.5 pt-2 border-t border-sumi-800/60">
                      <span>Đã học: <strong className="text-sumi-200 font-mono">{completed}/{total}</strong> chương</span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={12} className={completed === total ? 'text-emerald-400' : 'text-blue-400'} />
                        <span className="text-sumi-300 font-mono">
                          {completed === total ? 'Đã hoàn thành' : `Còn ${total - completed} chương`}
                        </span>
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
            title="模擬試験スコア (Latest Mock Score)"
            subtitle="Đánh giá quy đổi theo chuẩn IPA thang 1000 điểm"
            action={
              <Button variant="outline" size="sm" onClick={() => onNavigateTab('exam-simulator')} className="text-xs">
                Luyện đề
              </Button>
            }
          >
            {latestMock ? (
              <div className="space-y-3 mt-1">
                <div className="p-3 bg-sumi-850/80 border border-sumi-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-sumi-200">{latestMock.examName}</span>
                    <span className="text-[10px] font-mono text-sumi-400">{latestMock.dateTaken}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-sumi-800/60">
                    <div>
                      <p className="text-[10px] text-sumi-400">科目A (Lý thuyết)</p>
                      <p className="text-lg font-mono font-bold text-emerald-400">
                        {latestMock.subjectAScore1000} <span className="text-xs text-sumi-400 font-normal">/1000</span>
                      </p>
                      <span className="text-[10px] text-sumi-400">{latestMock.subjectACorrect}/60 câu đúng</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-sumi-400">科目B (Thuật toán)</p>
                      <p className="text-lg font-mono font-bold text-emerald-400">
                        {latestMock.subjectBScore1000} <span className="text-xs text-sumi-400 font-normal">/1000</span>
                      </p>
                      <span className="text-[10px] text-sumi-400">{latestMock.subjectBCorrect}/20 câu đúng</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-sumi-800/60 flex items-center justify-between">
                    <span className="text-xs text-sumi-400">Kết quả tổng thể:</span>
                    <Badge variant={latestMock.overallPass ? 'emerald' : 'rose'} dot>
                      {latestMock.overallPass ? '合格 (PASS)' : '不合格 (FAIL)'}
                    </Badge>
                  </div>
                </div>

                <div className="p-2.5 bg-sumi-850/50 border border-sumi-800/80 rounded-lg text-xs text-sumi-300 space-y-1">
                  <p className="font-semibold text-sumi-200 text-[11px]">Chuẩn đỗ IPA:</p>
                  <p className="text-[11px] text-sumi-400">• Cả 2 môn đều phải đạt tối thiểu <strong>600/1000</strong>.</p>
                  <p className="text-[11px] text-sumi-400">• Môn B gồm 16 câu Thuật toán + 4 câu Bảo mật.</p>
                  <p className="text-[11px] text-emerald-400 font-mono">• Điểm thi thử hiện tại: Đang ở vùng an toàn.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Japanese Holidays Schedule */}
        <BentoCard
          title="今後の祝日・集中学習チャンス (Lịch Nghỉ Lễ Nhật Bản)"
          subtitle="Tận dụng các ngày nghỉ đỏ và kỳ nghỉ Tết dài ngày"
          badge={<Badge variant="amber" dot>Holidays</Badge>}
        >
          <div className="space-y-2 mt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-amber-500/8 border border-amber-500/20 rounded-lg">
              <div>
                <span className="font-semibold text-amber-600 dark:text-amber-300">2026/09/21 - 09/27 (Tuần này)</span>
                <p className="text-[11px] text-sumi-400">Tuần nghỉ trọn vẹn (Kickstart 7 ngày liên tục)</p>
              </div>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">2.5 - 3h/ngày</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-sumi-850/60 border border-sumi-800 rounded-lg">
              <div>
                <span className="font-medium text-sumi-200">2026/10/12: スポーツの日 (Sports Day)</span>
                <p className="text-[10px] text-sumi-400">Nghỉ 1 ngày thứ Hai</p>
              </div>
              <span className="font-mono text-sumi-300">2.5h</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-sumi-850/60 border border-sumi-800 rounded-lg">
              <div>
                <span className="font-medium text-sumi-200">2026/11/03: 文化の日 (Culture Day)</span>
                <p className="text-[10px] text-sumi-400">Nghỉ 1 ngày thứ Ba</p>
              </div>
              <span className="font-mono text-sumi-300">2.5h</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-blue-500/8 border border-blue-500/20 rounded-lg">
              <div>
                <span className="font-semibold text-blue-600 dark:text-blue-300">2026/12/28 - 2027/01/03: 年末年始 (Nghỉ Tết)</span>
                <p className="text-[11px] text-sumi-400">Kỳ nghỉ Tết Dương lịch 7 ngày liên tục</p>
              </div>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">3.5 - 4h/ngày</span>
            </div>
          </div>
        </BentoCard>

        {/* 5 Blind Spots Survival Guide Preview */}
        <BentoCard
          title="FE試験の盲点ガイド (Cẩm Nang 5 Điểm Mù Kỳ Thi FE)"
          subtitle="Những kinh nghiệm thực chiến khi thi CBT tại Nhật Bản"
          action={
            <Button variant="outline" size="sm" onClick={() => onNavigateTab('survival-guide')} className="text-xs">
              Xem cẩm nang
            </Button>
          }
        >
          <div className="space-y-2 mt-1 text-xs">
            <div className="p-2.5 bg-sumi-850/60 border border-sumi-800 rounded-lg">
              <strong className="text-sumi-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sumi-800 text-sumi-300 flex items-center justify-center font-mono text-[10px] shrink-0">
                  01
                </span>
                <span>Bảng mica phòng thi Prometric</span>
              </strong>
              <p className="text-[11px] text-sumi-400 mt-1 pl-7">
                Không có giấy nháp. Prometric chỉ phát 2 bảng mica A4 và bút lông đen. Cần rèn kỹ năng viết tắt bảng Trace để không hết chỗ.
              </p>
            </div>

            <div className="p-2.5 bg-sumi-850/60 border border-sumi-800 rounded-lg">
              <strong className="text-sumi-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sumi-800 text-sumi-300 flex items-center justify-center font-mono text-[10px] shrink-0">
                  02
                </span>
                <span>Mỏ điểm Management & Strategy môn A</span>
              </strong>
              <p className="text-[11px] text-sumi-400 mt-1 pl-7">
                20 câu Quản lý dự án, ITIL và Luật IT có tỷ lệ câu hỏi lặp lại cực cao. Đừng để mất điểm ở phần dễ ăn nhất này.
              </p>
            </div>

            <div className="p-2.5 bg-sumi-850/60 border border-sumi-800 rounded-lg">
              <strong className="text-sumi-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sumi-800 text-sumi-300 flex items-center justify-center font-mono text-[10px] shrink-0">
                  03
                </span>
                <span>Đặt chỗ thi trước 1 tháng tại Tokyo/Osaka</span>
              </strong>
              <p className="text-[11px] text-sumi-400 mt-1 pl-7">
                Lệ phí 7,500 Yên. Các điểm thi lớn ở Shinjuku, Shibuya thường hết slot cuối tuần trước 3-4 tuần.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
