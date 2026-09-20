import { DailyScheduleItem, BookItem, ExamScoreRecord, ErrorNoteItem, AlgorithmPreset, SecurityCaseStudy, ApiKeyConnection, UserSettings } from '../types';

export const INITIAL_SETTINGS: UserSettings = {
  pin: '2026',
  isPinEnabled: true,
  activeModel: 'gemini-2.5-flash',
  autoRotateKeys: true,
  targetTotalHours: 135,
  pomodoroWorkMin: 25,
  pomodoroBreakMin: 5,
  streakDays: 1,
  lastStudiedDate: '2026-09-20',
  theme: 'sumi',
};

// Extract environment keys if available
export const INITIAL_API_KEYS: ApiKeyConnection[] = [
  {
    id: 'key-1',
    name: import.meta.env.VITE_GEMINI_KEY_1_NAME || 'sonhoang10800-ggaistudio',
    key: import.meta.env.VITE_GEMINI_KEY_1 || '',
    status: 'active',
    callsCount: 0,
  },
  {
    id: 'key-2',
    name: import.meta.env.VITE_GEMINI_KEY_2_NAME || 'sonhoang236-ggaistudio',
    key: import.meta.env.VITE_GEMINI_KEY_2 || '',
    status: 'active',
    callsCount: 0,
  },
  {
    id: 'key-3',
    name: import.meta.env.VITE_GEMINI_KEY_3_NAME || 'sonhoang1356-ggaistudio',
    key: import.meta.env.VITE_GEMINI_KEY_3 || '',
    status: 'active',
    callsCount: 0,
  },
  {
    id: 'key-4',
    name: import.meta.env.VITE_GEMINI_KEY_4_NAME || 'sonhoang1536-ggaistudio',
    key: import.meta.env.VITE_GEMINI_KEY_4 || '',
    status: 'active',
    callsCount: 0,
  },
  {
    id: 'key-5',
    name: import.meta.env.VITE_GEMINI_KEY_5_NAME || 'sonhoang1653-ggaitudio',
    key: import.meta.env.VITE_GEMINI_KEY_5 || '',
    status: 'active',
    callsCount: 0,
  },
  {
    id: 'key-6',
    name: import.meta.env.VITE_GEMINI_KEY_6_NAME || 'sonhoang1360-ggaistudio',
    key: import.meta.env.VITE_GEMINI_KEY_6 || '',
    status: 'active',
    callsCount: 0,
  },
];

