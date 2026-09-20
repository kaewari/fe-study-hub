import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { DailyScheduleItem } from '../../shared/types';
import { calculateWeeklyDeficits, calculateTotalStudyStats } from '../../shared/services/scheduleBufferService';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface PlannerViewProps {
  schedule: DailyScheduleItem[];
  onUpdateSchedule: (updated: DailyScheduleItem[]) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  schedule,
  onUpdateSchedule,
}) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const weeksCount = Math.ceil(schedule.length / 7);

  const currentWeekDays = schedule.slice(currentWeekIndex * 7, (currentWeekIndex + 1) * 7);
  const stats = calculateTotalStudyStats(schedule);

  const handleUpdateItem = (id: string, updates: Partial<DailyScheduleItem>) => {
    const rawUpdated = schedule.map((item) => (item.id === id ? { ...item, ...updates } : item));
    // Recalculate variance and weekend buffers
    const recalculated = calculateWeeklyDeficits(rawUpdated);
    onUpdateSchedule(recalculated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-sumi-900 border border-sumi-800 rounded-lg">
          <span className="text-[11px] text-sumi-400">Tổng giờ kế hoạch</span>
          <p className="text-xl font-mono font-bold text-sumi-100 mt-1">{stats.totalPlanned}h</p>
        </div>
        <div className="p-3.5 bg-sumi-900 border border-sumi-800 rounded-lg">
          <span className="text-[11px] text-sumi-400">Tổng giờ đã học thực tế</span>
          <p className="text-xl font-mono font-bold text-blue-400 mt-1">{stats.totalActual}h</p>
        </div>
        <div className="p-3.5 bg-sumi-900 border border-sumi-800 rounded-lg">
          <span className="text-[11px] text-sumi-400">Giờ thiếu cần bù cuối tuần</span>
          <p className={`text-xl font-mono font-bold mt-1 ${stats.totalBufferRequired > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {stats.totalBufferRequired}h
          </p>
        </div>
        <div className="p-3.5 bg-sumi-900 border border-sumi-800 rounded-lg">
          <span className="text-[11px] text-sumi-400">Số ngày đã hoàn thành</span>
          <p className="text-xl font-mono font-bold text-emerald-400 mt-1">{stats.completedDays} Ngày</p>
        </div>
      </div>

      {/* Week Navigator Bar */}
      <div className="flex items-center justify-between p-3 bg-sumi-900 border border-sumi-800 rounded-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={currentWeekIndex === 0}
            onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
          >
            <ArrowLeft size={14} /> Tuần trước
          </Button>
          <span className="text-xs font-mono font-semibold text-sumi-200">
            Tuần {currentWeekIndex + 1} / {weeksCount}
            {currentWeekIndex === 0 && (
              <Badge variant="amber" dot className="ml-2">Kickstart Tuần Đầu</Badge>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentWeekIndex >= weeksCount - 1}
            onClick={() => setCurrentWeekIndex((prev) => Math.min(weeksCount - 1, prev + 1))}
          >
            Tuần sau <ArrowRight size={14} />
          </Button>
        </div>

        <span className="text-xs text-sumi-400 font-mono">
          {currentWeekDays[0]?.date} ~ {currentWeekDays[currentWeekDays.length - 1]?.date}
        </span>
      </div>

      {/* Days Table */}
      <BentoCard title={`Lịch Học & Nhật Ký Tuần ${currentWeekIndex + 1}`}>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-sumi-800 bg-sumi-850/60 text-sumi-300 font-mono">
                <th className="py-2.5 px-3">Ngày / Thứ</th>
                <th className="py-2.5 px-3">Phân loại</th>
                <th className="py-2.5 px-3 text-center">Mục tiêu</th>
                <th className="py-2.5 px-3 text-center">Thực tế (h)</th>
                <th className="py-2.5 px-3 text-center">Bù cuối tuần</th>
                <th className="py-2.5 px-3">Môn & Nội dung chương</th>
                <th className="py-2.5 px-3 text-center">Tập trung</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sumi-800/60 font-sans">
              {currentWeekDays.map((day) => {
                const isKickstart = day.dayType === 'kickstart';
                const isNenmatsu = day.dayType === 'nenmatsu';
                const isHoliday = day.dayType === 'holiday';

                return (
                  <tr
                    key={day.id}
                    className={`hover:bg-sumi-850/40 transition-colors ${
                      isKickstart ? 'bg-amber-950/10' : (isHoliday ? 'bg-blue-950/10' : '')
                    }`}
                  >
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-medium text-sumi-100">{day.date}</div>
                      <span className="text-[11px] text-sumi-400 font-mono">{day.dayOfWeek} (Day {day.dayIndex})</span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge
                        variant={
                          isKickstart ? 'amber' : (isNenmatsu ? 'blue' : (isHoliday ? 'cyan' : 'slate'))
                        }
                      >
                        {day.dayTypeLabel}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-semibold text-sumi-300">
                      {day.plannedHours}h
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="16"
                        value={day.actualHours || ''}
                        placeholder="0.0"
                        onChange={(e) =>
                          handleUpdateItem(day.id, { actualHours: parseFloat(e.target.value) || 0 })
                        }
                        className="w-16 bg-sumi-950 border border-sumi-700 text-center text-xs rounded py-1 font-mono text-blue-400 focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      {day.catchUpBufferHours > 0 ? (
                        <span className="text-rose-400 font-bold">+{day.catchUpBufferHours}h</span>
                      ) : (
                        <span className="text-sumi-600">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-sumi-200">{day.subject}</div>
                      <input
                        type="text"
                        value={day.chapterTitle}
                        onChange={(e) => handleUpdateItem(day.id, { chapterTitle: e.target.value })}
                        className="w-full bg-transparent border-b border-dashed border-sumi-700 text-[11px] text-sumi-400 focus:outline-none focus:border-blue-500 py-0.5 mt-0.5"
                      />
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleUpdateItem(day.id, { focusLevel: star })}
                            className={`p-0.5 text-xs ${
                              star <= (day.focusLevel || 0) ? 'text-amber-400' : 'text-sumi-700'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(day.id, { completed: !day.completed })}
                        className={`p-1 rounded transition-colors ${
                          day.completed ? 'text-emerald-400 hover:text-emerald-300' : 'text-sumi-600 hover:text-sumi-400'
                        }`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>
  );
};
