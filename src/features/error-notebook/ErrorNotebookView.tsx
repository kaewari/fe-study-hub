import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { ErrorNoteItem, ErrorCause } from '../../shared/types';
import { computeNextSrsDate } from '../../shared/services/spacedRepetitionService';
import { Plus } from 'lucide-react';

interface ErrorNotebookViewProps {
  errorNotes: ErrorNoteItem[];
  onAddErrorNote: (note: ErrorNoteItem) => void;
  onUpdateErrorNote: (id: string, updates: Partial<ErrorNoteItem>) => void;
}

export const ErrorNotebookView: React.FC<ErrorNotebookViewProps> = ({
  errorNotes,
  onAddErrorNote,
  onUpdateErrorNote,
}) => {
  const [source, setSource] = useState<string>('福嶋 Ch04 演習問3');
  const [category, setCategory] = useState<string>('科目B・整列');
  const [questionSummary, setQuestionSummary] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [cause, setCause] = useState<ErrorCause>('algorithm_logic');
  const [keyTakeaway, setKeyTakeaway] = useState<string>('');

  const handleCreateNote = () => {
    if (!questionSummary.trim() || !correctAnswer.trim()) {
      alert('Vui lòng nhập tóm tắt câu hỏi và đáp án đúng.');
      return;
    }

    const newNote: ErrorNoteItem = {
      id: `ERR-${(errorNotes.length + 1).toString().padStart(3, '0')}`,
      source,
      category,
      questionSummary,
      correctAnswer,
      userAnswer,
      cause,
      keyTakeaway,
      review1Passed: false,
      review2Passed: false,
      review3Passed: false,
      mastered: false,
    };

    onAddErrorNote(newNote);
    setQuestionSummary('');
    setCorrectAnswer('');
    setUserAnswer('');
    setKeyTakeaway('');
    alert('✅ Đã thêm câu sai vào sổ tay ôn tập!');
  };

  const handleReviewAction = (note: ErrorNoteItem, cycle: 1 | 2 | 3, passed: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const srsResult = computeNextSrsDate(cycle, today, passed);

    if (cycle === 1) {
      onUpdateErrorNote(note.id, {
        review1Date: today,
        review1Passed: passed,
        mastered: srsResult.isMastered,
      });
    } else if (cycle === 2) {
      onUpdateErrorNote(note.id, {
        review2Date: today,
        review2Passed: passed,
        mastered: srsResult.isMastered,
      });
    } else if (cycle === 3) {
      onUpdateErrorNote(note.id, {
        review3Date: today,
        review3Passed: passed,
        mastered: srsResult.isMastered,
      });
    }
  };

  const getCauseBadge = (c: ErrorCause) => {
    switch (c) {
      case 'japanese_misread':
        return <Badge variant="amber">Tiếng Nhật</Badge>;
      case 'algorithm_logic':
        return <Badge variant="rose">Thuật toán B</Badge>;
      case 'theory_knowledge':
        return <Badge variant="blue">Lý thuyết A</Badge>;
      case 'careless_mistake':
        return <Badge variant="slate">Bất cẩn</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-sumi-900 border border-sumi-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="rose">Sổ Tay Câu Sai</Badge>
            <Badge variant="emerald">Spaced Repetition 3x</Badge>
          </div>
          <h2 className="text-base font-bold text-sumi-100">
            誤答・復習ノート (Chu Trình Lặp Lại Ngắt Quãng 3 Lần)
          </h2>
          <p className="text-xs text-sumi-400">
            Lặp lại câu sai: Lần 1 (+1 ngày) → Lần 2 (+3 ngày) → Lần 3 (+7 ngày). Đỗ kỳ thi FE phụ thuộc vào việc không lặp lại lỗi cũ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <BentoCard title="Ghi Nhận Câu Sai Mới">
            <div className="space-y-3 mt-1 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sumi-400 mb-1">Nguồn câu hỏi / Vị trí:</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded px-3 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sumi-400 mb-1">Chuyên đề:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded px-3 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sumi-400 mb-1">Tóm tắt câu hỏi:</label>
                <textarea
                  value={questionSummary}
                  onChange={(e) => setQuestionSummary(e.target.value)}
                  placeholder="Ví dụ: Đề bài yêu cầu tìm số lần so sánh của Quicksort khi mảng đã sắp xếp..."
                  rows={2}
                  className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded p-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-400 mb-1">Đáp án đúng:</label>
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Ví dụ: ウ (O(n²))"
                    className="w-full bg-sumi-950 border border-emerald-800 text-emerald-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-rose-400 mb-1">Đáp án mình chọn:</label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Ví dụ: ア (O(n log n))"
                    className="w-full bg-sumi-950 border border-rose-800 text-rose-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sumi-400 mb-1">Phân loại nguyên nhân sai:</label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value as ErrorCause)}
                  className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded px-3 py-2 focus:outline-none"
                >
                  <option value="algorithm_logic">2. Hiểu sai tư duy thuật toán / Ngôn ngữ giả môn B</option>
                  <option value="japanese_misread">1. Hiểu sai nghĩa từ vựng / Bẫy ngữ pháp tiếng Nhật</option>
                  <option value="theory_knowledge">3. Chưa nắm vững lý thuyết nền tảng môn A</option>
                  <option value="careless_mistake">4. Bất cẩn / Nhầm lẫn số liệu / Tính toán ẩu</option>
                </select>
              </div>

              <div>
                <label className="block text-sumi-400 mb-1">Điểm cốt lõi cần nhớ (Key Takeaway):</label>
                <textarea
                  value={keyTakeaway}
                  onChange={(e) => setKeyTakeaway(e.target.value)}
                  placeholder="Ghi lại nguyên tắc sống còn: Khi nào thì áp dụng công thức này..."
                  rows={2}
                  className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded p-2 focus:outline-none"
                />
              </div>

              <Button variant="primary" size="md" className="w-full mt-2" onClick={handleCreateNote}>
                <Plus size={16} /> Thêm Vào Sổ Tay Câu Sai
              </Button>
            </div>
          </BentoCard>
        </div>

        {/* List of Error Notes & Spaced Repetition Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <BentoCard title="Danh Sách Câu Sai Cần Ôn Tập (SRS Active Deck)">
            <div className="space-y-3 mt-2">
              {errorNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 bg-sumi-850/70 border border-sumi-800 rounded-lg space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sumi-200">{note.id}</span>
                      <span className="font-medium text-sumi-300">{note.source}</span>
                      {getCauseBadge(note.cause)}
                    </div>
                    {note.mastered ? (
                      <Badge variant="emerald">★ Đã Mastered</Badge>
                    ) : (
                      <Badge variant="amber">Đang ôn tập</Badge>
                    )}
                  </div>

                  <p className="text-sumi-100 font-medium leading-relaxed">{note.questionSummary}</p>

                  <div className="flex items-center gap-4 text-[11px] bg-sumi-950/60 p-2 rounded border border-sumi-800 font-mono">
                    <span className="text-emerald-400">Đáp án đúng: <strong>{note.correctAnswer}</strong></span>
                    <span className="text-rose-400">Đáp án bạn chọn: <strong>{note.userAnswer}</strong></span>
                  </div>

                  {note.keyTakeaway && (
                    <p className="text-[11px] text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-900/40">
                      💡 <strong>Key Takeaway:</strong> {note.keyTakeaway}
                    </p>
                  )}

                  {/* 3-Cycle Buttons */}
                  <div className="pt-2 border-t border-sumi-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-sumi-400">Chu trình ôn lại:</span>
                    <div className="flex items-center gap-2">
                      {/* Cycle 1 */}
                      <Button
                        variant={note.review1Passed ? 'outline' : 'secondary'}
                        size="sm"
                        className="text-[10px] h-7 px-2"
                        onClick={() => handleReviewAction(note, 1, !note.review1Passed)}
                      >
                        Lần 1 {note.review1Passed ? '✓' : '未'}
                      </Button>
                      {/* Cycle 2 */}
                      <Button
                        variant={note.review2Passed ? 'outline' : 'secondary'}
                        size="sm"
                        className="text-[10px] h-7 px-2"
                        onClick={() => handleReviewAction(note, 2, !note.review2Passed)}
                      >
                        Lần 2 {note.review2Passed ? '✓' : '未'}
                      </Button>
                      {/* Cycle 3 */}
                      <Button
                        variant={note.review3Passed ? 'outline' : 'secondary'}
                        size="sm"
                        className="text-[10px] h-7 px-2"
                        onClick={() => handleReviewAction(note, 3, !note.review3Passed)}
                      >
                        Lần 3 {note.review3Passed ? '✓' : '未'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
