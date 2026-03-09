'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { Search, ChevronDown, ChevronUp, Pill, AlertTriangle, FileText, X } from 'lucide-react';

/* ================================================================
   DADOS ESTRUTURADOS — Extraídos do texto técnico-legal fornecido.
   Organizados por FINALIDADE CLÍNICA.
   ================================================================ */

interface Prescription {
    id: number;
    title: string;
    type: string;
    category: string;
    indication: string;
    protocol_name: string;
    legal_basis: string;
    dosage_info: string | null;
    route: string | null;
    warnings: string | null;
    notes: string | null;
}

// ═══════════════════════════════════════════════════════════════
// CATEGORIAS POR FINALIDADE CLÍNICA (ordem do usuário)
// ═══════════════════════════════════════════════════════════════
const CATEGORY_ORDER = [
    'Medicações Sintomáticas',
    'IST',
    'Saúde da Mulher',
    'Pré-natal',
    'Hipertensão',
    'Diabetes',
    'HIV',
    'Tuberculose',
    'Hanseníase',
    'Dengue',
    'Antiparasitários',
    'Dermatologia',
    'Tabagismo',
    'Saúde da Criança',
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    'Medicações Sintomáticas': { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-200', border: 'border-slate-200 dark:border-slate-700', badge: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' },
    'IST': { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-900', badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' },
    'Saúde da Mulher': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-900', badge: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300' },
    'Pré-natal': { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200 dark:border-fuchsia-900', badge: 'bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-300' },
    'Hipertensão': { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-900', badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' },
    'Diabetes': { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-900', badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' },
    'HIV': { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-900', badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300' },
    'Tuberculose': { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-900', badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' },
    'Hanseníase': { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-900', badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' },
    'Dengue': { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-900', badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' },
    'Antiparasitários': { bg: 'bg-lime-50 dark:bg-lime-950/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-900', badge: 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300' },
    'Dermatologia': { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-900', badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' },
    'Tabagismo': { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-900', badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' },
    'Saúde da Criança': { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-900', badge: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300' },
};

const PRESCRIPTIONS: Prescription[] = [
    // ── Medicações Sintomáticas ──────────────────────────────────
    { id: 55, title: 'Dipirona', type: 'Medicamento', category: 'Medicações Sintomáticas', indication: 'Analgésico e antitérmico', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: 'Gotas e comprimido', route: 'Oral', warnings: 'PROIBIDO uso na dengue em conjunto com AAS/AINEs', notes: null },
    { id: 56, title: 'Paracetamol', type: 'Medicamento', category: 'Medicações Sintomáticas', indication: 'Analgésico e antitérmico', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: 'Também indicado no manejo da dengue' },
    { id: 57, title: 'Dimenidrato', type: 'Medicamento', category: 'Medicações Sintomáticas', indication: 'Antiemético', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },

    // ── IST ──────────────────────────────────────────────────────
    { id: 1, title: 'Benzilpenicilina Benzatina', type: 'Medicamento', category: 'IST', indication: 'Sífilis (recente e tardia)', protocol_name: 'PCDT IST — Ministério da Saúde', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: null, warnings: null, notes: 'Manejo sindrômico conforme PCDT' },
    { id: 2, title: 'Azitromicina', type: 'Medicamento', category: 'IST', indication: 'Uretrites, cervicites e clamídia', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '500mg e 1g', route: 'Oral', warnings: null, notes: null },
    { id: 3, title: 'Ceftriaxona', type: 'Medicamento', category: 'IST', indication: 'Gonorreia e DIP', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '500mg e 1g', route: null, warnings: null, notes: null },
    { id: 4, title: 'Metronidazol', type: 'Medicamento', category: 'IST', indication: 'Tricomoníase e vaginose bacteriana', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral e Gel', warnings: null, notes: null },
    { id: 5, title: 'Aciclovir', type: 'Medicamento', category: 'IST', indication: 'Herpes Genital', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '200mg', route: 'Oral', warnings: null, notes: null },
    { id: 6, title: 'Secnidazol', type: 'Medicamento', category: 'IST', indication: 'Tricomoníase (alternativa)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '1g', route: 'Oral', warnings: null, notes: null },
    { id: 7, title: 'Fluconazol', type: 'Medicamento', category: 'IST', indication: 'Candidíase vulvovaginal (oral)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 8, title: 'Itraconazol', type: 'Medicamento', category: 'IST', indication: 'Candidíase vulvovaginal (oral)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 9, title: 'Nistatina', type: 'Medicamento', category: 'IST', indication: 'Candidíase vulvovaginal (tópico)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Tópico', warnings: null, notes: null },
    { id: 10, title: 'Miconazol', type: 'Medicamento', category: 'IST', indication: 'Candidíase vulvovaginal (tópico)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Tópico', warnings: null, notes: null },
    { id: 11, title: 'Doxiciclina', type: 'Medicamento', category: 'IST', indication: 'Sífilis, donovanose e uretrites (alternativa)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 12, title: 'Ciprofloxacino', type: 'Medicamento', category: 'IST', indication: 'Cancroide e donovanose', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 13, title: 'Ácido Tricloroacético (ATA)', type: 'Substância', category: 'IST', indication: 'Verrugas anogenitais (HPV)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '80-90%', route: 'Tópico', warnings: null, notes: null },
    { id: 14, title: 'Podofilina', type: 'Medicamento', category: 'IST', indication: 'HPV (tópico)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Tópico', warnings: null, notes: null },
    { id: 15, title: 'Imiquimode', type: 'Medicamento', category: 'IST', indication: 'HPV (tópico)', protocol_name: 'PCDT IST', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Tópico', warnings: null, notes: null },

    // ── Saúde da Mulher ─────────────────────────────────────────
    { id: 16, title: 'Etinilestradiol + Levonorgestrel', type: 'Contraceptivo', category: 'Saúde da Mulher', indication: 'Contraceptivo oral combinado', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 17, title: 'Etinilestradiol + Desogestrel', type: 'Contraceptivo', category: 'Saúde da Mulher', indication: 'Contraceptivo oral combinado', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 18, title: 'Noretisterona', type: 'Contraceptivo', category: 'Saúde da Mulher', indication: 'Contraceptivo oral', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 19, title: 'Acetato de Medroxiprogesterona', type: 'Contraceptivo', category: 'Saúde da Mulher', indication: 'Contraceptivo injetável trimestral', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Injetável (IM)', warnings: null, notes: 'Trimestral' },
    { id: 20, title: 'Enantato de Noretisterona + Valerato de Estradiol', type: 'Contraceptivo', category: 'Saúde da Mulher', indication: 'Contraceptivo injetável mensal', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Injetável (IM)', warnings: null, notes: 'Mensal' },
    { id: 21, title: 'Levonorgestrel', type: 'Contraceptivo', category: 'Saúde da Mulher', indication: 'Contracepção de emergência', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: '0,75mg ou 1,5mg', route: 'Oral', warnings: null, notes: null },
    { id: 22, title: 'DIU (Dispositivo Intrauterino)', type: 'Dispositivo', category: 'Saúde da Mulher', indication: 'Contracepção de longa duração', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Intrauterino', warnings: null, notes: 'Inserção conforme capacitação' },
    { id: 23, title: 'Etonogestrel (Implante)', type: 'Dispositivo', category: 'Saúde da Mulher', indication: 'Contracepção de longa duração', protocol_name: 'Protocolos de Planejamento Reprodutivo', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Subdérmico', warnings: null, notes: 'Implante subdérmico' },

    // ── Pré-natal ────────────────────────────────────────────────
    { id: 24, title: 'Ácido Fólico', type: 'Suplemento', category: 'Pré-natal', indication: 'Prevenção de defeitos do tubo neural', protocol_name: 'Protocolos de Pré-natal de Baixo Risco', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 25, title: 'Sulfato Ferroso', type: 'Suplemento', category: 'Pré-natal', indication: 'Prevenção de anemia', protocol_name: 'Protocolos de Pré-natal de Baixo Risco', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 26, title: 'Carbonato de Cálcio', type: 'Suplemento', category: 'Pré-natal', indication: 'Suplementação de cálcio na gestação', protocol_name: 'Protocolos de Pré-natal de Baixo Risco', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: null },

    // ── Hipertensão ──────────────────────────────────────────────
    { id: 27, title: 'Captopril', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo (IECA)', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '25mg', route: 'Oral', warnings: null, notes: null },
    { id: 28, title: 'Maleato de Enalapril', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo (IECA)', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '5mg, 10mg, 20mg', route: 'Oral', warnings: null, notes: null },
    { id: 29, title: 'Losartana Potássica', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo (BRA)', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '50mg', route: 'Oral', warnings: null, notes: null },
    { id: 30, title: 'Hidroclorotiazida', type: 'Medicamento', category: 'Hipertensão', indication: 'Diurético anti-hipertensivo', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '25mg', route: 'Oral', warnings: null, notes: null },
    { id: 31, title: 'Propranolol', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo (betabloqueador)', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 32, title: 'Anlodipino', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo (BCC)', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '5mg e 10mg', route: 'Oral', warnings: null, notes: null },
    { id: 33, title: 'Nifedipino', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '10mg e 20mg', route: 'Oral', warnings: null, notes: null },
    { id: 34, title: 'Metildopa', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '250mg', route: 'Oral', warnings: null, notes: null },
    { id: 35, title: 'Hidralazina', type: 'Medicamento', category: 'Hipertensão', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },

    // ── Diabetes ─────────────────────────────────────────────────
    { id: 36, title: 'Cloridrato de Metformina', type: 'Medicamento', category: 'Diabetes', indication: 'Antidiabético oral', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '500mg, 850mg', route: 'Oral', warnings: null, notes: null },
    { id: 37, title: 'Glibenclamida', type: 'Medicamento', category: 'Diabetes', indication: 'Antidiabético oral (sulfonilureia)', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '5mg', route: 'Oral', warnings: null, notes: null },
    { id: 38, title: 'Insulina Humana NPH', type: 'Medicamento', category: 'Diabetes', indication: 'Insulinoterapia basal', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Subcutânea', warnings: null, notes: null },
    { id: 39, title: 'Insulina Regular', type: 'Medicamento', category: 'Diabetes', indication: 'Insulinoterapia de ação rápida', protocol_name: 'Protocolos de Crônicos na APS', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Subcutânea', warnings: null, notes: null },

    // ── HIV ──────────────────────────────────────────────────────
    { id: 40, title: 'Tenofovir (TDF) + Lamivudina (3TC) + Dolutegravir (DTG)', type: 'Medicamento', category: 'HIV', indication: 'Profilaxia Pós-Exposição (PEP)', protocol_name: 'PCDT PEP — Ministério da Saúde', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: null, notes: 'Enfermeiros habilitados' },
    { id: 41, title: 'Fumarato de Tenofovir Desoproxila + Entricitabina (TDF/FTC)', type: 'Medicamento', category: 'HIV', indication: 'Profilaxia Pré-Exposição (PrEP)', protocol_name: 'PCDT PrEP — Ministério da Saúde', legal_basis: 'Res. COFEN 801/2026', dosage_info: '300/200mg', route: 'Oral', warnings: null, notes: 'Enfermeiros habilitados' },

    // ── Tuberculose ──────────────────────────────────────────────
    { id: 42, title: 'Rifampicina + Isoniazida + Pirazinamida + Etambutol (RHZE)', type: 'Medicamento', category: 'Tuberculose', indication: 'Esquema quaternário para TB', protocol_name: 'Protocolo Nacional de Tuberculose', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: 'Tratamento Diretamente Observado (TDO)' },

    // ── Hanseníase ───────────────────────────────────────────────
    { id: 43, title: 'Poliquimioterapia (PQT)', type: 'Medicamento', category: 'Hanseníase', indication: 'Tratamento da Hanseníase', protocol_name: 'Protocolo Nacional de Hanseníase', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: 'TDO' },
    { id: 44, title: 'Creme de Ureia 10%', type: 'Medicamento', category: 'Hanseníase', indication: 'Hidratação da pele', protocol_name: 'Protocolo Nacional de Hanseníase', legal_basis: 'Res. COFEN 801/2026', dosage_info: '10%', route: 'Tópico', warnings: null, notes: 'Adjuvante' },

    // ── Dengue ───────────────────────────────────────────────────
    { id: 45, title: 'Sais de Reidratação Oral (SRO)', type: 'Medicamento', category: 'Dengue', indication: 'Reidratação oral', protocol_name: 'Protocolo de Manejo da Dengue', legal_basis: 'Res. COFEN 801/2026', dosage_info: null, route: 'Oral', warnings: '⛔ PROIBIDO AAS e AINEs na dengue', notes: null },
    { id: 46, title: 'Soro Fisiológico 0,9%', type: 'Medicamento', category: 'Dengue', indication: 'Hidratação venosa', protocol_name: 'Protocolo de Manejo da Dengue', legal_basis: 'Res. COFEN 801/2026', dosage_info: '0,9%', route: 'Intravenosa', warnings: '⛔ PROIBIDO AAS e AINEs na dengue', notes: null },

    // ── Antiparasitários ─────────────────────────────────────────
    { id: 47, title: 'Albendazol', type: 'Medicamento', category: 'Antiparasitários', indication: 'Antiparasitário', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '400mg', route: 'Oral', warnings: null, notes: null },
    { id: 48, title: 'Mebendazol', type: 'Medicamento', category: 'Antiparasitários', indication: 'Antiparasitário', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: null },
    { id: 49, title: 'Ivermectina', type: 'Medicamento', category: 'Antiparasitários', indication: 'Antiparasitário', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: null, route: 'Oral', warnings: null, notes: 'Conforme protocolo' },

    // ── Dermatologia ─────────────────────────────────────────────
    { id: 50, title: 'Permetrina (Loção 1% e 5%)', type: 'Medicamento', category: 'Dermatologia', indication: 'Escabiose e pediculose', protocol_name: 'Protocolos da Atenção Primária', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '1% e 5%', route: 'Tópico', warnings: null, notes: null },

    // ── Tabagismo ────────────────────────────────────────────────
    { id: 51, title: 'Nicotina (Adesivo Transdérmico)', type: 'Medicamento', category: 'Tabagismo', indication: 'Terapia de reposição nicotínica', protocol_name: 'Programa Nacional de Cessação do Tabagismo', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '7mg, 14mg, 21mg', route: 'Transdérmico', warnings: null, notes: null },
    { id: 52, title: 'Nicotina (Goma de Mascar)', type: 'Medicamento', category: 'Tabagismo', indication: 'Terapia de reposição nicotínica', protocol_name: 'Programa Nacional de Cessação do Tabagismo', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: '2mg', route: 'Oral (mastigação)', warnings: null, notes: null },

    // ── Saúde da Criança ─────────────────────────────────────────
    { id: 53, title: 'Vitamina A (Retinol)', type: 'Suplemento', category: 'Saúde da Criança', indication: 'Suplementação vitamínica infantil', protocol_name: 'Protocolos de Puericultura', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: 'Gotas', route: 'Oral', warnings: null, notes: null },
    { id: 54, title: 'Vitamina D (Colecalciferol)', type: 'Suplemento', category: 'Saúde da Criança', indication: 'Suplementação vitamínica infantil', protocol_name: 'Protocolos de Puericultura', legal_basis: 'Res. COFEN 801/2026 (Anexo II)', dosage_info: 'Gotas', route: 'Oral', warnings: null, notes: null },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE
// ═══════════════════════════════════════════════════════════════
export default function PrescricoesPage() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(CATEGORY_ORDER));

    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return PRESCRIPTIONS.filter(p => {
            const matchSearch = !s || p.title.toLowerCase().includes(s) ||
                p.indication.toLowerCase().includes(s) ||
                p.category.toLowerCase().includes(s);
            const matchCat = !catFilter || p.category === catFilter;
            return matchSearch && matchCat;
        });
    }, [search, catFilter]);

    const grouped = useMemo(() => {
        return CATEGORY_ORDER.map(cat => ({
            category: cat,
            items: filtered.filter(p => p.category === cat),
        })).filter(g => g.items.length > 0);
    }, [filtered]);

    const toggleCat = (cat: string) => {
        setExpandedCats(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat); else next.add(cat);
            return next;
        });
    };

    const expandAll = () => setExpandedCats(new Set(CATEGORY_ORDER));
    const collapseAll = () => setExpandedCats(new Set());

    return (
        <AppShell>
            <div className="space-y-5">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Pill className="text-emerald-500" size={24} />
                        Prescrições Autorizadas
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {PRESCRIPTIONS.length} medicamentos organizados por finalidade clínica · Res. COFEN 801/2026
                    </p>
                </div>

                {/* Search + filter */}
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar medicamento ou indicação..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm">
                        <option value="">Todas as categorias</option>
                        {CATEGORY_ORDER.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Expand/Collapse */}
                <div className="flex gap-2 text-xs">
                    <button onClick={expandAll} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Expandir tudo</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={collapseAll} className="text-slate-500 font-bold hover:underline">Recolher tudo</button>
                    <span className="text-slate-300 ml-auto">{filtered.length} de {PRESCRIPTIONS.length}</span>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    {grouped.map(({ category, items }) => {
                        const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Medicações Sintomáticas'];
                        const isOpen = expandedCats.has(category);
                        return (
                            <div key={category} className={`rounded-2xl border overflow-hidden ${colors.border}`}>
                                <button onClick={() => toggleCat(category)}
                                    className={`w-full px-4 py-3 flex items-center justify-between text-left ${colors.bg}`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${colors.badge}`}>{items.length}</span>
                                        <span className={`font-bold text-sm ${colors.text}`}>{category}</span>
                                    </div>
                                    {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </button>

                                {isOpen && (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {items.map(p => (
                                            <div key={p.id} className="px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-sm">{p.title}</span>
                                                            {p.dosage_info && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">{p.dosage_info}</span>}
                                                            {p.route && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">{p.route}</span>}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-0.5">{p.indication}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{p.protocol_name} · {p.legal_basis}</p>
                                                        {p.notes && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{p.notes}</p>}
                                                    </div>
                                                </div>
                                                {p.warnings && (
                                                    <div className="mt-2 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl px-2.5 py-1.5">
                                                        <AlertTriangle size={12} className="text-red-500 shrink-0" />
                                                        <span className="text-[10px] text-red-700 dark:text-red-300 font-bold">{p.warnings}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {grouped.length === 0 && (
                        <div className="text-center py-12">
                            <Pill size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-bold">Nenhuma prescrição encontrada</p>
                        </div>
                    )}
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl px-4 py-3">
                    <div className="flex items-start gap-2">
                        <FileText size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 dark:text-amber-300">
                            Módulo de consulta e apoio à decisão clínica. Não constitui prescrição automática.
                            Dados da Resolução COFEN nº 801/2026 e protocolos do Ministério da Saúde.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
