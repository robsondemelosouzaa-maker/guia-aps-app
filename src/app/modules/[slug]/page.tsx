'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import modulesData from '@/data/modules.json';
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, FileText, Users, ListChecks, History } from 'lucide-react';
import { notFound } from 'next/navigation';

type Tab = 'pacientes' | 'protocolos' | 'historico';

const statusConfig: Record<string, { color: string }> = {
    Critico: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    'Alto risco': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
    Pendente: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    'Em dia': { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
};

export default function ModuleDetailPage({ params }: { params: { slug: string } }) {
    const mod = (modulesData as any[]).find((m) => m.slug === params.slug);
    if (!mod) notFound();

    const [tab, setTab] = useState<Tab>('pacientes');

    const tabs = [
        { id: 'pacientes', label: 'Pacientes', icon: Users },
        { id: 'protocolos', label: 'Protocolos', icon: ListChecks },
        { id: 'historico', label: 'Histórico', icon: History },
    ] as const;

    return (
        <AppShell>
            <div className="max-w-3xl space-y-6">
                {/* Back + Header */}
                <div>
                    <Link href="/modules" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-4">
                        <ArrowLeft size={16} /> Todos os módulos
                    </Link>

                    <div className="p-6 rounded-3xl flex items-center justify-between" style={{ backgroundColor: mod.accentColor + '30', borderLeft: `6px solid ${mod.accentColor}` }}>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Módulo</p>
                            <h1 className="text-2xl font-black mt-0.5">{mod.title}</h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{mod.subtitle}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black" style={{ color: mod.accentColor.replace('F', 'A') }}>{mod.pendingCount}</p>
                            <p className="text-xs text-slate-400 font-semibold">pendentes</p>
                        </div>
                    </div>
                </div>

                {/* CTA Principal */}
                <button className="btn-primary w-full justify-center text-center py-4 text-base">
                    + Registrar nova consulta
                </button>

                {/* Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setTab(id as Tab)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
                ${tab === id ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {tab === 'pacientes' && (
                    <div className="space-y-3">
                        {(mod.patients as any[]).map((p: any) => (
                            <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm" style={{ backgroundColor: mod.accentColor + '50' }}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{p.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{p.age} · {p.info}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wide ${statusConfig[p.status]?.color}`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'protocolos' && (
                    <div className="space-y-3">
                        {(mod.protocols as any[]).map((pr: any) => (
                            <div key={pr.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-200 cursor-pointer transition-all">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{pr.title}</p>
                                    <p className="text-xs text-slate-400 font-medium">{pr.type} · Versão {pr.version}</p>
                                </div>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'historico' && (
                    <div className="flex flex-col items-center py-14 text-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">📋</div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Histórico vazio</h3>
                        <p className="text-sm text-slate-400 max-w-xs">O histórico de atendimentos aparecerá aqui assim que integrarmos o sistema. <span className="font-bold">(Fase 3)</span></p>
                        <Link href="/settings" className="text-sm text-emerald-600 font-semibold hover:underline">
                            Ver roadmap do sistema
                        </Link>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
