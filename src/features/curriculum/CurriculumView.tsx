import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { BookItem, ChapterItem } from '../../shared/types';
import { CheckCircle2, Camera } from 'lucide-react';

interface CurriculumViewProps {
  books: BookItem[];
  onUpdateChapter: (bookId: string, chapterId: string, updates: Partial<ChapterItem>) => void;
  onNavigateScan: (bookId: string, chapterId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  books,
  onUpdateChapter,
  onNavigateScan,
}) => {
  const [activeBookId, setActiveBookId] = useState<string>(books[0]?.id || 'book-kayanoki');
  const activeBook = books.find((b) => b.id === activeBookId) || books[0];

  return (
    <div className="space-y-6">
      {/* Book Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {books.map((book) => {
          const total = book.chapters.length;
          const completed = book.chapters.filter((c) => c.studyStatus === 'completed').length;
          const scanned = book.chapters.filter((c) => c.scanStatus === 'scanned').length;
          const pct = Math.round((completed / total) * 100);
          const isSelected = activeBookId === book.id;

          return (
            <button
              key={book.id}
              onClick={() => setActiveBookId(book.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-sumi-900 border-blue-500 shadow-lg'
                  : 'bg-sumi-900/60 border-sumi-800 hover:border-sumi-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-sumi-100 line-clamp-1">{book.title}</span>
                <Badge variant={book.targetSubject === '科目B' ? 'rose' : 'blue'}>
                  {book.targetSubject}
                </Badge>
              </div>
              <p className="text-[11px] text-sumi-400 mb-3">{book.author} | {book.edition}</p>

              <div className="w-full bg-sumi-800 rounded-full h-1.5 overflow-hidden mb-2">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-sumi-400">
                <span>Xong: {completed}/{total}</span>
                <span>Scan: {scanned}/{total}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chapters Table */}
      <BentoCard
        title={`Mục Lục Chi Tiết: ${activeBook.title}`}
        subtitle={`${activeBook.author} | ${activeBook.publisher}`}
        badge={<Badge variant="slate">{activeBook.targetSubject}</Badge>}
      >
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-sumi-800 bg-sumi-950 text-sumi-300 font-mono">
                <th className="py-2.5 px-3 w-16">Chương</th>
                <th className="py-2.5 px-3">Tên chương / Chủ đề kiến thức</th>
                <th className="py-2.5 px-3">Trang</th>
                <th className="py-2.5 px-3 text-center">Trạng thái Scan</th>
                <th className="py-2.5 px-3 text-center">Tiến độ học</th>
                <th className="py-2.5 px-3 text-center">Mức độ hiểu</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sumi-800/60 font-sans">
              {activeBook.chapters.map((ch) => (
                <tr key={ch.id} className="hover:bg-sumi-850/40">
                  <td className="py-3 px-3 font-mono font-bold text-sumi-400">
                    Ch {ch.chapterNumber.toString().padStart(2, '0')}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-sumi-100 block">{ch.title}</span>
                    <span className="text-[11px] text-sumi-400 font-mono block mt-0.5">{ch.jpCategory}</span>
                    {ch.keyPoints && <p className="text-[11px] text-sumi-400 mt-1 italic">{ch.keyPoints}</p>}
                  </td>

                  <td className="py-3 px-3 font-mono text-sumi-400 whitespace-nowrap">
                    {ch.pageRange}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateChapter(activeBook.id, ch.id, {
                          scanStatus: ch.scanStatus === 'scanned' ? 'unscanned' : 'scanned',
                        })
                      }
                      className={`text-xs px-2.5 py-1 rounded font-mono border transition-colors ${
                        ch.scanStatus === 'scanned'
                          ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                          : 'bg-sumi-950 border-sumi-700 text-sumi-500 hover:text-sumi-300'
                      }`}
                    >
                      {ch.scanStatus === 'scanned' ? '✓ Đã scan' : 'Chưa scan'}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateChapter(activeBook.id, ch.id, {
                          studyStatus: ch.studyStatus === 'completed' ? 'not_started' : 'completed',
                          completedDate: ch.studyStatus !== 'completed' ? new Date().toISOString().split('T')[0] : undefined,
                        })
                      }
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium border transition-colors ${
                        ch.studyStatus === 'completed'
                          ? 'bg-blue-950/70 border-blue-800 text-blue-300'
                          : 'bg-sumi-950 border-sumi-700 text-sumi-500 hover:text-sumi-300'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      {ch.studyStatus === 'completed' ? 'Đã học' : 'Chưa học'}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => onUpdateChapter(activeBook.id, ch.id, { comprehension: star })}
                          className={`p-0.5 text-xs ${
                            star <= (ch.comprehension || 0) ? 'text-amber-400' : 'text-sumi-700'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Camera size={14} />}
                      onClick={() => onNavigateScan(activeBook.id, ch.id)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Scan & OCR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>
  );
};
