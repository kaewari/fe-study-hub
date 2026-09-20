import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { verifyPassword } from '../../shared/utils/crypto';

interface PinLockScreenProps {
  correctPin: string;
  onUnlocked: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  onUnlocked,
}) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [remember30Days, setRemember30Days] = useState<boolean>(true);

  const checkPin = async (candidate: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      const isValid = await verifyPassword(candidate, correctPin);
      if (isValid) {
        if (remember30Days) {
          localStorage.setItem('fe_pin_unlocked_until', (Date.now() + 30 * 86400000).toString());
        }
        onUnlocked();
      } else {
        setError(true);
        setEnteredPin('');
      }
    } catch {
      setError(true);
      setEnteredPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (isVerifying || enteredPin.length >= 8) return;
    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);
    setError(false);

    // Auto-check on 4 or more digits
    if (nextPin.length >= 4) {
      checkPin(nextPin);
    }
  };

  const handleDelete = () => {
    if (isVerifying) return;
    setEnteredPin(enteredPin.slice(0, -1));
    setError(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin || isVerifying) return;
    checkPin(enteredPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sumi-950 p-4">
      <div className="w-full max-w-sm bg-sumi-900 border border-sumi-800 rounded-xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="p-3 bg-sumi-850 rounded-full border border-sumi-700 text-blue-400">
          <Lock size={28} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-sumi-100">FE Study Hub Security Lock</h2>
          <p className="text-xs text-sumi-400 mt-1">
            Vui lòng nhập mã PIN bảo mật để truy cập dữ liệu học tập cá nhân.
          </p>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex items-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full border transition-all ${
                enteredPin.length > idx
                  ? 'bg-[var(--theme-accent,#3b82f6)] border-[var(--theme-accent,#3b82f6)]'
                  : 'bg-sumi-800 border-sumi-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium">
            Mã PIN không chính xác. Mặc định là 2026.
          </p>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleDigit(n)}
              className="h-12 bg-sumi-850 hover:bg-sumi-800 border border-sumi-700 text-sumi-100 font-mono text-lg font-bold rounded transition-transform active:scale-95"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 bg-sumi-850 hover:bg-sumi-800 border border-sumi-700 text-sumi-400 text-xs font-mono rounded transition-transform active:scale-95"
          >
            Xóa
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 bg-sumi-850 hover:bg-sumi-800 border border-sumi-700 text-sumi-100 font-mono text-lg font-bold rounded transition-transform active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={isVerifying}
            className="h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono rounded transition-transform active:scale-95 flex items-center justify-center"
          >
            {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-sumi-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember30Days}
            onChange={(e) => setRemember30Days(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-blue-500 focus:ring-0"
          />
          <span>Ghi nhớ thiết bị này trong 30 ngày</span>
        </label>
      </div>
    </div>
  );
};
