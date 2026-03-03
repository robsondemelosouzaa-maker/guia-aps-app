'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Type, Moon, ShieldCheck, Sun, Info, Bell, Wifi } from 'lucide-react';

const FONT_SIZES = {
    sm: '14px',
    md: '16px',
    lg: '19px',
} as const;

type FontSize = keyof typeof FONT_SIZES;

export default function SettingsPage() {
    const [dark, setDark] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [notifs, setNotifs] = useState(true);
    const [offline, setOffline] = useState(false);
    const [fontSize, setFontSize] = useState<FontSize>('md');

    // Rehydrate from localStorage
    useEffect(() => {
        setDark(document.documentElement.classList.contains('dark'));
        const stored = localStorage.getItem('aps_fontSize') as FontSize | null;
        if (stored && FONT_SIZES[stored]) {
            setFontSize(stored);
            document.documentElement.style.fontSize = FONT_SIZES[stored];
        }
    }, []);

    const toggleDark = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    const changeFontSize = (size: FontSize) => {
        setFontSize(size);
        document.documentElement.style.fontSize = FONT_SIZES[size];
        localStorage.setItem('aps_fontSize', size);
    };

    return (
        <AppShell>
            <div className="max-w-xl mx-auto space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
                    <p className="text-slate-500 text-sm font-medium">Personalize para seu conforto e segurança.</p>
                </div>

                {/* Acessibilidade */}
                <Section title="Acessibilidade">
                    <SettingRow
                        icon={Type}
                        label="Tamanho da Fonte"
                        description="Ajuste para melhorar a leitura em campo."
                        action={
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-0.5">
                                {(['sm', 'md', 'lg'] as const).map((size) => (
                                    <button key={size} onClick={() => changeFontSize(size)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all
                      ${fontSize === size ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                                        {size === 'sm' ? 'A-' : size === 'md' ? 'A' : 'A+'}
                                    </button>
                                ))}
                            </div>
                        }
                    />
                    <SettingRow
                        icon={dark ? Sun : Moon}
                        label="Modo Escuro"
                        description="Reduz o cansaço visual em turnos noturnos."
                        action={<Toggle value={dark} onChange={toggleDark} />}
                    />
                </Section>

                {/* Segurança */}
                <Section title="Privacidade & Segurança">
                    <SettingRow
                        icon={ShieldCheck}
                        label="Modo Demonstração"
                        description="Oculta nomes e dados sensíveis de pacientes."
                        action={<Toggle value={demoMode} onChange={() => setDemoMode(!demoMode)} />}
                    />
                    {demoMode && (
                        <div className="mx-1 mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 rounded-xl flex gap-3">
                            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                                <strong>Ativo!</strong> Nomes e CPFs estão sendo exibidos ocultados agora.
                            </p>
                        </div>
                    )}
                </Section>

                {/* Notificações e Conectividade */}
                <Section title="Notificações & Sistema">
                    <SettingRow
                        icon={Bell}
                        label="Notificações"
                        description="Receba alertas de pendências críticas."
                        action={<Toggle value={notifs} onChange={() => setNotifs(!notifs)} />}
                    />
                    <SettingRow
                        icon={Wifi}
                        label="Modo Offline (Fase 3)"
                        description="Em breve: funcionar sem internet na UBS."
                        action={<Toggle value={offline} onChange={() => setOffline(!offline)} disabled />}
                    />
                </Section>

                {/* About */}
                <div className="text-center pt-4 space-y-1">
                    <p className="text-xs text-slate-400 font-semibold">Guia APS · v2.0</p>
                    <p className="text-xs text-slate-300 dark:text-slate-600">Desenvolvido com cuidado para a Atenção Primária 💚</p>
                </div>
            </div>
        </AppShell>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-2">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{title}</p>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
                {children}
            </div>
        </section>
    );
}

function SettingRow({ icon: Icon, label, description, action }: any) {
    return (
        <div className="flex items-center gap-4 px-5 py-4">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 shrink-0">
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            {action}
        </div>
    );
}

function Toggle({ value, onChange, disabled = false }: { value: boolean; onChange: () => void; disabled?: boolean }) {
    return (
        <button onClick={onChange} disabled={disabled}
            className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 shrink-0
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${value ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}>
            <div className="w-5 h-5 bg-white rounded-full shadow-md" />
        </button>
    );
}
