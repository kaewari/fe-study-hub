import { describe, it, expect } from 'vitest';
import {
  calculateSubjectAScore,
  calculateSubjectBScore,
  evaluateOverallExam,
} from '../shared/services/ipaScoreService';

describe('IPA FE Exam Scoring Engine (Syllabus 9.1)', () => {
  describe('calculateSubjectAScore', () => {
    it('should calculate accurate score for exact passing threshold (36/60 = 600/1000)', () => {
      const result = calculateSubjectAScore(36);
      expect(result.correct).toBe(36);
      expect(result.total).toBe(60);
      expect(result.percentage).toBe(60.0);
      expect(result.score1000).toBe(600);
      expect(result.passed).toBe(true);
      expect(result.isSafe).toBe(false);
    });

    it('should calculate safe pass threshold (42/60 = 700/1000)', () => {
      const result = calculateSubjectAScore(42);
      expect(result.percentage).toBe(70.0);
      expect(result.score1000).toBe(700);
      expect(result.passed).toBe(true);
      expect(result.isSafe).toBe(true);
    });

    it('should fail when below 600 threshold (35/60)', () => {
      const result = calculateSubjectAScore(35);
      expect(result.percentage).toBe(58.3);
      expect(result.score1000).toBe(583);
      expect(result.passed).toBe(false);
      expect(result.isSafe).toBe(false);
    });

    it('should clamp out-of-range bounds [0, 60]', () => {
      const zeroResult = calculateSubjectAScore(-5);
      expect(zeroResult.correct).toBe(0);
      expect(zeroResult.score1000).toBe(0);
      expect(zeroResult.passed).toBe(false);

      const maxResult = calculateSubjectAScore(75);
      expect(maxResult.correct).toBe(60);
      expect(maxResult.score1000).toBe(1000);
      expect(maxResult.passed).toBe(true);
      expect(maxResult.isSafe).toBe(true);
    });
  });

  describe('calculateSubjectBScore', () => {
    it('should calculate passing score for 10 Algo + 2 Security (12/20 = 600/1000)', () => {
      const result = calculateSubjectBScore(10, 2);
      expect(result.algorithmCorrect).toBe(10);
      expect(result.securityCorrect).toBe(2);
      expect(result.totalCorrect).toBe(12);
      expect(result.totalQuestions).toBe(20);
      expect(result.algorithmPercentage).toBe(62.5); // 10 / 16
      expect(result.securityPercentage).toBe(50.0); // 2 / 4
      expect(result.overallPercentage).toBe(60.0);
      expect(result.score1000).toBe(600);
      expect(result.passed).toBe(true);
      expect(result.isSafe).toBe(false);
    });

    it('should calculate safe score for 12 Algo + 3 Security (15/20 = 750/1000)', () => {
      const result = calculateSubjectBScore(12, 3);
      expect(result.totalCorrect).toBe(15);
      expect(result.score1000).toBe(750);
      expect(result.passed).toBe(true);
      expect(result.isSafe).toBe(true);
    });

    it('should fail when score is below 600 (9 Algo + 2 Security = 11/20 = 550/1000)', () => {
      const result = calculateSubjectBScore(9, 2);
      expect(result.totalCorrect).toBe(11);
      expect(result.score1000).toBe(550);
      expect(result.passed).toBe(false);
      expect(result.isSafe).toBe(false);
    });

    it('should clamp bounds for algorithm (max 16) and security (max 4)', () => {
      const clamped = calculateSubjectBScore(20, 10);
      expect(clamped.algorithmCorrect).toBe(16);
      expect(clamped.securityCorrect).toBe(4);
      expect(clamped.totalCorrect).toBe(20);
      expect(clamped.score1000).toBe(1000);
      expect(clamped.passed).toBe(true);
      expect(clamped.isSafe).toBe(true);
    });
  });

  describe('evaluateOverallExam', () => {
    it('should return safe pass when both A and B are >= 700', () => {
      const evalResult = evaluateOverallExam(45, 12, 3);
      expect(evalResult.passed).toBe(true);
      expect(evalResult.isSafe).toBe(true);
      expect(evalResult.evaluationMessage).toContain('安全圏合格');
    });

    it('should return standard pass when both are >= 600 but one is < 700', () => {
      const evalResult = evaluateOverallExam(38, 10, 2);
      expect(evalResult.passed).toBe(true);
      expect(evalResult.isSafe).toBe(false);
      expect(evalResult.evaluationMessage).toContain('合格基準クリア');
    });

    it('should identify Subject A failure', () => {
      const evalResult = evaluateOverallExam(30, 12, 3);
      expect(evalResult.passed).toBe(false);
      expect(evalResult.subjectA.passed).toBe(false);
      expect(evalResult.subjectB.passed).toBe(true);
      expect(evalResult.evaluationMessage).toContain('科目A不合格');
    });

    it('should identify Subject B failure', () => {
      const evalResult = evaluateOverallExam(45, 8, 2);
      expect(evalResult.passed).toBe(false);
      expect(evalResult.subjectA.passed).toBe(true);
      expect(evalResult.subjectB.passed).toBe(false);
      expect(evalResult.evaluationMessage).toContain('科目B不合格');
    });

    it('should identify failure in both subjects', () => {
      const evalResult = evaluateOverallExam(20, 5, 1);
      expect(evalResult.passed).toBe(false);
      expect(evalResult.subjectA.passed).toBe(false);
      expect(evalResult.subjectB.passed).toBe(false);
      expect(evalResult.evaluationMessage).toContain('不合格 (Fail Both)');
    });
  });
});
