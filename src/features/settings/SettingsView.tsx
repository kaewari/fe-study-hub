import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { ApiKeyConnection, UserSettings } from '../../shared/types';
import {
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Key,
} from 'lucide-react';
import { THEMES_LIST } from '../../shared/constants/themes';
import { hashPassword, isPasswordHashed } from '../../shared/utils/crypto';

interface SettingsViewProps {
  apiKeys: ApiKeyConnection[];
  settings: UserSettings;
  onUpdateApiKeys: (keys: ApiKeyConnection[]) => void;
  onUpdateSettings: (settings: UserSettings) => void;
  onExportExcel: () => void;
  onExportJson: () => void;
  onImportJson: (jsonData: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  apiKeys,
  settings,
  onUpdateApiKeys,
  onUpdateSettings,
  onExportExcel,
  onExportJson,
  onImportJson,
}) => {
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(settings.isPinEnabled);
  const [activeModel, setActiveModel] = useState<string>(settings.activeModel);
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [isPinSaving, setIsPinSaving] = useState<boolean>(false);

  // API Key Visibility & In-place Edit
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [editKeyInput, setEditKeyInput] = useState<string>('');

  const toggleRevealKey = (keyId: string) => {
    setRevealedKeyIds((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleStartEditKey = (k: ApiKeyConnection) => {
    setEditingKeyId(k.id);
    setEditKeyInput(k.key);
  };

  const handleSaveEditKey = (keyId: string) => {
    const updated = apiKeys.map((k) => {
      if (k.id === keyId) {
        return {
          ...k,
          key: editKeyInput.trim(),
          status: (k.status === 'exhausted_429' && editKeyInput.trim() ? 'active' : k.status) as 'active' | 'exhausted_429',
        };
      }
      return k;
    });
    onUpdateApiKeys(updated);
    setEditingKeyId(null);
    setEditKeyInput('');
  };

  const handleSaveSecurity = async () => {
    if (newPinInput) {
      if (newPinInput.length < 4 || newPinInput.length > 8) {
        alert('Mã PIN phải từ 4 đến 8 chữ số.');
        return;
      }
      if (newPinInput !== confirmPinInput) {
        alert('Mã PIN xác nhận không trùng khớp.');
        return;
      }
      setIsPinSaving(true);
      try {
        const hashed = await hashPassword(newPinInput);
        onUpdateSettings({
          ...settings,
          pin: hashed,
          isPinEnabled,
          activeModel,
        });
        setNewPinInput('');
        setConfirmPinInput('');
        alert('Đã cập nhật và mã hóa mã PIN bằng PBKDF2-SHA256!');
      } finally {
        setIsPinSaving(false);
      }
    } else {
      onUpdateSettings({
        ...settings,
        isPinEnabled,
        activeModel,
      });
      alert('Đã lưu cài đặt bảo mật và Model!');
    }
  };

  const handleToggleKeyStatus = (keyId: string) => {
    const updated = apiKeys.map((k) => {
      if (k.id === keyId) {
        return {
          ...k,
          status: (k.status === 'active' ? 'exhausted_429' : 'active') as 'active' | 'exhausted_429',
        };
      }
      return k;
    });
    onUpdateApiKeys(updated);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImportJson(reader.result as string);
        alert('✅ Đã nhập dữ liệu sao lưu thành công!');
      } catch (err: any) {
        alert(`Lỗi đọc file JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Theme Selector Bento Card */}
      <BentoCard
        title="Giao Diện & Màu Sắc Hệ Thống (Theme Engine)"
        subtitle="Hệ thống 8 theme màu tinh tế (5 Theme Tối & 3 Theme Sáng) tối ưu cho học tập và chống mỏi mắt"
        badge={
          <Badge variant="accent" dot>
            {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.name || 'Sumi & Cobalt'}
          </Badge>
        }
      >
        {/* Dark Themes Group */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-sumi-200 tracking-wider uppercase flex items-center gap-1.5">
              Chế Độ Tối (Dark Themes - Chống Mỏi Mắt)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {THEMES_LIST.filter((t) => t.mode === 'dark').map((th) => {
              const isSelected = (settings.theme || 'sumi') === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: th.id })}
                  className={`p-3 rounded-lg border text-left transition-colors relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--theme-accent,#3b82f6)] bg-sumi-850 ring-1 ring-[var(--theme-accent,#3b82f6)]'
                      : 'border-sumi-800 bg-sumi-900/60 hover:bg-sumi-850 hover:border-sumi-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-xs text-sumi-100">{th.name}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[var(--theme-accent,#3b82f6)] text-white flex items-center justify-center shrink-0">
                          <Check size={10} />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-sumi-400 block mb-2">{th.jpName}</span>
                    <p className="text-[11px] text-sumi-300 leading-tight mb-3 line-clamp-2">
                      {th.description}
                    </p>
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-sumi-950 border border-sumi-800/80 shrink-0">
                    <div className="w-3.5 h-3.5 rounded-xs border border-white/10 shrink-0" style={{ backgroundColor: th.preview.canvas }} title="Canvas" />
                    <div className="w-3.5 h-3.5 rounded-xs border border-white/10 shrink-0" style={{ backgroundColor: th.preview.surface }} title="Surface" />
                    <div className="w-3.5 h-3.5 rounded-xs border border-white/10 shrink-0" style={{ backgroundColor: th.preview.accent }} title="Accent" />
                    <span className="text-[9px] font-mono text-sumi-400 ml-auto uppercase">{th.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Light Themes Group */}
        <div className="mt-5 pt-4 border-t border-sumi-800/60">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-sumi-200 tracking-wider uppercase flex items-center gap-1.5">
              Chế Độ Sáng (Light Themes - Sáng Thanh Khiết & Thanh Lịch)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEMES_LIST.filter((t) => t.mode === 'light').map((th) => {
              const isSelected = (settings.theme || 'sumi') === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: th.id })}
                  className={`p-3 rounded-lg border text-left transition-colors relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--theme-accent,#3b82f6)] bg-sumi-850 ring-1 ring-[var(--theme-accent,#3b82f6)]'
                      : 'border-sumi-800 bg-sumi-900/60 hover:bg-sumi-850 hover:border-sumi-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-xs text-sumi-100">{th.name}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[var(--theme-accent,#3b82f6)] text-white flex items-center justify-center shrink-0">
                          <Check size={10} />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-sumi-400 block mb-2">{th.jpName}</span>
                    <p className="text-[11px] text-sumi-300 leading-tight mb-3">
                      {th.description}
                    </p>
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-sumi-950 border border-sumi-800/80 shrink-0">
                    <div className="w-3.5 h-3.5 rounded-xs border border-white/10 shrink-0" style={{ backgroundColor: th.preview.canvas }} title="Canvas" />
                    <div className="w-3.5 h-3.5 rounded-xs border border-white/10 shrink-0" style={{ backgroundColor: th.preview.surface }} title="Surface" />
                    <div className="w-3.5 h-3.5 rounded-xs border border-white/10 shrink-0" style={{ backgroundColor: th.preview.accent }} title="Accent" />
                    <span className="text-[9px] font-mono text-sumi-400 ml-auto uppercase">{th.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </BentoCard>

      {/* 6 Gemini Keys Manager */}
      <BentoCard
        title="Quản Lý 6 Gemini API Keys (Omniroute Integration)"
        subtitle="Hệ thống tự động failover tuần tự khi gặp lỗi 429. Toàn bộ API Key được mã hóa AES-256-GCM khi lưu trữ."
        badge={
          <Badge variant="emerald">
            <ShieldCheck size={12} className="mr-1 inline" /> AES-256-GCM Encrypted
          </Badge>
        }
      >
        <div className="space-y-3 mt-2">
          {apiKeys.map((k, idx) => (
            <div
              key={k.id}
              className="p-3 bg-sumi-850 border border-sumi-800 rounded-md flex flex-col gap-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sumi-400">#{idx + 1}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sumi-100 font-mono">{k.name}</strong>
                      <Badge variant={k.status === 'active' ? 'emerald' : 'rose'}>
                        {k.status === 'active' ? 'Hoạt động' : 'Hết hạn mức (429)'}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-sumi-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <span>Khóa:</span>
                      {k.key ? (
                        <span className="text-sumi-200">
                          {revealedKeyIds[k.id]
                            ? k.key
                            : `${k.key.slice(0, 8)}••••••••${k.key.slice(-4)}`}
                        </span>
                      ) : (
                        <span className="text-sumi-500 italic">(Chưa thiết lập)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {k.key && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRevealKey(k.id)}
                      className="text-[11px]"
                      title={revealedKeyIds[k.id] ? 'Ẩn khóa' : 'Xem khóa'}
                    >
                      {revealedKeyIds[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                      <span className="ml-1">{revealedKeyIds[k.id] ? 'Ẩn' : 'Hiện'}</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (editingKeyId === k.id ? setEditingKeyId(null) : handleStartEditKey(k))}
                    className="text-[11px]"
                  >
                    <Key size={12} />
                    <span className="ml-1">{editingKeyId === k.id ? 'Đóng' : 'Sửa Key'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleKeyStatus(k.id)}
                    className="text-[11px]"
                  >
                    <RefreshCw size={12} />
                    <span className="ml-1">{k.status === 'active' ? 'Đặt 429' : 'Kích hoạt'}</span>
                  </Button>
                </div>
              </div>

              {/* Inline edit box */}
              {editingKeyId === k.id && (
                <div className="pt-2 border-t border-sumi-800 flex items-center gap-2">
                  <input
                    type="password"
                    value={editKeyInput}
                    onChange={(e) => setEditKeyInput(e.target.value)}
                    placeholder="Dán mã Gemini API Key mới (AIzaSy...)"
                    className="flex-1 bg-sumi-950 border border-sumi-700 text-sumi-100 font-mono text-xs rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveEditKey(k.id)}
                    className="text-[11px]"
                  >
                    <Check size={12} /> Lưu & Mã hóa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingKeyId(null)}
                    className="text-[11px]"
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Security & PIN Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoCard
          title="Bảo Mật Truy Cập & Mã PIN"
          subtitle="Bảo vệ dữ liệu học tập cá nhân. Mã PIN được mã hóa một chiều bằng PBKDF2-SHA256 với Salt 128-bit."
          badge={
            <Badge variant="blue">
              <Lock size={12} className="mr-1 inline" /> PBKDF2-SHA256 Salted
            </Badge>
          }
        >
          <div className="space-y-4 mt-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-sumi-850 border border-sumi-800 rounded">
              <div>
                <span className="font-semibold text-sumi-200 block">Kích hoạt khóa mã PIN</span>
                <span className="text-[11px] text-sumi-400">Yêu cầu nhập PIN khi mở web</span>
              </div>
              <input
                type="checkbox"
                checked={isPinEnabled}
                onChange={(e) => setIsPinEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-sumi-900 border border-sumi-800 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sumi-300">Trạng thái mã PIN hiện tại:</span>
                <Badge variant={isPasswordHashed(settings.pin) ? 'emerald' : 'blue'}>
                  {isPasswordHashed(settings.pin) ? 'Đã băm PBKDF2 an toàn' : 'Mặc định (2026)'}
                </Badge>
              </div>

              <div>
                <label className="block text-sumi-400 mb-1">Đổi mã PIN mới (4 - 8 chữ số):</label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  maxLength={8}
                  placeholder="Để trống nếu không muốn đổi PIN"
                  className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 font-mono text-center text-sm rounded px-3 py-2 tracking-widest focus:outline-none focus:border-blue-500"
                />
              </div>

              {newPinInput.length > 0 && (
                <div>
                  <label className="block text-sumi-400 mb-1">Xác nhận lại mã PIN mới:</label>
                  <input
                    type="password"
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    placeholder="Nhập lại mã PIN mới"
                    className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 font-mono text-center text-sm rounded px-3 py-2 tracking-widest focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sumi-400 mb-1">Model Gemini ưu tiên:</label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Khuyên dùng - Siêu nhanh, tiếng Nhật chuẩn)</option>
                <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                <option value="gemini-flash-latest">Gemini Flash Latest</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Suy luận sâu thuật toán)</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSaveSecurity}
              disabled={isPinSaving}
            >
              {isPinSaving ? 'Đang mã hóa & lưu...' : 'Lưu Cài Đặt Bảo Mật'}
            </Button>
          </div>
        </BentoCard>

        {/* Data Backup & Export */}
        <BentoCard title="Sao Lưu Dữ Liệu & Xuất File" subtitle="Đồng bộ đa thiết bị và lưu trữ an toàn">
          <div className="space-y-3 mt-2 text-xs">
            <div className="p-3 bg-sumi-850 border border-sumi-800 rounded space-y-2">
              <span className="font-semibold text-sumi-200 block">Xuất File Excel (.xlsx)</span>
              <p className="text-[11px] text-sumi-400">
                Xuất toàn bộ tiến độ, nhật ký học, bảng điểm và từ vựng thành file Excel 7 sheet.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-emerald-400 border-emerald-800/80"
                icon={<FileSpreadsheet size={16} />}
                onClick={onExportExcel}
              >
                Tải File Excel (.xlsx) Về Máy
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={14} />}
                onClick={onExportJson}
              >
                Sao lưu JSON
              </Button>
              <label className="inline-flex items-center justify-center font-medium rounded transition-all active:scale-[0.98] text-xs px-2.5 py-1.5 h-8 bg-sumi-850 hover:bg-sumi-800 text-sumi-100 border border-sumi-700 cursor-pointer gap-2">
                <Upload size={14} /> Khôi phục JSON
                <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </label>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
