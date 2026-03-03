'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { ChevronDown, ChevronUp, Shield, Heart, Baby, Eye, FileText, Scale, Smartphone, Syringe, Activity, BookOpen, Link as LinkIcon, Sparkles } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
interface Section {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    color: string;
    content: React.ReactNode;
}

// ── Helpers ──────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 mt-3">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                        {headers.map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className={`px-4 py-3 text-slate-700 dark:text-slate-300 ${j === 0 ? 'font-bold' : ''}`}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Highlight({ children, isWarning = false }: { children: React.ReactNode; isWarning?: boolean }) {
    if (isWarning) {
        return <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-2xl px-4 py-3 my-3 text-sm text-orange-800 dark:text-orange-200">{children}</div>;
    }
    return <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl px-4 py-3 my-3 text-sm text-emerald-800 dark:text-emerald-200">{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
    return <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full mr-1 mb-1">{children}</span>;
}

// ── Content Sections ─────────────────────────────────────────
const SECTIONS: Section[] = [
    {
        id: 'etica',
        icon: Scale,
        title: 'Ética e Deontologia',
        subtitle: 'Código de Ética (Resolução COFEN nº 564/2017)',
        color: 'slate',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>O exercício da enfermagem deve ser pautado em preceitos éticos e legais que garantam a segurança do paciente e do profissional. O <strong>Código de Ética dos Profissionais de Enfermagem (CEPE)</strong>, aprovado pela Resolução COFEN nº 564/2017, é a bússola para o comportamento profissional no cotidiano.</p>
                <Table
                    headers={['Categoria', 'Descrição']}
                    rows={[
                        ['Direitos', 'Exercer a profissão com autonomia e liberdade, recusando-se a realizar atividades que não sejam de sua competência técnica ou que não ofereçam segurança.'],
                        ['Deveres', 'Registrar no prontuário as informações inerentes ao processo de cuidar de forma clara, objetiva e cronológica. Assegurar assistência com consentimento prévio do paciente.'],
                        ['Proibições', 'É vedado delegar atividades privativas do enfermeiro a outros membros da equipe de saúde ou para acompanhantes/responsáveis pelo paciente.'],
                    ]}
                />
            </div>
        )
    },
    {
        id: 'pe',
        icon: FileText,
        title: 'Governança da Prática Profissional',
        subtitle: 'SAE e Processo de Enfermagem — Resolução COFEN nº 736/2024',
        color: 'blue',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>A transição normativa mais importante recente ocorreu com a publicação da <strong>Resolução COFEN nº 736/2024</strong> (substituindo a 358/2009), que estabelece que o Processo de Enfermagem (PE) deve ser implementado em todo contexto de cuidado.</p>
                <h4 className="font-black text-slate-900 dark:text-white mt-4">Etapas do Processo de Enfermagem</h4>
                <div className="flex flex-wrap mt-2">
                    <Pill>1. Avaliação</Pill>
                    <Pill>2. Diagnóstico</Pill>
                    <Pill>3. Planejamento</Pill>
                    <Pill>4. Implementação</Pill>
                    <Pill>5. Evolução</Pill>
                </div>
                <Highlight>
                    <strong>Atividades Privativas:</strong> O Diagnóstico de Enfermagem e a Prescrição de Enfermagem são atividades <strong>exclusivas (privativas)</strong> do enfermeiro. Toda documentação deve ser formalizada em prontuário, físico ou eletrônico.
                </Highlight>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <em>Nota sobre Resolução 699/2022:</em> Esta trata especificamente da concessão do Prêmio Anna Nery, não regendo a SAE nem o PE diretamente.
                </div>
            </div>
        )
    },
    {
        id: 'tele',
        icon: Smartphone,
        title: 'Inovação e Saúde Digital',
        subtitle: 'Telenfermagem — Resolução COFEN nº 696/2022',
        color: 'sky',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>A Saúde Digital foi normatizada pela Resolução COFEN nº 696/2022, definindo a <strong>Telenfermagem</strong> como o exercício da profissão mediado por Tecnologias de Informação e Comunicação (TIC).</p>
                <Table
                    headers={['Modalidade', 'Definição']}
                    rows={[
                        ['Consulta de Enfermagem', 'Avaliação remota do estado de saúde com foco no cuidado.'],
                        ['Monitoramento', 'Acompanhamento à distância de parâmetros de saúde.'],
                        ['Interconsulta', 'Troca de informações e opiniões entre enfermeiros ou com outros profissionais para auxílio clínico.'],
                        ['Educação em Saúde', 'Práticas que buscam aumentar a autonomia das pessoas via ferramentas digitais.'],
                    ]}
                />
                <Highlight>
                    Para a prática da Telenfermagem, é obrigatório registro ativo no COREN. O registro das consultas deve conter a identificação do profissional e paciente, preferencialmente <strong>com assinatura por certificado digital</strong>.
                </Highlight>
            </div>
        )
    },
    {
        id: 'diu',
        icon: Baby,
        title: 'Saúde Sexual e Reprodutiva',
        subtitle: 'Inserção de DIU — Resoluções COFEN (ex: 690/2022)',
        color: 'pink',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>As normas vigentes e atualizações reafirmam que o enfermeiro tem <strong>competência técnica</strong> no âmbito do Planejamento Familiar e Reprodutivo para realizar a inserção e retirada do Dispositivo Intrauterino (DIU) no SUS.</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Requisitos:</strong> O enfermeiro deve realizar a consulta de enfermagem prévia, solicitar exames indicados e seguir rigorosamente os protocolos institucionais e POPs da sua unidade/município.</li>
                    <li><strong>Registro:</strong> É obrigatória a descrição detalhada do procedimento, preenchimento de termo de consentimento e das tomadas de decisão no prontuário da paciente.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'vigilancia_vacinas',
        icon: Syringe,
        title: 'Vigilância em Saúde e Imunização',
        subtitle: 'Atualizações PNI 2024-2025 e Guia de Vigilância',
        color: 'amber',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>O Guia de Vigilância em Saúde (2022) e o Programa Nacional de Imunizações (PNI) tiveram <strong>atualizações críticas</strong> para os anos de 2024 e 2025.</p>
                <h4 className="font-black text-slate-900 dark:text-white mt-4">Principais Mudanças no PNI 2025</h4>
                <div className="space-y-3 mt-2">
                    <Highlight>
                        <strong>Poliomielite:</strong> Substituição total da vacina oral (gotinha VOPb) pela <strong>vacina inativada injetável (VIP)</strong>. O reforço aos 15 meses passa a ser feito exclusivamente com a VIP injetável.
                    </Highlight>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Vacina COVID-19:</strong> Inclusão definitiva no Calendário Nacional de rotina para crianças de 6 meses a menores de 5 anos de idade, e grupos prioritários.</li>
                        <li><strong>Influenza:</strong> Inclusão na rotina anual para crianças (6m a &lt;6a), gestantes e idosos.</li>
                        <li><strong>Vírus Sincicial Respiratório (VSR):</strong> Introdução do anticorpo monoclonal <em>Nirsevimabe</em> para prevenção em recém-nascidos e lactentes, e a vacina de VSR específica para gestantes.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'cronicos',
        icon: Activity,
        title: 'Manejo das Condições Crônicas',
        subtitle: 'Linhas de Cuidado (Adulto, HAS, DM)',
        color: 'red',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>As novas Linhas de Cuidado estabelecem o percurso assistencial ideal do paciente na rede, consolidando metas restritas para controle de complicações.</p>
                <Table
                    headers={['Agravo', 'Critério / Metas', 'Periodicidade (Alto risco)']}
                    rows={[
                        ['Hipertensão (HAS)', 'Sistólica ≥140 ou Diastólica ≥90 mmHg em 2 ocasiões. Meta <130/80 mmHg na maioria.', 'Mensal com o enfermeiro; trimestral com o médico.'],
                        ['Diabetes (DM)', 'Jejum ≥126 ou HbA1c ≥6,5%. Estratificação pelo escore FINDRISC.', 'Mensal com o enfermeiro; trimestral com o médico.'],
                    ]}
                />
            </div>
        )
    },
    {
        id: 'cancer',
        icon: Heart,
        title: 'Rastreamento Câncer Colo de Útero',
        subtitle: 'Diretrizes 2023 — Transição para DNA-HPV',
        color: 'purple',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>O câncer do colo do útero permanece como o 3º tipo mais incidente no Brasil. O <strong>Protocolo de 2023</strong> introduz a transição da citologia (Papanicolau) para a testagem molecular de DNA-HPV.</p>
                <Highlight isWarning>
                    Com o <strong>teste de DNA-HPV</strong> (rastreio de HPV de alto risco), o intervalo de coleta passa a ser a <strong>cada 5 anos</strong> caso o resultado seja negativo para as faixas etárias preconizadas da genotipagem.
                </Highlight>
                <p>O enfermeiro atua ativamente na coleta, no acompanhamento dos resultados e encaminhamento para colposcopia em caso de lesões de alto grau (HSIL/ASC-H), além do rastreio preventivo via Vacina HPV (que agora é <strong>dose única</strong> para 9 a 14 anos na rede pública).</p>
            </div>
        )
    },
    {
        id: 'conclusoes',
        icon: Shield,
        title: 'Conclusões e Implicações para o App',
        subtitle: 'A integração da teoria na prática digital',
        color: 'emerald',
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <p>Para que o aplicativo seja uma ferramenta de alto impacto prático, ele deve integrar as seguintes bases do Guia:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Checklists do PE:</strong> Avaliação rápida → Diagnóstico CIPE/NANDA → Plano/Conduta (conforme 736/2024).</li>
                    <li><strong>Módulo Telenfermagem:</strong> Campos prontos para monitoramento remoto com os requisitos da 696/2022.</li>
                    <li><strong>Calculadoras:</strong> IMC automatizado, Escore FINDRISC, risco cardiovascular, etc.</li>
                    <li><strong>Calendário Vacinal Inteligente:</strong> Já considerando VIP exclusiva p/ Pólio, e indicação de VSR/COVID pediátrica.</li>
                    <li><strong>Guia de Ética de Bolso:</strong> Para checagem rápida de delegação e competências durante o plantão na UBS.</li>
                </ul>
            </div>
        )
    }
];

