import React, { useState, useMemo } from 'react';
import { StudyNoteItem, StudyNoteCategory } from '../../shared/types';
import { Button } from '../../shared/components/Button';
import {
  NotebookPen,
  Search,
  Plus,
  Pin,
  PinOff,
  Trash2,
  Edit3,
  Sparkles,
  Tag,
  Clock,
  Check,
  X,
  Code2,
  ShieldCheck,
  Cpu,
  FolderGit2,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

interface StudyNotesViewProps {
  notes: StudyNoteItem[];
  onAddNote: (note: StudyNoteItem) => void;
  onUpdateNote: (id: string, updates: Partial<StudyNoteItem>) => void;
  onDeleteNote: (id: string) => void;
  onAskAiAboutNote?: (note: StudyNoteItem) => void;
}

const CATEGORY_META: Record<
  StudyNoteCategory,
  { label: string; jp: string; icon: React.ReactNode; color: string }
> = {
  technology: {
    label: 'Công nghệ',
    jp: 'テクノロジ系',
    icon: <Cpu size={14} />,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  algorithm: {
    label: 'Thuật toán & Mã giả',
    jp: 'アルゴリズム (科目B)',
    icon: <Code2 size={14} />,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  security: {
    label: 'Bảo mật thông tin',
    jp: '情報セキュリティ',
    icon: <ShieldCheck size={14} />,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  management: {
    label: 'Quản lý dự án',
    jp: 'マネジメント系',
    icon: <FolderGit2 size={14} />,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  strategy: {
    label: 'Chiến lược kinh doanh',
    jp: 'ストラテジ系',
    icon: <TrendingUp size={14} />,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  other: {
    label: 'Mẹo phòng thi & Khác',
    jp: 'その他・試験対策',
    icon: <Lightbulb size={14} />,
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  },
};

export const StudyNotesView: React.FC<StudyNotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAskAiAboutNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StudyNoteCategory | 'all'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<StudyNoteCategory>('technology');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formPinned, setFormPinned] = useState(false);

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('technology');
    setFormContent('');
    setFormTags('');
    setFormPinned(false);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleStartEdit = (note: StudyNoteItem) => {
    setEditingId(note.id);
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormContent(note.content);
    setFormTags(note.tags.join(', '));
    setFormPinned(!!note.pinned);
    setIsCreating(false);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const now = new Date().toISOString();

    if (editingId) {
      onUpdateNote(editingId, {
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: parsedTags,
        pinned: formPinned,
        updatedAt: now,
      });
    } else {
      const newNote: StudyNoteItem = {
        id: `note-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: parsedTags,
        pinned: formPinned,
        createdAt: now,
        updatedAt: now,
      };
      onAddNote(newNote);
    }

    resetForm();
  };

  // Filter & Sort: Pinned first, then newest
  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return notes
      .filter((note) => {
        const matchesCat = selectedCategory === 'all' || note.category === selectedCategory;
        const matchesSearch =
          !q ||
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [notes, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-sumi-900 border border-sumi-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <NotebookPen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-sumi-100">
                Ghi Chú Học Tập & Tổng Hợp Lý Thuyết FE
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sumi-800 text-sumi-300 border border-sumi-700">
                {notes.length} ghi chú
              </span>
            </div>
            <p className="text-xs text-sumi-400 mt-0.5">
              Ghi lại các công thức, mẹo thi, bảng tra cứu, quy tắc mã giả IPA và hỏi AI Trợ giảng trực tiếp.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
        >
          Tạo ghi chú mới
        </Button>
      </div>

      {/* Editor Modal / Inline Form */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSaveNote}
          className="p-5 bg-sumi-900/90 border border-blue-500/30 rounded-xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-sumi-800 pb-3">
            <h3 className="text-sm font-semibold text-sumi-100 flex items-center gap-2">
              <Edit3 size={15} className="text-blue-400" />
              {editingId ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú học tập mới'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-sumi-400 hover:text-sumi-100 p-1 rounded hover:bg-sumi-800"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-sumi-400 mb-1 font-medium">Tiêu đề ghi chú:</label>
              <input
                type="text"
                required
                placeholder="VD: Quy tắc chỉ số mảng 1-based trong mã giả IPA..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-sumi-950 border border-sumi-700 text-xs rounded-lg px-3 py-2 text-sumi-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-sumi-400 mb-1 font-medium">Danh mục phân nhánh:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as StudyNoteCategory)}
                className="w-full bg-sumi-950 border border-sumi-700 text-xs rounded-lg px-3 py-2 text-sumi-100 focus:outline-none focus:border-blue-500"
              >
                {Object.entries(CATEGORY_META).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({val.jp})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-sumi-400 mb-1">
              <span className="font-medium">Nội dung chi tiết (hỗ trợ Markdown):</span>
              <span className="font-mono text-[11px]">{formContent.length} ký tự</span>
            </div>
            <textarea
              required
              rows={8}
              placeholder="Ghi chú công thức, phân tích lý thuyết, bảng tra cứu, mẹo giải đề..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full bg-sumi-950 border border-sumi-700 text-xs rounded-lg p-3 text-sumi-100 font-mono focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="md:col-span-2">
              <label className="block text-xs text-sumi-400 mb-1 font-medium">
                Thẻ từ khóa (Tags - cách nhau bởi dấu phẩy):
              </label>
              <input
                type="text"
                placeholder="VD: 擬似言語, 配列, 科目B, アルゴリズム"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="w-full bg-sumi-950 border border-sumi-700 text-xs rounded-lg px-3 py-2 text-sumi-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 md:pt-0">
              <label className="flex items-center gap-2 text-xs text-sumi-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formPinned}
                  onChange={(e) => setFormPinned(e.target.checked)}
                  className="rounded border-sumi-700 bg-sumi-950 text-blue-500 focus:ring-0"
                />
                <Pin size={14} className={formPinned ? 'text-amber-400' : 'text-sumi-500'} />
                <span>Ghim lên đầu trang</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-sumi-800">
            <Button variant="ghost" size="sm" onClick={resetForm} type="button">
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<Check size={14} />}>
              {editingId ? 'Cập nhật ghi chú' : 'Lưu ghi chú'}
            </Button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-sumi-900 border border-sumi-800 text-sumi-400 hover:text-sumi-200'
            }`}
          >
            Tất cả ({notes.length})
          </button>
          {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
            const count = notes.filter((n) => n.category === catKey).length;
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey as StudyNoteCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-sumi-900 border border-sumi-800 text-sumi-400 hover:text-sumi-200'
                }`}
              >
                {meta.icon}
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sumi-500" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, nội dung, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-sumi-900 border border-sumi-800 text-xs rounded-lg text-sumi-100 placeholder-sumi-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sumi-500 hover:text-sumi-300"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center text-sumi-500 border border-dashed border-sumi-800 rounded-xl">
          <NotebookPen size={32} className="mx-auto text-sumi-600 mb-2" />
          <p className="text-sm font-medium text-sumi-300">Không tìm thấy ghi chú nào</p>
          <p className="text-xs text-sumi-500 mt-1">
            {searchQuery
              ? 'Thử tìm kiếm với từ khóa khác.'
              : 'Bấm "Tạo ghi chú mới" để bắt đầu lưu kiến thức ôn thi.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const meta = CATEGORY_META[note.category] || CATEGORY_META.other;
            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl bg-sumi-900 border transition-all duration-150 flex flex-col justify-between ${
                  note.pinned
                    ? 'border-amber-500/40 shadow-sm bg-sumi-900/95'
                    : 'border-sumi-800 hover:border-sumi-700'
                }`}
              >
                <div>
                  {/* Top Bar: Category badge, pinned button, actions */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium ${meta.color}`}
                      >
                        {meta.icon}
                        <span>{meta.label}</span>
                      </span>
                      {note.pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                          <Pin size={10} />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateNote(note.id, { pinned: !note.pinned })}
                        title={note.pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                        className={`p-1.5 rounded hover:bg-sumi-800 text-xs transition-colors ${
                          note.pinned ? 'text-amber-400' : 'text-sumi-500 hover:text-sumi-300'
                        }`}
                      >
                        {note.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(note)}
                        title="Chỉnh sửa"
                        className="p-1.5 rounded hover:bg-sumi-800 text-sumi-500 hover:text-sumi-200 text-xs transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa ghi chú "${note.title}"?`)) {
                            onDeleteNote(note.id);
                          }
                        }}
                        title="Xóa ghi chú"
                        className="p-1.5 rounded hover:bg-rose-500/10 text-sumi-500 hover:text-rose-400 text-xs transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-sumi-100 mb-2 leading-snug">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <div className="text-xs text-sumi-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-mono bg-sumi-950/60 p-3 rounded-lg border border-sumi-800/60 scrollbar-thin">
                    {note.content}
                  </div>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-sumi-800 text-sumi-400 border border-sumi-700/80 font-mono"
                        >
                          <Tag size={9} className="text-sumi-500" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Date & AI Tutor Trigger */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-sumi-800/80 text-[11px] text-sumi-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>
                      {new Date(note.updatedAt || note.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </span>

                  {onAskAiAboutNote && (
                    <button
                      type="button"
                      onClick={() => onAskAiAboutNote(note)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                    >
                      <Sparkles size={12} />
                      <span>Hỏi AI về ghi chú này</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
