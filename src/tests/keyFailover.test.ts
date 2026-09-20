import { describe, it, expect } from 'vitest';
import {
  getNextActiveKeyIndex,
  markKeyExhausted,
  PROMPT_FUKUSHIMA,
  PROMPT_KAYANOKI,
  PROMPT_PAST_EXAM,
} from '../shared/services/geminiKeyManager';
import { ApiKeyConnection } from '../shared/types';

describe('Gemini 6-Key Manager with Sequential Rollover Failover', () => {
  const createMockKeys = (count = 6): ApiKeyConnection[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `gemini-key-${i + 1}`,
      name: `Omniroute Key ${i + 1}`,
      key: `AIzaSyDummyKey${i + 1}`,
      status: 'active' as const,
      callsCount: 0,
    }));
  };

  it('should find next active key sequentially starting from currentIndex', () => {
    const keys = createMockKeys(6);
    expect(getNextActiveKeyIndex(keys, 0)).toBe(0);
    expect(getNextActiveKeyIndex(keys, 3)).toBe(3);
  });

  it('should mark key exhausted and rollover to next active key', () => {
    const keys = createMockKeys(6);
    const { updatedKeys, nextIndex } = markKeyExhausted(keys, 0);

    expect(updatedKeys[0].status).toBe('exhausted_429');
    expect(nextIndex).toBe(1);
    expect(updatedKeys[1].status).toBe('active');
  });

  it('should chain sequential rollovers across multiple exhausted keys', () => {
    let keys = createMockKeys(4);

    // Key 0 exhausted -> shifts to 1
    const res1 = markKeyExhausted(keys, 0);
    expect(res1.nextIndex).toBe(1);

    // Key 1 exhausted -> shifts to 2
    const res2 = markKeyExhausted(res1.updatedKeys, 1);
    expect(res2.nextIndex).toBe(2);

    // Key 2 exhausted -> shifts to 3
    const res3 = markKeyExhausted(res2.updatedKeys, 2);
    expect(res3.nextIndex).toBe(3);
  });

  it('should wrap around the list when reaching the end', () => {
    const keys = createMockKeys(3);
    // Keys 0 and 1 active, Key 2 active
    // If currentIndex is 2 and we mark 2 exhausted, next is (2+1)%3 = 0
    const { updatedKeys, nextIndex } = markKeyExhausted(keys, 2);
    expect(updatedKeys[2].status).toBe('exhausted_429');
    expect(nextIndex).toBe(0);
  });

  it('should return -1 when all 6 keys are exhausted', () => {
    let keys = createMockKeys(3);
    keys = markKeyExhausted(keys, 0).updatedKeys;
    keys = markKeyExhausted(keys, 1).updatedKeys;
    const { updatedKeys, nextIndex } = markKeyExhausted(keys, 2);

    expect(nextIndex).toBe(-1);
    expect(updatedKeys.every(k => k.status === 'exhausted_429')).toBe(true);
  });

  it('should contain the 3 specialized book prompts with exact IPA requirements', () => {
    // Fukushima: dialogue, pseudo-code, trace table
    expect(PROMPT_FUKUSHIMA).toContain('福嶋先生');
    expect(PROMPT_FUKUSHIMA).toContain('擬似言語コード');
    expect(PROMPT_FUKUSHIMA).toContain('トレース表');

    // Kayanoki: syllabus, clever method, past exam challenge, Mazii vocab
    expect(PROMPT_KAYANOKI).toContain('かやのき先生');
    expect(PROMPT_KAYANOKI).toContain('クレバー方式の要点');
    expect(PROMPT_KAYANOKI).toContain('過去問にチャレンジ');

    // Past Exam: question number, original Japanese text, 4 choices, explanation
    expect(PROMPT_PAST_EXAM).toContain('パーフェクトラーニング');
    expect(PROMPT_PAST_EXAM).toContain('問題番号');
    expect(PROMPT_PAST_EXAM).toContain('選択肢');
  });
});
