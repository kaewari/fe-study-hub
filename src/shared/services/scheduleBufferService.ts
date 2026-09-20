// Weekend Catch-up Buffer Service
// Calculates deficits on weekdays and rolls them into Saturday/Sunday buffers

import { DailyScheduleItem } from '../types';

export function calculateWeeklyDeficits(schedule: DailyScheduleItem[]): DailyScheduleItem[] {
  // Deep clone to avoid in-place mutation
  const updated = schedule.map(item => ({ ...item }));

  // Group by week chunks (every 7 days starting from Day 1 / Monday)
  for (let i = 0; i < updated.length; i += 7) {
    const weekItems = updated.slice(i, i + 7);
    let weeklyWeekdayDeficit = 0;

    // Check Monday through Friday (indices 0 to 4 in week)
    for (let day = 0; day < Math.min(5, weekItems.length); day++) {
      const item = weekItems[day];
      item.varianceHours = Number((item.actualHours - item.plannedHours).toFixed(1));
      if (item.varianceHours < 0) {
        weeklyWeekdayDeficit += Math.abs(item.varianceHours);
      }
    }

    // Assign catch-up buffer to Saturday (index 5) and Sunday (index 6)
    if (weekItems.length >= 6) {
      const sat = weekItems[5];
      // Half of deficit to Sat, half to Sun
      const satBuffer = Number((weeklyWeekdayDeficit / 2).toFixed(1));
      sat.catchUpBufferHours = satBuffer;
      sat.varianceHours = Number((sat.actualHours - sat.plannedHours).toFixed(1));
    }

    if (weekItems.length >= 7) {
      const sun = weekItems[6];
      const sunBuffer = Number((weeklyWeekdayDeficit / 2).toFixed(1));
      sun.catchUpBufferHours = sunBuffer;
      sun.varianceHours = Number((sun.actualHours - sun.plannedHours).toFixed(1));
    }
  }

  return updated;
}

export function calculateTotalStudyStats(schedule: DailyScheduleItem[]) {
  const totalPlanned = schedule.reduce((sum, item) => sum + item.plannedHours, 0);
  const totalActual = schedule.reduce((sum, item) => sum + item.actualHours, 0);
  const totalDeficit = schedule.reduce((sum, item) => sum + (item.varianceHours < 0 ? Math.abs(item.varianceHours) : 0), 0);
  const totalBufferRequired = schedule.reduce((sum, item) => sum + item.catchUpBufferHours, 0);
  const completedDays = schedule.filter(item => item.completed || item.actualHours > 0).length;

  return {
    totalPlanned: Number(totalPlanned.toFixed(1)),
    totalActual: Number(totalActual.toFixed(1)),
    totalDeficit: Number(totalDeficit.toFixed(1)),
    totalBufferRequired: Number(totalBufferRequired.toFixed(1)),
    completedDays,
  };
}
