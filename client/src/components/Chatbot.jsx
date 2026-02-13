import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquare, X, Send, Bot, UserRound, Sparkles,
  BarChart3, TrendingUp, Target, BookOpen, Lightbulb,
  GripVertical, Minimize2, Maximize2, Trash2, ChevronDown
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

/* ───────── quick-action chips ───────── */
const quickActions = [
  { label: 'Performance Summary', icon: BarChart3, message: 'Give me a complete performance summary across all subjects.' },
  { label: 'Weak Areas', icon: Target, message: 'Which subjects and topics need the most improvement?' },
  { label: 'Study Plan', icon: BookOpen, message: 'Create a weekly improvement plan focusing on my weakest areas.' },
  { label: 'Score Trends', icon: TrendingUp, message: 'Analyze my score trends — am I improving or declining?' },
  { label: 'DSA Deep-dive', icon: Lightbulb, message: 'Give me a detailed analysis of my DSA performance with topic-wise breakdown.' },
];

/* ───────── Markdown components for styling ───────── */
const mdComponents = {
  h1: ({ children }) => <h1 className="text-base font-bold text-gray-900 mt-3 mb-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-sm font-bold text-gray-800 mt-2.5 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-700 mt-2 mb-0.5">{children}</h3>,
  p: ({ children }) => <p className="text-sm leading-relaxed text-gray-700 mb-1.5">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="text-indigo-600 not-italic font-medium">{children}</em>,
  ul: ({ children }) => <ul className="space-y-0.5 mb-2 ml-1">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-0.5 mb-2 ml-1 list-decimal list-inside">{children}</ol>,
  li: ({ children }) => (
    <li className="text-sm text-gray-700 flex items-start gap-1.5">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
      <span>{children}</span>
    </li>
  ),
  code: ({ inline, children, ...props }) =>
    inline ? (
      <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
    ) : (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono leading-relaxed">
        <code {...props}>{children}</code>
      </pre>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-indigo-400 bg-indigo-50/50 pl-3 py-1 my-2 rounded-r-lg text-sm italic text-gray-600">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-gray-200 my-2" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-1 text-left border-b border-gray-200">{children}</th>,
  td: ({ children }) => <td className="px-2 py-1 border-b border-gray-100 text-gray-700">{children}</td>,
};

/* ───────── typing indicator ───────── */
const TypingIndicator = () => (
  <div className="flex items-start gap-2.5">
    <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
      <Bot className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="text-[10px] text-gray-400 mt-1">Analyzing your data...</p>
    </div>
  </div>
);

/* ───────── scroll-to-bottom button ───────── */
const ScrollButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-md rounded-full p-1.5 hover:bg-gray-50 transition-all z-10"
  >
    <ChevronDown className="w-4 h-4 text-gray-500" />
  </button>
);

/* ═══════════════════════════════════════════
   Main ChatBot Component
   ═══════════════════════════════════════════ */
const ChatBot = ({ userId, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey ${userName || 'there'}! I'm your **AI Study Assistant** on AcadBoost AI.\n\nI have access to all your test scores and performance data. Here's what I can help with:\n\n- **Performance analysis** across all subjects\n- **Trend insights** — improving or declining?\n- **Study plans** tailored to your weak areas\n- **Topic-wise breakdowns** for any subject\n\nAsk me anything or pick a quick action below!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Resize state
  const [size, setSize] = useState({ w: 420, h: 560 });
  const resizeRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  /* ── auto-scroll ── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  /* ── scroll button visibility ── */
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!atBottom);
  };

  /* ── resize handler ── */
  const handleResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onMove = (ev) => {
      const dw = startX - ev.clientX;
      const dh = startY - ev.clientY;
      setSize({
        w: Math.min(700, Math.max(360, startW + dw)),
        h: Math.min(800, Math.max(400, startH + dh)),
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* ── send message ── */
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const conversationHistory = messages
        .filter((m) => m.role !== 'system')
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await axios.post(`${API_URL}/chat/${userId}`, {
        message: trimmed,
        conversationHistory,
      });

      if (response.data.success) {
        const reply = response.data.data.reply;
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble processing that right now. Please try again in a moment!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! How can I help you, ${userName || 'there'}?`,
      },
    ]);
    setShowQuickActions(true);
  };

  const toggleExpand = () => {
    if (isExpanded) {
      setSize({ w: 420, h: 560 });
    } else {
      setSize({ w: 600, h: 700 });
    }
    setIsExpanded(!isExpanded);
  };

  /* ═════════ RENDER ═════════ */
  return (
    <>
      {/* ── Floating Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group hover:scale-105"
          title="Chat with AI Assistant"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
          style={{
            width: `${size.w}px`,
            height: `${size.h}px`,
            animation: 'chatSlideUp 0.25s ease-out',
          }}
        >
          {/* Resize handle (top-left corner) */}
          <div
            ref={resizeRef}
            onMouseDown={handleResizeStart}
            className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            title="Drag to resize"
          >
            <GripVertical className="w-3 h-3 text-gray-400 -rotate-45" />
          </div>

          {/* ── Header ── */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  AI Study Assistant
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                </h3>
                <p className="text-indigo-200 text-[10px]">
                  {isLoading ? 'Thinking...' : 'Powered by Gemini'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Clear chat">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={toggleExpand} className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title={isExpanded ? 'Minimize' : 'Expand'}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50/80 relative"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start gap-2.5'}`}>
                {/* AI avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <UserRound className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && <TypingIndicator />}

            {/* Quick action chips — shown after welcome */}
            {showQuickActions && messages.length <= 1 && !isLoading && (
              <div className="pt-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-10">Quick Actions</p>
                <div className="flex flex-wrap gap-1.5 ml-10">
                  {quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(qa.message)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm"
                    >
                      <qa.icon className="w-3 h-3" />
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

            {/* Scroll-to-bottom button */}
            {showScrollBtn && <ScrollButton onClick={scrollToBottom} />}
          </div>

          {/* ── Input ── */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your performance..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white max-h-24 overflow-y-auto transition-colors"
                style={{ minHeight: '42px' }}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm hover:shadow-md disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Enter to send &middot; Shift+Enter for new line
            </p>
          </div>
        </div>
      )}

      {/* Slide-up animation */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
