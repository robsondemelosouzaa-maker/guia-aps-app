'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { Scale, Shield, FileCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

/* ================================================================
   NORMAS / PORTARIAS / LGPD — Conteúdo do texto técnico-legal.
   ================================================================ */

interface Section {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    content: { subtitle: string; text: string }[];
}

const SECTIONS: Section[] = [
    {
        id: 'base-legal',
        title: '1. Base Legal da Prescrição de Enfermagem',
        icon: Scale,
        color: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900',
        content: [
            { subtitle: 'Lei nº 7.498/1986 (Art. 11)', text: 'O enfermeiro exerce todas as atividades de enfermagem, cabendo-lhe privativamente a consulta de enfermagem e a prescrição da assistência. Como integrante da equipe de saúde, tem a atribuição de prescrever medicamentos estabelecidos em programas de saúde pública e em rotinas aprovadas pela instituição de saúde.' },
            { subtitle: 'Decreto nº 94.406/1987', text: 'Regulamenta a Lei 7.498/86. Reforça a necessidade de que a atividade prescritiva esteja vinculada a protocolos institucionais, garantindo que o ato profissional não ocorra de forma aleatória, mas fundamentado em diretrizes clínicas validadas.' },
            { subtitle: 'Portaria GM/MS nº 2.436/2017', text: 'Política Nacional de Atenção Básica. Ratifica a autonomia do enfermeiro para prescrever conforme protocolos do SUS.' },
            { subtitle: 'Resolução COFEN nº 801/2026', text: 'Consolida as diretrizes para prescrição de medicamentos por enfermeiros. Sistematiza as normas técnicas e éticas para o ato prescritivo moderno. Contém Anexo II com relação exemplificativa de medicamentos.' },
            { subtitle: 'Limitação Legal Importante', text: 'A legislação não concede ao enfermeiro a liberdade de prescrever em consultórios particulares de forma isolada, sem a presença de uma equipe de saúde ou sem o respaldo de protocolos formais. A competência está vinculada à integração do profissional em redes de atenção à saúde, sejam públicas ou privadas.' },
        ],
    },
    {
        id: 'processo-enfermagem',
        title: '2. Processo de Enfermagem e SAE',
        icon: FileCheck,
        color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900',
        content: [
            { subtitle: 'Resolução COFEN nº 736/2024', text: 'Normatiza a implementação do Processo de Enfermagem (PE), garantindo que a medicação seja precedida de diagnóstico e sucedida por avaliação. A prescrição de medicamentos não é um ato mecânico, mas uma intervenção de enfermagem que decorre de um julgamento clínico.' },
            { subtitle: 'Segurança do Paciente', text: 'O enfermeiro é a barreira de segurança final. A técnica dos "certos" (paciente certo, dose certa, via certa, horário certo, medicamento certo) é complementada pela obrigatoriedade de notificar qualquer evento adverso relacionado à medicação aos órgãos de vigilância sanitária e farmacovigilância.' },
        ],
    },
    {
        id: 'requisitos-prescricao',
        title: '3. Requisitos Obrigatórios da Prescrição',
        icon: FileCheck,
        color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900',
        content: [
            { subtitle: 'Identificação do Protocolo', text: 'Nome oficial e ano de publicação do protocolo clínico utilizado.' },
            { subtitle: 'Dados da Instituição', text: 'Nome do serviço de saúde e CNPJ da instituição.' },
            { subtitle: 'Identificação do Profissional', text: 'Nome completo, categoria profissional e número do COREN.' },
            { subtitle: 'Denominação do Fármaco', text: 'A prescrição deve ser identificada obrigatoriamente pela denominação genérica (substância ativa), conforme Resolução COFEN nº 801/2026.' },
            { subtitle: 'Detalhamento do Fármaco', text: 'DCB (Denominação Comum Brasileira), via de administração, dose e posologia.' },
            { subtitle: 'Identificação do Usuário', text: 'Nome completo, nome social (quando aplicável) e identificador do paciente.' },
        ],
    },
    {
        id: 'solicitacao-exames',
        title: '4. Solicitação de Exames',
        icon: FileCheck,
        color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900',
        content: [
            { subtitle: 'Resolução COFEN nº 195/1997', text: 'Dispõe sobre a solicitação de exames de rotina e complementares por enfermeiros. A lógica subjacente é que a prescrição segura de medicamentos exige uma avaliação clínica completa, que muitas vezes depende de resultados laboratoriais ou exames de imagem.' },
        ],
    },
    {
        id: 'limites-eticos',
        title: '5. Limites Éticos e Administrativos',
        icon: Shield,
        color: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900',
        content: [
            { subtitle: 'Vinculação a Protocolos', text: 'A lista de medicamentos autorizada, embora vasta, está estritamente vinculada à existência de protocolos e à inserção do profissional em equipes de saúde.' },
            { subtitle: 'Contexto Institucional', text: 'A atividade prescritiva não ocorre de forma aleatória, mas sim fundamentada em diretrizes clínicas validadas por gestores e órgãos técnicos.' },
            { subtitle: 'Notificação de Eventos', text: 'Obrigatoriedade de notificar qualquer evento adverso relacionado à medicação aos órgãos de vigilância sanitária e farmacovigilância.' },
        ],
    },
    {
        id: 'governanca',
        title: '6. Governança Clínica e Segurança',
        icon: Shield,
        color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900',
        content: [
            { subtitle: 'Resolutividade do SUS', text: 'O protagonismo do enfermeiro como prescritor amplia a resolutividade do SUS, transformando a competência técnica em acesso à saúde para a população.' },
            { subtitle: 'Rol Exemplificativo', text: 'A Resolução COFEN nº 801/2026 estabelece um rol exemplificativo de medicamentos que configuram a relação mínima reconhecida para subsidiar protocolos locais e institucionais. Este rol não é exaustivo, mas serve de base para que instituições desenvolvam seus próprios protocolos.' },
            { subtitle: 'Capacitação Profissional', text: 'A competência prescritiva requer qualificação contínua e está vinculada à demonstração de competência técnica pelo profissional de enfermagem.' },
        ],
    },
];

