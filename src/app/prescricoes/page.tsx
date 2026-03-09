'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { Search, ChevronDown, ChevronUp, Pill, FileText, RefreshCw, AlertTriangle, Info } from 'lucide-react';

/* ================================================================
   FONTE DE VERDADE — DADOS CLÍNICOS OFICIAIS
   Não inventados. Extraídos exatamente do documento fornecido.
   ================================================================ */

interface PrescricaoItem {
    id: number;
    category: string;
    name: string;
    allowed_for: string;
    posology: string;
    duration: string;
    indication: string;
    operational_notes: string;
    reference: string;
    is_insumo?: boolean;
}

interface CronicoItem {
    id: number;
    name: string;
    dosage: string;
    max_daily_dose_for_renewal: string;
    renewal_limit: string;
    reference: string;
}

// ═══════════════════════════════════════════════════════════════
// ORDEM DAS CATEGORIAS CLÍNICAS (exatamente como solicitado)
// ═══════════════════════════════════════════════════════════════
const CATEGORY_ORDER = [
    'Saúde da Criança',
    'Pré-concepção / Gestação / Pós-parto',
    'IST',
    'Saúde da Mulher',
    'Gestação sintomáticos / intercorrências',
    'Diabetes Gestacional / Insumos',
    'Parasitoses / Dermatologia',
    'Reidratação / Dengue',
    'Sintomáticos',
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; accent: string }> = {
    'Saúde da Criança': { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800', badge: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300', accent: 'bg-cyan-500' },
    'Pré-concepção / Gestação / Pós-parto': { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200 dark:border-fuchsia-800', badge: 'bg-fuchsia-100 dark:bg-fuchsia-900/60 text-fuchsia-700 dark:text-fuchsia-300', accent: 'bg-fuchsia-500' },
    'IST': { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800', badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300', accent: 'bg-red-500' },
    'Saúde da Mulher': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800', badge: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300', accent: 'bg-pink-500' },
    'Gestação sintomáticos / intercorrências': { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300', accent: 'bg-violet-500' },
    'Diabetes Gestacional / Insumos': { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300', accent: 'bg-amber-500' },
    'Parasitoses / Dermatologia': { bg: 'bg-lime-50 dark:bg-lime-950/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-800', badge: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300', accent: 'bg-lime-500' },
    'Reidratação / Dengue': { bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800', badge: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300', accent: 'bg-sky-500' },
    'Sintomáticos': { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-200', border: 'border-slate-200 dark:border-slate-700', badge: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200', accent: 'bg-slate-500' },
};

// ═══════════════════════════════════════════════════════════════
// PRESCRIÇÕES AUTORIZADAS — DADOS EXATOS SEM INVENÇÃO
// ═══════════════════════════════════════════════════════════════
const PRESCRICOES: PrescricaoItem[] = [
    // ── Saúde da Criança ─────────────────────────────────────────
    {
        id: 1,
        category: 'Saúde da Criança',
        name: 'Acetato de retinol + Colecalciferol (50.000 UI/ml + 10.000 UI/ml) solução oral',
        allowed_for: 'Crianças de 0 a 6 meses',
        posology: '2 gotas 1x/dia',
        duration: 'Uso contínuo (somente até 6 meses)',
        indication: 'Complementação vitamínica na primeira infância',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 2,
        category: 'Saúde da Criança',
        name: 'Albendazol 40 mg/ml suspensão oral',
        allowed_for: 'Crianças acima de 2 anos (com mais de 10 kg) até 11 anos, 11 meses e 29 dias',
        posology: '10 ml (400 mg)',
        duration: 'Dose única',
        indication: 'Parasitose intestinal',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 3,
        category: 'Saúde da Criança',
        name: 'Nistatina 100.000 UI/ml suspensão oral',
        allowed_for: 'Crianças até 11 anos, 11 meses e 29 dias',
        posology: '1 ml a 6 ml de solução oral de 6/6 horas',
        duration: 'Por até 9 dias',
        indication: 'Monilíase oral (candidíase)',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 4,
        category: 'Saúde da Criança',
        name: 'Palmitato de retinol + Colecalciferol + Óxido de Zinco pomada',
        allowed_for: 'Crianças e adultos de todas as idades',
        posology: 'Aplicar após cada troca de fralda',
        duration: 'Tempo determinado (se for uso contínuo será informado na prescrição e renovada a cada 6 meses)',
        indication: 'Prevenção de assaduras e dermatite amoniacal, intertrigo',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 5,
        category: 'Saúde da Criança',
        name: 'Sulfato ferroso 125 mg/ml = 25 mg de ferro elementar gotas',
        allowed_for: 'Crianças a partir de 30 dias até 11 anos, 11 meses e 29 dias',
        posology: 'Conforme páginas 32 e 33 do Manual Saúde da Criança e Adolescente',
        duration: 'Uso contínuo (cada 6 meses renova prescrição se necessário)',
        indication: 'Suplementação profilática de ferro',
        operational_notes: '',
        reference: 'Manual Saúde da Criança e Adolescente, páginas 32 e 33',
    },
    {
        id: 6,
        category: 'Saúde da Criança',
        name: 'Vitamina A',
        allowed_for: 'Crianças a partir do 6º mês até o 24º mês',
        posology: 'Conforme página 31 do Manual Saúde da Criança e Adolescente',
        duration: 'Conforme protocolo',
        indication: 'Suplementação de Vitamina A',
        operational_notes: 'Aplicação oral nas Unidades Básicas de Saúde',
        reference: 'Manual Saúde da Criança e Adolescente, página 31',
    },

    // ── Pré-concepção / Gestação / Pós-parto ─────────────────────
    {
        id: 7,
        category: 'Pré-concepção / Gestação / Pós-parto',
        name: 'Ácido fólico 5 mg comprimido',
        allowed_for: 'Mulheres no período de pré-concepção e gestantes',
        posology: '1 comprimido/dia',
        duration: 'Uso contínuo (cada 6 meses renova prescrição se necessário)',
        indication: 'Prevenção de defeitos do tubo neural. Iniciar pelo menos 30 dias antes da data em que se planeja engravidar e manter até o final da gestação',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 8,
        category: 'Pré-concepção / Gestação / Pós-parto',
        name: 'Dipirona 500 mg/ml gotas',
        allowed_for: 'Mulheres amamentando',
        posology: '30 gotas de 6/6 horas, se necessário',
        duration: 'Por até 30 dias',
        indication: 'Cefaleia e ingurgitamento mamário',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 9,
        category: 'Pré-concepção / Gestação / Pós-parto',
        name: 'Miconazol creme vaginal 20 mg/g',
        allowed_for: 'Mulheres amamentando',
        posology: 'Uso tópico nas mamas',
        duration: 'Por até 14 dias',
        indication: 'Candidíase nas mamas',
        operational_notes: 'Manter exatamente como no conteúdo fornecido',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 10,
        category: 'Pré-concepção / Gestação / Pós-parto',
        name: 'Sulfato ferroso 200 mg = 40 mg de ferro elementar comprimido',
        allowed_for: 'Gestantes e mulheres no pós-parto e pós-aborto',
        posology: '1 comprimido 1x/dia desde o início do pré-natal até 3 meses pós-parto ou pós-aborto. Exceções: anemia branda: 2 comprimidos antes do café, 2 antes do almoço e 1 antes do jantar, uma hora antes das refeições, até que a Hb atinja níveis ideais; depois retornar para 1 comprimido ao dia',
        duration: 'Uso contínuo (cada 6 meses renova prescrição se necessário)',
        indication: 'Suplementação profilática de ferro',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },

    // ── IST ─────────────────────────────────────────────────────
    {
        id: 11,
        category: 'IST',
        name: 'Azitromicina 500 mg comprimido',
        allowed_for: 'Mulheres e Homens. Parceiros(as) sexuais com prescrições individuais',
        posology: '2 comprimidos',
        duration: 'Dose única',
        indication: 'Cancro mole',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 12,
        category: 'IST',
        name: 'Azitromicina 500 mg comprimido + Ceftriaxona 500 mg IM',
        allowed_for: 'Mulheres e Homens. Parceiros(as) sexuais com prescrições individuais',
        posology: 'Dose única: 2 comprimidos + 1 injeção de Ceftriaxona 500 mg IM',
        duration: 'Dose única',
        indication: 'Clamídia e Gonorreia',
        operational_notes: 'Administrado SOMENTE no CEDIC. Esta prescrição deve ser atendida somente na farmácia do CEDIC na sua totalidade; orientar usuários a procurarem o CEDIC de 2ª a 6ª feira, das 09:00 às 15:00h',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 13,
        category: 'IST',
        name: 'Doxiciclina 100 mg comprimido',
        allowed_for: 'Mulheres e Homens. Parceiros(as) sexuais com prescrições individuais (exceto gestantes)',
        posology: '1 comprimido de 12/12h',
        duration: 'Por 15 dias',
        indication: 'Sífilis primária, sífilis secundária, sífilis latente recente (até um ano do contato) – apenas para alérgicos à penicilina',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 14,
        category: 'IST',
        name: 'Doxiciclina 100 mg comprimido',
        allowed_for: 'Mulheres e Homens. Parceiros(as) sexuais com prescrições individuais (exceto gestantes)',
        posology: '1 comprimido de 12/12h',
        duration: 'Por 30 dias',
        indication: 'Sífilis latente tardia (mais de 1 ano do contato), sífilis latente com duração ignorada, sífilis terciária – apenas para alérgicos à penicilina',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 15,
        category: 'IST',
        name: 'Fluconazol 150 mg comprimido',
        allowed_for: 'Mulheres e parceiros(as) sexuais - prescrições individuais',
        posology: '1 comprimido',
        duration: 'Dose única',
        indication: 'Candidíase vulvovaginal',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 16,
        category: 'IST',
        name: 'Fluconazol 150 mg comprimido',
        allowed_for: 'Mulheres e parceiros(as) sexuais - prescrições individuais',
        posology: '1 comprimido 1x/dia nos dias 1, 4 e 7; depois 1 comprimido 1x/semana',
        duration: 'Por 6 meses',
        indication: 'Candidíase vulvovaginal recorrente (mais de 4 episódios no ano)',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 17,
        category: 'IST',
        name: 'Metronidazol 250 mg comprimido',
        allowed_for: 'Mulheres e parceiros(as) sexuais - prescrições individuais',
        posology: '02 comprimidos de 12/12 horas OU 08 comprimidos em dose única',
        duration: 'Por 01 dia OU por 7 dias',
        indication: 'Vaginose bacteriana e Tricomoníase',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 18,
        category: 'IST',
        name: 'Metronidazol gel vaginal 100 mg/g',
        allowed_for: 'Mulheres',
        posology: 'Um aplicador (5 g) à noite, via vaginal, ao deitar-se',
        duration: 'De 05 a 10 dias',
        indication: 'Vaginose bacteriana',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 19,
        category: 'IST',
        name: 'Miconazol creme vaginal 20 mg/g',
        allowed_for: 'Mulheres',
        posology: 'Um aplicador (5 g) à noite, via vaginal, ao deitar-se',
        duration: 'De 07 a 14 noites',
        indication: 'Candidíase vulvovaginal',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 20,
        category: 'IST',
        name: 'Penicilina Benzatina 1.200.000 UI ampola',
        allowed_for: 'Mulheres e Homens. Parceiros(as) sexuais com prescrições individuais',
        posology: 'Conforme página 149 do Manual Saúde da Mulher',
        duration: 'Conforme prescrição',
        indication: 'Sífilis',
        operational_notes: 'Aplicação realizada nas Unidades Básicas de Saúde',
        reference: 'Manual Saúde da Mulher, página 149',
    },

    // ── Saúde da Mulher ─────────────────────────────────────────
    {
        id: 21,
        category: 'Saúde da Mulher',
        name: 'Levonorgestrel 0,75 mg comprimido',
        allowed_for: 'Mulheres no período fértil',
        posology: '2 comprimidos de 0,75 mg em dose única OU 1 comprimido de 0,75 mg de 12/12 horas',
        duration: 'Dose única',
        indication: 'Anticoncepção hormonal de emergência',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },

    // ── Gestação sintomáticos / intercorrências ──────────────────
    {
        id: 22,
        category: 'Gestação sintomáticos / intercorrências',
        name: 'Dimenidrinato 50 mg + Cloridrato de piridoxina 10 mg comprimido',
        allowed_for: 'Gestantes',
        posology: '1 comprimido de 6/6 horas, se necessário (não exceder 400 mg/dia)',
        duration: 'Por até 30 dias',
        indication: 'Náuseas e vômitos',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 23,
        category: 'Gestação sintomáticos / intercorrências',
        name: 'Dipirona 500 mg/ml gotas',
        allowed_for: 'Gestantes',
        posology: '30 gotas de 6/6 horas, se necessário',
        duration: 'Por até 30 dias',
        indication: 'Dor lombar, dor pélvica e cefaleia',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 24,
        category: 'Gestação sintomáticos / intercorrências',
        name: 'Escopolamina 10 mg comprimido',
        allowed_for: 'Gestantes',
        posology: '1 comprimido de 8/8 horas, se necessário',
        duration: 'Por até 30 dias',
        indication: 'Cólicas e dor abdominal',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 25,
        category: 'Gestação sintomáticos / intercorrências',
        name: 'Hidróxido de alumínio 40 mg/ml + Hidróxido de magnésio 30 mg/ml + Simeticona 3 mg/ml suspensão oral',
        allowed_for: 'Gestantes',
        posology: '10-15 ml (duas colheres de chá ou uma colher de sopa) após as refeições e ao deitar-se, se necessário',
        duration: 'Por até 30 dias',
        indication: 'Pirose e azia',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 26,
        category: 'Gestação sintomáticos / intercorrências',
        name: 'Soro fisiológico 0,9% solução nasal',
        allowed_for: 'Gestantes',
        posology: '2 a 4 gotas em cada narina, 3 a 4 vezes ao dia, ou o suficiente para manter as narinas úmidas, se necessário',
        duration: 'Por até 30 dias',
        indication: 'Epistaxe ou sangramento nasal',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },

    // ── Diabetes Gestacional / Insumos ───────────────────────────
    {
        id: 27,
        category: 'Diabetes Gestacional / Insumos',
        name: 'Glicosímetro, tiras, lancetas e lancetador',
        allowed_for: 'Gestantes com suspeita ou confirmação de diabetes',
        posology: '4 testes ao dia, até 150 tiras/mês',
        duration: 'Até o final do puerpério (45 dias pós-parto)',
        indication: 'Diabetes Mellitus Gestacional e Diabetes Mellitus (Protocolo de atendimento DMG)',
        operational_notes: 'Classificar como insumo, não como medicamento',
        reference: 'Protocolo de atendimento DMG',
        is_insumo: true,
    },

    // ── Parasitoses / Dermatologia ───────────────────────────────
    {
        id: 28,
        category: 'Parasitoses / Dermatologia',
        name: 'Ivermectina 6 mg comprimido',
        allowed_for: 'Crianças a partir de 5 anos, com peso acima de 15 kg, e adultos',
        posology: 'Dose oral única conforme peso: 15 a 24 kg = 1/2 comprimido; 25 a 35 kg = 1 comprimido; 36 a 50 kg = 1 e 1/2 comprimidos; 51 a 65 kg = 2 comprimidos; 66 a 79 kg = 2 e 1/2 comprimidos',
        duration: 'Dose única',
        indication: 'Pediculose e Escabiose',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 29,
        category: 'Parasitoses / Dermatologia',
        name: 'Óleo mineral',
        allowed_for: 'Crianças e adultos de todas as idades',
        posology: 'Conforme prescrição',
        duration: 'Tempo determinado',
        indication: 'Dermatite seborreica',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 30,
        category: 'Parasitoses / Dermatologia',
        name: 'Permetrina 10 mg/ml loção',
        allowed_for: 'Crianças acima de 2 anos e adultos',
        posology: 'Conforme prescrição',
        duration: 'Tempo determinado',
        indication: 'Pediculose',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },

    // ── Reidratação / Dengue ─────────────────────────────────────
    {
        id: 31,
        category: 'Reidratação / Dengue',
        name: 'Sais de reidratação oral',
        allowed_for: 'Crianças e adultos de todas as idades',
        posology: 'Conforme prescrição',
        duration: 'Conforme prescrição',
        indication: 'Diarreia, suspeita de dengue ou dengue confirmada',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },

    // ── Sintomáticos ─────────────────────────────────────────────
    {
        id: 32,
        category: 'Sintomáticos',
        name: 'Dipirona 500 mg/ml gotas',
        allowed_for: 'Crianças maiores de 3 meses até 11 anos, 11 meses e 29 dias',
        posology: '1 gota/kg/peso de 6/6 horas',
        duration: 'Por até 5 dias',
        indication: 'Febre, dor de ouvido sem febre e em bom estado geral, estomatite se dor ou febre, dor leve a moderada',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 33,
        category: 'Sintomáticos',
        name: 'Dipirona 500 mg/ml gotas',
        allowed_for: 'Crianças acima de 11 anos, 11 meses e 29 dias e adultos',
        posology: '30 gotas de 6/6 horas, se necessário',
        duration: 'Por até 5 dias',
        indication: 'Idem ao uso sintomático da dipirona',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 34,
        category: 'Sintomáticos',
        name: 'Paracetamol 200 mg/ml gotas',
        allowed_for: 'Crianças maiores de 3 meses até 11 anos, 11 meses e 29 dias',
        posology: '1 gota/kg/peso de 6/6 horas',
        duration: 'Por até 5 dias',
        indication: 'Febre, dor de ouvido sem febre e em bom estado geral, estomatite se dor ou febre, dor leve a moderada',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 35,
        category: 'Sintomáticos',
        name: 'Paracetamol 500 mg comprimido',
        allowed_for: 'Idem ao medicamento Dipirona',
        posology: 'Idem ao medicamento Dipirona, porém ao invés de 30 gotas é 1 comprimido',
        duration: 'Idem ao medicamento Dipirona',
        indication: 'Idem ao medicamento Dipirona',
        operational_notes: 'Manter exatamente como no conteúdo fornecido',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
    {
        id: 36,
        category: 'Sintomáticos',
        name: 'Soro fisiológico 0,9% solução nasal',
        allowed_for: 'Crianças e adultos de todas as idades',
        posology: 'Para uso nasal ou lavagem nasal (seringa de 20 ml)',
        duration: 'Tempo determinado (se for uso contínuo será informado na prescrição e renovada a cada 6 meses)',
        indication: 'Obstrução nasal por secreção e coriza',
        operational_notes: '',
        reference: 'Resumo prescrições permitidas por enfermeiros(as)',
    },
];

// ═══════════════════════════════════════════════════════════════
// RENOVAÇÃO DE CRÔNICOS — SOMENTE RENOVAÇÃO POR ATÉ 6 MESES
// ═══════════════════════════════════════════════════════════════
const CRONICOS: CronicoItem[] = [
    { id: 1, name: 'Anlodipino, besilato', dosage: '5 mg', max_daily_dose_for_renewal: '10 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 2, name: 'Atenolol', dosage: '25 mg e 50 mg', max_daily_dose_for_renewal: '100 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 3, name: 'Captopril', dosage: '25 mg', max_daily_dose_for_renewal: '150 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 4, name: 'Carvedilol', dosage: '3,125 mg e 12,5 mg', max_daily_dose_for_renewal: '50 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 5, name: 'Enalapril, Maleato', dosage: '10 mg', max_daily_dose_for_renewal: '40 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 6, name: 'Espironolactona', dosage: '25 mg', max_daily_dose_for_renewal: '100 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 7, name: 'Furosemida', dosage: '40 mg', max_daily_dose_for_renewal: '80 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 8, name: 'Glibenclamida', dosage: '5 mg', max_daily_dose_for_renewal: '20 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 9, name: 'Glicazida', dosage: '30 mg', max_daily_dose_for_renewal: '120 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 10, name: 'Hidroclorotiazida', dosage: '25 mg', max_daily_dose_for_renewal: '25 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 11, name: 'Losartana', dosage: '50 mg', max_daily_dose_for_renewal: '100 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 12, name: 'Metildopa', dosage: '250 mg', max_daily_dose_for_renewal: '1500 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 13, name: 'Metformina, cloridrato', dosage: '850 mg', max_daily_dose_for_renewal: '2550 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 14, name: 'Propranolol', dosage: '40 mg', max_daily_dose_for_renewal: '240 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
    { id: 15, name: 'Verapamil, cloridrato', dosage: '80 mg', max_daily_dose_for_renewal: '480 mg/dia', renewal_limit: 'Somente renovação por até 6 meses (183 dias)', reference: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba' },
];

// ═══════════════════════════════════════════════════════════════
// REFERÊNCIAS OBRIGATÓRIAS DO MÓDULO
// ═══════════════════════════════════════════════════════════════
const REFERENCIAS = [
    { id: 1, title: 'Resumo prescrições permitidas por enfermeiros(as)', details: 'Documento base do módulo de prescrições' },
    { id: 2, title: 'DAF – Referência Manuais de Assistência de Enfermagem Piracicaba', details: 'Base para Renovação de Crônicos' },
    { id: 3, title: 'Manual Saúde da Mulher – página 149', details: 'Penicilina Benzatina para Sífilis' },
    { id: 4, title: 'Manual Saúde da Criança e Adolescente – páginas 31, 32 e 33', details: 'Vitamina A e Sulfato Ferroso pediátrico' },
    { id: 5, title: 'Protocolo de atendimento DMG', details: 'Diabetes Mellitus Gestacional e insumos' },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE CARD DE PRESCRIÇÃO
// ═══════════════════════════════════════════════════════════════
function PrescricaoCard({ item }: { item: PrescricaoItem }) {
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="px-4 py-4">
                {/* Nome + badge insumo */}
                <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{item.name}</span>
                            {item.is_insumo && (
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 uppercase tracking-wide shrink-0">
                                    Insumo
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Permitido para:</span> {item.allowed_for}
                        </p>
                    </div>
                </div>

                {/* POSOLOGIA — DESTAQUE MÁXIMO */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl px-3 py-2.5 mb-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">💊 Posologia</p>
                    <p className="text-sm font-black text-emerald-900 dark:text-emerald-100 leading-snug">{item.posology}</p>
                </div>

                {/* Duração */}
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">⏱ Por quanto tempo:</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.duration}</span>
                </div>

                {/* Indicação */}
                <div className="mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Indicação: </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300">{item.indication}</span>
                </div>

                {/* Observações operacionais */}
                {item.operational_notes && (
                    <div className="flex items-start gap-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-2 mb-2">
                        <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-snug">{item.operational_notes}</span>
                    </div>
                )}

                {/* Referência */}
                <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <FileText size={10} className="shrink-0" />
                    {item.reference}
                </p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function PrescricoesPage() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set([...CATEGORY_ORDER, 'Renovação de Crônicos']));
    const [showRefs, setShowRefs] = useState(false);

    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return PRESCRICOES.filter(p => {
            const matchSearch = !s ||
                p.name.toLowerCase().includes(s) ||
                p.indication.toLowerCase().includes(s) ||
                p.allowed_for.toLowerCase().includes(s) ||
                p.category.toLowerCase().includes(s);
            const matchCat = !catFilter || p.category === catFilter;
            return matchSearch && matchCat;
        });
    }, [search, catFilter]);

    const filteredCronicos = useMemo(() => {
        if (catFilter && catFilter !== 'Renovação de Crônicos') return [];
        const s = search.toLowerCase();
        if (!s) return CRONICOS;
        return CRONICOS.filter(c =>
            c.name.toLowerCase().includes(s) ||
            c.dosage.toLowerCase().includes(s)
        );
    }, [search, catFilter]);

    const grouped = useMemo(() => {
        return CATEGORY_ORDER.map(cat => ({
            category: cat,
            items: filtered.filter(p => p.category === cat),
        })).filter(g => g.items.length > 0);
    }, [filtered]);

    const totalVisible = filtered.length + filteredCronicos.length;
    const totalAll = PRESCRICOES.length + CRONICOS.length;

    const toggleCat = (cat: string) => {
        setExpandedCats(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat); else next.add(cat);
            return next;
        });
    };

    const expandAll = () => setExpandedCats(new Set([...CATEGORY_ORDER, 'Renovação de Crônicos']));
    const collapseAll = () => setExpandedCats(new Set());

    const allCategories = [...CATEGORY_ORDER, 'Renovação de Crônicos'];

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
                        {PRESCRICOES.length} prescrições + {CRONICOS.length} crônicos · Organizado por categoria clínica
                    </p>
                </div>

                {/* Search + filter */}
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 relative min-w-0">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar medicamento, insumo ou indicação..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-600"
                        />
                    </div>
                    <select
                        value={catFilter}
                        onChange={e => setCatFilter(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 w-full sm:w-auto"
                    >
                        <option value="">Todas as categorias</option>
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Expand/Collapse + count */}
                <div className="flex items-center gap-2 text-xs">
                    <button onClick={expandAll} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Expandir tudo</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={collapseAll} className="text-slate-500 font-bold hover:underline">Recolher tudo</button>
                    <span className="text-slate-300 ml-auto">{totalVisible} de {totalAll} itens</span>
                </div>

                {/* ── CATEGORIAS CLÍNICAS ── */}
                <div className="space-y-3">
                    {grouped.map(({ category, items }) => {
                        const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Sintomáticos'];
                        const isOpen = expandedCats.has(category);
                        return (
                            <div key={category} className={`rounded-2xl border overflow-hidden ${colors.border}`}>
                                <button
                                    onClick={() => toggleCat(category)}
                                    className={`w-full px-4 py-3 flex items-center justify-between text-left ${colors.bg}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${colors.accent} shrink-0`} />
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${colors.badge}`}>{items.length}</span>
                                        <span className={`font-bold text-sm ${colors.text}`}>{category}</span>
                                    </div>
                                    {isOpen ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                                </button>

                                {isOpen && (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {items.map(p => <PrescricaoCard key={p.id} item={p} />)}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* ── RENOVAÇÃO DE CRÔNICOS ── */}
                    {filteredCronicos.length > 0 && (
                        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                            <button
                                onClick={() => toggleCat('Renovação de Crônicos')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left bg-blue-50 dark:bg-blue-950/30"
                            >
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={14} className="text-blue-500 shrink-0" />
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">{filteredCronicos.length}</span>
                                    <span className="font-bold text-sm text-blue-700 dark:text-blue-300">Renovação de Crônicos</span>
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-300 uppercase tracking-wide">somente renovação · 6 meses</span>
                                </div>
                                {expandedCats.has('Renovação de Crônicos')
                                    ? <ChevronUp size={16} className="text-slate-400 shrink-0" />
                                    : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                            </button>

                            {expandedCats.has('Renovação de Crônicos') && (
                                <div>
                                    {/* Aviso */}
                                    <div className="px-4 py-2.5 bg-blue-50/80 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900">
                                        <div className="flex items-start gap-2">
                                            <Info size={13} className="text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                                                Estes medicamentos são <strong>exclusivamente para renovação</strong> de prescrições médicas já existentes. Prazo máximo: <strong>6 meses (183 dias)</strong>.
                                                Referência: DAF – Manuais de Assistência de Enfermagem Piracicaba.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tabela responsiva */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                                                    <th className="text-left px-4 py-2.5 font-black text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Medicamento</th>
                                                    <th className="text-left px-3 py-2.5 font-black text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Apresentação</th>
                                                    <th className="text-left px-3 py-2.5 font-black text-[10px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Dose máx/dia (renovação)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {filteredCronicos.map(c => (
                                                    <tr key={c.id} className="bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                                                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{c.name}</td>
                                                        <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{c.dosage}</td>
                                                        <td className="px-3 py-3">
                                                            <span className="font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">
                                                                {c.max_daily_dose_for_renewal}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {grouped.length === 0 && filteredCronicos.length === 0 && (
                        <div className="text-center py-12">
                            <Pill size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-bold">Nenhuma prescrição encontrada</p>
                            <p className="text-xs text-slate-400 mt-1">Tente outro termo de busca</p>
                        </div>
                    )}
                </div>

                {/* ── REFERÊNCIAS DO MÓDULO ── */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                        onClick={() => setShowRefs(v => !v)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left bg-slate-50 dark:bg-slate-800/50"
                    >
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-slate-500" />
                            <span className="font-bold text-sm text-slate-600 dark:text-slate-300">Referências do Módulo</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{REFERENCIAS.length}</span>
                        </div>
                        {showRefs ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>
                    {showRefs && (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {REFERENCIAS.map(ref => (
                                <div key={ref.id} className="px-4 py-3 bg-white dark:bg-slate-900">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ref.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ref.details}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl px-4 py-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 dark:text-amber-300">
                            Módulo de consulta e apoio à decisão clínica. Não constitui prescrição automática.
                            Dados extraídos do Resumo de Prescrições Permitidas por Enfermeiros(as) e dos Manuais de Referência citados.
                            Não invente posologia. Não invente medicamentos. Siga os protocolos oficiais.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
