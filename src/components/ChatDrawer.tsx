'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, MessageCircle, Search, Hash, BarChart3, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { txt } from '@/i18n/ptBR';
import { getAssistantResponse, handleChip, type AssistantMessage } from '@/lib/assistantEngine';

// ── Markdown simples (bold, bullet, italic) ─────────────────
function SimpleMarkdown({ text }: { text: string }) {
    const lines = text.split('\n');
    return (
        <div className="space-y-1 text-sm leading-relaxed">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-1" />;
                // Heading tipo **Título:**
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                const formatted = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em>$1</em>');
                return (
                    <p key={i}
                        className={isBullet ? 'pl-3' : ''}
                        dangerouslySetInnerHTML={{ __html: formatted }} />
                );
            })}
        </div>
    );
}

// ── Chips de ação rápida ─────────────────────────────────────
const CHIPS = [
    { id: 'searchGuide', label: txt.assistant.chips.searchGuide, icon: Search },
    { id: 'ciap', label: txt.assistant.chips.ciap, icon: Hash },
    { id: 'counts', label: txt.assistant.chips.counts, icon: BarChart3 },
    { id: 'pending', label: txt.assistant.chips.pending, icon: Clock },
] as const;

// ── Tipo ─────────────────────────────────────────────────────
interface ChatDrawerProps {
    open: boolean;
    onClose: () => void;
    demoMode?: boolean;
}

// ── ChatDrawer ────────────────────────────────────────────────
export function ChatDrawer({ open, onClose, demoMode = false }: ChatDrawerProps) {
    const [messages, setMessages] = useState<AssistantMessage[]>([
        { role: 'assistant', content: txt.assistant.greeting, timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300);
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [open, messages]);

    const pushMessage = (msg: AssistantMessage) =>
        setMessages(prev => [...prev, msg]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || thinking) return;
        setInput('');
        pushMessage({ role: 'user', content: text, timestamp: new Date() });
        setThinking(true);
        try {
            const reply = await getAssistantResponse(text, demoMode);
            pushMessage(reply);
        } catch {
            pushMessage({ role: 'assistant', content: txt.unhappy.error.body, timestamp: new Date() });
        } finally {
            setThinking(false);
        }
    };

    const handleChipClick = async (chipId: string) => {
        setThinking(true);
        try {
            const reply = await handleChip(chipId);
            pushMessage(reply);
        } finally {
            setThinking(false);
        }
    };

    const clearChat = () =>
        setMessages([{ role: 'assistant', content: txt.assistant.greeting, timestamp: new Date() }]);

    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />

            {/* Drawer */}
            <aside
                role="complementary"
                aria-label="Assistente APS"
                className={`
          fixed z-50 flex flex-col
          bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl
          md:right-6 md:bottom-6 md:left-auto md:h-[600px] md:w-96 md:rounded-3xl
          bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800
          transition-all duration-300
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                            <MessageCircle size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-sm leading-none">{txt.assistant.fab}</h2>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                {demoMode ? '🔒 Modo Demonstração' : '● Online'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={clearChat} title={txt.assistant.clearChat}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                            <Trash2 size={16} />
                        </button>
                        <button onClick={onClose} aria-label="Fechar assistente"
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900 flex items-center gap-2 shrink-0">
                    <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold leading-tight">
                        {txt.assistant.disclaimer}
                    </p>
                </div>

                {/* Quick Chips */}
                <div className="px-4 py-3 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
                    {CHIPS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => handleChipClick(id)}
                            disabled={thinking}
                            className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-50 shrink-0">
                            <Icon size={12} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-0.5 shadow-sm">
                                    <MessageCircle size={13} className="text-white" />
                                </div>
                            )}
                            <div className={`max-w-[82%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-emerald-500 text-white rounded-tr-none'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                                    }`}>
                                    {msg.role === 'user'
                                        ? <p className="text-sm">{msg.content}</p>
                                        : <SimpleMarkdown text={msg.content} />
                                    }
                                </div>

                                {/* Sources */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="space-y-1 w-full">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">{txt.assistant.sources}</p>
                                        {msg.sources.map(s => (
                                            <a key={s.id} href={`/content/${s.id}`}
                                                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
                                                <ExternalLink size={11} className="shrink-0 text-slate-400 group-hover:text-emerald-500" />
                                                <span className="font-semibold truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{s.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {thinking && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
                                <MessageCircle size={13} className="text-white" />
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex gap-2 items-end bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={e => {
                                setInput(e.target.value);
                                e.target.style.height = '24px';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                            }}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder={txt.assistant.placeholder}
                            className="flex-1 bg-transparent text-sm resize-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
                            style={{ height: '24px', maxHeight: '96px' }}
                        />
                        <button onClick={handleSend} disabled={!input.trim() || thinking}
                            aria-label={txt.actions.send}
                            className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition-all shrink-0 active:scale-95">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

// ── FAB Button ────────────────────────────────────────────────
export function AssistantFAB({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
    return (
        <button
            onClick={onClick}
            aria-label={txt.assistant.fab}
            aria-expanded={isOpen}
            className={`
        fixed bottom-28 right-5 z-40
        md:bottom-8 md:right-8
        w-14 h-14 rounded-2xl flex items-center justify-center
        bg-gradient-to-br from-emerald-500 to-teal-600
        text-white shadow-xl shadow-emerald-300/40 dark:shadow-emerald-900/60
        hover:scale-105 active:scale-95 transition-all duration-200
        border-2 border-white/20
        ${isOpen ? 'rotate-[360deg]' : ''}
      `}
        >
            {isOpen
                ? <X size={22} />
                : <MessageCircle size={22} />
            }
        </button>
    );
}
