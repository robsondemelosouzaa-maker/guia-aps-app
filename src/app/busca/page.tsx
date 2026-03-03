'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { searchContent, suggestTerms, type SearchResult } from '@/lib/contentSearch';
import { Search, ExternalLink, Tag, X, BookOpen } from 'lucide-react';
import { txt } from '@/i18n/ptBR';
import { LoadingState, EmptySearchState, DisclaimerBanner } from '@/components/ui-states';

// Destaca o termo na string
function highlight(text: string, query: string): React.ReactNode {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part)
            ? <mark key={i} className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded px-0.5 not-italic">{part}</mark>
            : part
    );
}

const MODULE_LABELS: Record<string, string> = {
    cronicos: 'Crônicos (HAS/DM)',
    gestante: 'Gestante',
    crianca: 'Puericultura',
    mulher: 'Saúde da Mulher',
};

export default function BuscaPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const results = useMemo<SearchResult[]>(() => {
        const q = query.trim();
        if (q.length < 2) return [];
        setIsLoading(true);
        const r = searchContent(q, 10);
        setIsLoading(false);
        return r;
    }, [query]);

    const suggestions = useMemo(() =>
        query.trim().length >= 2 && results.length === 0 ? suggestTerms(query, 5) : [],
        [query, results]
    );

    const showResults = query.trim().length >= 2 && !isLoading;
    const showEmpty = showResults && results.length === 0;

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">Busca no Guia</h1>
                    <p className="text-slate-500 text-sm font-medium">Pesquise protocolos, condutas e referências. Funciona sem internet.</p>
                </div>

                <DisclaimerBanner />

                {/* Search Input */}
                <div className="relative group">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Ex: hipertensão, pré-natal, papanicolau, CIAP-2..."
                        autoFocus
                        aria-label="Campo de busca no guia"
                        className="w-full h-14 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-400 rounded-2xl pl-14 pr-12 text-base font-medium focus:outline-none transition-all shadow-soft placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} aria-label={txt.actions.clear}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Hint inicial */}
                {!showResults && !isLoading && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 rounded-2xl">
                        <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                            💡 {txt.unhappy.emptySearch.hint} Você pode buscar por nomes, CIAP-2 ou palavras-chave.
                        </p>
                    </div>
                )}

                {isLoading && <LoadingState label={txt.states.searching} />}

                {/* Resultados */}
                {showResults && results.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-xs text-slate-400 font-bold px-1">
                            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                        </p>
                        {results.map(r => (
                            <ResultCard key={r.protocol.id} result={r} query={query.trim()} />
                        ))}
                    </div>
                )}

                {/* Sem resultado — com sugestões */}
                {showEmpty && (
                    <div className="space-y-4">
                        <EmptySearchState query={query} />
                        {suggestions.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 font-bold px-1">Tente também:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map(s => (
                                        <button key={s} onClick={() => setQuery(s)}
                                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                            <Tag size={11} />
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}

function ResultCard({ result, query }: { result: SearchResult; query: string }) {
    const { protocol: p, snippet } = result;
    return (
        <Link href={`/content/${p.id}`}>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900">
                            <BookOpen size={17} className="text-emerald-500" />
                        </div>
                        <h3 className="font-black text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {highlight(p.title, query)}
                        </h3>
                    </div>
                    <ExternalLink size={15} className="text-slate-300 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                </div>

                {/* Snippet */}
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-3">
                    {highlight(snippet, query)}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2">
                    {p.module && (
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900 px-2 py-0.5 rounded-full font-black uppercase tracking-wide">
                            {MODULE_LABELS[p.module] ?? p.module}
                        </span>
                    )}
                    {p.ciapCodes.map(code => (
                        <span key={code} className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-2 py-0.5 rounded-full font-black">
                            {code}
                        </span>
                    ))}
                    {p.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
