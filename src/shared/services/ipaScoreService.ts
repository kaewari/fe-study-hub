// IPA FE Exam Scoring Engine (Syllabus 9.1)
// Standard: 科目A (60 questions), 科目B (20 questions: 16 Algorithm + 4 Security)
// Passing Threshold: >= 600 / 1000 in BOTH Subject A and Subject B.
// Safe Pass Threshold: >= 700 / 1000 in BOTH.

export interface SubjectAScoreResult {
  correct: number;
  total: number;
  percentage: number;
  score1000: number;
  passed: boolean;
  isSafe: boolean;
}

export interface SubjectBScoreResult {
  algorithmCorrect: number;
  securityCorrect: number;
  totalCorrect: number;
  totalQuestions: number;
  algorithmPercentage: number;
  securityPercentage: number;
  overallPercentage: number;
  score1000: number;
  passed: boolean;
  isSafe: boolean;
}

export interface OverallExamResult {
  subjectA: SubjectAScoreResult;
  subjectB: SubjectBScoreResult;
  passed: boolean;
  isSafe: boolean;
  evaluationMessage: string;
}

export function calculateSubjectAScore(correct: number): SubjectAScoreResult {
  const safeCorrect = Math.max(0, Math.min(60, correct));
  const percentage = (safeCorrect / 60) * 100;
  // Scaled linear estimation for CBT practice (0 to 1000)
  const score1000 = Math.round((safeCorrect / 60) * 1000);
  const passed = score1000 >= 600;
  const isSafe = score1000 >= 700;

  return {
    correct: safeCorrect,
    total: 60,
    percentage: Number(percentage.toFixed(1)),
    score1000,
    passed,
    isSafe,
  };
}

export function calculateSubjectBScore(algorithmCorrect: number, securityCorrect: number): SubjectBScoreResult {
  const safeAlgo = Math.max(0, Math.min(16, algorithmCorrect));
  const safeSec = Math.max(0, Math.min(4, securityCorrect));
  const totalCorrect = safeAlgo + safeSec;

  const algorithmPercentage = Number(((safeAlgo / 16) * 100).toFixed(1));
  const securityPercentage = Number(((safeSec / 4) * 100).toFixed(1));
  const overallPercentage = Number(((totalCorrect / 20) * 100).toFixed(1));
  const score1000 = Math.round((totalCorrect / 20) * 1000);
  const passed = score1000 >= 600;
  const isSafe = score1000 >= 700;

  return {
    algorithmCorrect: safeAlgo,
    securityCorrect: safeSec,
    totalCorrect,
    totalQuestions: 20,
    algorithmPercentage,
    securityPercentage,
    overallPercentage,
    score1000,
    passed,
    isSafe,
  };
}

export function evaluateOverallExam(
  subjectACorrect: number,
  algorithmCorrect: number,
  securityCorrect: number
): OverallExamResult {
  const subjectA = calculateSubjectAScore(subjectACorrect);
  const subjectB = calculateSubjectBScore(algorithmCorrect, securityCorrect);

  const passed = subjectA.passed && subjectB.passed;
  const isSafe = subjectA.isSafe && subjectB.isSafe;

  let evaluationMessage = '';
  if (isSafe) {
    evaluationMessage = '★ 安全圏合格 (Safe Pass): Cả 2 môn đều đạt trên 700 điểm. Sẵn sàng đăng ký thi CBT!';
  } else if (passed) {
    evaluationMessage = '〇 合格基準クリア (Standard Pass): Đạt mốc 600 điểm của IPA. Cần duy trì phong độ.';
  } else if (!subjectA.passed && !subjectB.passed) {
    evaluationMessage = '✕ 不合格 (Fail Both): Chưa đạt chuẩn ở cả 2 môn. Cần tăng cường luyện đề.';
  } else if (!subjectA.passed) {
    evaluationMessage = '✕ 科目A不合格 (Fail Subject A): Môn A dưới 600. Cần cày thêm từ vựng và câu hỏi quá khứ.';
  } else {
    evaluationMessage = '✕ 科目B不合格 (Fail Subject B): Môn B dưới 600. Cần luyện thêm bảng Trace thuật toán.';
  }

  return {
    subjectA,
    subjectB,
    passed,
    isSafe,
    evaluationMessage,
  };
}
