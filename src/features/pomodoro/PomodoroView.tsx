import React, { useState, useEffect } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroViewProps {
  workMinutes?: number;
  breakMinutes?: number;
  onLogStudyMinutes?: (minutes: number) => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  workMinutes = 25,
  breakMinutes = 5,
  onLogStudyMinutes,
}) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(workMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const playSynthesizedChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio context not allowed or supported');
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSynthesizedChime();

      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
        if (onLogStudyMinutes) onLogStudyMinutes(workMinutes);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        setMode('break');
        setTimeLeft(breakMinutes * 60);
      } else {
        setMode('work');
        setTimeLeft(workMinutes * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workMinutes, breakMinutes, onLogStudyMinutes]);

  const toggleRunning = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft((mode === 'work' ? workMinutes : breakMinutes) * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalSeconds = (mode === 'work' ? workMinutes : breakMinutes) * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BentoCard
        title="🍅 Đồng Hồ Tập Trung Pomodoro"
        subtitle="Phương pháp quả cà chua 25 phút học / 5 phút nghỉ"
        badge={
          <Badge variant={mode === 'work' ? 'rose' : 'emerald'}>
            {mode === 'work' ? 'TẬP TRUNG HỌC' : 'NGHỈ NGƠI'}
          </Badge>
        }
      >
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          {/* Circular Progress Display */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-sumi-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-300 ${mode === 'work' ? 'stroke-rose-500' : 'stroke-emerald-500'}`}
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-mono font-bold text-sumi-100">{timeFormatted}</span>
              <span className="text-xs font-mono text-sumi-400 mt-1">
                {mode === 'work' ? 'Tập trung đọc sách' : 'Nghỉ giải lao'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={isRunning ? 'danger' : 'primary'}
              size="lg"
              className="w-32 font-bold"
              icon={isRunning ? <Pause size={18} /> : <Play size={18} />}
              onClick={toggleRunning}
            >
              {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
            </Button>
            <Button variant="outline" size="lg" icon={<RotateCcw size={18} />} onClick={handleReset}>
              Đặt lại
            </Button>
          </div>

          {/* Mode Switcher & Stats */}
          <div className="w-full pt-4 border-t border-sumi-800 flex items-center justify-between text-xs text-sumi-400">
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-amber-400" />
              <span>Đã hoàn thành: <strong className="text-sumi-100 font-mono">{completedSessions}</strong> quả cà chua</span>
            </div>
            <span className="font-mono text-[11px] text-blue-400">
              +{completedSessions * workMinutes} phút học
            </span>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
