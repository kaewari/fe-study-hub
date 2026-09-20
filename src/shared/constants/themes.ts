import { AppTheme } from '../types';

export interface ThemeOption {
  id: AppTheme;
  name: string;
  jpName: string;
  description: string;
  category: 'Japanese' | 'Modern Dark' | 'Pastel' | 'Minimalist';
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
    preview: {
      canvas: '#0b0d10',
      surface: '#161b22',
      border: '#222933',
      accent: '#3b82f6',
      text: '#f1f5f9',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    jpName: '東京の夜 (Ánh đèn Shinjuku)',
    description: 'Gam màu xanh đêm Tokyo rực rỡ, độ tương phản sắc nét, cân bằng hoàn hảo cho các buổi cày đêm.',
    category: 'Japanese',
    preview: {
      canvas: '#16161e',
      surface: '#1f2335',
      border: '#2f3549',
      accent: '#7aa2f7',
      text: '#c0caf5',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    jpName: 'カプチーノ (Pastel xoa dịu mắt)',
    description: 'Theme được cộng đồng lập trình viên yêu thích nhất thế giới với tông màu pastel êm dịu, ấm áp.',
    category: 'Pastel',
    preview: {
      canvas: '#11111b',
      surface: '#1e1e2e',
      border: '#313244',
      accent: '#cba6f7',
      text: '#f5e0dc',
    },
  },
  {
    id: 'nord',
    name: 'Nord Arctic',
    jpName: '極北の冷気 (Băng tuyết tối giản)',
    description: 'Bảng màu xanh băng Bắc Cực tĩnh lặng, giúp tập trung tối đa tư duy giải thuật toán môn B.',
    category: 'Minimalist',
    preview: {
      canvas: '#242933',
      surface: '#3b4252',
      border: '#434c5e',
      accent: '#88c0d0',
      text: '#eceff4',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    jpName: 'ドラキュラ (Tương phản cao)',
    description: 'Theme huyền thoại với độ tương phản cao, tím neon và xanh neon giúp nhận diện mã giả IPA tức thì.',
    category: 'Modern Dark',
    preview: {
      canvas: '#1e1f29',
      surface: '#343746',
      border: '#44475a',
      accent: '#bd93f9',
      text: '#f8f8f2',
    },
  },
  {
    id: 'rose-pine',
    name: 'Rosé Pine',
    jpName: 'ロゼ・パイン (Gỗ thông & Soho)',
    description: 'Tông màu gỗ thông tự nhiên kết hợp ánh hồng hoàng hôn ấm cúng, đậm chất thẩm mỹ Zen.',
    category: 'Modern Dark',
    preview: {
      canvas: '#14121d',
      surface: '#1f1d2e',
      border: '#26233a',
      accent: '#ebbcba',
      text: '#f4ede8',
    },
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark Dimmed',
    jpName: 'ギットハブ (Chuẩn Kỹ Sư)',
    description: 'Giao diện quen thuộc của GitHub Dimmed, thân thuộc và chuyên nghiệp cho mọi developer.',
    category: 'Minimalist',
    preview: {
      canvas: '#1c2128',
      surface: '#2d333b',
      border: '#373e47',
      accent: '#539bf5',
      text: '#cdd9e5',
    },
  },
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    jpName: 'ワン・ダーク (Huyền thoại Atom/VSCode)',
    description: 'Bảng màu chuẩn mực kinh điển hàng chục triệu lượt cài đặt, màu sắc hài hòa dễ chịu.',
    category: 'Modern Dark',
    preview: {
      canvas: '#1e2227',
      surface: '#282c34',
      border: '#353b45',
      accent: '#61afef',
      text: '#ffffff',
    },
  },
];
