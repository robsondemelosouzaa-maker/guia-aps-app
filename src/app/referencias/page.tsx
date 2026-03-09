'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { BookOpen, FileText, Scale, Stethoscope, BookMarked } from 'lucide-react';

/* ================================================================
   REFERÊNCIAS — Extraídas do texto técnico-legal fornecido.
   ================================================================ */

interface Reference {
    title: string;
    type: string;
    description: string;
    year: string | null;
}

const REFERENCES: Reference[] = [
    // Leis
    { title: 'Lei nº 7.498/1986', type: 'Lei', description: 'Dispõe sobre a regulamentação do exercício da enfermagem. Define a prescrição em programas de saúde pública como atribuição do enfermeiro (Art. 11).', year: '1986' },
    // Decretos
    { title: 'Decreto nº 94.406/1987', type: 'Decreto', description: 'Regulamenta a Lei 7.498/86. Estabelece o contexto de rotinas e protocolos para a prescrição de medicamentos pelo enfermeiro.', year: '1987' },
    // Portarias
    { title: 'Portaria GM/MS nº 2.436/2017', type: 'Portaria', description: 'Política Nacional de Atenção Básica (PNAB). Ratifica a autonomia do enfermeiro para prescrever conforme protocolos do SUS.', year: '2017' },
    // Resoluções COFEN
    { title: 'Resolução COFEN nº 195/1997', type: 'Resolução COFEN', description: 'Dispõe sobre a solicitação de exames de rotina e complementares por enfermeiros.', year: '1997' },
    { title: 'Resolução COFEN nº 736/2024', type: 'Resolução COFEN', description: 'Normatiza a implementação do Processo de Enfermagem (PE), garantindo que a medicação seja precedida de diagnóstico e sucedida por avaliação.', year: '2024' },
    { title: 'Resolução COFEN nº 801/2026', type: 'Resolução COFEN', description: 'Consolida as diretrizes para prescrição de medicamentos por enfermeiros. Sistematiza normas técnicas e éticas para o ato prescritivo. Contém Anexo II com relação exemplificativa de medicamentos.', year: '2026' },
    // Protocolos Clínicos
    { title: 'PCDT IST — Protocolos Clínicos e Diretrizes Terapêuticas para IST', type: 'Protocolo Clínico', description: 'Protocolos do Ministério da Saúde para manejo sindrômico de corrimentos e úlceras genitais.', year: null },
    { title: 'PCDT PEP — Profilaxia Pós-Exposição ao HIV', type: 'Protocolo Clínico', description: 'Protocolo do Ministério da Saúde para esquema de profilaxia pós-exposição usando TDF + 3TC + DTG.', year: null },
    { title: 'PCDT PrEP — Profilaxia Pré-Exposição ao HIV', type: 'Protocolo Clínico', description: 'Protocolo do Ministério da Saúde para profilaxia pré-exposição usando TDF/FTC 300/200mg.', year: null },
    { title: 'Protocolo Nacional de Tuberculose', type: 'Protocolo Clínico', description: 'Esquema quaternário para tratamento de TB (Rifampicina, Isoniazida, Pirazinamida e Etambutol) sob Tratamento Diretamente Observado (TDO).', year: null },
    { title: 'Protocolo Nacional de Hanseníase', type: 'Protocolo Clínico', description: 'Poliquimioterapia (PQT) para tratamento da Hanseníase, incluindo medicamentos adjuvantes.', year: null },
    { title: 'Protocolo de Manejo da Dengue', type: 'Protocolo Clínico', description: 'Diretrizes para hidratação e manejo sintomático da Dengue. ALERTA: proibição de AAS e AINEs.', year: null },
    { title: 'Protocolos de Planejamento Reprodutivo', type: 'Protocolo Clínico', description: 'Diretrizes para prescrição e renovação de métodos contraceptivos e suplementação vitamínica no pré-natal.', year: null },
    { title: 'Protocolos de Acompanhamento de Crônicos na APS', type: 'Protocolo Clínico', description: 'Diretrizes para renovação de receitas e monitoramento de pacientes estáveis com Hipertensão e Diabetes na Atenção Primária.', year: null },
    { title: 'Programa Nacional de Cessação do Tabagismo', type: 'Programa de Saúde', description: 'Diretrizes para terapia de reposição nicotínica com adesivos transdérmicos e goma de mascar.', year: null },
];

const TYPES_ORDER = ['Lei', 'Decreto', 'Portaria', 'Resolução COFEN', 'Protocolo Clínico', 'Programa de Saúde'];

const typeIcons: Record<string, React.ElementType> = {
    'Lei': Scale,
    'Decreto': FileText,
    'Portaria': FileText,
    'Resolução COFEN': BookOpen,
    'Protocolo Clínico': Stethoscope,
    'Programa de Saúde': BookMarked,
};

const typeColors: Record<string, string> = {
    'Lei': 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'Decreto': 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    'Portaria': 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
    'Resolução COFEN': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'Protocolo Clínico': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'Programa de Saúde': 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
};

export default function ReferenciasPage() {
    const grouped = TYPES_ORDER.map(type => ({
        type,
        items: REFERENCES.filter(r => r.type === type),
    })).filter(g => g.items.length > 0);

    return (
        <AppShell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <BookOpen className="text-emerald-500" size={24} />
                        Referências Normativas e Técnicas
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Base legal, resoluções do COFEN e protocolos clínicos do Ministério da Saúde citados no texto técnico-legal.
                    </p>
                </div>

                {grouped.map(({ type, items }) => {
                    const Icon = typeIcons[type] ?? FileText;
                    const colorClass = typeColors[type] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                    return (
                        <section key={type} className="space-y-3">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                                <Icon size={14} /> {type === 'Resolução COFEN' ? 'Resoluções COFEN' : type + 's'}
                            </h2>
                            <div className="space-y-2">
                                {items.map(ref => (
                                    <div key={ref.title} className={`p-4 rounded-2xl border ${colorClass}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-bold text-sm">{ref.title}</h3>
                                                <p className="text-xs mt-1 opacity-80">{ref.description}</p>
                                            </div>
                                            {ref.year && (
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 shrink-0">
                                                    {ref.year}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3">
                    <p className="text-[10px] text-slate-400">
                        Fonte: Texto técnico-legal fornecido &mdash; &quot;Análise Abrangente da Atuação do Enfermeiro na Terapia Medicamentosa&quot;.
                        Referências extraídas sem acréscimos ou invenções.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
