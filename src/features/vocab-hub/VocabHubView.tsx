import React, { useState, useMemo } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { VocabItem } from '../../shared/types';
import { Volume2, Search, CheckCircle2, RotateCw, BookOpen, Layers, HelpCircle } from 'lucide-react';

interface VocabHubViewProps {
  vocabList: VocabItem[];
  onToggleMastered: (id: string) => void;
}

export const VocabHubView: React.FC<VocabHubViewProps> = ({
  vocabList,
  onToggleMastered,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<'table' | 'flashcard' | 'quiz'>('table');

  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<number | null>(null);

  // Filtered List
  const filteredVocab = useMemo(() => {
    return vocabList.filter((v) => {
      const matchesSearch =
        v.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vi.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || v.category.includes(selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [vocabList, searchTerm, selectedCategory]);

  const speakJapanese = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentFlashcard = filteredVocab[currentCardIndex] || filteredVocab[0];

  // Generate 4 choices for quiz question
  const currentQuizItem = filteredVocab[currentCardIndex] || filteredVocab[0];
  const quizChoices = useMemo(() => {
    if (!currentQuizItem || filteredVocab.length < 4) return [];
    const others = filteredVocab.filter((v) => v.id !== currentQuizItem.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const all4 = [currentQuizItem, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return all4;
  }, [currentQuizItem, filteredVocab]);

  const handleSelectQuiz = (choiceIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizChoice(choiceIdx);
    setQuizAnswered(true);
    if (quizChoices[choiceIdx]?.id === currentQuizItem.id) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizAnswered(false);
    setSelectedQuizChoice(null);
    setCurrentCardIndex((prev) => (prev + 1) % filteredVocab.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-sumi-900 border border-sumi-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">Mazii SQLite Database</Badge>
            <Badge variant="emerald">{vocabList.length} Thuật ngữ FE</Badge>
          </div>
          <h2 className="text-base font-bold text-sumi-100">
            Từ Điển Thuật Ngữ IT Chuyên Ngành (FE Core Glossary & Flashcards)
          </h2>
          <p className="text-xs text-sumi-400">
            Được trích xuất trực tiếp từ cơ sở dữ liệu từ điển Mazii. Tích hợp phát âm giọng Tokyo chuẩn & Thẻ ghi nhớ SRS.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-sumi-950 p-1 rounded-lg border border-sumi-800 shrink-0">
          <Button
            variant={activeMode === 'table' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode('table')}
            className="text-xs"
          >
            <BookOpen size={14} /> Tra cứu
          </Button>
          <Button
            variant={activeMode === 'flashcard' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveMode('flashcard');
              setIsFlipped(false);
            }}
            className="text-xs"
          >
            <Layers size={14} /> Flashcard SRS
          </Button>
          <Button
            variant={activeMode === 'quiz' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveMode('quiz');
              setQuizAnswered(false);
              setSelectedQuizChoice(null);
            }}
            className="text-xs"
          >
            <HelpCircle size={14} /> Trắc nghiệm 5 phút
          </Button>
        </div>
      </div>

      {/* Mode 1: Table Search Mode */}
      {activeMode === 'table' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-sumi-900 border border-sumi-800 rounded-lg">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-2.5 text-sumi-400" />
              <input
                type="text"
                placeholder="Tìm theo Kanji, Kana, tiếng Anh, tiếng Việt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-sumi-950 border border-sumi-700 text-xs rounded pl-9 pr-3 py-1.5 text-sumi-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['all', 'テクノロジ', 'マネジメント', 'ストラテジ'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium border transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                      : 'bg-sumi-850 border-sumi-700 text-sumi-400 hover:text-sumi-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vocab Table */}
          <BentoCard title={`Danh Sách Từ Vựng (${filteredVocab.length} mục)`}>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-sumi-800 bg-sumi-950 text-sumi-300 font-mono">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Thuật ngữ & Phiên âm</th>
                    <th className="py-2.5 px-3">Tiếng Anh gốc</th>
                    <th className="py-2.5 px-3">Giải nghĩa tiếng Việt (Mazii)</th>
                    <th className="py-2.5 px-3">Phân loại</th>
                    <th className="py-2.5 px-3 text-center">Âm thanh</th>
                    <th className="py-2.5 px-3 text-center">Đã thuộc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sumi-800/60 font-sans">
                  {filteredVocab.map((item) => (
                    <tr key={item.id} className="hover:bg-sumi-850/40">
                      <td className="py-2.5 px-3 font-mono text-sumi-400">{item.id}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-base font-bold text-sumi-100 block">{item.expression}</span>
                        <span className="text-[11px] text-sumi-400 font-mono">{item.reading}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-blue-300 font-medium">{item.en}</td>
                      <td className="py-2.5 px-3 text-sumi-200 max-w-xs">{item.vi}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <Badge variant="slate">{item.category}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => speakJapanese(item.expression)}
                          className="p-1 rounded text-sumi-400 hover:text-blue-400 hover:bg-sumi-800 transition-colors"
                        >
                          <Volume2 size={16} />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleMastered(item.id)}
                          className={`p-1 rounded transition-colors ${
                            item.mastered ? 'text-emerald-400' : 'text-sumi-700 hover:text-sumi-400'
                          }`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BentoCard>
        </div>
      )}

      {/* Mode 2: Flashcard SRS Flip Mode */}
      {activeMode === 'flashcard' && currentFlashcard && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-sumi-400 font-mono">
            <span>Thẻ {currentCardIndex + 1} / {filteredVocab.length}</span>
            <span>Bấm vào thẻ hoặc nhấn [Space] để lật</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] p-8 bg-sumi-900 border border-sumi-700 hover:border-sumi-600 rounded-xl shadow-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none"
          >
            {!isFlipped ? (
              // Front: Kanji & Pronunciation
              <div className="space-y-3">
                <Badge variant="slate">{currentFlashcard.category}</Badge>
                <h3 className="text-3xl font-bold text-sumi-100 tracking-wide mt-2">
                  {currentFlashcard.expression}
                </h3>
                <p className="text-sm font-mono text-sumi-400">{currentFlashcard.reading}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(currentFlashcard.expression);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 p-2 rounded bg-sumi-850"
                >
                  <Volume2 size={14} /> Nghe phát âm Tokyo
                </button>
              </div>
            ) : (
              // Back: Meaning & English
              <div className="space-y-3 animate-in fade-in duration-150">
                <span className="text-xs font-mono text-blue-400 font-semibold">{currentFlashcard.en}</span>
                <p className="text-base text-sumi-100 font-medium max-w-md leading-relaxed">
                  {currentFlashcard.vi}
                </p>
                <div className="pt-3 border-t border-sumi-800 w-full flex justify-center gap-2">
                  <Badge variant="emerald">{currentFlashcard.importance}</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev === 0 ? filteredVocab.length - 1 : prev - 1));
              }}
            >
              Thẻ trước
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<RotateCw size={14} />}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              Lật thẻ
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev + 1) % filteredVocab.length);
              }}
            >
              Thẻ tiếp theo
            </Button>
          </div>
        </div>
      )}

      {/* Mode 3: Quick 5-Minute Quiz Mode */}
      {activeMode === 'quiz' && currentQuizItem && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-sumi-400 font-mono">
            <span>Câu {currentCardIndex + 1} / {filteredVocab.length}</span>
            <span>Điểm hiện tại: <strong className="text-emerald-400">{quizScore}</strong></span>
          </div>

          <div className="p-6 bg-sumi-900 border border-sumi-700 rounded-xl space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-blue-400 font-mono">{currentQuizItem.category}</span>
              <h3 className="text-2xl font-bold text-sumi-100 flex items-center justify-between">
                <span>{currentQuizItem.expression}</span>
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQuizItem.expression)}
                  className="text-sumi-400 hover:text-blue-400"
                >
                  <Volume2 size={20} />
                </button>
              </h3>
              <p className="text-xs font-mono text-sumi-400">{currentQuizItem.reading}</p>
            </div>

            <p className="text-xs text-sumi-300 font-medium pt-2 border-t border-sumi-800">
              Chọn định nghĩa tiếng Việt chính xác nhất:
            </p>

            <div className="space-y-2">
              {quizChoices.map((choice, idx) => {
                const isSelected = selectedQuizChoice === idx;
                const isCorrect = choice.id === currentQuizItem.id;

                let btnStyle = 'bg-sumi-950 border-sumi-700 text-sumi-300 hover:border-sumi-500';
                if (quizAnswered) {
                  if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectQuiz(idx)}
                    disabled={quizAnswered}
                    className={`w-full text-left text-xs p-3 rounded border transition-all leading-relaxed ${btnStyle}`}
                  >
                    <span className="font-mono font-bold mr-2 text-sumi-400">[{idx + 1}]</span>
                    {choice.vi}
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <div className="pt-3 border-t border-sumi-800 flex justify-between items-center">
                <span className="text-xs text-sumi-400 font-mono">
                  Thuật ngữ tiếng Anh: <strong className="text-blue-400">{currentQuizItem.en}</strong>
                </span>
                <Button variant="primary" size="sm" onClick={nextQuizQuestion}>
                  Câu tiếp theo →
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
