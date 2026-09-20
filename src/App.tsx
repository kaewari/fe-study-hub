import React, { useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  INITIAL_API_KEYS,
  INITIAL_BOOKS,
  INITIAL_EXAMS,
  INITIAL_ERROR_NOTES,
  INITIAL_ALGORITHM_PRESETS,
  INITIAL_SECURITY_CASES,
  INITIAL_STUDY_NOTES,
  generateInitialSchedule,
} from './shared/constants/initialData';
import {
  DailyScheduleItem,
  BookItem,
  ExamScoreRecord,
  ErrorNoteItem,
  VocabItem,
  ApiKeyConnection,
  UserSettings,
  ChapterItem,
  StudyNoteItem,
} from './shared/types';
import rawVocabJson from './shared/constants/fe_vocab.json';

import { DashboardView } from './features/dashboard/DashboardView';
import { PlannerView } from './features/planner/PlannerView';
import { StudyNotesView } from './features/notes/StudyNotesView';
import { AiStudyAssistant } from './features/ai/AiStudyAssistant';
import { CurriculumView } from './features/curriculum/CurriculumView';
import { AlgorithmWorkshopView } from './features/algorithm-workshop/AlgorithmWorkshopView';
import { SecurityWorkshopView } from './features/security-workshop/SecurityWorkshopView';
import { ExamSimulatorView } from './features/exam-simulator/ExamSimulatorView';
import { ErrorNotebookView } from './features/error-notebook/ErrorNotebookView';
import { VocabHubView } from './features/vocab-hub/VocabHubView';
import { SurvivalGuideView } from './features/survival-guide/SurvivalGuideView';
import { PomodoroView } from './features/pomodoro/PomodoroView';
import { SettingsView } from './features/settings/SettingsView';
import { PinLockScreen } from './features/settings/PinLockScreen';
import {
  encryptApiKeys,
  decryptApiKeys,
  isDataEncrypted,
  hashPassword,
  isPasswordHashed,
} from './shared/utils/crypto';

