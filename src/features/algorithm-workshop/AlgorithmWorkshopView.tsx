import React, { useState, useEffect } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { AlgorithmPreset, TraceTableRow } from '../../shared/types';
import { Play, Pause, RotateCcw, Plus, AlertTriangle, Timer } from 'lucide-react';

interface AlgorithmWorkshopViewProps {
  presets: AlgorithmPreset[];
}

export const AlgorithmWorkshopView: React.FC<AlgorithmWorkshopViewProps> = ({
  presets,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0]?.id || 'algo-binary-search');
  const activePreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  // Trace Table State
  const [columns, setColumns] = useState<string[]>(activePreset.sampleColumns);
  const [traceRows, setTraceRows] = useState<TraceTableRow[]>(activePreset.initialTraceRows);
  const [newColName, setNewColName] = useState<string>('');

  // 6-8 min Stopwatch State
  const [timerSeconds, setTimerSeconds] = useState<number>(8 * 60); // 8 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    setColumns(activePreset.sampleColumns);
    setTraceRows(activePreset.initialTraceRows);
  }, [activePreset]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('⏰ Hết 8 phút! Hãy kiểm tra lại kết quả bài toán môn B của bạn.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddColumn = () => {
    if (!newColName.trim() || columns.includes(newColName.trim())) return;
    setColumns([...columns, newColName.trim()]);
    setNewColName('');
  };

  const handleAddRow = () => {
    const nextStep = traceRows.length + 1;
    const newRow: TraceTableRow = {
      step: nextStep,
      description: `Bước chạy ${nextStep}`,
      variables: {},
    };
    columns.forEach((c) => {
      newRow.variables[c] = '';
    });
    setTraceRows([...traceRows, newRow]);
  };

  const handleCellChange = (rowIdx: number, col: string, val: string) => {
    const updated = [...traceRows];
    updated[rowIdx].variables[col] = val;
    setTraceRows(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stopwatch */}
      <div className="p-4 bg-sumi-900 border border-sumi-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="rose">科目B・アルゴリズム</Badge>
            <Badge variant="blue">IPA 擬似言語</Badge>
          </div>
          <h2 className="text-base font-bold text-sumi-100">
            Xưởng Luyện Thuật Toán & Bảng Nháp Trace Table Kỹ Thuật Số
          </h2>
          <p className="text-xs text-sumi-400">
            Môn B có 16 câu thuật toán. Thời gian tiêu chuẩn: 6 - 8 phút/câu. Sử dụng bảng trace để theo dõi giá trị biến số.
          </p>
        </div>

        {/* Stopwatch Widget */}
        <div className="flex items-center gap-3 bg-sumi-950 p-2.5 px-4 rounded-lg border border-sumi-700 shrink-0">
          <Timer size={18} className={isTimerRunning ? 'text-rose-400 animate-pulse' : 'text-sumi-400'} />
          <div className="text-right">
            <span className="text-[10px] text-sumi-400 block font-mono">Đồng hồ đếm ngược:</span>
            <span
              className={`font-mono text-xl font-bold ${
                timerSeconds < 120 ? 'text-rose-400' : (timerSeconds < 300 ? 'text-amber-400' : 'text-emerald-400')
              }`}
            >
              {formatTimer(timerSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant={isTimerRunning ? 'danger' : 'primary'}
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(8 * 60);
              }}
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPresetId(preset.id)}
            className={`text-xs px-3 py-2 rounded-md font-medium whitespace-nowrap border transition-all ${
              selectedPresetId === preset.id
                ? 'bg-blue-950/80 border-blue-500 text-blue-200'
                : 'bg-sumi-900 border-sumi-800 text-sumi-400 hover:text-sumi-200 hover:border-sumi-700'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Code & Traps on Left, Interactive Trace Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Pseudo-code & IPA Traps */}
        <div className="lg:col-span-5 space-y-4">
          <BentoCard
            title={activePreset.name}
            subtitle={`${activePreset.category} | Thời gian: ${activePreset.complexityTime}`}
            badge={<Badge variant="slate">{activePreset.complexitySpace}</Badge>}
          >
            <div className="space-y-3 mt-1">
              {/* Pseudo-code block */}
              <div className="bg-sumi-950 border border-sumi-800 rounded p-3 font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto whitespace-pre">
                {activePreset.pseudoCode}
              </div>

              {/* Traps guide */}
              <div className="p-3 bg-rose-950/30 border border-rose-800/60 rounded text-xs space-y-1.5">
                <strong className="text-rose-300 flex items-center gap-1.5 font-semibold">
                  <AlertTriangle size={14} /> Cạm bẫy IPA hay lừa:
                </strong>
                <ul className="list-disc list-inside text-sumi-300 space-y-1 text-[11px]">
                  {activePreset.commonTraps.map((trap, idx) => (
                    <li key={idx}>{trap}</li>
                  ))}
                </ul>
              </div>
            </div>
          </BentoCard>

          {/* IPA Syntax Cheat Sheet */}
          <BentoCard title="📌 Cẩm Nang Ký Hiệu Ngôn Ngữ Giả IPA">
            <div className="text-xs space-y-2 mt-1">
              <div className="flex justify-between py-1 border-b border-sumi-800">
                <span className="font-mono text-blue-400">x ← y</span>
                <span className="text-sumi-300">Gán giá trị của y cho x</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sumi-800">
                <span className="font-mono text-blue-400">x = y / x ≠ y</span>
                <span className="text-sumi-300">So sánh bằng / So sánh khác</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sumi-800">
                <span className="font-mono text-rose-400">arr[1]</span>
                <span className="text-sumi-300">Mảng bắt đầu từ vị trí 1 (Mặc định IPA)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-mono text-amber-400">div / mod</span>
                <span className="text-sumi-300">Chia lấy phần nguyên / Chia lấy dư</span>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Right Col: Interactive Trace Table Scratchpad */}
        <div className="lg:col-span-7 space-y-4">
          <BentoCard
            title="Bảng Nháp Trace Table Tương Tác"
            subtitle="Mô phỏng bảng mica phòng thi Prometric - Gõ giá trị từng bước"
            action={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleAddRow} className="text-xs">
                  <Plus size={14} /> Thêm bước chạy
                </Button>
              </div>
            }
          >
            <div className="space-y-3 mt-1">
              {/* Add Custom Column input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Thêm tên biến (ví dụ: temp, flag, count)..."
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                  className="bg-sumi-950 border border-sumi-700 text-xs rounded px-2.5 py-1 text-sumi-100 focus:outline-none focus:border-blue-500 w-48"
                />
                <Button variant="secondary" size="sm" onClick={handleAddColumn} className="text-xs">
                  Thêm cột
                </Button>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-sumi-800 rounded-lg">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sumi-800 bg-sumi-950 text-sumi-300 font-mono">
                      <th className="py-2 px-2.5 w-12 text-center">Bước</th>
                      <th className="py-2 px-2.5 min-w-[120px]">Mô tả thao tác</th>
                      {columns.map((col) => (
                        <th key={col} className="py-2 px-2 text-center font-bold text-blue-300 min-w-[60px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sumi-800/60 font-mono">
                    {traceRows.map((row, rIdx) => (
                      <tr key={row.step} className="hover:bg-sumi-850/40">
                        <td className="py-2 px-2.5 text-center text-sumi-500 font-bold">{row.step}</td>
                        <td className="py-2 px-2.5">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) => {
                              const updated = [...traceRows];
                              updated[rIdx].description = e.target.value;
                              setTraceRows(updated);
                            }}
                            className="w-full bg-transparent border-none text-[11px] text-sumi-300 focus:outline-none font-sans"
                          />
                        </td>
                        {columns.map((col) => (
                          <td key={col} className="py-1 px-1 text-center">
                            <input
                              type="text"
                              value={row.variables[col] ?? ''}
                              onChange={(e) => handleCellChange(rIdx, col, e.target.value)}
                              className="w-full bg-sumi-950/80 border border-sumi-800 text-center text-xs py-1 text-emerald-400 font-bold focus:outline-none focus:border-blue-500 rounded"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-sumi-500">
                💡 <strong>Mẹo phòng thi:</strong> Khi vẽ bảng trace trên bảng mica của Prometric, hãy viết thật gọn (chỉ viết chữ cái đầu của biến: i, j, m) để không bị hết diện tích bảng viết.
              </p>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
