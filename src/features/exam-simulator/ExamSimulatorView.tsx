import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { ExamScoreRecord } from '../../shared/types';
import { evaluateOverallExam } from '../../shared/services/ipaScoreService';
import { Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamSimulatorViewProps {
  examScores: ExamScoreRecord[];
  onAddScoreRecord: (record: ExamScoreRecord) => void;
}

export const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({
  examScores,
  onAddScoreRecord,
}) => {
  const [examName, setExamName] = useState<string>('令和06年 公開問題 (R06)');
  const [subjectACorrect, setSubjectACorrect] = useState<number>(42);
  const [algoCorrect, setAlgoCorrect] = useState<number>(11);
  const [secCorrect, setSecCorrect] = useState<number>(3);
  const [timeSpentA, setTimeSpentA] = useState<number>(85);
  const [timeSpentB, setTimeSpentB] = useState<number>(95);
  const [notes, setNotes] = useState<string>('');

  const previewResult = evaluateOverallExam(subjectACorrect, algoCorrect, secCorrect);

  const handleSaveScore = () => {
    const newRecord: ExamScoreRecord = {
      id: `mock-${Date.now()}`,
      examName,
      dateTaken: new Date().toISOString().split('T')[0],
      timeSpentA,
      timeSpentB,
      subjectACorrect: previewResult.subjectA.correct,
      subjectAScore1000: previewResult.subjectA.score1000,
      subjectAPass: previewResult.subjectA.passed,
      subjectBAlgorithmCorrect: previewResult.subjectB.algorithmCorrect,
      subjectBSecurityCorrect: previewResult.subjectB.securityCorrect,
      subjectBCorrect: previewResult.subjectB.totalCorrect,
      subjectBScore1000: previewResult.subjectB.score1000,
      subjectBPass: previewResult.subjectB.passed,
      overallPass: previewResult.passed,
      isSafePass: previewResult.isSafe,
      notes,
    };

    onAddScoreRecord(newRecord);
    if (previewResult.passed) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
    alert('✅ Đã lưu kết quả thi thử!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-sumi-900 border border-sumi-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald">IPA CBT 標準評価</Badge>
            <Badge variant="blue">Thang 1000 Điểm</Badge>
          </div>
          <h2 className="text-base font-bold text-sumi-100">
            Hệ Thống Mô Phỏng Điểm Thi Thử & Đánh Giá Chuẩn Đỗ IPA
          </h2>
          <p className="text-xs text-sumi-400">
            IPA quy định: Bắt buộc cả 科目A và 科目B đều phải đạt từ <strong>600 / 1000 điểm</strong> trở lên mới được công nhận đỗ chứng chỉ FE.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form & Live Evaluation on Left, History Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <BentoCard title="Nhập Kết Quả Bài Thi Thử Mới">
            <div className="space-y-3 mt-1 text-xs">
              <div>
                <label className="block text-sumi-400 mb-1">Tên bộ đề / Đợt thi thử:</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Subject A Inputs */}
              <div className="p-3 bg-sumi-850 rounded border border-sumi-800 space-y-2">
                <span className="font-semibold text-sumi-200 block">科目A (Lý thuyết trắc nghiệm 60 câu)</span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-sumi-400 block mb-1">Số câu đúng (/60):</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={subjectACorrect}
                      onChange={(e) => setSubjectACorrect(parseInt(e.target.value) || 0)}
                      className="w-full bg-sumi-950 border border-sumi-700 text-center text-sm font-mono font-bold text-blue-400 rounded py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="w-28">
                    <label className="text-[11px] text-sumi-400 block mb-1">Thời gian (phút):</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={timeSpentA}
                      onChange={(e) => setTimeSpentA(parseInt(e.target.value) || 0)}
                      className="w-full bg-sumi-950 border border-sumi-700 text-center text-xs font-mono rounded py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Subject B Inputs */}
              <div className="p-3 bg-sumi-850 rounded border border-sumi-800 space-y-2">
                <span className="font-semibold text-sumi-200 block">科目B (Thuật toán 16 câu + Bảo mật 4 câu)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-sumi-400 block mb-1">Thuật toán (/16):</label>
                    <input
                      type="number"
                      min="0"
                      max="16"
                      value={algoCorrect}
                      onChange={(e) => setAlgoCorrect(parseInt(e.target.value) || 0)}
                      className="w-full bg-sumi-950 border border-sumi-700 text-center text-sm font-mono font-bold text-rose-400 rounded py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-sumi-400 block mb-1">Bảo mật (/4):</label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={secCorrect}
                      onChange={(e) => setSecCorrect(parseInt(e.target.value) || 0)}
                      className="w-full bg-sumi-950 border border-sumi-700 text-center text-sm font-mono font-bold text-emerald-400 rounded py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-sumi-400 block mb-1">Thời gian (phút):</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={timeSpentB}
                      onChange={(e) => setTimeSpentB(parseInt(e.target.value) || 0)}
                      className="w-full bg-sumi-950 border border-sumi-700 text-center text-xs font-mono rounded py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Evaluation Box */}
              <div className={`p-3.5 rounded-lg border ${previewResult.passed ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-rose-500/10 border-rose-500/25'} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-sumi-200">Đánh giá chuẩn IPA:</span>
                  <Badge variant={previewResult.passed ? (previewResult.isSafe ? 'emerald' : 'blue') : 'rose'} dot>
                    {previewResult.passed ? (previewResult.isSafe ? 'AN TOÀN (Safe)' : 'ĐẠT (Pass)') : 'TRƯỢT (Fail)'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div>
                    <span className="text-sumi-400">Môn A: </span>
                    <strong className={previewResult.subjectA.passed ? 'text-emerald-400' : 'text-rose-400'}>
                      {previewResult.subjectA.score1000}/1000 ({previewResult.subjectA.percentage}%)
                    </strong>
                  </div>
                  <div>
                    <span className="text-sumi-400">Môn B: </span>
                    <strong className={previewResult.subjectB.passed ? 'text-emerald-400' : 'text-rose-400'}>
                      {previewResult.subjectB.score1000}/1000 ({previewResult.subjectB.overallPercentage}%)
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-sumi-300 mt-1">{previewResult.evaluationMessage}</p>
              </div>

              <div>
                <label className="block text-sumi-400 mb-1">Ghi chú & Phân tích nguyên nhân:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Môn A câu CSDL làm tốt, Môn B bị câu đệ quy mất 15 phút..."
                  rows={2}
                  className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded p-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <Button variant="primary" size="md" className="w-full mt-2" onClick={handleSaveScore}>
                <Plus size={16} /> Lưu Kết Quả Thi Thử
              </Button>
            </div>
          </BentoCard>
        </div>

        {/* Score History Table */}
        <div className="lg:col-span-7 space-y-4">
          <BentoCard title="Lịch Sử Điểm Thi Thử Đã Lưu" subtitle="Theo dõi đường tiến bộ điểm số qua từng lần cày đề">
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-sumi-800 bg-sumi-950 text-sumi-300 font-mono">
                    <th className="py-2.5 px-3">Ngày</th>
                    <th className="py-2.5 px-3">Đề thi</th>
                    <th className="py-2.5 px-3 text-center">Môn A</th>
                    <th className="py-2.5 px-3 text-center">Môn B (Algo+Sec)</th>
                    <th className="py-2.5 px-3 text-center">Tổng thể</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sumi-800/60 font-mono">
                  {examScores.map((score) => (
                    <tr key={score.id} className="hover:bg-sumi-850/40">
                      <td className="py-2.5 px-3 whitespace-nowrap text-sumi-400">{score.dateTaken}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-sumi-200">
                        {score.examName}
                        {score.notes && <p className="text-[10px] text-sumi-400 font-sans mt-0.5">{score.notes}</p>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold ${score.subjectAPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {score.subjectAScore1000}
                        </span>
                        <span className="text-[10px] text-sumi-500 block">({score.subjectACorrect}/60)</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold ${score.subjectBPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {score.subjectBScore1000}
                        </span>
                        <span className="text-[10px] text-sumi-500 block">({score.subjectBAlgorithmCorrect}+{score.subjectBSecurityCorrect}/20)</span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <Badge variant={score.overallPass ? 'emerald' : 'rose'} dot>
                          {score.overallPass ? '合格 PASS' : '不合格 FAIL'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