// 3 Books Syllabus Initial Data
export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'book-kayanoki',
    title: '令和08年 かやのき先生の基本情報技術者教室',
    author: '栢木 厚 (Kayanoki Atsushi)',
    publisher: '技術評論社',
    edition: 'R08 (Syllabus Ver 9.1 対応)',
    targetSubject: '科目A・B',
    totalChapters: 12,
    completedChapters: 0,
    chapters: [
      { id: 'kayanoki-01', bookId: 'book-kayanoki', chapterNumber: 1, title: '基礎理論 (離散数学・情報理論)', jpCategory: 'テクノロジ系 - 基礎理論', pageRange: 'p.1 - p.46', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Toán nhị phân, số bù 2, logic AND/OR/XOR, tập hợp' },
      { id: 'kayanoki-02', bookId: 'book-kayanoki', chapterNumber: 2, title: 'アルゴリズムとデータ構造の基礎', jpCategory: 'テクノロジ系 - 基礎理論', pageRange: 'p.47 - p.92', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Mảng, danh sách liên kết, cây nhị phân, thuật toán cơ bản' },
      { id: 'kayanoki-03', bookId: 'book-kayanoki', chapterNumber: 3, title: 'ハードウェアとコンピュータ構成要素', jpCategory: 'テクノロジ系 - コンピュータ', pageRange: 'p.93 - p.140', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'CPU, thanh ghi, chu kỳ lệnh, bộ nhớ RAM, ROM, Bus' },
      { id: 'kayanoki-04', bookId: 'book-kayanoki', chapterNumber: 4, title: 'システム構成要素と稼働率 (MTBF/MTTR)', jpCategory: 'テクノロジ系 - システム構成', pageRange: 'p.141 - p.184', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Tính toán độ khả dụng MTBF, MTTR, RAID 0/1/5, Dual & Duplex' },
      { id: 'kayanoki-05', bookId: 'book-kayanoki', chapterNumber: 5, title: 'ソフトウェアとOS (メモリ管理・プロセス)', jpCategory: 'テクノロジ系 - OS・ソフト', pageRange: 'p.185 - p.230', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Bộ nhớ ảo, phân trang Paging, Deadlock, Semaphore, Ngắt' },
      { id: 'kayanoki-06', bookId: 'book-kayanoki', chapterNumber: 6, title: 'データベースとSQL (正規化・ACID)', jpCategory: 'テクノロジ系 - データベース', pageRange: 'p.231 - p.282', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'RDBMS, Chuẩn hóa 1NF/2NF/3NF, Khóa chính/ngoại, Transaction' },
      { id: 'kayanoki-07', bookId: 'book-kayanoki', chapterNumber: 7, title: 'ネットワーク技術 (TCP/IP・ルーティング)', jpCategory: 'テクノロジ系 - ネットワーク', pageRange: 'p.283 - p.336', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'OSI 7 tầng, TCP/IP, IP v4/v6, Subnet mask, Port, DNS, DHCP' },
      { id: 'kayanoki-08', bookId: 'book-kayanoki', chapterNumber: 8, title: '情報セキュリティ (暗号・署名・攻撃対策)', jpCategory: 'テクノロジ系 - セキュリティ', pageRange: 'p.337 - p.402', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'RSA, AES, Chữ ký số, CA, WAF, SQLi, XSS, Ransomware, Phishing' },
      { id: 'kayanoki-09', bookId: 'book-kayanoki', chapterNumber: 9, title: 'システム開発技術 (設計・テスト・アジャイル)', jpCategory: 'テクノロジ系 - 開発技術', pageRange: 'p.403 - p.448', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Waterfall, Agile Scrum, Test hộp trắng/hộp đen, TDD' },
      { id: 'kayanoki-10', bookId: 'book-kayanoki', chapterNumber: 10, title: 'プロジェクトマネジメント (WBS・日程計算)', jpCategory: 'マネジメント系 - プロジェクト', pageRange: 'p.449 - p.488', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Mỏ điểm: WBS, Sơ đồ mạng PERT, Đường găng Critical Path' },
      { id: 'kayanoki-11', bookId: 'book-kayanoki', chapterNumber: 11, title: 'サービスマネジメントとシステム監査 (ITIL)', jpCategory: 'マネジメント系 - サービス', pageRange: 'p.489 - p.526', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'ITIL, SLA, Incident management, Problem management, Kiểm toán' },
      { id: 'kayanoki-12', bookId: 'book-kayanoki', chapterNumber: 12, title: '経営戦略・システム戦略・企業と法務', jpCategory: 'ストラテジ系 - 経営・法務', pageRange: 'p.527 - p.580', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'SWOT, PPM, BSC, Luật bản quyền, Luật bảo vệ thông tin cá nhân' },
    ],
  },
  {
    id: 'book-fukushima',
    title: '福嶋先生の集中ゼミ 科目B・アルゴリズム編',
    author: '福嶋 宏訓 (Fukushima Hirokun)',
    publisher: '日本経済新聞出版',
    edition: '2024年版 (新試験制度・擬似言語対応)',
    targetSubject: '科目B',
    totalChapters: 10,
    completedChapters: 0,
    chapters: [
      { id: 'fukushima-01', bookId: 'book-fukushima', chapterNumber: 1, title: '擬似言語の読み方と基本文法 (変数・配列・代入)', jpCategory: '科目B - 言語仕様', pageRange: 'p.1 - p.38', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Quy ước chỉ số mảng bắt đầu từ 1, mũi tên gán ←, cấu trúc rẽ nhánh' },
      { id: 'fukushima-02', bookId: 'book-fukushima', chapterNumber: 2, title: '配列とリストの走査・トレース表の書き方', jpCategory: '科目B - トレース技法', pageRange: 'p.39 - p.78', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Kỹ năng vẽ bảng chạy từng bước (Trace Table) chuẩn phòng thi' },
      { id: 'fukushima-03', bookId: 'book-fukushima', chapterNumber: 3, title: '基本的な探索アルゴリズム (線形探索・2分探索)', jpCategory: '科目B - 探索', pageRange: 'p.79 - p.118', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Kỹ thuật lính canh 番兵法, tìm kiếm nhị phân mid = (low+high)/2' },
      { id: 'fukushima-04', bookId: 'book-fukushima', chapterNumber: 4, title: '整列アルゴリズム基本 (バブル・選択・挿入)', jpCategory: '科目B - ソート基本', pageRange: 'p.119 - p.158', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Số lần so sánh, số lần hoán đổi, điều kiện dừng vòng lặp lồng' },
      { id: 'fukushima-05', bookId: 'book-fukushima', chapterNumber: 5, title: '高度な整列 (クイックソート・マージソート)', jpCategory: '科目B - ソート応用', pageRange: 'p.159 - p.202', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Phân hoạch mảng quanh pivot, gộp 2 mảng đã sắp xếp' },
      { id: 'fukushima-06', bookId: 'book-fukushima', chapterNumber: 6, title: 'スタックとキューの操作とリングバッファ', jpCategory: '科目B - データ構造', pageRange: 'p.203 - p.246', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'LIFO (Push/Pop), FIFO (Enqueue/Dequeue), Ring buffer mảng tròn' },
      { id: 'fukushima-07', bookId: 'book-fukushima', chapterNumber: 7, title: '2分木と木構造の巡回 (先行・中間・後続順)', jpCategory: '科目B - 木構造', pageRange: 'p.247 - p.290', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Duyệt cây tiền thứ tự, trung thứ tự, hậu thứ tự, tìm kiếm trên BST' },
      { id: 'fukushima-08', bookId: 'book-fukushima', chapterNumber: 8, title: '再帰呼び出しとコールスタックの挙動', jpCategory: '科目B - 再帰', pageRange: 'p.291 - p.330', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Vết gọi hàm đệ quy, điều kiện thoát đệ quy, bài toán tháp Hà Nội' },
      { id: 'fukushima-09', bookId: 'book-fukushima', chapterNumber: 9, title: 'グラフアルゴリズム (最短経路・ダイクストラ法)', jpCategory: '科目B - グラフ', pageRange: 'p.331 - p.372', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Ma trận kề, bảng trọng số, cập nhật nhãn khoảng cách ngắn nhất' },
      { id: 'fukushima-10', bookId: 'book-fukushima', chapterNumber: 10, title: '実戦模擬問題演習 (長文アルゴリズム解法)', jpCategory: '科目B - 実戦演習', pageRange: 'p.373 - p.420', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Chiến thuật giải bài thuật toán lớn trong 6-8 phút' },
    ],
  },
  {
    id: 'book-pastpapers',
    title: '令和08年 基本情報技術者 パーフェクトラーニング過去問題集',
    author: '山本 三雄 (Yamamoto Mitsuo)',
    publisher: '技術評論社',
    edition: '令和08年 (Syllabus 9.1 完全対応)',
    targetSubject: '科目A・B',
    totalChapters: 4,
    completedChapters: 0,
    chapters: [
      { id: 'past-01', bookId: 'book-pastpapers', chapterNumber: 1, title: '令和5年 公開問題 (科目A 60問 + 科目B 20問)', jpCategory: '過去問演習', pageRange: 'p.1 - p.68', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Đề thi công bố chính thức R05 của IPA kèm phân tích chi tiết' },
      { id: 'past-02', bookId: 'book-pastpapers', chapterNumber: 2, title: '令和6年 公開問題 (科目A 60問 + 科目B 20問)', jpCategory: '過去問演習', pageRange: 'p.69 - p.142', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Đề thi công bố chính thức R06 của IPA' },
      { id: 'past-03', bookId: 'book-pastpapers', chapterNumber: 3, title: '令和7年 公開問題 (科目A 60問 + 科目B 20問)', jpCategory: '過去問演習', pageRange: 'p.143 - p.218', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Đề thi công bố chính thức R07 của IPA' },
      { id: 'past-04', bookId: 'book-pastpapers', chapterNumber: 4, title: '令和8年 予想模擬試験 (科目A 60問 + 科目B 20問)', jpCategory: '予想模試', pageRange: 'p.219 - p.290', scanStatus: 'unscanned', studyStatus: 'not_started', comprehension: 0, keyPoints: 'Đề thi dự đoán điểm rơi theo đề thi thật 2026' },
    ],
  },
];

// Initial Mock Exam Scores
export const INITIAL_EXAMS: ExamScoreRecord[] = [
  {
    id: 'mock-01',
    examName: '令和5年 公開問題 (R05)',
    dateTaken: '2026-09-20',
    timeSpentA: 90,
    timeSpentB: 100,
    subjectACorrect: 45,
    subjectAScore1000: 750,
    subjectAPass: true,
    subjectBAlgorithmCorrect: 12,
    subjectBSecurityCorrect: 3,
    subjectBCorrect: 15,
    subjectBScore1000: 750,
    subjectBPass: true,
    overallPass: true,
    isSafePass: true,
    notes: 'Khảo sát năng lực ban đầu trước thềm lộ trình chính thức.',
  },
];

// Initial Error Notebook Items
export const INITIAL_ERROR_NOTES: ErrorNoteItem[] = [
  {
    id: 'ERR-001',
    source: 'かやのき Ch04 問12',
    category: 'システム構成',
    questionSummary: 'MTBFとMTTRから2台の稼働率を求める計算問題',
    correctAnswer: 'ア (0.96)',
    userAnswer: 'ウ (0.80)',
    cause: 'careless_mistake',
    keyTakeaway: 'Công thức hệ thống dự phòng song song: 1 - (1 - A)^2. Nhớ tính riêng từng server!',
    review1Date: '2026-09-21',
    review1Passed: true,
    mastered: false,
  },
  {
    id: 'ERR-002',
    source: '福嶋 Ch03 例題2',
    category: '科目B・2分探索',
    questionSummary: 'Cập nhật biến chỉ số mid khi chia đôi mảng',
    correctAnswer: 'イ (low ← mid + 1)',
    userAnswer: 'エ (low ← mid)',
    cause: 'algorithm_logic',
    keyTakeaway: 'Khi chia đôi khoảng tìm kiếm, bắt buộc phải loại bỏ phần tử mid bằng +1 hoặc -1 để tránh lặp vô hạn!',
    review1Date: '2026-09-22',
    review1Passed: false,
    mastered: false,
  },
  {
    id: 'ERR-003',
    source: 'パーフェクト R05 問28',
    category: 'セキュリティ',
    questionSummary: '公開鍵暗号方式における秘密鍵の役割 (暗号化 vs 署名)',
    correctAnswer: 'エ (送信者の秘密鍵で署名)',
    userAnswer: 'ア (受信者の公開鍵で署名)',
    cause: 'japanese_misread',
    keyTakeaway: 'Gửi thư bảo mật = Khóa công khai người nhận mã hóa. Ký chữ ký điện tử = Khóa bí mật người gửi ký!',
    mastered: false,
  },
];

// Initial 16 Core Algorithm Presets for Subject B Workshop
export const INITIAL_ALGORITHM_PRESETS: AlgorithmPreset[] = [
  {
    id: 'algo-binary-search',
    name: '二分探索 (Binary Search)',
    category: '探索アルゴリズム',
    complexityTime: 'O(log n)',
    complexitySpace: 'O(1)',
    pseudoCode: `○整数型: binarySearch(整数型の配列: arr, 整数型: target)
  整数型: low, high, mid
  low ← 1
  high ← arrの要素数
  while (low ≦ high)
    mid ← (low + high) ÷ 2  /* 切り捨て */
    if (arr[mid] = target)
      return mid
    elseif (arr[mid] < target)
      low ← mid + 1
    else
      high ← mid - 1
    endif
  endwhile
  return -1`,
    explanation: 'Tìm kiếm trên mảng đã sắp xếp bằng cách liên tục chia đôi khoảng tìm kiếm. Độ phức tạp O(log n).',
    commonTraps: [
      'Chỉ số mảng bắt đầu từ 1 trong đề thi IPA.',
      'Phép chia (low + high) ÷ 2 lấy phần nguyên (làm tròn xuống).',
      'Cập nhật low = mid + 1 và high = mid - 1, nếu quên +1/-1 sẽ bị lặp vô tận.',
    ],
    sampleColumns: ['step', 'low', 'high', 'mid', 'arr[mid]', 'target', 'result'],
    initialTraceRows: [
      { step: 1, description: 'Khởi tạo khoảng tìm kiếm', variables: { low: 1, high: 7, mid: 4, 'arr[mid]': 40, target: 65, result: 'Chưa thấy' } },
      { step: 2, description: '40 < 65 -> low = mid + 1', variables: { low: 5, high: 7, mid: 6, 'arr[mid]': 65, target: 65, result: 'Tìm thấy tại 6' } },
    ],
  },
  {
    id: 'algo-bubble-sort',
    name: '基本交換法 (Bubble Sort)',
    category: '整列アルゴリズム',
    complexityTime: 'O(n²)',
    complexitySpace: 'O(1)',
    pseudoCode: `○bubbleSort(整数型の配列: arr)
  整数型: i, j, temp, n
  n ← arrの要素数
  for (i を 1 から n - 1 まで 1 ずつ増やす)
    for (j を n から i + 1 まで -1 ずつ減らす)
      if (arr[j - 1] > arr[j])
        temp ← arr[j - 1]
        arr[j - 1] ← arr[j]
        arr[j] ← temp
      endif
    endfor
  endfor`,
    explanation: 'So sánh từng cặp phần tử liền kề và đổi chỗ nếu sai thứ tự. Số lần so sánh luôn là n(n-1)/2.',
    commonTraps: [
      'Chiều quét của vòng lặp trong: từ cuối mảng lùi về đầu.',
      'Điều kiện đổi chỗ arr[j-1] > arr[j] (tăng dần) hay < (giảm dần).',
    ],
    sampleColumns: ['step', 'i', 'j', 'arr[j-1]', 'arr[j]', 'action'],
    initialTraceRows: [
      { step: 1, description: 'So sánh cặp cuối cùng', variables: { i: 1, j: 5, 'arr[j-1]': 50, 'arr[j]': 20, action: 'Swap (50 > 20)' } },
      { step: 2, description: 'Lùi tiếp về j=4', variables: { i: 1, j: 4, 'arr[j-1]': 30, 'arr[j]': 20, action: 'Swap (30 > 20)' } },
    ],
  },
  {
    id: 'algo-linear-sentinel',
    name: '番兵法 (Linear Search with Sentinel)',
    category: '探索アルゴリズム',
    complexityTime: 'O(n)',
    complexitySpace: 'O(1)',
    pseudoCode: `○整数型: sentinelSearch(整数型の配列: arr, 整数型: target)
  整数型: i, n
  n ← arrの要素数
  arr[n + 1] ← target  /* 番兵を末尾に追加 */
  i ← 1
  while (arr[i] ≠ target)
    i ← i + 1
  endwhile
  if (i ≦ n)
    return i  /* 見つかった */
  else
    return -1 /* 見つからなかった (番兵に当たった) */
  endif`,
    explanation: 'Đặt giá trị cần tìm vào cuối mảng làm "lính canh" để loại bỏ phép so sánh kiểm tra tràn mảng trong mỗi vòng lặp.',
    commonTraps: [
      'Mảng cần có thêm 1 ô nhớ dự phòng ở cuối (arr[n+1]).',
      'Nếu kết quả i == n+1 nghĩa là không tìm thấy trong mảng ban đầu.',
    ],
    sampleColumns: ['step', 'i', 'arr[i]', 'target', 'condition', 'status'],
    initialTraceRows: [
      { step: 1, description: 'Thêm lính canh vào arr[6]=99', variables: { i: 1, 'arr[i]': 12, target: 99, condition: '12 ≠ 99', status: 'Next' } },
      { step: 2, description: 'Quét tiếp', variables: { i: 2, 'arr[i]': 45, target: 99, condition: '45 ≠ 99', status: 'Next' } },
    ],
  },
  {
    id: 'algo-stack-queue',
    name: 'スタック＆キュー (Stack & Queue)',
    category: 'データ構造',
    complexityTime: 'O(1)',
    complexitySpace: 'O(n)',
    pseudoCode: `/* スタック操作 (LIFO) */
○push(値)
  top ← top + 1
  stack[top] ← 値

○整数型: pop()
  値 ← stack[top]
  top ← top - 1
  return 値`,
    explanation: 'Stack hoạt động theo cơ chế LIFO (Vào sau ra trước). Queue hoạt động theo FIFO (Vào trước ra trước).',
    commonTraps: [
      'Kiểm tra tràn Stack (Overflow khi top >= max) hoặc rỗng Stack (Underflow khi top == 0).',
      'Hàng đợi tròn (Ring buffer): khi tail hoặc head chạm cuối mảng thì quay về 1 qua công thức chia dư.',
    ],
    sampleColumns: ['step', 'operation', 'value', 'top', 'stack_state'],
    initialTraceRows: [
      { step: 1, description: 'Push(10)', variables: { operation: 'Push', value: 10, top: 1, stack_state: '[10]' } },
      { step: 2, description: 'Push(25)', variables: { operation: 'Push', value: 25, top: 2, stack_state: '[10, 25]' } },
      { step: 3, description: 'Pop()', variables: { operation: 'Pop', value: 25, top: 1, stack_state: '[10]' } },
    ],
  },
  {
    id: 'algo-recursion-fibonacci',
    name: '再帰呼び出し (Recursion - Fibonacci)',
    category: '再帰・動的計画法',
    complexityTime: 'O(2ⁿ) hoặc O(n) memo',
    complexitySpace: 'O(n)',
    pseudoCode: `○整数型: fib(整数型: n)
  if (n = 1 or n = 2)
    return 1
  endif
  return fib(n - 1) + fib(n - 2)`,
    explanation: 'Hàm tự gọi lại chính nó. Cần đặc biệt chú ý điều kiện cơ sở (Base Case) để không bị đệ quy vô hạn.',
    commonTraps: [
      'Điều kiện dừng n=1 hoặc n=2.',
      'Thứ tự đánh giá trong cây đệ quy: nhánh trái fib(n-1) được tính toán trước nhánh phải fib(n-2).',
    ],
    sampleColumns: ['step', 'call', 'n', 'return_val', 'call_depth'],
    initialTraceRows: [
      { step: 1, description: 'Gọi fib(4)', variables: { call: 'fib(4)', n: 4, return_val: 'fib(3)+fib(2)', call_depth: 1 } },
      { step: 2, description: 'Gọi fib(3)', variables: { call: 'fib(3)', n: 3, return_val: 'fib(2)+fib(1)', call_depth: 2 } },
    ],
  },
];

// Initial 4 Security Case Studies for Subject B Workshop
export const INITIAL_SECURITY_CASES: SecurityCaseStudy[] = [
  {
    id: 'sec-case-01',
    title: 'Web Server Access Log Analysis (SQL Injection Investigation)',
    logType: 'web',
    scenarioDescription: 'Hệ thống website thương mại điện tử công ty X nhận cảnh báo lộ dữ liệu người dùng. Chuyên viên bảo mật trích xuất Apache Access Log để điều tra.',
    sampleLogLines: [
      '192.168.10.15 - - [20/Sep/2026:10:14:02 +0900] "GET /items?cat=1 HTTP/1.1" 200 4520',
      '203.0.113.45 - - [20/Sep/2026:10:15:30 +0900] "GET /items?cat=1%27%20OR%201=1-- HTTP/1.1" 200 89210',
      '203.0.113.45 - - [20/Sep/2026:10:15:45 +0900] "GET /items?cat=1%27%20UNION%20SELECT%20user,pass%20FROM%20users-- HTTP/1.1" 200 95400',
      '192.168.10.15 - - [20/Sep/2026:10:16:01 +0900] "POST /login HTTP/1.1" 302 450',
    ],
    analysisQuestions: [
      {
        questionText: 'Dòng log thứ 2 và thứ 3 từ IP 203.0.113.45 cho thấy dấu hiệu của cuộc tấn công nào?',
        choices: [
          'ア: Cross-Site Scripting (XSS)',
          'イ: SQL Injection (SQLi)',
          'ウ: Directory Traversal',
          'エ: Brute Force Attack',
        ],
        correctIndex: 1,
        explanation: 'Chuỗi %27 (ký tự dấu nháy đơn \') kèm cú pháp OR 1=1-- và UNION SELECT là đặc trưng rõ ràng của SQL Injection nhằm thao túng câu lệnh truy vấn CSDL.',
      },
    ],
  },
  {
    id: 'sec-case-02',
    title: 'Firewall Packet Filtering Rules (DMZ & Internal LAN)',
    logType: 'firewall',
    scenarioDescription: 'Thiết lập bảng quy tắc tường lửa lọc gói tin cho máy chủ Web trong vùng DMZ và máy chủ CSDL trong vùng Internal LAN.',
    sampleLogLines: [
      'Rule 1: Src=ANY, Dst=DMZ_Web, Port=443, Proto=TCP, Action=ALLOW',
      'Rule 2: Src=DMZ_Web, Dst=DB_Internal, Port=3306, Proto=TCP, Action=ALLOW',
      'Rule 3: Src=ANY, Dst=DB_Internal, Port=ANY, Proto=ANY, Action=DROP',
      'Rule 4: Src=ANY, Dst=ANY, Port=ANY, Proto=ANY, Action=DROP (Default)',
    ],
    analysisQuestions: [
      {
        questionText: 'Theo cấu hình trên, một client từ Internet có thể kết nối trực tiếp đến cổng 3306 của máy chủ DB_Internal không?',
        choices: [
          'ア: Có thể, vì Rule 2 cho phép kết nối đến DB_Internal',
          'イ: Không thể, vì Rule 3 chặn mọi truy cập trực tiếp từ ngoài vào DB_Internal',
          'ウ: Có thể nếu client gửi gói tin mã hóa SSL',
          'エ: Chỉ có thể nếu gói tin đi qua cổng 443 trước',
        ],
        correctIndex: 1,
        explanation: 'Chỉ có DMZ_Web mới được phép kết nối đến DB_Internal qua port 3306 (Rule 2). Mọi truy cập từ ANY đến DB_Internal đều bị DROP bởi Rule 3.',
      },
    ],
  },
];

// Generator for 100 Days Daily Schedule starting 2026-09-21
export function generateInitialSchedule(): DailyScheduleItem[] {
  const items: DailyScheduleItem[] = [];
  const startDate = new Date(2026, 8, 21); // Sept 21, 2026
  const jpDays = ['月', '火', '水', '木', '金', '土', '日'];

  const holidayNames: Record<string, string> = {
    '2026-09-21': '敬老の日',
    '2026-09-22': '国民の休日',
    '2026-09-23': '秋分の日',
    '2026-10-12': 'スポーツの日',
    '2026-11-03': '文化の日',
    '2026-11-23': '勤労感謝の日',
    '2027-01-11': '成人の日',
  };

  for (let i = 0; i < 100; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const jsDay = d.getDay(); // 0 = Sun, 1 = Mon ...
    const dayOfWeekIdx = (jsDay + 6) % 7; // 0 = Mon, 6 = Sun
    const dayOfWeek = jpDays[dayOfWeekIdx];

    const isKickstart = dateStr >= '2026-09-21' && dateStr <= '2026-09-27';
    const isNenmatsu = dateStr >= '2026-12-28' && dateStr <= '2027-01-03';
    const holidayName = holidayNames[dateStr];

    let dayType: DailyScheduleItem['dayType'] = 'weekday';
    let dayTypeLabel = '平日 (1.0h)';
    let plannedHours = 1.0;

    if (isKickstart) {
      dayType = 'kickstart';
      dayTypeLabel = '★ 全休キックスタート (2.5h)';
      plannedHours = 2.5;
    } else if (isNenmatsu) {
      dayType = 'nenmatsu';
      dayTypeLabel = '🎌 年末年始休暇 (3.5h)';
      plannedHours = 3.5;
    } else if (holidayName) {
      dayType = 'holiday';
      dayTypeLabel = `🎌 祝日: ${holidayName} (2.5h)`;
      plannedHours = 2.5;
    } else if (dayOfWeekIdx === 5 || dayOfWeekIdx === 6) {
      dayType = 'weekend';
      dayTypeLabel = '週末 (2.5h)';
      plannedHours = 2.5;
    }

    let subject = '科目A (かやのき)';
    let chapterTitle = `かやのき 第${(i % 12) + 1}章: Lý thuyết`;
    if (dayOfWeekIdx === 1 || dayOfWeekIdx === 3 || dayOfWeekIdx === 5) {
      subject = '科目B (福嶋)';
      chapterTitle = `福嶋 第${(i % 10) + 1}章: Thuật toán`;
    } else if (dayOfWeekIdx === 6) {
      subject = '過去問演習';
      chapterTitle = 'Tổng ôn tập tuần & Giải đề quá khứ R08';
    }

    items.push({
      id: `sched-${i + 1}`,
      dayIndex: i + 1,
      date: dateStr,
      dayOfWeek,
      dayType,
      dayTypeLabel,
      plannedHours,
      actualHours: 0,
      varianceHours: -plannedHours,
      catchUpBufferHours: 0,
      subject,
      chapterTitle,
      focusLevel: 0,
      scanVerified: false,
      completed: false,
      notes: '',
    });
  }

  return items;
}