import { exportStudyDataToExcel } from './shared/services/excelExportService';
import { THEMES_LIST } from './shared/constants/themes';
import { AppTheme } from './shared/types';
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  NotebookPen,
  BookOpen,
  Code2,
  ShieldCheck,
  Award,
  RotateCcw,
  BookA,
  Clock,
  Compass,
  Settings,
  Lock,
  Flame,
  Palette,
  Sun,
  Moon,
  Check,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('fe_sidebar_collapsed') === 'true';
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Persistence State
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('fe_user_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [apiKeys, setApiKeys] = useState<ApiKeyConnection[]>(() => {
    const saved = localStorage.getItem('fe_api_keys');
    if (saved && !isDataEncrypted(saved)) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_API_KEYS;
      }
    }
    return INITIAL_API_KEYS;
  });

  const [schedule, setSchedule] = useState<DailyScheduleItem[]>(() => {
    const saved = localStorage.getItem('fe_daily_schedule');
    return saved ? JSON.parse(saved) : generateInitialSchedule();
  });

  const [books, setBooks] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem('fe_books_syllabus');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [examScores, setExamScores] = useState<ExamScoreRecord[]>(() => {
    const saved = localStorage.getItem('fe_exam_scores');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [errorNotes, setErrorNotes] = useState<ErrorNoteItem[]>(() => {
    const saved = localStorage.getItem('fe_error_notes');
    return saved ? JSON.parse(saved) : INITIAL_ERROR_NOTES;
  });

  const [vocabList, setVocabList] = useState<VocabItem[]>(() => {
    const saved = localStorage.getItem('fe_vocab_list');
    return saved ? JSON.parse(saved) : (rawVocabJson as VocabItem[]);
  });

  const [studyNotes, setStudyNotes] = useState<StudyNoteItem[]>(() => {
    const saved = localStorage.getItem('fe_study_notes');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_NOTES;
  });

  // AI Assistant Global State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [aiAssistantQuery, setAiAssistantQuery] = useState<string | null>(null);

  // Lock State
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    if (!settings.isPinEnabled) return false;
    const unlockUntil = localStorage.getItem('fe_pin_unlocked_until');
    if (unlockUntil && parseInt(unlockUntil) > Date.now()) return false;
    return true;
  });

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('fe_user_settings', JSON.stringify(settings));
  }, [settings]);

  // Auto-migrate legacy plain-text PIN to salted PBKDF2 hash
  useEffect(() => {
    async function autoMigratePin() {
      if (settings.pin && !isPasswordHashed(settings.pin)) {
        const hashed = await hashPassword(settings.pin);
        setSettings((prev) => ({ ...prev, pin: hashed }));
      }
    }
    autoMigratePin();
  }, [settings.pin]);

  // Load & Decrypt API keys from localStorage on mount (AES-256-GCM)
  useEffect(() => {
    let isMounted = true;
    async function initApiKeys() {
      const saved = localStorage.getItem('fe_api_keys');
      if (saved) {
        const loaded = await decryptApiKeys(saved, INITIAL_API_KEYS);
        if (isMounted) {
          setApiKeys(loaded);
        }
        // Auto-encrypt legacy plain text in localStorage
        if (!isDataEncrypted(saved)) {
          const cipher = await encryptApiKeys(loaded);
          localStorage.setItem('fe_api_keys', cipher);
        }
      } else {
        const cipher = await encryptApiKeys(INITIAL_API_KEYS);
        localStorage.setItem('fe_api_keys', cipher);
      }
    }
    initApiKeys();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save encrypted API keys to localStorage whenever updated
  useEffect(() => {
    async function persistEncryptedKeys() {
      if (apiKeys && apiKeys.length > 0) {
        try {
          const cipher = await encryptApiKeys(apiKeys);
          localStorage.setItem('fe_api_keys', cipher);
        } catch (err) {
          console.error('Failed to encrypt API keys for storage:', err);
        }
      }
    }
    persistEncryptedKeys();
  }, [apiKeys]);

  // Apply Active Theme to Root DOM and toggle dark/light mode class
  useEffect(() => {
    const themeId = settings.theme || 'sumi';
    document.documentElement.setAttribute('data-theme', themeId);
    const currentTheme = THEMES_LIST.find((t) => t.id === themeId);
    const isLight = currentTheme?.mode === 'light';
    if (isLight) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme]);

  // Quick Toggle between Dark and Light
  const handleToggleLightDark = () => {
    const currentTheme = THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'));
    const isLight = currentTheme?.mode === 'light';
    const nextThemeId: AppTheme = isLight ? 'sumi' : 'sakura';
    setSettings((prev) => ({ ...prev, theme: nextThemeId }));
  };

  const handleSelectTheme = (newTheme: AppTheme) => {
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    setIsThemeMenuOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('fe_daily_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('fe_books_syllabus', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('fe_exam_scores', JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem('fe_error_notes', JSON.stringify(errorNotes));
  }, [errorNotes]);

  useEffect(() => {
    localStorage.setItem('fe_vocab_list', JSON.stringify(vocabList));
  }, [vocabList]);

  useEffect(() => {
    localStorage.setItem('fe_study_notes', JSON.stringify(studyNotes));
  }, [studyNotes]);

  useEffect(() => {
    localStorage.setItem('fe_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'p' || e.key === 'P') setActiveTab('pomodoro');
      if (e.key === 't' || e.key === 'T') setActiveTab('algorithm-workshop');
      if (e.key === 's' || e.key === 'S' || e.key === 'n' || e.key === 'N') setActiveTab('study-notes');
      if (e.key === 'd' || e.key === 'D') setActiveTab('dashboard');
      if (e.key === '[' || (e.ctrlKey && e.key === 'b') || (e.metaKey && e.key === 'b')) {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleUpdateChapter = (bookId: string, chapterId: string, updates: Partial<ChapterItem>) => {
    const updatedBooks = books.map((b) => {
      if (b.id === bookId) {
        const updatedChapters = b.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, ...updates } : ch
        );
        const completed = updatedChapters.filter((c) => c.studyStatus === 'completed').length;
        return { ...b, chapters: updatedChapters, completedChapters: completed };
      }
      return b;
    });
    setBooks(updatedBooks);
  };

  const handleToggleVocabMastered = (id: string) => {
    const updated = vocabList.map((v) => (v.id === id ? { ...v, mastered: !v.mastered } : v));
    setVocabList(updated);
  };

  const handleExportExcel = () => {
    exportStudyDataToExcel(schedule, books, examScores, errorNotes, vocabList);
  };

  const handleExportJson = () => {
    const backupData = {
      settings,
      apiKeys: apiKeys.map((k) => ({ ...k, key: '' })), // Redact raw key in export for safety
      schedule,
      books,
      examScores,
      errorNotes,
      vocabList,
      studyNotes,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FE_Study_Hub_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (jsonString: string) => {
    const data = JSON.parse(jsonString);
    if (data.schedule) setSchedule(data.schedule);
    if (data.books) setBooks(data.books);
    if (data.examScores) setExamScores(data.examScores);
    if (data.errorNotes) setErrorNotes(data.errorNotes);
    if (data.vocabList) setVocabList(data.vocabList);
    if (data.studyNotes) setStudyNotes(data.studyNotes);
    if (data.settings) setSettings(data.settings);
  };

  const unmasteredErrorCount = errorNotes.filter((n) => !n.mastered).length;

  const navSections = [
    {
      title: 'Tổng quan',
      items: [
        { id: 'dashboard', label: 'Dashboard', jpName: 'ダッシュボード', icon: <LayoutDashboard size={17} /> },
        { id: 'planner', label: 'Kế hoạch 30 ngày', jpName: '日別計画', icon: <Calendar size={17} /> },
      ],
    },
    {
      title: 'Luyện thi chuyên sâu',
      items: [
        { id: 'algorithm-workshop', label: 'Thuật toán & Trace B', jpName: '擬似言語 B', icon: <Code2 size={17} /> },
        { id: 'security-workshop', label: 'Bảo mật thông tin', jpName: '情報セキュリティ', icon: <ShieldCheck size={17} /> },
        { id: 'exam-simulator', label: 'Thi thử & Mock Test', jpName: '過去問・模擬試験', icon: <Award size={17} /> },
      ],
    },
    {
      title: 'Giáo trình & Từ vựng',
      items: [
        { id: 'curriculum', label: 'Giáo trình 3 cuốn', jpName: '3冊の教材', icon: <BookOpen size={17} /> },
        { id: 'vocab-hub', label: 'Mazii IT Từ vựng', jpName: 'IT用語集', icon: <BookA size={17} /> },
        { id: 'study-notes', label: 'Ghi chú học tập', jpName: '学習ノート', icon: <NotebookPen size={17} /> },
      ],
    },
    {
      title: 'Công cụ & Ôn tập',
      items: [
        { id: 'pomodoro', label: 'Pomodoro Focus', jpName: '集中タイマー', icon: <Clock size={17} /> },
        {
          id: 'error-notebook',
          label: 'Sổ tay lỗi sai',
          jpName: '復習ノート',
          icon: <RotateCcw size={17} />,
          badge: unmasteredErrorCount > 0 ? unmasteredErrorCount : undefined,
        },
        { id: 'survival-guide', label: '5 Điểm mù phòng thi', jpName: '5つの盲点', icon: <Compass size={17} /> },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        { id: 'settings', label: 'Cấu hình & Backup', jpName: '設定・データ', icon: <Settings size={17} /> },
      ],
    },
  ];

  const allNavItems = navSections.flatMap((s) => s.items);
  const currentItem = allNavItems.find((item) => item.id === activeTab) || allNavItems[0];
  const currentSection = navSections.find((s) => s.items.some((item) => item.id === activeTab));

  return (
    <div className="min-h-screen bg-sumi-950 text-sumi-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Security Lock Screen */}
      {isLocked && (
        <PinLockScreen correctPin={settings.pin} onUnlocked={() => setIsLocked(false)} />
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-sumi-950/90 backdrop-blur-xl border-b border-sumi-800/80 shrink-0 transition-colors duration-200">
        <div className="w-full px-3 sm:px-5 h-14 flex items-center justify-between gap-3">
          {/* Left: Sidebar Toggle + Mobile Hamburger + Brand + Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-sumi-400 hover:text-sumi-100 hover:bg-sumi-850 border border-transparent hover:border-sumi-700/80 transition-colors"
              title={isSidebarCollapsed ? 'Mở rộng thanh điều hướng (Phím [)' : 'Thu gọn thanh điều hướng (Phím [)'}
            >
              {isSidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-1.5 rounded-lg text-sumi-400 hover:text-sumi-100 hover:bg-sumi-850 border border-transparent hover:border-sumi-700/80 transition-colors"
              title="Menu điều hướng"
            >
              {isMobileNavOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActiveTab('dashboard')}>
              <div className="w-7 h-7 rounded-lg bg-sumi-850 border border-sumi-700/90 flex items-center justify-center font-bold text-emerald-400 font-mono text-xs shadow-sm relative overflow-hidden group">
                <span className="relative z-10">基</span>
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-sm tracking-tight text-sumi-100 whitespace-nowrap">
                  FE STUDY HUB
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sumi-850 border border-sumi-700/80 text-sumi-400 font-normal hidden sm:inline">
                  v1.0
                </span>
              </div>
            </div>

            {/* Breadcrumb indicator */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-sumi-800 text-xs text-sumi-400 font-medium truncate">
              <span>{currentSection?.title}</span>
              <span className="text-sumi-600">/</span>
              <span className="text-sumi-200 font-semibold flex items-center gap-1.5">
                <span className="text-[var(--theme-accent,#3b82f6)]">{currentItem?.icon}</span>
                <span>{currentItem?.label}</span>
                <span className="text-sumi-500 font-normal">({currentItem?.jpName})</span>
              </span>
            </div>
          </div>

          {/* Quick Actions, Theme Switcher & Lock */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Exam Countdown Chip */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CalendarClock size={13} className="text-blue-400 shrink-0" />
              <span>19/04/2026 (Còn 29 ngày)</span>
            </span>

            {/* Streak Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-sumi-850/90 border border-sumi-800 px-2.5 py-1 rounded-md">
              <Flame size={13} className="text-amber-400 shrink-0" />
              <span>{settings.streakDays} Day Streak</span>
            </div>

            {/* Quick 1-Click Light/Dark Toggle */}
            <button
              type="button"
              onClick={handleToggleLightDark}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg bg-sumi-850 hover:bg-sumi-800 border border-sumi-700/70 text-sumi-200 flex items-center gap-1.5 transition-colors active:scale-95"
              title="Chuyển nhanh Sáng / Tối (1 click)"
            >
              {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.mode === 'light' ? (
                <>
                  <Sun size={14} className="text-amber-500" />
                  <span className="hidden sm:inline">Chế độ Sáng</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-blue-400" />
                  <span className="hidden sm:inline">Chế độ Tối</span>
                </>
              )}
            </button>

            {/* Quick Theme Switcher Popover Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-sumi-850 hover:bg-sumi-800 border border-sumi-700/70 text-sumi-100 flex items-center gap-2 transition-colors active:scale-95"
                title="Chọn giao diện & màu sắc"
              >
                <Palette size={14} className="text-[var(--theme-accent,#3b82f6)]" />
                <span className="hidden md:inline max-w-[110px] truncate">
                  {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.name || 'Theme'}
                </span>
                <div
                  className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.preview.accent || '#3b82f6' }}
                />
                <ChevronDown size={12} className={`text-sumi-400 transition-transform duration-200 ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-sumi-900 border border-sumi-700 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-sumi-800">
                      <div>
                        <h4 className="text-xs font-bold text-sumi-100 uppercase tracking-wider flex items-center gap-1.5">
                          <Palette size={13} className="text-[var(--theme-accent,#3b82f6)]" />
                          Giao Diện (Theme Engine)
                        </h4>
                        <p className="text-[10px] text-sumi-400 mt-0.5">8 phong cách tối ưu thị giác, chống mỏi mắt</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleLightDark}
                        className="text-[11px] px-2 py-1 rounded-md bg-sumi-850 hover:bg-sumi-800 border border-sumi-700/80 text-sumi-200 flex items-center gap-1 transition-colors"
                      >
                        {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.mode === 'light' ? (
                          <>
                            <Moon size={11} className="text-blue-400" /> Sang Tối
                          </>
                        ) : (
                          <>
                            <Sun size={11} className="text-amber-400" /> Sang Sáng
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 max-h-72 overflow-y-auto pr-1">
                      {THEMES_LIST.map((th) => {
                        const isSelected = (settings.theme || 'sumi') === th.id;
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => handleSelectTheme(th.id)}
                            className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                              isSelected
                                ? 'border-[var(--theme-accent,#3b82f6)] bg-sumi-850 ring-1 ring-[var(--theme-accent,#3b82f6)]'
                                : 'border-sumi-800 bg-sumi-950/60 hover:bg-sumi-850 hover:border-sumi-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-xs text-sumi-100 truncate">{th.name}</span>
                              {isSelected && (
                                <Check size={12} className="text-[var(--theme-accent,#3b82f6)] shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-sumi-400 block truncate mb-2">{th.jpName}</span>

                            {/* Color preview swatch bar */}
                            <div className="flex items-center gap-1 p-1 rounded bg-sumi-950 border border-sumi-800/80 shrink-0">
                              <div className="w-2.5 h-2.5 rounded-xs border border-white/20" style={{ backgroundColor: th.preview.canvas }} title="Canvas" />
                              <div className="w-2.5 h-2.5 rounded-xs border border-white/20" style={{ backgroundColor: th.preview.surface }} title="Surface" />
                              <div className="w-2.5 h-2.5 rounded-xs border border-white/20" style={{ backgroundColor: th.preview.accent }} title="Accent" />
                              <span className="text-[8px] font-mono text-sumi-400 ml-auto uppercase">{th.mode}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* PIN Lock Button */}
            {settings.isPinEnabled && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('fe_pin_unlocked_until');
                  setIsLocked(true);
                }}
                className="p-1.5 text-sumi-400 hover:text-sumi-100 rounded-lg hover:bg-sumi-850 transition-colors border border-transparent hover:border-sumi-700/80"
                title="Khóa màn hình"
              >
                <Lock size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* App Main Shell: Sidebar + Content */}
      <div className="flex-1 flex min-h-[calc(100vh-3.5rem)] relative">
        {/* Left Sidebar (Desktop) */}
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r border-sumi-800/80 bg-sumi-900/40 backdrop-blur-md sticky top-14 h-[calc(100vh-3.5rem)] transition-all duration-200 z-30 select-none ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Nav Items List */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {navSections.map((section, sIdx) => (
              <div key={sIdx}>
                {!isSidebarCollapsed && (
                  <div className="px-3 pb-1 text-[10px] font-bold text-sumi-500 uppercase tracking-wider">
                    {section.title}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    if (isSidebarCollapsed) {
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id)}
                          title={`${item.label} (${item.jpName})`}
                          className={`relative w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-sumi-850 text-[var(--theme-accent,#3b82f6)] border border-sumi-700/80 shadow-2xs'
                              : 'text-sumi-400 hover:text-sumi-100 hover:bg-sumi-850/60'
                          }`}
                        >
                          {item.icon}
                          {item.badge !== undefined && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono font-bold bg-rose-500 text-white flex items-center justify-center shadow-xs">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                          isActive
                            ? 'bg-sumi-850 text-sumi-100 font-semibold border-l-2 border-[var(--theme-accent,#3b82f6)] shadow-2xs'
                            : 'text-sumi-400 hover:text-sumi-200 hover:bg-sumi-850/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`shrink-0 transition-colors ${
                              isActive ? 'text-[var(--theme-accent,#3b82f6)]' : 'text-sumi-400 group-hover:text-sumi-200'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <div className="text-left min-w-0">
                            <div className="truncate text-xs leading-tight">{item.label}</div>
                            <div className="truncate text-[10px] text-sumi-500 font-normal leading-tight mt-0.5">
                              {item.jpName}
                            </div>
                          </div>
                        </div>
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sidebar Dock Actions */}
          {!isSidebarCollapsed ? (
            <div className="p-3 border-t border-sumi-800/70 bg-sumi-950/40">
              <div className="flex items-center justify-between text-xs text-sumi-400 mb-2">
                <span className="font-mono text-[11px]">Kỳ thi 19/04/2026</span>
                <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
                  Còn 29 ngày
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg bg-sumi-850 hover:bg-sumi-800 border border-sumi-700/70 text-xs text-sumi-300 transition-colors"
                title="Thu gọn sidebar (phím [)"
              >
                <PanelLeftClose size={14} />
                <span>Thu gọn menu</span>
                <kbd className="ml-auto text-[9px] font-mono px-1 rounded bg-sumi-900 border border-sumi-700 text-sumi-400">
                  [
                </kbd>
              </button>
            </div>
          ) : (
            <div className="p-2 border-t border-sumi-800/70 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sumi-400 hover:text-sumi-100 hover:bg-sumi-850 border border-transparent hover:border-sumi-700/80 transition-colors"
                title="Mở rộng menu (phím [)"
              >
                <PanelLeft size={16} />
              </button>
            </div>
          )}
        </aside>

        {/* Mobile Slide-Over Drawer */}
        {isMobileNavOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-150"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <aside className="fixed top-14 bottom-0 left-0 w-72 bg-sumi-900 border-r border-sumi-800 z-50 overflow-y-auto p-3 flex flex-col md:hidden animate-in slide-in-from-left duration-200">
              <div className="flex-1 space-y-4">
                {navSections.map((section, sIdx) => (
                  <div key={sIdx}>
                    <div className="px-3 pb-1 text-[10px] font-bold text-sumi-500 uppercase tracking-wider">
                      {section.title}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileNavOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-sumi-850 text-sumi-100 font-semibold border-l-2 border-[var(--theme-accent,#3b82f6)]'
                                : 'text-sumi-400 hover:text-sumi-200 hover:bg-sumi-850/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`shrink-0 ${
                                  isActive ? 'text-[var(--theme-accent,#3b82f6)]' : 'text-sumi-400'
                                }`}
                              >
                                {item.icon}
                              </span>
                              <div className="text-left min-w-0">
                                <div className="truncate text-xs leading-tight">{item.label}</div>
                                <div className="truncate text-[10px] text-sumi-500 font-normal leading-tight mt-0.5">
                                  {item.jpName}
                                </div>
                              </div>
                            </div>
                            {item.badge !== undefined && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
            {activeTab === 'dashboard' && (
              <DashboardView
                schedule={schedule}
                books={books}
                examScores={examScores}
                onNavigateTab={setActiveTab}
                onExportExcel={handleExportExcel}
              />
            )}

            {activeTab === 'planner' && (
              <PlannerView schedule={schedule} onUpdateSchedule={setSchedule} />
            )}

            {activeTab === 'study-notes' && (
              <StudyNotesView
                notes={studyNotes}
                onAddNote={(note) => setStudyNotes([note, ...studyNotes])}
                onUpdateNote={(id, updates) =>
                  setStudyNotes(studyNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)))
                }
                onDeleteNote={(id) => setStudyNotes(studyNotes.filter((n) => n.id !== id))}
                onAskAiAboutNote={(note) => {
                  setAiAssistantQuery(
                    `Hãy phân tích, tóm tắt và bổ sung thêm các điểm mấu chốt cho ghi chú này:\nTiêu đề: ${note.title}\nNội dung:\n${note.content}`
                  );
                  setIsAiAssistantOpen(true);
                }}
              />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumView
                books={books}
                onUpdateChapter={handleUpdateChapter}
                onNavigateNotes={(_bookId, _chapterId) => {
                  setActiveTab('study-notes');
                }}
              />
            )}

            {activeTab === 'algorithm-workshop' && (
              <AlgorithmWorkshopView presets={INITIAL_ALGORITHM_PRESETS} />
            )}

            {activeTab === 'security-workshop' && (
              <SecurityWorkshopView caseStudies={INITIAL_SECURITY_CASES} />
            )}

            {activeTab === 'exam-simulator' && (
              <ExamSimulatorView
                examScores={examScores}
                onAddScoreRecord={(rec) => setExamScores([...examScores, rec])}
              />
            )}

            {activeTab === 'error-notebook' && (
              <ErrorNotebookView
                errorNotes={errorNotes}
                onAddErrorNote={(note) => setErrorNotes([...errorNotes, note])}
                onUpdateErrorNote={(id, updates) => {
                  setErrorNotes(errorNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
                }}
              />
            )}

            {activeTab === 'vocab-hub' && (
              <VocabHubView vocabList={vocabList} onToggleMastered={handleToggleVocabMastered} />
            )}

            {activeTab === 'pomodoro' && (
              <PomodoroView
                workMinutes={settings.pomodoroWorkMin}
                breakMinutes={settings.pomodoroBreakMin}
                onLogStudyMinutes={(min) => {
                  // Add actual hours to today's schedule
                  const todayStr = new Date().toISOString().split('T')[0];
                  const updated = schedule.map((s) =>
                    s.date === todayStr ? { ...s, actualHours: s.actualHours + min / 60 } : s
                  );
                  setSchedule(updated);
                }}
              />
            )}

            {activeTab === 'survival-guide' && <SurvivalGuideView />}

            {activeTab === 'settings' && (
              <SettingsView
                apiKeys={apiKeys}
                settings={settings}
                onUpdateApiKeys={setApiKeys}
                onUpdateSettings={setSettings}
                onExportExcel={handleExportExcel}
                onExportJson={handleExportJson}
                onImportJson={handleImportJson}
              />
            )}
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t border-sumi-800/70 pt-4 pb-2 text-center text-xs text-sumi-500 font-mono">
            FE Study Hub © 2026 | Built for Fundamental IT Engineers in Japan | Shortcuts: [D] Dashboard, [S/N] Notes, [T] Trace, [P] Pomodoro, [Ctrl+J] AI Tutor, [[] Thu gọn Sidebar
          </footer>
        </main>
      </div>

      {/* Global Floating AI Tutor Assistant */}
      <AiStudyAssistant
        apiKeys={apiKeys}
        onUpdateApiKeys={setApiKeys}
        isOpen={isAiAssistantOpen}
        onToggleOpen={setIsAiAssistantOpen}
        externalQuery={aiAssistantQuery}
        onClearExternalQuery={() => setAiAssistantQuery(null)}
      />
    </div>
  );
};
