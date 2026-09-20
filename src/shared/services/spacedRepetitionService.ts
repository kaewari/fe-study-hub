// Spaced Repetition (SRS) 3-Cycle Leitner Engine for Error Notebook
// Review 1: +1 day | Review 2: +3 days | Review 3: +7 days

export interface SrsReviewResult {
  nextReviewDate: string;
  isMastered: boolean;
  statusText: string;
}

export function computeNextSrsDate(
  currentCycle: 1 | 2 | 3,
  reviewDateStr: string,
  passed: boolean
): SrsReviewResult {
  const baseDate = new Date(reviewDateStr);
  if (isNaN(baseDate.getTime())) {
    return {
      nextReviewDate: '',
      isMastered: false,
      statusText: 'Ngày không hợp lệ',
    };
  }

  if (!passed) {
    // Reset or keep at current cycle + 1 day
    const nextDate = new Date(baseDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return {
      nextReviewDate: nextDate.toISOString().split('T')[0],
      isMastered: false,
      statusText: 'Cần ôn lại (Lặp lại chu kỳ)',
    };
  }

  // Passed: advance to next cycle interval
  const nextDate = new Date(baseDate);
  if (currentCycle === 1) {
    nextDate.setDate(nextDate.getDate() + 3); // 3 days after Review 1
    return {
      nextReviewDate: nextDate.toISOString().split('T')[0],
      isMastered: false,
      statusText: 'Hoàn thành Lần 1 -> Chờ Lần 2 (+3 ngày)',
    };
  } else if (currentCycle === 2) {
    nextDate.setDate(nextDate.getDate() + 7); // 7 days after Review 2
    return {
      nextReviewDate: nextDate.toISOString().split('T')[0],
      isMastered: false,
      statusText: 'Hoàn thành Lần 2 -> Chờ Lần 3 (+7 ngày)',
    };
  } else {
    // Cycle 3 passed -> Mastered!
    return {
      nextReviewDate: '',
      isMastered: true,
      statusText: '★ Đã làm chủ hoàn toàn (Mastered)',
    };
  }
}
