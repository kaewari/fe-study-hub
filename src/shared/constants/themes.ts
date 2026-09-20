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
    name: 'Sumi & Slate',
    jpName: '墨 & スレート (Mặc định)',
    description: 'Phong cách mực tàu truyền thống Nhật Bản & xám than kỹ sư. Chống mỏi mắt tuyệt đối.',
    category: 'Japanese',
    mode: 'dark',
    preview: {
      canvas: '#0d1117',
      surface: '#161b22',
      border: '#30363d',
      accent: '#38bdf8',
      text: '#f0f6fc',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Neon Night',
    jpName: '東京の夜 (Ánh đèn Shinjuku)',
    description: 'Gam màu xanh đêm Tokyo rực rỡ với tím neon Shinjuku, độ tương phản sắc sảo.',
    category: 'Japanese',
    mode: 'dark',
    preview: {
      canvas: '#0f111a',
      surface: '#1a1c2e',
      border: '#2f3549',
      accent: '#7aa2f7',
      text: '#c0caf5',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    jpName: 'サイバーパンク (Neon Tương Lai)',
    description: 'Đêm công nghệ cao tương lai, điểm nhấn vàng neon & cyan rực sáng trên nền đen huyền ảo.',
    category: 'Cyberpunk',
    mode: 'dark',
    preview: {
      canvas: '#0c0d14',
      surface: '#151624',
      border: '#2a2c42',
      accent: '#fcee0a',
      text: '#e2e8f0',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula High-Contrast',
    jpName: 'ドラキュラ (Tương phản cao)',
    description: 'Theme huyền thoại với độ tương phản cao, tím neon và xanh neon giúp nhận diện mã giả IPA tức thì.',
    category: 'Modern Dark',
    mode: 'dark',
    preview: {
      canvas: '#191824',
      surface: '#242338',
      border: '#3e3b5e',
      accent: '#bd93f9',
      text: '#f8f8f2',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    jpName: 'カプチーノ (Pastel xoa dịu)',
    description: 'Theme được cộng đồng lập trình viên yêu thích nhất thế giới với tông màu pastel êm dịu, ấm áp.',
    category: 'Pastel',
    mode: 'dark',
    preview: {
      canvas: '#181825',
      surface: '#24273a',
      border: '#363a4f',
      accent: '#f5c2e7',
      text: '#cdd6f4',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura Paper Light',
    jpName: '桜 (Sáng Thanh Lịch)',
    description: 'Tone giấy Washi Nhật Bản ấm áp, chữ đen sắc nét, điểm xuyết hoa anh đào hồng thắm thanh khiết.',
    category: 'Light & Clean',
    mode: 'light',
    preview: {
      canvas: '#fcfbfa',
      surface: '#ffffff',
      border: '#e5e0d8',
      accent: '#e11d48',
      text: '#1e293b',
    },
  },
  {
    id: 'nord-light',
    name: 'Nord Snow Light',
    jpName: '北欧の雪 (Sáng Băng Bắc Cực)',
    description: 'Trắng tuyết băng hà Bắc Cực mát mẻ, xanh lam dương và xám thanh lịch, cực kỳ trong trẻo.',
    category: 'Light & Clean',
    mode: 'light',
    preview: {
      canvas: '#f4f6f9',
      surface: '#ffffff',
      border: '#d5e0ea',
      accent: '#0284c7',
      text: '#1e293b',
    },
  },
  {
    id: 'matcha',
    name: 'Matcha Zen',
    jpName: '抹茶 (Trà Xanh Dịu Mắt)',
    description: 'Tone kem ngà tự nhiên kết hợp xanh trà tĩnh tại, bảo vệ mắt và mang lại cảm giác bình yên khi học.',
    category: 'Light & Clean',
    mode: 'light',
    preview: {
      canvas: '#fbfaf6',
      surface: '#ffffff',
      border: '#dde5d4',
      accent: '#16a34a',
      text: '#14532d',
    },
  },
];
