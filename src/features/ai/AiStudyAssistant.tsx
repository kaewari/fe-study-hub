import React, { useState, useEffect, useRef } from 'react';
import { ApiKeyConnection } from '../../shared/types';
import { markKeyExhausted } from '../../shared/services/geminiKeyManager';
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  Key,
  Minimize2,
  Maximize2,
  AlertCircle,
  HelpCircle,
  Code2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface AiStudyAssistantProps {
  apiKeys: ApiKeyConnection[];
  onUpdateApiKeys: (updated: ApiKeyConnection[]) => void;
  activeModel?: string;
  externalQuery?: string | null;
  onClearExternalQuery?: () => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

const QUICK_PROMPTS = [
  {
    label: 'Mã giả 科目B',
    icon: <Code2 size={12} />,
    prompt: 'Giải thích quy tắc chỉ số mảng 1-based và mẹo lập bảng Trace biến (トレース表) trong đề thi mã giả 科目B.',
  },
  {
    label: 'Bẫy bảo mật FE',
    icon: <ShieldCheck size={12} />,
    prompt: 'Phân tích 3 bẫy đề thi hay gặp nhất về An toàn thông tin (chữ ký số, chứng chỉ số và tấn công SQL Injection).',
  },
  {
    label: 'Phân biệt RSA vs AES',
    icon: <HelpCircle size={12} />,
    prompt: 'So sánh chi tiết mã hóa khóa đối xứng (AES) và khóa bất đối xứng (RSA). Tại sao thực tế dùng mô hình lai (Hybrid)?',
  },
  {
    label: 'Chiến lược thi đỗ',
    icon: <Sparkles size={12} />,
    prompt: 'Tôi cần đạt 600/1000 ở cả 2 môn 科目A và 科目B. Hãy tư vấn chiến lược phân bổ thời gian và thứ tự làm bài tối ưu.',
  },
];

export const AiStudyAssistant: React.FC<AiStudyAssistantProps> = ({
  apiKeys,
  onUpdateApiKeys,
  activeModel,
  externalQuery,
  onClearExternalQuery,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggleOpen) onToggleOpen(open);
    else setInternalIsOpen(open);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin chào! Tôi là Trợ giảng AI chuyên sâu kỳ thi Kỹ sư CNTT Nhật Bản (FE - 基本情報技術者).

Bạn có thể dán mã giả 科目B, hỏi lý thuyết 3 nhánh (Công nghệ, Quản lý, Chiến lược), hoặc hỏi mẹo giải đề bất kỳ lúc nào!

*(Hệ thống sử dụng Gemini 2.5 Flash với cơ chế xoay vòng 6 API Keys Omniroute).*`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [keyAlert, setKeyAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Shortcut Ctrl+J / Cmd+J to toggle AI Assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle external incoming query (e.g. from StudyNotesView)
  useEffect(() => {
    if (externalQuery) {
      setIsOpen(true);
      setInputQuery(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [externalQuery]);

  const activeKey = apiKeys[currentKeyIndex] || apiKeys[0];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    setKeyAlert(null);

    // Call Gemini API with 6-key failover
    let keyIdx = currentKeyIndex;
    let attempts = 0;
    const maxAttempts = Math.max(apiKeys.length, 1);
    let success = false;

    const systemPrompt = `Bạn là Trợ giảng chuyên sâu kỳ thi Kỹ sư CNTT Nhật Bản (FE - 基本情報技術者 / Fundamental Information Technology Engineer Examination).
Quy tắc trả lời:
1. Giải thích cặn kẽ, chính xác bản chất kỹ thuật bằng tiếng Việt chuẩn mực, dễ hiểu.
2. Với các thuật ngữ CNTT tiếng Nhật, luôn đính kèm Kanji, Kana và thuật ngữ tiếng Anh chuẩn IPA Syllabus (ví dụ: 公開鍵暗号方式 - Public Key Cryptography).
3. Nếu người dùng hỏi về Mã giả (擬似言語 - 科目B): Nhắc nhở quy tắc mảng 1-based, cách trace biến qua bảng (トレース表) và bẫy hay gặp.
4. Trình bày rõ ràng bằng Markdown, có gạch đầu dòng, ví dụ cụ thể, không dài dòng lan man.`;

    while (attempts < maxAttempts) {
      const candidateKey = apiKeys[keyIdx];
      if (!candidateKey || !candidateKey.key || candidateKey.status !== 'active') {
        keyIdx = (keyIdx + 1) % Math.max(apiKeys.length, 1);
        attempts++;
        continue;
      }

      try {
        const preferredModel = activeModel || import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.8-flash';
        let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${preferredModel}:generateContent?key=${candidateKey.key}`;
        let res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  { text: `Học viên hỏi: "${query}"` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2048,
            },
          }),
        });

        // If the configured model returns 404 or 503 (high demand spike on preview), fallback seamlessly
        if (!res.ok && (res.status === 404 || res.status === 503)) {
          const fallbackModel = preferredModel === 'gemini-3.8-flash' ? 'gemini-3.6-flash' : 'gemini-3.8-flash';
          endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${candidateKey.key}`;
          res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemPrompt },
                    { text: `Học viên hỏi: "${query}"` },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2048,
              },
            }),
          });
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || `HTTP ${res.status}`;

          if (res.status === 429 || errMsg.includes('429') || errMsg.includes('Quota')) {
            // Key exhausted, rollover to next key
            const { updatedKeys, nextIndex } = markKeyExhausted(apiKeys, keyIdx);
            onUpdateApiKeys(updatedKeys);
            setKeyAlert(`Key ${candidateKey.name} chạm hạn mức (429). Tự động chuyển key tiếp theo...`);
            if (nextIndex === -1) {
              throw new Error('Tất cả API keys đều đã hết hạn mức (429 Rate Limit)!');
            }
            keyIdx = nextIndex;
            attempts++;
            continue;
          }

          if (res.status === 503 || errMsg.includes('503') || errMsg.includes('high demand')) {
            // High demand spike, rotate to next key immediately
            setKeyAlert(`Model đang tải cao trên key ${candidateKey.name} (503). Chuyển key tiếp theo...`);
            keyIdx = (keyIdx + 1) % Math.max(apiKeys.length, 1);
            attempts++;
            continue;
          }

          throw new Error(errMsg);
        }

        const data = await res.json();
        const answer =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Trợ giảng không nhận được phản hồi từ mô hình.';

        setCurrentKeyIndex(keyIdx);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: answer,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        success = true;
        break;
      } catch (err: any) {
        console.warn(`Key ${candidateKey?.name} failed:`, err.message);
        if (err.message.includes('429')) {
          attempts++;
          keyIdx = (keyIdx + 1) % apiKeys.length;
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `error-${Date.now()}`,
              sender: 'assistant',
              text: `⚠️ Lỗi kết nối trợ giảng: ${err.message}. Vui lòng kiểm tra lại API Key trong Cài đặt.`,
              timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              isError: true,
            },
          ]);
          break;
        }
      }
    }

    if (!success && attempts >= maxAttempts) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: '⚠️ Không thể gửi câu hỏi vì tất cả API key đã hết hạn mức hoặc chưa được thiết lập.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Lịch sử hội thoại đã được làm mới. Hãy đặt câu hỏi bất kỳ cho Trợ giảng!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/20 border border-blue-400/30 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95 group"
          title="Mở Trợ Giảng AI (Ctrl + J)"
        >
          <div className="relative">
            <Bot size={20} className="transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-600 rounded-full animate-pulse" />
          </div>
          <span className="text-xs font-semibold pr-1 hidden sm:inline">AI Tutor Trợ Giảng</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-700/80 text-blue-200 hidden md:inline">
            Ctrl+J
          </span>
        </button>
      )}

      {/* Floating Drawer / Dialog */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 ${
            isExpanded
              ? 'inset-4 md:inset-10'
              : 'bottom-4 right-4 w-[calc(100vw-32px)] sm:w-[440px] h-[580px] max-h-[calc(100vh-40px)]'
          } bg-sumi-900 border border-sumi-750 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="p-3.5 bg-sumi-950/80 border-b border-sumi-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-sumi-100 truncate">
                    AI Tutor Trợ Giảng FE
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Gemini 2.5
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-sumi-400 font-mono mt-0.5 truncate">
                  <Key size={10} className="text-blue-400 shrink-0" />
                  <span className="truncate">{activeKey?.name || 'Omniroute Key'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sumi-400">
              <button
                type="button"
                onClick={handleClearChat}
                title="Làm mới đoạn chat"
                className="p-1.5 rounded-lg hover:bg-sumi-800 hover:text-sumi-200 transition-colors"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                className="p-1.5 rounded-lg hover:bg-sumi-800 hover:text-sumi-200 transition-colors hidden sm:inline-flex"
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng trợ giảng (Ctrl + J)"
                className="p-1.5 rounded-lg hover:bg-sumi-800 hover:text-sumi-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Key Alert banner */}
          {keyAlert && (
            <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2 shrink-0">
              <AlertCircle size={12} className="shrink-0 text-amber-400" />
              <span className="truncate">{keyAlert}</span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : msg.isError
                      ? 'bg-rose-950/40 border border-rose-800 text-rose-200 rounded-bl-none'
                      : 'bg-sumi-950 border border-sumi-800 text-sumi-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  <div
                    className={`text-[9px] font-mono mt-1.5 flex justify-end ${
                      msg.sender === 'user' ? 'text-blue-200/70' : 'text-sumi-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} />
                </div>
                <div className="p-3 bg-sumi-950 border border-sumi-800 rounded-xl rounded-bl-none flex items-center gap-2 text-xs text-sumi-400">
                  <Loader2 size={13} className="animate-spin text-blue-400" />
                  <span>Trợ giảng đang phân tích câu hỏi...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-3 py-2 bg-sumi-950/60 border-t border-sumi-800/80 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(qp.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-sumi-850 hover:bg-sumi-800 text-sumi-300 hover:text-sumi-100 border border-sumi-750 transition-colors shrink-0 disabled:opacity-50"
                >
                  <span className="text-blue-400">{qp.icon}</span>
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-sumi-950 border-t border-sumi-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Hỏi trợ giảng hoặc dán mã giả đề thi... (Enter)"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-sumi-900 border border-sumi-700/80 rounded-xl px-3 py-2 text-xs text-sumi-100 placeholder-sumi-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-sumi-800 text-white disabled:text-sumi-500 rounded-xl transition-colors shrink-0"
                title="Gửi câu hỏi"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
