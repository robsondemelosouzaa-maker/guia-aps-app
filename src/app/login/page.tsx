'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED = 'valeriaassessoria1@gmail.com';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (email.trim().toLowerCase() !== ALLOWED) {
            setError('E-mail não autorizado. Entre em contato com o administrador.');
            setLoading(false);
            return;
        }

        // Salva sessão simples em cookie (30 dias)
        document.cookie = `aps_session=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 30}`;
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-6">
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-4">
                        <span className="text-white font-black text-3xl">+</span>
                    </div>
                    <h1 className="text-white font-black text-2xl">Guia APS</h1>
                    <p className="text-emerald-300/70 text-sm font-medium mt-1">Assistente de Enfermagem</p>
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <h2 className="text-white font-black text-xl mb-1">Entrar</h2>
                            <p className="text-slate-400 text-sm">Digite seu e-mail para acessar.</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                                placeholder="seu@email.com"
                                autoComplete="email"
                                className="w-full h-12 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-2xl px-4 focus:outline-none focus:border-emerald-400 transition-colors text-sm"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs font-semibold bg-red-900/20 border border-red-800 rounded-xl px-3 py-2">
                                ❌ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 active:scale-[0.98]">
                            {loading ? 'Entrando…' : 'Entrar →'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    Acesso restrito a profissionais autorizados.
                </p>
            </div>
        </div>
    );
}
