import { describe, it, expect } from 'vitest';
import { computeNextSrsDate } from '../shared/services/spacedRepetitionService';

describe('Spaced Repetition (SRS) 3-Cycle Leitner Engine', () => {
  it('should advance to Cycle 2 (+3 days) when Cycle 1 is passed', () => {
    const result = computeNextSrsDate(1, '2026-09-21', true);
    expect(result.nextReviewDate).toBe('2026-09-24');
    expect(result.isMastered).toBe(false);
    expect(result.statusText).toContain('Chờ Lần 2 (+3 ngày)');
  });

  it('should advance to Cycle 3 (+7 days) when Cycle 2 is passed', () => {
    const result = computeNextSrsDate(2, '2026-09-24', true);
    expect(result.nextReviewDate).toBe('2026-10-01');
    expect(result.isMastered).toBe(false);
    expect(result.statusText).toContain('Chờ Lần 3 (+7 ngày)');
  });

  it('should mark item as Mastered when Cycle 3 is passed', () => {
    const result = computeNextSrsDate(3, '2026-10-01', true);
    expect(result.nextReviewDate).toBe('');
    expect(result.isMastered).toBe(true);
    expect(result.statusText).toContain('Mastered');
  });

  it('should repeat review the very next day (+1 day) when user fails review', () => {
    const result = computeNextSrsDate(2, '2026-09-24', false);
    expect(result.nextReviewDate).toBe('2026-09-25');
    expect(result.isMastered).toBe(false);
    expect(result.statusText).toContain('Cần ôn lại');
  });

  it('should handle invalid date input gracefully', () => {
    const result = computeNextSrsDate(1, 'invalid-date-string', true);
    expect(result.nextReviewDate).toBe('');
    expect(result.isMastered).toBe(false);
    expect(result.statusText).toBe('Ngày không hợp lệ');
  });
});
