'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Grid, Search, BookOpen, Settings, Bell, Moon, Sun,
    Menu, X, Baby, Heart, Stethoscope, User, Users, MessageCircle, Scale
} from 'lucide-react';
import { ChatDrawer, AssistantFAB } from './ChatDrawer';
import { txt } from '@/i18n/ptBR';
import { createClient } from '@/lib/supabase/client';

// ── Main nav items ────────────────────────────────────────────
const mainNav = [
    { href: '/', icon: Home, label: txt.nav.home },
    { href: '/ciap', icon: Search, label: txt.nav.ciap },
    { href: '/normas', icon: BookOpen, label: txt.nav.norms },
    { href: '/busca', icon: Search, label: 'Buscar no Guia' },
];

// ── Patient module nav ────────────────────────────────────────
const patientNav = [
    { href: '/pacientes/gestante', icon: Baby, label: 'Gestantes' },
    { href: '/pacientes/crianca', icon: Users, label: 'Crianças (CD)' },
    { href: '/pacientes/cronicos', icon: Stethoscope, label: 'Crônicos' },
    { href: '/pacientes/mulher', icon: Heart, label: 'Saúde da Mulher' },
    { href: '/pacientes/idosos', icon: User, label: 'Idosos' },
];

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
    return (
        <Link href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all text-sm font-semibold
        ${active
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}>
            <Icon size={17} className={active ? 'text-emerald-500' : ''} />
            {label}
        </Link>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [dark, setDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Dark mode
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
            document.documentElement.classList.add('dark');
            setDark(true);
        }
        // Online status
        setIsOnline(navigator.onLine);
        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));
        // User info from simple cookie
        const cookieVal = document.cookie
            .split('; ')
            .find(r => r.startsWith('aps_session='));
        if (cookieVal) {
            const email = decodeURIComponent(cookieVal.split('=')[1] ?? '');
            if (email) setUserName(email.split('@')[0]);
        }
    }, []);

    const toggleDark = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    const signOut = () => {
        document.cookie = 'aps_session=; path=/; max-age=0';
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">

            {/* Offline Banner */}
            {!isOnline && (
                <div role="alert" aria-live="assertive"
                    className="fixed top-0 left-0 right-0 z-[60] flex items-center gap-3 px-6 py-2.5 bg-amber-500 text-white text-xs font-bold shadow-lg">
                    📶 {txt.unhappy.offline.title}. {txt.unhappy.offline.body}
                </div>
            )}

            {/* Sidebar Overlay - Mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50
        flex flex-col w-72 md:w-64
        bg-white dark:bg-slate-900
        border-r border-slate-100 dark:border-slate-800
        p-4 transition-transform duration-300 ease-out shadow-2xl md:shadow-none overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-base">+</span>
                        </div>
                        <div>
                            <span className="font-black text-base tracking-tight block leading-none">Guia APS</span>
                            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Enfermagem</span>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Status */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-2.5 mb-5 flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                        {userName || 'Enfermagem'}
                    </p>
                </div>

                {/* General nav */}
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Geral</p>
                <nav className="space-y-0.5 mb-5">
                    {mainNav.map(item => (
                        <NavLink key={item.href} {...item} active={pathname === item.href} />
                    ))}
                </nav>

                {/* Patient modules */}
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Pacientes</p>
                <nav className="space-y-0.5 flex-1">
                    {patientNav.map(item => (
                        <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
                    ))}
                </nav>

                {/* Bottom */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1 mt-4">
                    <NavLink href="/settings" icon={Settings} label={txt.nav.settings} active={pathname === '/settings'} />
                    <NavLink href="/normas" icon={Scale} label="Normas + LGPD" active={pathname === '/normas'} />

                    <button onClick={toggleDark}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
                        {dark ? <Sun size={17} /> : <Moon size={17} />}
                        {dark ? txt.settings.lightMode : txt.settings.darkMode}
                    </button>
                    <button onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className={`h-14 flex items-center justify-between px-4 md:px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky z-30 border-b border-slate-100 dark:border-slate-800/50 ${!isOnline ? 'top-7' : 'top-0'}`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-xs">+</span>
                            </div>
                            <span className="font-black text-sm">Guia APS</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleDark} className="hidden md:flex p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            {dark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>
                        <button onClick={() => setChatOpen(!chatOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors">
                            <MessageCircle size={14} /> Assistente
                        </button>
                        <div onClick={signOut} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md"
                            title="Sair">
                            {userName[0]?.toUpperCase() ?? 'U'}
                        </div>
                    </div>
                </header>

                {/* Page */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8">
                    {children}
                </div>
            </main>

            {/* Bottom Nav - Mobile */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-around px-1 shadow-2xl shadow-black/10 z-40">
                <Link href="/" className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl ${pathname === '/' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <Home size={20} strokeWidth={pathname === '/' ? 2.5 : 2} /><span className="text-[9px] font-bold">Início</span>
                </Link>
                <Link href="/pacientes/gestante" className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl ${pathname.includes('gestante') ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <Baby size={20} strokeWidth={pathname.includes('gestante') ? 2.5 : 2} /><span className="text-[9px] font-bold">Gestantes</span>
                </Link>
                <Link href="/pacientes/crianca" className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl ${pathname.includes('crianca') ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <Users size={20} strokeWidth={pathname.includes('crianca') ? 2.5 : 2} /><span className="text-[9px] font-bold">CD</span>
                </Link>
                <Link href="/pacientes/cronicos" className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl ${pathname.includes('cronicos') ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <Stethoscope size={20} strokeWidth={pathname.includes('cronicos') ? 2.5 : 2} /><span className="text-[9px] font-bold">Crônicos</span>
                </Link>
                <Link href="/settings" className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl ${pathname === '/settings' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <Settings size={20} strokeWidth={pathname === '/settings' ? 2.5 : 2} /><span className="text-[9px] font-bold">Config</span>
                </Link>
            </nav>

            {/* Assistant */}
            <AssistantFAB onClick={() => setChatOpen(!chatOpen)} isOpen={chatOpen} />
            <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} demoMode={false} />
        </div>
    );
}
