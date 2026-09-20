import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { BookItem, ApiKeyConnection } from '../../shared/types';
import { callGeminiVisionOcr, markKeyExhausted } from '../../shared/services/geminiKeyManager';
import { Upload, Camera, FileText, CheckCircle2, AlertCircle, Bot, Loader2, Sparkles, Key } from 'lucide-react';

interface ScannerViewProps {
  books: BookItem[];
  apiKeys: ApiKeyConnection[];
  onUpdateApiKeys: (updated: ApiKeyConnection[]) => void;
  onUpdateChapterScan: (bookId: string, chapterId: string, markdown: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  books,
  apiKeys,
  onUpdateApiKeys,
  onUpdateChapterScan,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || 'book-kayanoki');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('kayanoki-01');
  const [bookFormat, setBookFormat] = useState<'kayanoki' | 'fukushima' | 'pastexam'>('kayanoki');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [ocrResult, setOcrResult] = useState<string>('');
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [ocrError, setOcrError] = useState<string | null>(null);

  // AI Tutor State
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0];
  const activeKey = apiKeys[currentKeyIndex] || apiKeys[0];

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    if (bookId === 'book-kayanoki') setBookFormat('kayanoki');
    else if (bookId === 'book-fukushima') setBookFormat('fukushima');
    else setBookFormat('pastexam');

    const b = books.find((x) => x.id === bookId);
    if (b && b.chapters.length > 0) {
      setSelectedChapterId(b.chapters[0].id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setOcrResult('');
      setOcrError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunOcr = async () => {
    if (!imagePreview) return;
    if (!activeKey || !activeKey.key) {
      setOcrError('Chưa có API key hợp lệ. Vui lòng kiểm tra lại 6 keys từ Omniroute trong mục Cài đặt.');
      return;
    }

    setIsOcrLoading(true);
    setOcrError(null);

    let keyIdx = currentKeyIndex;
    let attempts = 0;
    const maxAttempts = apiKeys.length;

    while (attempts < maxAttempts) {
      const candidateKey = apiKeys[keyIdx];
      if (!candidateKey || !candidateKey.key || candidateKey.status !== 'active') {
        keyIdx = (keyIdx + 1) % apiKeys.length;
        attempts++;
        continue;
      }

      try {
        const text = await callGeminiVisionOcr(
          imagePreview,
          mimeType,
          bookFormat,
          candidateKey.key,
          'gemini-2.5-flash'
        );
        setOcrResult(text);
        setCurrentKeyIndex(keyIdx);
        setIsOcrLoading(false);
        return;
      } catch (err: any) {
        console.warn(`Key ${candidateKey.name} error:`, err.message);
        if (err.message.includes('429')) {
          // Mark exhausted and failover to next key
          const { updatedKeys, nextIndex } = markKeyExhausted(apiKeys, keyIdx);
          onUpdateApiKeys(updatedKeys);
          if (nextIndex === -1) {
            setOcrError('Tất cả 6 Gemini API keys đều đã hết hạn mức (429 Rate Limit)!');
            setIsOcrLoading(false);
            return;
          }
          keyIdx = nextIndex;
          attempts++;
        } else {
          setOcrError(err.message || 'Lỗi nhận diện Gemini OCR.');
          setIsOcrLoading(false);
          return;
        }
      }
    }

    setOcrError('Không thể thực hiện OCR sau khi đã thử toàn bộ danh sách API key.');
    setIsOcrLoading(false);
  };

  const handleSaveToChapter = () => {
    if (!ocrResult || !selectedBookId || !selectedChapterId) return;
    onUpdateChapterScan(selectedBookId, selectedChapterId, ocrResult);
    alert('✅ Đã lưu kết quả OCR và đánh dấu trạng thái Đã Scan cho chương này!');
  };

  const handleAskAiTutor = async () => {
    if (!aiQuestion.trim() || !activeKey?.key) return;
    setIsAiLoading(true);

    try {
      const prompt = `Bạn là trợ giảng chuyên sâu kỳ thi Kỹ sư CNTT Nhật Bản (FE - 基本情報技術者).
Dưới đây là nội dung trang sách vừa OCR:
---
${ocrResult.slice(0, 2000)}
---
Câu hỏi của học viên: "${aiQuestion}"
Hãy giải thích thật dễ hiểu, cặn kẽ bằng tiếng Việt, phân tích bản chất kỹ thuật và mẹo làm bài thi thật.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey.key}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được câu trả lời từ AI.';
      setAiAnswer(answer);
    } catch (e: any) {
      setAiAnswer(`Lỗi trợ giảng: ${e.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header reminder */}
      <div className="p-4 bg-sumi-900 border border-amber-800/60 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-950/60 text-amber-400 rounded">
            <Camera size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sumi-100 flex items-center gap-2">
              Tủ Sách Giấy & Trung Tâm Scan Just-In-Time (Gemini Vision OCR)
            </h2>
            <p className="text-xs text-sumi-400">
              Nhắc nhở: Sách giấy chưa có PDF. Dùng app điện thoại (vFlat / Adobe Scan) scan chương tiếp theo trước khi ngồi vào bàn học.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-sumi-300 shrink-0">
          <Key size={14} className="text-blue-400" />
          <span>Active Key:</span>
          <Badge variant="blue">{activeKey?.name || 'Omniroute Key'}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Book & Chapter Selection + Upload */}
        <div className="lg:col-span-5 space-y-4">
          <BentoCard title="1. Chọn Sách & Chương Bài Học">
            <div className="space-y-3 mt-1">
              <div>
                <label className="block text-xs text-sumi-400 mb-1">Chọn sách giấy cần scan:</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => handleBookChange(e.target.value)}
                  className="w-full bg-sumi-850 border border-sumi-700 text-sumi-100 text-xs rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.targetSubject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-sumi-400 mb-1">Chọn chương mục:</label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full bg-sumi-850 border border-sumi-700 text-sumi-100 text-xs rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {selectedBook.chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.title} ({ch.scanStatus === 'scanned' ? 'Đã scan' : 'Chưa scan'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-sumi-400 mb-1">Mẫu bóc tách thông minh (Format Parser):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookFormat('kayanoki')}
                    className={`text-[11px] p-2 rounded border font-medium text-center transition-all ${
                      bookFormat === 'kayanoki'
                        ? 'bg-blue-950/80 border-blue-500 text-blue-200'
                        : 'bg-sumi-850 border-sumi-700 text-sumi-400'
                    }`}
                  >
                    かやのき (Lý thuyết)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookFormat('fukushima')}
                    className={`text-[11px] p-2 rounded border font-medium text-center transition-all ${
                      bookFormat === 'fukushima'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-sumi-850 border-sumi-700 text-sumi-400'
                    }`}
                  >
                    福嶋 (Thuật toán B)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookFormat('pastexam')}
                    className={`text-[11px] p-2 rounded border font-medium text-center transition-all ${
                      bookFormat === 'pastexam'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : 'bg-sumi-850 border-sumi-700 text-sumi-400'
                    }`}
                  >
                    過去問 (Đề thi)
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="mt-4 pt-4 border-t border-sumi-800">
                <label className="block text-xs text-sumi-300 font-medium mb-2">
                  Tải lên ảnh chụp trang sách hoặc file PDF vừa scan:
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-sumi-700 hover:border-sumi-500 rounded-lg p-6 cursor-pointer bg-sumi-850/40 hover:bg-sumi-850 transition-colors">
                  <Upload size={24} className="text-sumi-400 mb-2" />
                  <span className="text-xs text-sumi-300 font-medium">Bấm để chọn file hoặc kéo thả vào đây</span>
                  <span className="text-[10px] text-sumi-500 mt-1">Hỗ trợ JPG, PNG, WebP hoặc PDF xuất từ vFlat</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="mt-3 space-y-2">
                  <div className="relative rounded border border-sumi-700 overflow-hidden max-h-48 bg-black/40 flex items-center justify-center">
                    <img src={imagePreview} alt="Scan preview" className="object-contain max-h-48 w-full" />
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={isOcrLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    onClick={handleRunOcr}
                    disabled={isOcrLoading}
                  >
                    {isOcrLoading ? 'Đang gọi Gemini 3.8 Flash OCR...' : 'Chạy Gemini Vision OCR'}
                  </Button>
                </div>
              )}

              {ocrError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 rounded text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Lỗi nhận diện:</strong>
                    <span>{ocrError}</span>
                  </div>
                </div>
              )}
            </div>
          </BentoCard>
        </div>

        {/* Right Column: OCR Result Editor & AI Tutor */}
        <div className="lg:col-span-7 space-y-4">
          <BentoCard
            title="2. Kết Quả Nhận Diện Markdown & Trợ Giảng AI"
            subtitle="Định dạng Markdown có cấu trúc, cho phép chỉnh sửa trực tiếp"
            action={
              ocrResult ? (
                <Button variant="outline" size="sm" onClick={handleSaveToChapter} className="text-xs">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Lưu vào chương sách
                </Button>
              ) : undefined
            }
          >
            {ocrResult ? (
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-sumi-400 mb-1">
                    <span>Nội dung đã bóc tách (Markdown):</span>
                    <span className="font-mono text-[10px]">{ocrResult.length} ký tự</span>
                  </div>
                  <textarea
                    value={ocrResult}
                    onChange={(e) => setOcrResult(e.target.value)}
                    rows={12}
                    className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 font-mono text-xs rounded p-3 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                  />
                </div>

                {/* AI Tutor Chatbox */}
                <div className="p-4 bg-sumi-850 border border-sumi-700/80 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-blue-400" />
                    <span className="text-xs font-semibold text-sumi-100">
                      AI Tutor (Trợ giảng tiếng Việt - 6 Keys Omniroute)
                    </span>
                  </div>
                  <p className="text-[11px] text-sumi-400">
                    Đoạn nào trong trang sách chưa hiểu? Hãy hỏi trợ giảng để được giải thích cặn kẽ thuật toán hoặc khái niệm tiếng Nhật.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ví dụ: Giải thích giúp tôi tại sao thuật toán này mid = (low+high)/2..."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAiTutor()}
                      className="flex-1 bg-sumi-950 border border-sumi-700 text-xs rounded px-3 py-2 text-sumi-100 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAskAiTutor}
                      disabled={isAiLoading || !aiQuestion.trim()}
                    >
                      {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : 'Hỏi AI'}
                    </Button>
                  </div>

                  {aiAnswer && (
                    <div className="p-3 bg-sumi-950/80 border border-sumi-800 rounded text-xs text-sumi-200 leading-relaxed mt-2 whitespace-pre-wrap">
                      <strong className="text-blue-400 block mb-1">Giải thích từ Trợ giảng:</strong>
                      {aiAnswer}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-sumi-500 text-xs space-y-2">
                <FileText size={32} className="mx-auto text-sumi-600 mb-2" />
                <p className="text-sumi-300 font-medium">Chưa có nội dung scan.</p>
                <p className="text-sumi-500 max-w-sm mx-auto">
                  Chọn sách ở bên trái, tải ảnh trang sách vừa scan bằng điện thoại lên và bấm 'Chạy Gemini Vision OCR'.
                </p>
              </div>
            )}
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
