import React, { useState } from 'react';
import { BentoCard } from '../../shared/components/BentoCard';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { ApiKeyConnection, UserSettings } from '../../shared/types';
import { Download, Upload, RefreshCw, FileSpreadsheet } from 'lucide-react';

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
  const [pinInput, setPinInput] = useState<string>(settings.pin);
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(settings.isPinEnabled);
  const [activeModel, setActiveModel] = useState<string>(settings.activeModel);

  const handleSavePin = () => {
    onUpdateSettings({
      ...settings,
      pin: pinInput,
      isPinEnabled,
      activeModel,
    });
    alert('✅ Đã lưu cài đặt bảo mật và Model!');
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
      {/* 6 Gemini Keys Manager */}
      <BentoCard
        title="Quản Lý 6 Gemini API Keys (Omniroute Integration)"
        subtitle="Hệ thống tự động failover tuần tự khi một key gặp lỗi 429 Quota Exceeded"
        badge={<Badge variant="emerald">6 Keys Ready</Badge>}
      >
        <div className="space-y-3 mt-2">
          {apiKeys.map((k, idx) => (
            <div
              key={k.id}
              className="p-3 bg-sumi-850 border border-sumi-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sumi-400">#{idx + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sumi-100 font-mono">{k.name}</strong>
                    <Badge variant={k.status === 'active' ? 'emerald' : 'rose'}>
                      {k.status === 'active' ? 'Hoạt động' : 'Hết hạn mức (429)'}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-sumi-400 font-mono">
                    Khóa: {k.key ? `${k.key.slice(0, 8)}••••••••${k.key.slice(-4)}` : '(Chưa điền)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleKeyStatus(k.id)}
                  className="text-[11px]"
                >
                  <RefreshCw size={12} /> {k.status === 'active' ? 'Đặt 429' : 'Kích hoạt lại'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Security & PIN Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoCard title="Bảo Mật Truy Cập & Mã PIN" subtitle="Bảo vệ dữ liệu học tập khi triển khai web lên mạng">
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

            <div>
              <label className="block text-sumi-400 mb-1">Mã PIN bảo vệ (Mặc định: 2026):</label>
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={8}
                className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 font-mono font-bold tracking-widest text-center text-sm rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sumi-400 mb-1">Model Gemini ưu tiên:</label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full bg-sumi-950 border border-sumi-700 text-sumi-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="gemini-2.5-flash">Gemini 3.8 Flash high (Siêu nhanh, OCR chuẩn tiếng Nhật)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Suy luận sâu thuật toán)</option>
              </select>
            </div>

            <Button variant="primary" size="md" className="w-full" onClick={handleSavePin}>
              Lưu Cài Đặt Bảo Mật
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
