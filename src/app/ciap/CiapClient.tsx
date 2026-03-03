'use client';
import React, { useState, useMemo, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { ALL_CIAP2, CIAP2_CHAPTERS } from '@/data/ciap';
import type { CiapEntry } from '@/data/ciap';
import { Search, Copy, Check, ChevronDown, X, Filter } from 'lucide-react';

// ── Colour map for chapter badges ─────────────────────────────
const CHAPTER_COLOR: Record<string, string> = {
    'Procedimentos': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    'A - Geral': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    'B - Sangue/Linfa': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    'D - Digestivo': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    'F - Olho': 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    'H - Ouvido': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'K - Circulatório': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'L - Locomotor': 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
    'N - Nervoso': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'P - Psicológico': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
    'R - Respiratório': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'S - Pele': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'T - Endócrino': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    'U - Urinário': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    'W - Gravidez/Parto': 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    'X - Genital Feminino': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'Y - Genital Masculino': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    'Z - Social': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};
const colorFor = (ch: string) =>
    CHAPTER_COLOR[ch] ?? 'bg-slate-100 text-slate-600';

// ── Copy hook ─────────────────────────────────────────────────
function useCopy() {
    const [copiedCode, setCopied] = useState<string | null>(null);
    const copy = (entry: CiapEntry) => {
        const text = `${entry.code} — ${entry.label}${entry.cid ? ` (CID-10: ${entry.cid})` : ''}`;
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(entry.code);
        setTimeout(() => setCopied(null), 1800);
    };
    return { copiedCode, copy };
}

// ── Row ───────────────────────────────────────────────────────
function CiapRow({ entry, onCopy, isCopied }: {
    entry: CiapEntry; onCopy: () => void; isCopied: boolean;
}) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group border-b border-slate-50 dark:border-slate-800/60 last:border-0">
            {/* code badge */}
            <span className="font-black text-sm w-14 shrink-0 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl px-2 py-1 tracking-tight">
                {entry.code}
            </span>
            {/* label */}
            <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 leading-snug min-w-0">
                {entry.label}
            </p>
            {/* chapter chip */}
            <span className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${colorFor(entry.chapter)}`}>
                {entry.chapter.split(' - ')[0]}
            </span>
            {/* cid */}
            {entry.cid ? (
                <span className="hidden md:inline text-[10px] text-slate-400 font-mono w-14 shrink-0 text-right">
                    {entry.cid}
                </span>
            ) : (
                <span className="hidden md:inline w-14 shrink-0" />
            )}
            {/* copy */}
            <button onClick={onCopy}
                className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-xl transition-all opacity-0 group-hover:opacity-100
          ${isCopied ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
                title="Copiar código">
                {isCopied ? <Check size={13} /> : <Copy size={13} />}
            </button>
        </div>
    );
}

// ── Main client component ─────────────────────────────────────
export function CiapPageClient() {
    const [query, setQuery] = useState('');
    const [activeChapter, setActiveChapter] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { copiedCode, copy } = useCopy();
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return ALL_CIAP2.filter(e => {
            const matchChapter = !activeChapter || e.chapter === activeChapter;
            if (!matchChapter) return false;
            if (!q) return true;
            return (
                e.code.toLowerCase().includes(q) ||
                e.label.toLowerCase().includes(q) ||
                (e.cid ?? '').toLowerCase().includes(q)
            );
        });
    }, [query, activeChapter]);

    const clearFilters = () => { setQuery(''); setActiveChapter(''); inputRef.current?.focus(); };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-5">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black">CIAP-2</h1>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">
                        Classificação Internacional de Atenção Primária — {ALL_CIAP2.length} códigos completos
                    </p>
                </div>

                {/* Search + filter bar */}
                <div className="flex gap-2">
                    {/* search */}
                    <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400/40">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar por código, descrição ou CID-10…"
                            className="flex-1 py-3 text-sm bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* chapter filter */}
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`flex items-center gap-2 px-4 h-full bg-white dark:bg-slate-900 border rounded-2xl text-sm font-semibold shadow-sm transition-colors
                ${activeChapter ? 'border-emerald-400 text-emerald-600 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-800 text-slate-500'}`}>
                            <Filter size={14} />
                            <span className="hidden sm:inline">{activeChapter ? activeChapter.split(' - ')[0] : 'Capítulo'}</span>
                            <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-1 min-w-[220px] max-h-80 overflow-y-auto">
                                <button onClick={() => { setActiveChapter(''); setDropdownOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-xl font-semibold transition-colors
                    ${!activeChapter ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}>
                                    Todos os capítulos
                                </button>
                                {CIAP2_CHAPTERS.map(ch => (
                                    <button key={ch} onClick={() => { setActiveChapter(ch); setDropdownOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors
                      ${activeChapter === ch ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results count + clear */}
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">
                        {filtered.length === ALL_CIAP2.length
                            ? `${ALL_CIAP2.length} códigos — todos os capítulos`
                            : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
                    </p>
                    {(query || activeChapter) && (
                        <button onClick={clearFilters} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                            Limpar filtros
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                    {/* col headers */}
                    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30">
                        <span className="w-14 shrink-0 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">CIAP</span>
                        <span className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</span>
                        <span className="hidden sm:inline text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 shrink-0">Cap.</span>
                        <span className="hidden md:inline text-[10px] font-black text-slate-400 uppercase tracking-widest w-14 shrink-0 text-right">CID-10</span>
                        <span className="w-7 shrink-0" />
                    </div>

                    {/* rows */}
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-2xl mb-2">🔍</p>
                            <p className="font-bold text-slate-700 dark:text-slate-300">Nenhum código encontrado</p>
                            <p className="text-sm text-slate-400 mt-1">Tente outro termo ou limpe os filtros</p>
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-transparent">
                            {filtered.map(entry => (
                                <CiapRow
                                    key={entry.code}
                                    entry={entry}
                                    isCopied={copiedCode === entry.code}
                                    onCopy={() => copy(entry)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="pb-8">
                    <p className="text-[10px] text-slate-400 font-medium text-center">
                        Toque no ícone <Copy size={10} className="inline" /> para copiar o código completo com CID-10
                        &nbsp;·&nbsp; Códigos <strong>-30 a -69</strong> são sufixos combinados com a letra do capítulo (ex: A30, K45)
                    </p>
                </div>

            </div>
        </AppShell>
    );
}
