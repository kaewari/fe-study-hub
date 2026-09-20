// FE Study Hub - Strict Domain Types

export type DayType = 
  | 'kickstart'      // ★ 特別全休キックスタート週 (2026/09/21 - 09/27)
  | 'weekday'        // 平日 (1.0h)
  | 'weekend'        // 週末 (2.5h)
  | 'holiday'        // 祝日 (2.5h)
  | 'nenmatsu';      // 年末年始 (3.5h)

export interface DailyScheduleItem {
  id: string;
  dayIndex: number;
  date: string;          // YYYY-MM-DD
  dayOfWeek: string;     // 月, 火, 水, 木, 金, 土, 日
  dayType: DayType;
  dayTypeLabel: string;
  plannedHours: number;
  actualHours: number;
  varianceHours: number; // actual - planned
  catchUpBufferHours: number; // needed on upcoming weekend
  subject: string;       // 科目A (かやのき) | 科目B (福嶋) | 過去問演習
  chapterTitle: string;
  focusLevel: number;    // 1 to 5 stars
  scanVerified: boolean; // Has the PDF for today's chapter been scanned?
  completed: boolean;
  notes: string;
}

export type ScanStatus = 'unscanned' | 'in_progress' | 'scanned';
export type StudyStatus = 'not_started' | 'in_progress' | 'completed';

export interface ChapterItem {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  jpCategory: string;
  pageRange: string;
  scanStatus: ScanStatus;
  scannedPdfName?: string;
  scannedPdfDataUrl?: string; // Stored in IndexedDB or base64
  ocrContentMarkdown?: string;
  studyStatus: StudyStatus;
  comprehension: number; // 1 to 5 stars
  completedDate?: string;
  keyPoints: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  targetSubject: '科目A' | '科目B' | '科目A・B';
  totalChapters: number;
  completedChapters: number;
  coverImage?: string;
  chapters: ChapterItem[];
}

export interface ExamScoreRecord {
  id: string;
  examName: string;
  dateTaken: string;
  timeSpentA: number; // minutes
  timeSpentB: number; // minutes
  subjectACorrect: number; // / 60
  subjectAScore1000: number; // 0 to 1000
  subjectAPass: boolean; // >= 600
  subjectBAlgorithmCorrect: number; // / 16
  subjectBSecurityCorrect: number; // / 4
  subjectBCorrect: number; // / 20
  subjectBScore1000: number; // 0 to 1000
  subjectBPass: boolean; // >= 600
  overallPass: boolean; // Both A & B >= 600
  isSafePass: boolean;  // Both A & B >= 700
  notes: string;
}

export type ErrorCause = 
  | 'japanese_misread'   // 1. 日本語の読解・用語解釈ミス
  | 'algorithm_logic'    // 2. アルゴリズム・擬似言語の理解不足
  | 'theory_knowledge'   // 3. 基礎理論・知識不足
  | 'careless_mistake';  // 4. ケアレスミス・計算ミス

export interface ErrorNoteItem {
  id: string;
  source: string;        // e.g. "かやのき Ch04 問12"
  category: string;      // e.g. "システム構成"
  questionSummary: string;
  correctAnswer: string;
  userAnswer: string;
  cause: ErrorCause;
  keyTakeaway: string;
  review1Date?: string;
  review1Passed?: boolean;
  review2Date?: string;
  review2Passed?: boolean;
  review3Date?: string;
  review3Passed?: boolean;
  mastered: boolean;
}

export interface VocabItem {
  id: string;
  expression: string;    // Kanji/Kana
  reading: string;       // Hiragana/Kana
  en: string;            // English Term
  vi: string;            // Vietnamese Definition from Mazii
  category: string;      // Phân loại IPA
  importance: string;    // ⭐⭐⭐
  mastered: boolean;
  reviewCount: number;
  notes: string;
}

export interface TraceTableRow {
  step: number;
  description: string;
  variables: Record<string, string | number>;
}

export interface AlgorithmPreset {
  id: string;
  name: string;
  category: string;
  complexityTime: string;
  complexitySpace: string;
  pseudoCode: string;
  explanation: string;
  commonTraps: string[];
  sampleColumns: string[];
  initialTraceRows: TraceTableRow[];
}

export interface SecurityCaseStudy {
  id: string;
  title: string;
  logType: 'web' | 'firewall' | 'dns' | 'email';
  scenarioDescription: string;
  sampleLogLines: string[];
  analysisQuestions: {
    questionText: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ApiKeyConnection {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'exhausted_429' | 'invalid';
  callsCount: number;
  lastUsedAt?: string;
}

export type AppTheme =
  | 'sumi'
  | 'tokyo-night'
  | 'catppuccin'
  | 'nord'
  | 'dracula'
  | 'rose-pine'
  | 'github-dark'
  | 'one-dark';

export interface UserSettings {
  pin: string;
  isPinEnabled: boolean;
  activeModel: string;
  autoRotateKeys: boolean;
  targetTotalHours: number;
  pomodoroWorkMin: number;
  pomodoroBreakMin: number;
  streakDays: number;
  lastStudiedDate?: string;
  theme?: AppTheme;
}