// ── Fontes Modal ─────────────────────────────────────────────
function FontesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;

    const fontes = [
        { label: "Política Nacional de Atenção Básica (PNAB) - ARES", url: "https://ares.unasus.gov.br/acervo/handle/ARES/9814" },
        { label: "Portaria nº 2.436/2017 - Ministério da Saúde", url: "https://bvsms.saude.gov.br/bvs/saudelegis/gm/2017/prt2436_22_09_2017.html" },
        { label: "PNAB 2017: retrocessos e riscos - SciELO", url: "https://www.scielo.br/j/rsp/a/pX3v8w6v8Z6QZ5TqR5m2j9j/" },
        { label: "Competências na Saúde da Família - ResearchGate", url: "https://www.researchgate.net/publication/312061327_Competencias_dos_enfermeiros_na_estrategia_Saude_da_Familia" },
        { label: "PNAB mapa mental e princípios - Medcel", url: "https://www.medcel.com.br/conteudos/pnab-atencao-basica" },
        { label: "Sistematização da Assistência - Grupo IBES", url: "https://www.ibes.med.br/nova-diretriz-sobre-sistematizacao-da-assistencia-de-enfermagem/" },
        { label: "Resolução COFEN nº 736/2024 (Processo de Enfermagem)", url: "https://www.cofen.gov.br/resolucao-cofen-no-736-de-17-de-janeiro-de-2024/" },
        { label: "Resolução COFEN nº 699/2022", url: "https://www.cofen.gov.br/resolucao-cofen-no-699-2022/" },
        { label: "Diretrizes Rastreamento Câncer Colo Útero 2023 - GOV", url: "https://www.gov.br/conitec/pt-br/assuntos/noticias/2023/maio/aprovada-diretrizes-brasileiras-para-o-rastreamento-do-cancer-de-colo-do-utero" }
    ];

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center">
                                <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="font-black text-xl">Fontes Pesquisadas</h2>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {fontes.map((f, i) => (
                            <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <LinkIcon size={16} className="mt-0.5 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                    {f.label}
                                </span>
                            </a>
                        ))}
                    </div>

                    <button onClick={onClose} className="mt-6 w-full h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl transition-all hover:opacity-90">
                        Fechar
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Propósito de Criação Modal ────────────────────────────────
function PropositoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/40 rounded-2xl flex items-center justify-center">
                            <Sparkles size={20} className="text-pink-500 dark:text-pink-400" />
                        </div>
                        <div>
                            <h2 className="font-black text-xl">Propósito de Criação</h2>
                            <p className="text-xs text-slate-400 font-medium">Por que este app existe</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p>
                            Assisti, por muitos anos, minha esposa <strong>Valéria</strong> chegar em casa exausta — não pelo peso do cansaço, mas pelo peso da responsabilidade.
                            Ela carrega na rotina diária a vida de gestantes, crianças, idosos e famílias inteiras que dependem do seu cuidado.
                            Vi de perto a sua dedicação silenciosa, os protocolos decorados de tanto reler, as orientações cuidadosas, o olhar que enxerga além do sintoma e alcança
                            o ser humano.
                        </p>

                        <p>
                            Esse sistema nasceu do amor que tenho por ela e do respeito que tenho pelo que ela representa.
                            O <strong>Guia APS</strong> foi construído para que Valéria — e cada enfermeira como ela — possa dedicar ao paciente o que é mais valioso:
                            <strong> tempo, atenção e excelência clínica</strong>. Para que a burocracia seja menor, o acerto seja maior, e o cuidado chegue mais longe.
                        </p>

                        <p>
                            Quando vimos os indicadores da unidade melhorarem, decidimos não guardar isso só para nós.
                            Se uma ferramenta pode transformar uma UBS, ela pode transformar muitas.
                            E por isso que o Guia APS existe hoje como plataforma — para honrar a enfermagem brasileira que,
                            dia após dia, sustenta o SUS com competência e com o coração.
                        </p>

                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-100 dark:border-pink-900 rounded-2xl p-4 mt-4">
                            <p className="text-sm italic font-semibold text-slate-800 dark:text-slate-200">
                                Robson Sousa — para Valéria Sousa, e para a enfermagem brasileira.
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Novo Gama, Goiás · 2025</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="mt-6 w-full h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl transition-all hover:opacity-90">
                        Fechar
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Accordion item ────────────────────────────────────────────
function AccordionItem({ section }: { section: Section }) {
    const [open, setOpen] = useState(false);
    const Icon = section.icon;

    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
        red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        sky: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    };

    return (
        <div className={`border rounded-3xl overflow-hidden transition-shadow ${open ? 'shadow-md' : 'shadow-sm'} bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800`}>
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${colorMap[section.color]}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{section.title}</p>
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{section.subtitle}</p>
                </div>
                <div className="shrink-0 text-slate-400">
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {open && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-50 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                    {section.content}
                </div>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function NormasPage() {
    const [fontesOpen, setFontesOpen] = useState(false);
    const [propositoOpen, setPropositoOpen] = useState(false);

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black">Tratado da Prática</h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">
                            Análise Técnica e Operacional das Diretrizes para a Enfermagem na APS
                        </p>
                    </div>
                </div>

                {/* Intro banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-5">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        O cenário de saúde exige do profissional uma atuação baseada em arcabouços normativos robustos.
                        Neste manual, traduzimos diretrizes em fluxos assistenciais vivos, fornecendo subsídio técnico para ferramentas e atendimento seguro na base do SUS.
                    </p>
                </div>

                {/* Accordion Sections */}
                <div className="space-y-3">
                    {SECTIONS.map(s => (
                        <AccordionItem key={s.id} section={s} />
                    ))}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col items-center justify-center gap-3 pt-6 pb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={() => setFontesOpen(true)} className="flex items-center gap-2 px-5 py-3 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl text-slate-700 dark:text-slate-300 font-bold transition-all shadow-sm">
                            <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                            Ver Fontes
                        </button>
                        <button onClick={() => setPropositoOpen(true)} className="flex items-center gap-2 px-5 py-3 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 rounded-2xl text-slate-700 dark:text-slate-300 font-bold transition-all shadow-sm">
                            <Sparkles size={16} className="text-pink-500 dark:text-pink-400" />
                            Motivação e Propósito
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-2">Guia APS · v2.0</p>
                </div>
            </div>

            <FontesModal open={fontesOpen} onClose={() => setFontesOpen(false)} />
            <PropositoModal open={propositoOpen} onClose={() => setPropositoOpen(false)} />
        </AppShell>
    );
}
