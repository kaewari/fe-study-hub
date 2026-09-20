import React, { useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  INITIAL_API_KEYS,
  INITIAL_BOOKS,
  INITIAL_EXAMS,
  INITIAL_ERROR_NOTES,
  INITIAL_ALGORITHM_PRESETS,
  INITIAL_SECURITY_CASES,
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
} from './shared/types';
import rawVocabJson from './shared/constants/fe_vocab.json';

import { DashboardView } from './features/dashboard/DashboardView';
import { PlannerView } from './features/planner/PlannerView';
import { ScannerView } from './features/scanner/ScannerView';
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

import { exportStudyDataToExcel } from './shared/services/excelExportService';
import { THEMES_LIST } from './shared/constants/themes';
import { AppTheme } from './shared/types';
import {
  LayoutDashboard,
  Calendar,
  Camera,
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
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);

  // Persistence State
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('fe_user_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [apiKeys, setApiKeys] = useState<ApiKeyConnection[]>(() => {
    const saved = localStorage.getItem('fe_api_keys');
    return saved ? JSON.parse(saved) : INITIAL_API_KEYS;
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
    localStorage.setItem('fe_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

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

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'p' || e.key === 'P') setActiveTab('pomodoro');
      if (e.key === 't' || e.key === 'T') setActiveTab('algorithm-workshop');
      if (e.key === 's' || e.key === 'S') setActiveTab('scanner');
      if (e.key === 'd' || e.key === 'D') setActiveTab('dashboard');
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

  const handleUpdateChapterScan = (bookId: string, chapterId: string, markdown: string) => {
    handleUpdateChapter(bookId, chapterId, {
      scanStatus: 'scanned',
      ocrContentMarkdown: markdown,
    });
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
    if (data.settings) setSettings(data.settings);
  };

  const tabs = [
    { id: 'dashboard', label: '📊 ダッシュボード', icon: <LayoutDashboard size={15} /> },
    { id: 'planner', label: '📅 日別計画', icon: <Calendar size={15} /> },
    { id: 'scanner', label: '📷 Scan & OCR', icon: <Camera size={15} /> },
    { id: 'curriculum', label: '📚 3冊の教材', icon: <BookOpen size={15} /> },
    { id: 'algorithm-workshop', label: '💻 擬似言語 B', icon: <Code2 size={15} /> },
    { id: 'security-workshop', label: '🛡️ セキュリティ', icon: <ShieldCheck size={15} /> },
    { id: 'exam-simulator', label: '📝 模擬試験', icon: <Award size={15} /> },
    { id: 'error-notebook', label: '🔁 復習ノート', icon: <RotateCcw size={15} /> },
    { id: 'vocab-hub', label: '📖 Mazii用語集', icon: <BookA size={15} /> },
    { id: 'pomodoro', label: '🍅 Pomodoro', icon: <Clock size={15} /> },
    { id: 'survival-guide', label: '💡 5つの盲点', icon: <Compass size={15} /> },
    { id: 'settings', label: '⚙️ 設定', icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-sumi-950 text-sumi-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Security Lock Screen */}
      {isLocked && (
        <PinLockScreen correctPin={settings.pin} onUnlocked={() => setIsLocked(false)} />
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-sumi-950/85 backdrop-blur-xl border-b border-sumi-800/80 shrink-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-sumi-850 border border-sumi-700/90 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm shadow-sm relative overflow-hidden group">
              <span className="relative z-10">基</span>
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-sumi-100 flex items-center gap-1.5">
                  FE STUDY HUB <span className="text-[10px] px-1.5 py-0.2 rounded bg-sumi-850 border border-sumi-700/80 text-sumi-400 font-normal">v1.0</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  ⏳ 19/04/2026 (Còn 29 ngày)
                </span>
              </div>
              <span className="text-[10px] text-sumi-400 block font-mono">基本情報技術者試験 (Syllabus 9.1)</span>
            </div>
          </div>

          {/* Quick Actions, Theme Switcher & Lock */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Badge */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber-400 bg-sumi-850/90 border border-sumi-800 px-2.5 py-1.5 rounded-lg shadow-sm">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>{settings.streakDays} Day Streak</span>
            </div>

            {/* Quick 1-Click Light/Dark Toggle */}
            <button
              type="button"
              onClick={handleToggleLightDark}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg bg-sumi-850 hover:bg-sumi-800 border border-sumi-700/80 text-sumi-200 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Chuyển nhanh Sáng / Tối (1 click)"
            >
              {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.mode === 'light' ? (
                <>
                  <Sun size={15} className="text-amber-500" />
                  <span className="hidden sm:inline">Chế độ Sáng</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-blue-400" />
                  <span className="hidden sm:inline">Chế độ Tối</span>
                </>
              )}
            </button>

            {/* Quick Theme Switcher Popover Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-sumi-850 hover:bg-sumi-800 border border-sumi-700/80 text-sumi-100 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                title="Chọn giao diện & màu sắc"
              >
                <Palette size={14} className="text-[var(--theme-accent,#38bdf8)]" />
                <span className="hidden md:inline max-w-[90px] truncate">
                  {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.name || 'Theme'}
                </span>
                <div
                  className="w-3 h-3 rounded-full border border-white/20 shrink-0 shadow-xs"
                  style={{ backgroundColor: THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.preview.accent || '#38bdf8' }}
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
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-sumi-900 border border-sumi-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-sumi-800">
                      <div>
                        <h4 className="text-xs font-bold text-sumi-100 uppercase tracking-wider flex items-center gap-1.5">
                          <Palette size={13} className="text-[var(--theme-accent,#38bdf8)]" />
                          Giao Diện (Theme Engine)
                        </h4>
                        <p className="text-[10px] text-sumi-400 mt-0.5">8 phong cách thẩm mỹ chuẩn quốc tế</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleLightDark}
                        className="text-[11px] px-2 py-1 rounded bg-sumi-850 hover:bg-sumi-800 border border-sumi-700 text-sumi-200 flex items-center gap-1 transition-colors"
                      >
                        {THEMES_LIST.find((t) => t.id === (settings.theme || 'sumi'))?.mode === 'light' ? '🌙 Sang Tối' : '☀️ Sang Sáng'}
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
                                ? 'border-[var(--theme-accent,#38bdf8)] bg-sumi-850 ring-1 ring-[var(--theme-accent,#38bdf8)]'
                                : 'border-sumi-800 bg-sumi-950/60 hover:bg-sumi-850 hover:border-sumi-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-semibold text-xs text-sumi-100 truncate">{th.name}</span>
                              {isSelected && (
                                <Check size={12} className="text-[var(--theme-accent,#38bdf8)] shrink-0" />
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

        {/* Modern Segmented Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none py-1.5 flex items-center gap-1.5 border-t border-sumi-800/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-sumi-850 text-sumi-100 font-semibold border border-sumi-700 shadow-sm theme-accent-border'
                    : 'text-sumi-400 hover:text-sumi-200 hover:bg-sumi-850/60 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[var(--theme-accent,#38bdf8)]' : ''}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
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

        {activeTab === 'scanner' && (
          <ScannerView
            books={books}
            apiKeys={apiKeys}
            onUpdateApiKeys={setApiKeys}
            onUpdateChapterScan={handleUpdateChapterScan}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            books={books}
            onUpdateChapter={handleUpdateChapter}
            onNavigateScan={(_bookId, _chapterId) => {
              setActiveTab('scanner');
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
      </main>

      {/* Footer */}
      <footer className="border-t border-sumi-800 py-4 px-6 text-center text-xs text-sumi-500 font-mono">
        FE Study Hub © 2026 | Built for Fundamental IT Engineers in Japan | Shortcuts: [D] Dashboard, [S] Scan, [T] Trace, [P] Pomodoro
      </footer>
    </div>
  );
};
