'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { Users, ClipboardList, Activity, ArrowUpRight, TrendingUp, Baby, Heart, Activity as ActivityIcon } from 'lucide-react';

const patients = [
    { id: '1', name: 'João da Silva', info: 'Hipertensivo · CD atrasada · PA 165/100', status: 'Critico', color: '#BFEFD0', href: '/pacientes/cronicos' },
    { id: '2', name: 'Maria Oliveira', info: 'Gestante 32ª sem. · Pré-natal hoje', status: 'Em dia', color: '#FFB1CC', href: '/pacientes/gestante' },
    { id: '3', name: 'Ricardo Santos', info: 'Diabético · Renovação de Receita', status: 'Pendente', color: '#BFEFD0', href: '/pacientes/cronicos' },
    { id: '4', name: 'Ana Souza', info: 'Gestante 14ª sem. · PA elevada', status: 'Alto risco', color: '#FFB1CC', href: '/pacientes/gestante' },
];

const quickAccess = [
    { label: 'Gestante', icon: '🤰', color: '#FFB1CC', href: '/pacientes/gestante' },
    { label: 'Puerpério', icon: '🍼', color: '#F9A8D4', href: '/pacientes/puerperio' },
    { label: 'CD', icon: '👶', color: '#A7D8FF', href: '/pacientes/crianca' },
    { label: 'Idoso', icon: '👵', color: '#FFE7A3', href: '/pacientes/idosos' },
    { label: 'Crônicos', icon: '❤️', color: '#BFEFD0', href: '/pacientes/cronicos' },
    { label: 'S. da Mulher', icon: '🌸', color: '#D8B4E2', href: '/pacientes/mulher' },
];

const statusStyle: Record<string, string> = {
    Critico: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    'Alto risco': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    Pendente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'Em dia': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

// Define structure for stats
interface Counts {
    pregnantTotal: number;
    pregnantBorn: number;
    childrenTotal: number;
    chronicTotal: number;
    womenTotal: number;
    elderlyTotal: number;
}

export default function DashboardPage() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    // Pegar nome do usuario no localStorage ou fallback
    const [userName, setUserName] = useState<string>('Enfermeiro(a)');
    const [counts, setCounts] = useState<Counts | null>(null);
    const [loadingCounts, setLoadingCounts] = useState(true);

    useEffect(() => {
        // Obter nome
        try {
            const acc = localStorage.getItem('aps_account');
            if (acc) {
                const parsed = JSON.parse(acc);
                if (parsed.name) setUserName(parsed.name);
            }
        } catch (e) {
            console.error('No account format found', e);
        }

        // Fetch de métricas exatas do Supabase
        async function fetchExactCounts() {
            setLoadingCounts(true);
            try {
                const res = await fetch('/api/assistant/counts');
                if (res.ok) {
                    const data = await res.json();
                    setCounts(data as Counts);
                }
            } catch (err) {
                console.error("Failed to fetch exact counts:", err);
            } finally {
                setLoadingCounts(false);
            }
        }

        fetchExactCounts();
    }, []);

    const metrics = [
        { icon: '👶', label: 'Crianças (CD)', value: counts ? counts.childrenTotal : '--', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
        { icon: '🤰', label: 'Gestantes', value: counts ? counts.pregnantTotal : '--', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
        { icon: '🍼', label: 'Puérperas', value: counts ? counts.pregnantBorn : '--', color: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300' },
        { icon: '👵', label: 'Idosos', value: counts ? counts.elderlyTotal : '--', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
        { icon: '🌸', label: 'Mulheres', value: counts ? counts.womenTotal : '--', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
        { icon: '❤️', label: 'HAS / DM', value: counts ? counts.chronicTotal : '--', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    ];

    return (
        <AppShell>
            {/* Greeting */}
            <div className="space-y-1 mb-6">
                <h1 className="text-3xl font-black tracking-tight">{greeting}, {userName} 👋</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Seu painel clínico individualizado. Você tem <Link href="/pacientes/cronicos" className="text-emerald-600 font-bold hover:underline">4 pacientes em atenção prioritária</Link>.
                </p>
            </div>

            {/* Metrics - Population stats */}
            <section className="space-y-3 mb-8">
                <div className="flex items-center gap-2 pl-1 mb-1">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sua População Acompanhada</h2>
                    {loadingCounts && <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {metrics.map(({ icon, label, value, color }) => (
                        <div key={label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl space-y-2 shadow-soft hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mt-1">
                                <span className={`text-xl flex items-center justify-center w-10 h-10 rounded-2xl ${color}`}>
                                    {icon}
                                </span>
                            </div>
                            <div>
                                <p className="text-3xl font-black tracking-tighter mt-2">{value}</p>
                                <p className="text-xs text-slate-500 font-bold mt-1 max-w-[80px] leading-tight">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Access */}
            <section className="space-y-3 mb-8">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Atalhos Clínicos</h2>
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
                    {quickAccess.map(({ label, icon, color, href }) => (
                        <Link key={label} href={href} className="shrink-0">
                            <div className="px-5 py-4 rounded-3xl font-bold flex flex-col items-center justify-center gap-2 group hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-w-[110px]" style={{ backgroundColor: color + '20', border: `1.5px solid ${color}50` }}>
                                <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                                <span className="text-xs text-slate-700 dark:text-slate-200">{label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Priority Pendencies */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                        Situações Críticas (Meus Pacientes)
                    </h2>
                    <Link href="/pacientes/gestante" className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline flex items-center gap-1">
                        Ver todos <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div className="space-y-3">
                    {patients.map((p) => (
                        <Link key={p.id} href={p.href}>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-slate-700 text-lg shrink-0" style={{ backgroundColor: p.color + '70' }}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{p.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{p.info}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide ${statusStyle[p.status]}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </AppShell>
    );
}
