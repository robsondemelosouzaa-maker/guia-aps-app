import React from 'react';
import AppShell from '@/components/AppShell';
import { getProtocolById, getAllProtocols } from '@/lib/contentSearch';
import { FonteCard, DisclaimerBanner } from '@/components/ui-states';
import { ArrowLeft, CheckSquare, Tag, Hash } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
    return getAllProtocols().map(p => ({ id: p.id }));
}

export default function ContentDetailPage({ params }: { params: { id: string } }) {
    const protocol = getProtocolById(params.id);
    if (!protocol) notFound();

    // Convert newlines to paragraph breaks
    const bodyParagraphs = protocol.body.split('\n').filter(l => l.trim());

    return (
        <AppShell>
            <article className="max-w-2xl mx-auto space-y-8">
                {/* Back */}
                <Link href="/busca" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <ArrowLeft size={16} /> Voltar para Busca
                </Link>

                {/* Hero */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {protocol.ciapCodes.map(code => (
                            <span key={code} className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                                <Hash size={11} /> {code}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-2xl font-black tracking-tight leading-snug">{protocol.title}</h1>
                </div>

                {/* Disclaimer — obrigatório */}
                <DisclaimerBanner />

                {/* Summary / Lead */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-5 py-4 rounded-2xl">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{protocol.summary}</p>
                </div>

                {/* Body */}
                <div className="prose-sm max-w-none space-y-3">
                    {bodyParagraphs.map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                            return <h2 key={i} className="text-lg font-black mt-6 mb-2">{line.replace(/\*\*/g, '')}</h2>;
                        }
                        if (line.startsWith('- ') || line.startsWith('• ')) {
                            return <p key={i} className="pl-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{line.replace(/^[-•]\s/, '• ')}</p>;
                        }
                        if (/^\d+\./.test(line)) {
                            return <p key={i} className="pl-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{line}</p>;
                        }
                        // Inline bold
                        const formatted = line
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        return <p key={i} className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
                    })}
                </div>

                {/* Checklist */}
                {protocol.checklist.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-black flex items-center gap-2">
                            <CheckSquare size={20} className="text-emerald-500" /> Checklist da Consulta
                        </h2>
                        <div className="space-y-2">
                            {protocol.checklist.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3 rounded-xl">
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-200 dark:border-slate-700 shrink-0 mt-0.5 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-sm" />
                                    </div>
                                    <p className="text-sm font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tags */}
                {protocol.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {protocol.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-semibold">
                                <Tag size={10} /> {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Fonte Card — obrigatório */}
                <FonteCard
                    source={protocol.sourceFull}
                    version={protocol.version}
                    updatedAt={protocol.updatedAt}
                />

                {/* Disclaimer de rodapé */}
                <DisclaimerBanner />
            </article>
        </AppShell>
    );
}
