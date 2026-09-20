// Client-side 1-Click Excel Export Service using xlsx library
import * as XLSX from 'xlsx';
import { DailyScheduleItem, BookItem, ExamScoreRecord, ErrorNoteItem, VocabItem } from '../types';

export function exportStudyDataToExcel(
  schedule: DailyScheduleItem[],
  books: BookItem[],
  examScores: ExamScoreRecord[],
  errorNotes: ErrorNoteItem[],
  vocabList: VocabItem[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet Daily Schedule
  const scheduleRows = schedule.map(s => ({
    'Day': `Day ${s.dayIndex}`,
    '日付 (Ngày)': s.date,
    '曜日 (Thứ)': s.dayOfWeek,
    '区分 (Loại ngày)': s.dayTypeLabel,
    '計画時間 (h)': s.plannedHours,
    '実績時間 (h)': s.actualHours,
    '差異 (h)': s.varianceHours,
    '週末補修 (h)': s.catchUpBufferHours,
    '科目 (Môn)': s.subject,
    '章・内容 (Chương/Bài)': s.chapterTitle,
    '集中度 (1-5★)': '★'.repeat(s.focusLevel || 0),
    'Scan確認': s.scanVerified ? '済' : '未',
    '状態': s.completed ? '完了' : '未着手',
    '学習メモ': s.notes,
  }));
  const wsSchedule = XLSX.utils.json_to_sheet(scheduleRows);
  XLSX.utils.book_append_sheet(wb, wsSchedule, '📅 日別計画・実績');

  // 2. Sheet 3 Books Syllabus
  const booksRows: any[] = [];
  books.forEach(b => {
    b.chapters.forEach(ch => {
      booksRows.push({
        '書籍名 (Tên sách)': b.title,
        '章番号 (ID)': `Ch ${ch.chapterNumber.toString().padStart(2, '0')}`,
        '章の名称 (Tên chương)': ch.title,
        '分野 (Syllabus 9.1)': ch.jpCategory,
        'ページ範囲': ch.pageRange,
        'スキャン状況': ch.scanStatus === 'scanned' ? '済' : '未',
        '完了状態': ch.studyStatus === 'completed' ? '完了' : (ch.studyStatus === 'in_progress' ? '進行中' : '未着手'),
        '理解度 (1-5★)': '★'.repeat(ch.comprehension || 0),
        '完了日': ch.completedDate || '',
        '重要ポイント': ch.keyPoints,
      });
    });
  });
  const wsBooks = XLSX.utils.json_to_sheet(booksRows);
  XLSX.utils.book_append_sheet(wb, wsBooks, '📚 3冊の学習進捗');

  // 3. Sheet Mock Exam Scores
  const examRows = examScores.map(e => ({
    '試験セット名 (Đề thi)': e.examName,
    '実施日 (Ngày)': e.dateTaken,
    '科目A正解数 (/60)': e.subjectACorrect,
    '科目Aスコア (/1000)': e.subjectAScore1000,
    '科目A判定': e.subjectAPass ? '合格' : '不合格',
    '科目Bアルゴリズム (/16)': e.subjectBAlgorithmCorrect,
    '科目Bセキュリティ (/4)': e.subjectBSecurityCorrect,
    '科目B合計 (/20)': e.subjectBCorrect,
    '科目Bスコア (/1000)': e.subjectBScore1000,
    '科目B判定': e.subjectBPass ? '合格' : '不合格',
    '総合判定 (IPA)': e.overallPass ? (e.isSafePass ? '★ 安全圏 (Safe Pass)' : '〇 合格 (Pass)') : '✕ 不合格 (Fail)',
    '所要時間 (Phút)': `${e.timeSpentA + e.timeSpentB}分`,
    '分析メモ': e.notes,
  }));
  const wsExams = XLSX.utils.json_to_sheet(examRows);
  XLSX.utils.book_append_sheet(wb, wsExams, '📝 模擬試験スコア');

  // 4. Sheet Error Notebook
  const errorRows = errorNotes.map(err => ({
    'ID': err.id,
    '出題元 (Nguồn)': err.source,
    '分野 (Chuyên đề)': err.category,
    '問題要約': err.questionSummary,
    '正解': err.correctAnswer,
    '自分の誤答': err.userAnswer,
    '間違いの原因': err.cause,
    'ポイント (Key Takeaway)': err.keyTakeaway,
    '復習1回目': err.review1Passed ? '〇 Đạt' : '未',
    '復習2回目': err.review2Passed ? '〇 Đạt' : '未',
    '復習3回目': err.review3Passed ? '〇 Đạt' : '未',
    '習得状態': err.mastered ? '★ Mastered' : '復習中',
  }));
  const wsErrors = XLSX.utils.json_to_sheet(errorRows);
  XLSX.utils.book_append_sheet(wb, wsErrors, '🔁 誤答・復習ノート');

  // 5. Sheet IT Vocab from Mazii
  const vocabRows = vocabList.map(v => ({
    'ID': v.id,
    '用語 (Kanji/Kana)': v.expression,
    '読み方 (Hiragana)': v.reading,
    '英語表記 (English)': v.en,
    'ベトナム語 (Tiếng Việt Mazii)': v.vi,
    'シラバス分野': v.category,
    '重要度': v.importance,
    '習得': v.mastered ? '済' : '未',
    '暗記メモ': v.notes,
  }));
  const wsVocab = XLSX.utils.json_to_sheet(vocabRows);
  XLSX.utils.book_append_sheet(wb, wsVocab, '📖 IT専門用語集');

  // Generate binary and trigger browser download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FE_Exam_Study_Tracker_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
