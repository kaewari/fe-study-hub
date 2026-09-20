import { AppTheme } from '../types';

export interface ThemeOption {
  id: AppTheme;
  name: string;
  jpName: string;
  description: string;
  category: 'Japanese' | 'Modern Dark' | 'Cyberpunk' | 'Pastel' | 'Light & Clean';
  mode: 'dark' | 'light';
  preview: {
    canvas: string;
    surface: string;
    border: string;
    accent: string;
    text: string;
  };
}

export const THEMES_LIST: ThemeOption[] = [
  {
    id: 'sumi',
    name: 'Sumi & Cobalt',
    jpName: '墨 & コバルト (Mặc định)',
    description: 'Mực tàu truyền thống Nhật Bản & xanh thép kỹ sư. Tối giản, tập trung cao độ, chống mỏi mắt.',
    category: 'Japanese',
    mode: 'dark',
    preview: {
      canvas: '#0a0d14',
      surface: '#121722',
      border: '#232c3d',
      accent: '#3b82f6',
      text: '#f1f5f9',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Twilight',
    jpName: '東京の夕暮れ (Tím chàm sâu)',
    description: 'Chàm đêm Tokyo tĩnh lặng điểm xuyết tím lavender êm dịu, tương phản dễ chịu cho mắt.',
    category: 'Japanese',
    mode: 'dark',
    preview: {
      canvas: '#0b0e17',
      surface: '#141828',
      border: '#252b45',
      accent: '#818cf8',
      text: '#e0e7ff',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Obsidian & Amber',
    jpName: '黒曜石 & 琥珀 (Đen Kỹ thuật)',
    description: 'Đen nhám kỹ thuật cao với điểm nhấn vàng hổ phách chuẩn thiết bị đo đạc, loại bỏ hoàn toàn neon chói.',
    category: 'Cyberpunk',
    mode: 'dark',
    preview: {
      canvas: '#09090b',
      surface: '#141417',
      border: '#27272a',
      accent: '#f59e0b',
      text: '#f4f4f5',
    },
  },
  {
    id: 'dracula',
    name: 'Deep Amethyst',
    jpName: '紫水晶 (Thạch anh tím)',
    description: 'Tone tím than thạch anh quý phái với điểm nhấn violet dịu nhẹ, sắc nét mà không gắt.',
    category: 'Modern Dark',
    mode: 'dark',
    preview: {
      canvas: '#0f0d17',
      surface: '#191626',
      border: '#2e2942',
      accent: '#a855f7',
      text: '#f5f3ff',
    },
  },
  {
    id: 'catppuccin',
    name: 'Mocha & Rosewater',
    jpName: 'モカ & ローズ (Espresso êm)',
    description: 'Cà phê mocha ấm áp kết hợp gam hồng đất mộc mạc, mang lại cảm giác dễ chịu khi ôn thi đêm.',
    category: 'Pastel',
    mode: 'dark',
    preview: {
      canvas: '#14121a',
      surface: '#1f1c29',
      border: '#322e42',
      accent: '#f472b6',
      text: '#fdf2f8',
    },
  },
  {
    id: 'sakura',
    name: 'Washi Paper & Crimson',
    jpName: '和紙 & 紅 (Giấy Dó & Chu Sa)',
    description: 'Nền giấy dó Nhật Bản ấm áp, mực in than sắc sảo, điểm xuyết sắc đỏ chu sa thanh khiết.',
    category: 'Light & Clean',
    mode: 'light',
    preview: {
      canvas: '#faf9f5',
      surface: '#ffffff',
      border: '#e7e5dc',
      accent: '#e11d48',
      text: '#1c1917',
    },
  },
  {
    id: 'nord-light',
    name: 'Nordic Frost',
    jpName: '北欧の霜 (Sương Băng Bắc Âu)',
    description: 'Trắng sương tuyết Bắc Âu thanh sạch, chữ xanh đen rõ nét cùng điểm nhấn xanh băng mát mắt.',
    category: 'Light & Clean',
    mode: 'light',
    preview: {
      canvas: '#f8fafc',
      surface: '#ffffff',
      border: '#e2e8f0',
      accent: '#0284c7',
      text: '#0f172a',
    },
  },
  {
    id: 'matcha',
    name: 'Matcha Studio',
    jpName: '抹茶スタジオ (Trà Xanh Tĩnh)',
    description: 'Nền ngà thảo mộc tự nhiên kết hợp xanh trà sencha tĩnh tại, bảo vệ mắt tuyệt đối.',
    category: 'Light & Clean',
    mode: 'light',
    preview: {
      canvas: '#fbfbf7',
      surface: '#ffffff',
      border: '#e2e8d8',
      accent: '#16a34a',
      text: '#14532d',
    },
  },
];
