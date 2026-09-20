import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { SecurityCaseStudy } from '../../shared/types';
import { Terminal, Network, Mail, Globe, CheckCircle2, XCircle } from 'lucide-react';

interface SecurityWorkshopViewProps {
  caseStudies: SecurityCaseStudy[];
}

export const SecurityWorkshopView: React.FC<SecurityWorkshopViewProps> = ({
  caseStudies,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseStudies[0]?.id || 'sec-case-01');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const activeCase = caseStudies.find((c) => c.id === selectedCaseId) || caseStudies[0];

  const handleSelectChoice = (qIdx: number, choiceIdx: number) => {
    const key = `${activeCase.id}-${qIdx}`;
    setSelectedAnswers({ ...selectedAnswers, [key]: choiceIdx });
    setShowExplanation({ ...showExplanation, [key]: true });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-sumi-900 border border-sumi-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="rose">科目B・情報セキュリティ</Badge>
            <Badge variant="emerald">20% Tổng Điểm Môn B</Badge>
          </div>
          <h2 className="text-base font-bold text-sumi-100">
            Xưởng Phân Tích Tình Huống Bảo Mật (Security Case Workshop)
          </h2>
          <p className="text-xs text-sumi-400">
            Chiến thuật 'Security First': Làm 4 câu bảo mật trong 15-20 phút đầu để ăn chắc 20% điểm trước khi dốc toàn lực cho thuật toán.
          </p>
        </div>
      </div>

      {/* Case Study Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {caseStudies.map((cs) => (
          <button
            key={cs.id}
            onClick={() => setSelectedCaseId(cs.id)}
            className={`text-xs px-3 py-2 rounded-md font-medium whitespace-nowrap border transition-all flex items-center gap-2 ${
              selectedCaseId === cs.id
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : 'bg-sumi-900 border-sumi-800 text-sumi-400 hover:text-sumi-200'
            }`}
          >
            {cs.logType === 'web' && <Globe size={14} />}
            {cs.logType === 'firewall' && <Network size={14} />}
            {cs.logType === 'email' && <Mail size={14} />}
            {cs.title}
          </button>
        ))}
      </div>

      {/* Main Grid: Scenario & Raw Log on Left, Interactive Questions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Scenario & Raw Log lines */}
        <div className="lg:col-span-6 space-y-4">
          <BentoCard
            title={activeCase.title}
            subtitle="Tình huống thực tế trích xuất từ đề thi IPA"
            badge={<Badge variant="rose">Case Study</Badge>}
          >
            <div className="space-y-3 mt-1 text-xs">
              <p className="text-sumi-300 leading-relaxed bg-sumi-850 p-3 rounded border border-sumi-800">
                {activeCase.scenarioDescription}
              </p>

              <div>
                <div className="flex items-center gap-1.5 text-sumi-400 mb-1.5 font-mono text-[11px]">
                  <Terminal size={12} />
                  <span>Trích xuất nhật ký Log ({activeCase.logType.toUpperCase()} Log):</span>
                </div>
                <div className="bg-sumi-950 border border-sumi-800 rounded p-3 font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto leading-relaxed">
                  {activeCase.sampleLogLines.map((line, idx) => (
                    <div key={idx} className="hover:bg-sumi-900 px-1 rounded">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Security-First Strategy Card */}
          <BentoCard title="🎯 Chiến Thuật Thi 'Security First'">
            <div className="text-xs space-y-2 text-sumi-300">
              <p>
                <strong>0 - 20 phút đầu:</strong> Lật ngay đến 4 câu bảo mật cuối đề môn B (từ câu 17 đến 20).
              </p>
              <p className="text-[11px] text-sumi-400">
                4 câu này là dạng đọc hiểu tình huống. Chỉ cần nắm vững kiến thức mạng, CSDL và các loại tấn công là giải quyết rất nhanh trong 3-4 phút/câu.
              </p>
              <p className="text-emerald-400 font-semibold text-[11px]">
                Ăn chắc 4/4 câu = 200 điểm (tương đương 1/3 điểm đỗ 600)!
              </p>
            </div>
          </BentoCard>
        </div>

        {/* Right Col: Interactive Questions & Explanations */}
        <div className="lg:col-span-6 space-y-4">
          <BentoCard title="Câu Hỏi Khảo Sát & Giải Thích Chi Tiết">
            <div className="space-y-6 mt-1">
              {activeCase.analysisQuestions.map((q, qIdx) => {
                const key = `${activeCase.id}-${qIdx}`;
                const chosen = selectedAnswers[key];
                const isRevealed = showExplanation[key];
                const isCorrect = chosen === q.correctIndex;

                return (
                  <div key={qIdx} className="space-y-3 p-3 bg-sumi-850/50 border border-sumi-800 rounded-md">
                    <p className="text-xs font-semibold text-sumi-100 leading-relaxed">
                      Câu hỏi {qIdx + 1}: {q.questionText}
                    </p>

                    <div className="space-y-2">
                      {q.choices.map((choice, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSelectChoice(qIdx, cIdx)}
                          className={`w-full text-left text-xs p-2.5 rounded border transition-all font-mono ${
                            chosen === cIdx
                              ? isCorrect
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                : 'bg-rose-950/80 border-rose-500 text-rose-200'
                              : isRevealed && cIdx === q.correctIndex
                              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                              : 'bg-sumi-950 border-sumi-700 text-sumi-300 hover:border-sumi-500'
                          }`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>

                    {isRevealed && (
                      <div
                        className={`p-3 rounded border text-xs leading-relaxed space-y-1 ${
                          isCorrect
                            ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                            : 'bg-rose-950/30 border-rose-800/80 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          <span>{isCorrect ? 'Chính xác! Đáp án đúng.' : 'Chưa chính xác!'}</span>
                        </div>
                        <p className="text-sumi-300 text-[11px] mt-1">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
