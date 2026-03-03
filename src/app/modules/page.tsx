'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import modulesData from '@/data/modules.json';
import { ArrowRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: any }> = {
    Critico: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: AlertCircle },
    'Alto risco': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', icon: AlertCircle },
    Pendente: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: Clock },
    'Em dia': { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle2 },
};

const iconMap: Record<string, string> = {
    Baby: '👶',
    Heart: '❤️',
    Activity: '🤰',
};

export default function ModulesPage() {
    return (
        <AppShell>
            <div className="space-y-6 max-w-3xl">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">Módulos de Cuidado</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Selecione uma área para ver protocolos e pacientes vinculados.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(modulesData as any[]).map((mod) => (
                        <Link key={mod.slug} href={`/modules/${mod.slug}`}>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl group cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all relative overflow-hidden">
                                {/* Accent blob */}
                                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: mod.accentColor }} />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md" style={{ backgroundColor: mod.accentColor + '60' }}>
                                        {iconMap[mod.icon] ?? '📋'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full font-bold">
                                            {mod.pendingCount} pendente{mod.pendingCount !== 1 ? 's' : ''}
                                        </span>
                                        <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="mt-4 relative z-10">
                                    <h2 className="font-black text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{mod.title}</h2>
                                    <p className="text-sm text-slate-400 font-medium mt-0.5">{mod.subtitle}</p>
                                </div>

                                {/* Mini patient preview */}
                                <div className="mt-4 flex gap-1 relative z-10">
                                    {(mod.patients as any[]).slice(0, 3).map((p: any) => (
                                        <div key={p.id}
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black border-2 border-white dark:border-slate-900 shadow"
                                            style={{ backgroundColor: mod.accentColor }}>
                                            <span className="text-slate-700">{p.name.charAt(0)}</span>
                                        </div>
                                    ))}
                                    {mod.patients.length > 3 && (
                                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 font-black border-2 border-white dark:border-slate-900">
                                            +{mod.patients.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
