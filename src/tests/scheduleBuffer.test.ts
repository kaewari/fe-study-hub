import { describe, it, expect } from 'vitest';
import {
  calculateWeeklyDeficits,
  calculateTotalStudyStats,
} from '../shared/services/scheduleBufferService';
import { DailyScheduleItem } from '../shared/types';

describe('Schedule Buffer & Deficit Rollover Engine', () => {
  const createSampleWeek = (weekdayActual: number[], weekendActual: [number, number]): DailyScheduleItem[] => {
    const days: DailyScheduleItem[] = [];
    const weekdayNames = ['月', '火', '水', '木', '金', '土', '日'];
    
    // Mon - Fri (Planned: 1.0h each)
    for (let i = 0; i < 5; i++) {
      days.push({
        id: `day-${i + 1}`,
        dayIndex: i + 1,
        date: `2026-09-${21 + i}`,
        dayOfWeek: weekdayNames[i],
        dayType: 'kickstart',
        dayTypeLabel: 'Kickstart',
        plannedHours: 1.0,
        actualHours: weekdayActual[i] ?? 1.0,
        varianceHours: 0,
        catchUpBufferHours: 0,
        subject: 'かやのき先生',
        chapterTitle: 'Ch ' + (i + 1),
        focusLevel: 4,
        scanVerified: true,
        completed: (weekdayActual[i] ?? 1.0) >= 1.0,
        notes: '',
      });
    }

    // Sat (Planned: 2.5h)
    days.push({
      id: 'day-6',
      dayIndex: 6,
      date: '2026-09-26',
      dayOfWeek: '土',
      dayType: 'kickstart',
      dayTypeLabel: 'Kickstart Weekend',
      plannedHours: 2.5,
      actualHours: weekendActual[0],
      varianceHours: 0,
      catchUpBufferHours: 0,
      subject: '福嶋先生',
      chapterTitle: 'Algorithm Saturday',
      focusLevel: 5,
      scanVerified: true,
      completed: weekendActual[0] >= 2.5,
      notes: '',
    });

    // Sun (Planned: 2.5h)
    days.push({
      id: 'day-7',
      dayIndex: 7,
      date: '2026-09-27',
      dayOfWeek: '日',
      dayType: 'kickstart',
      dayTypeLabel: 'Kickstart Weekend',
      plannedHours: 2.5,
      actualHours: weekendActual[1],
      varianceHours: 0,
      catchUpBufferHours: 0,
      subject: 'パーフェクト過去問',
      chapterTitle: 'Review & Mock',
      focusLevel: 5,
      scanVerified: true,
      completed: weekendActual[1] >= 2.5,
      notes: '',
    });

    return days;
  };

  it('should calculate zero weekend buffer when weekday targets are 100% met', () => {
    const week = createSampleWeek([1.0, 1.0, 1.0, 1.0, 1.0], [2.5, 2.5]);
    const updated = calculateWeeklyDeficits(week);

    expect(updated[5].catchUpBufferHours).toBe(0);
    expect(updated[6].catchUpBufferHours).toBe(0);
    expect(updated.every(d => d.varianceHours >= 0)).toBe(true);
  });

  it('should roll accumulated weekday deficits equally into Saturday and Sunday buffer', () => {
    // Mon: 0.5 (deficit 0.5), Tue: 0.0 (deficit 1.0), Wed: 1.0, Thu: 0.5 (deficit 0.5), Fri: 1.0
    // Total weekday deficit = 0.5 + 1.0 + 0.5 = 2.0 hours
    const week = createSampleWeek([0.5, 0.0, 1.0, 0.5, 1.0], [3.5, 3.5]);
    const updated = calculateWeeklyDeficits(week);

    expect(updated[0].varianceHours).toBe(-0.5);
    expect(updated[1].varianceHours).toBe(-1.0);
    expect(updated[2].varianceHours).toBe(0.0);
    expect(updated[3].varianceHours).toBe(-0.5);
    expect(updated[4].varianceHours).toBe(0.0);

    // Deficit of 2.0 split evenly: 1.0h to Sat, 1.0h to Sun
    expect(updated[5].catchUpBufferHours).toBe(1.0);
    expect(updated[6].catchUpBufferHours).toBe(1.0);
  });

  it('should correctly compute overall aggregate study stats', () => {
    const week = createSampleWeek([0.5, 0.0, 1.0, 0.5, 1.0], [2.5, 2.5]);
    const updated = calculateWeeklyDeficits(week);
    const stats = calculateTotalStudyStats(updated);

    // Planned: 1*5 + 2.5*2 = 10.0 hours
    expect(stats.totalPlanned).toBe(10.0);
    // Actual: 0.5 + 0 + 1 + 0.5 + 1 + 2.5 + 2.5 = 8.0 hours
    expect(stats.totalActual).toBe(8.0);
    // Deficit: 0.5 + 1.0 + 0.5 = 2.0 hours
    expect(stats.totalDeficit).toBe(2.0);
    // Total buffer required: 1.0 (Sat) + 1.0 (Sun) = 2.0 hours
    expect(stats.totalBufferRequired).toBe(2.0);
    // Completed days (actualHours > 0 or completed == true): Mon, Wed, Thu, Fri, Sat, Sun (6 days)
    expect(stats.completedDays).toBe(6);
  });
});
