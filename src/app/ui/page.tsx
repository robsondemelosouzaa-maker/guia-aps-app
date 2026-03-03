import React from 'react';
import AppShell from '@/components/AppShell';

export default function UIShowcase() {
    return (
        <AppShell>
            <div className="space-y-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight underline decoration-primary decoration-8 underline-offset-8">Guia de Estilo</h1>
                    <p className="text-slate-500 font-medium text-lg">Tokens de design, componentes e regras de UX.</p>
                </div>

                {/* Colors */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Paleta de Cores (Saúde Premium)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <ColorBlock color="#10B981" label="Primary (Emerald)" />
                        <ColorBlock color="#3B82F6" label="Secondary (Blue)" />
                        <ColorBlock color="#A7D8FF" label="CD / Puericultura" />
                        <ColorBlock color="#FFE7A3" label="Saúde da Mulher" />
                        <ColorBlock color="#FFB1CC" label="Gestante" />
                        <ColorBlock color="#BFEFD0" label="Hipertenso/Diab" />
                        <ColorBlock color="#F8FAFC" label="Background Light" />
                        <ColorBlock color="#0F172A" label="Background Dark" />
                    </div>
                </section>

                {/* Components */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Componentes</h2>
                    <div className="flex flex-wrap gap-4 items-start">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Botões</h3>
                            <div className="flex gap-4">
                                <button className="btn-primary">Ação Principal</button>
                                <button className="btn-secondary">Ação Secundária</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cards de Feedback</h3>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm text-sm font-bold">
                                Registro salvo com sucesso!
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-800 shadow-sm text-sm font-bold">
                                Ocorreu um erro ao salvar o rascunho.
                            </div>
                        </div>
                    </div>
                </section>

                {/* Principles */}
                <section className="space-y-6 bg-slate-100 dark:bg-slate-800/50 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold">Regras de Experiência (UX)</h2>
                    <ul className="list-disc list-inside space-y-3 font-medium text-slate-600 dark:text-slate-400">
                        <li><strong>Arquitetura de Escolha:</strong> CTAs claros e em posições previsíveis.</li>
                        <li><strong>Redução de Carga:</strong> Menos texto, mais reconhecimento visual.</li>
                        <li><strong>Unhappy Path:</strong> Estados de erro sempre oferecem um botão de retorno ou resgate.</li>
                        <li><strong>Vieses Éticos:</strong> Defaults que ajudam (Filtros padrão p/ hoje).</li>
                    </ul>
                </section>
            </div>
        </AppShell>
    );
}

function ColorBlock({ color, label }: { color: string, label: string }) {
    return (
        <div className="space-y-2">
            <div className="h-20 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-bold block truncate">{label}</span>
            <span className="text-[10px] text-slate-400 block font-mono lowercase">{color}</span>
        </div>
    );
}