// Tabela de requisitos obrigatórios
const REQUISITOS_TABLE = [
    { requisito: 'Identificação do Protocolo', detalhe: 'Nome oficial e ano de publicação do protocolo clínico utilizado' },
    { requisito: 'Dados da Instituição', detalhe: 'Nome do serviço de saúde e CNPJ' },
    { requisito: 'Identificação do Profissional', detalhe: 'Nome completo, categoria profissional e número do COREN' },
    { requisito: 'Denominação do Fármaco', detalhe: 'DCB (Denominação Comum Brasileira)' },
    { requisito: 'Detalhamento do Fármaco', detalhe: 'Via de administração, dose e posologia' },
    { requisito: 'Identificação do Usuário', detalhe: 'Nome completo, nome social e identificador do paciente' },
];

// Tabela de hierarquia legal
const HIERARQUIA_TABLE = [
    { dispositivo: 'Lei nº 7.498/1986', objeto: 'Regulamentação do Exercício Profissional', impacto: 'Define a prescrição em programas de saúde pública como atribuição do enfermeiro.' },
    { dispositivo: 'Decreto nº 94.406/1987', objeto: 'Regulamentação do Exercício da Enfermagem', impacto: 'Estabelece o contexto de rotinas e protocolos para a prescrição de medicamentos.' },
    { dispositivo: 'Portaria GM/MS nº 2.436/2017', objeto: 'Política Nacional de Atenção Básica', impacto: 'Ratifica a autonomia do enfermeiro para prescrever conforme protocolos do SUS.' },
    { dispositivo: 'Resolução COFEN nº 801/2026', objeto: 'Consolidação das Diretrizes de Prescrição', impacto: 'Sistematiza as normas técnicas e éticas para o ato prescritivo moderno.' },
];

export default function NormasPage() {
    const [openSection, setOpenSection] = useState<string | null>('base-legal');

    return (
        <AppShell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Scale className="text-emerald-500" size={24} />
                        Normas, Portarias e Governança
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Marcos regulatórios, requisitos obrigatórios e limites éticos da prescrição de enfermagem no SUS.
                    </p>
                </div>

                {/* Quadro de Hierarquia Legal */}
                <section className="space-y-3">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Hierarquia das Normas</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800">
                                    <th className="text-left px-3 py-2 font-black text-slate-500 uppercase tracking-widest">Dispositivo Legal</th>
                                    <th className="text-left px-3 py-2 font-black text-slate-500 uppercase tracking-widest">Objeto Principal</th>
                                    <th className="text-left px-3 py-2 font-black text-slate-500 uppercase tracking-widest">Impacto na Terapia Medicamentosa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {HIERARQUIA_TABLE.map((row, i) => (
                                    <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="px-3 py-2 font-bold text-emerald-700 dark:text-emerald-300">{row.dispositivo}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.objeto}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.impacto}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quadro de Requisitos Obrigatórios */}
                <section className="space-y-3">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Requisitos Obrigatórios para Validade da Prescrição</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {REQUISITOS_TABLE.map((req, i) => (
                            <div key={i} className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl px-4 py-3">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{req.requisito}</p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-1">{req.detalhe}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Seções Acordeão */}
                <section className="space-y-2">
                    {SECTIONS.map(section => {
                        const isOpen = openSection === section.id;
                        const Icon = section.icon;
                        return (
                            <div key={section.id} className={`border rounded-2xl overflow-hidden ${section.color}`}>
                                <button onClick={() => setOpenSection(isOpen ? null : section.id)}
                                    className="w-full px-4 py-3 flex items-center justify-between text-left">
                                    <div className="flex items-center gap-2">
                                        <Icon size={16} />
                                        <span className="font-bold text-sm">{section.title}</span>
                                    </div>
                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-black/5 dark:border-white/5">
                                        {section.content.map((item, i) => (
                                            <div key={i} className="mt-3">
                                                <p className="text-xs font-bold">{item.subtitle}</p>
                                                <p className="text-xs opacity-80 mt-1 leading-relaxed">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>

                {/* Warning */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl px-4 py-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 dark:text-amber-300">
                            Todo conteúdo desta seção foi extraído do texto técnico-legal fornecido, sem acréscimos.
                            Para informações sobre Prescrição Digital, Assinatura Eletrônica, ANVISA/SNGPC e LGPD,
                            consulte documentos complementares não cobertos pelo texto-fonte atual.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
