'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { Search, Filter, ChevronDown, ChevronUp, Pill, AlertTriangle, FileText, X } from 'lucide-react';

/* ================================================================
   DADOS ESTRUTURADOS — Extraídos do texto técnico-legal fornecido.
   NÃO INVENTAR medicamentos, doses ou indicações ausentes no texto.
   ================================================================ */

interface Prescription {
    id: number;
    title: string;
    type: string;
    category: string;
    health_program: string;
    indication: string;
    protocol_name: string;
    protocol_year: string | null;
    legal_basis: string;
    release_criteria: string;
    dosage_info: string | null;
    route: string | null;
    warnings: string | null;
    target_population: string;
    notes: string | null;
}

const PRESCRIPTIONS: Prescription[] = [
    // ── 1. IST e Saúde Reprodutiva ──────────────────────────────
    { id: 1, title: 'Benzilpenicilina Benzatina', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Tratamento de Sífilis (recente e tardia)', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: null, warnings: null, target_population: 'Adultos', notes: 'Manejo sindrômico conforme PCDT' },
    { id: 2, title: 'Azitromicina', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Uretrites, cervicites e clamídia', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: '500mg e 1g', route: 'Oral', warnings: null, target_population: 'Adultos', notes: null },
    { id: 3, title: 'Ceftriaxona', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Gonorreia e Doença Inflamatória Pélvica (DIP)', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: '500mg e 1g', route: null, warnings: null, target_population: 'Adultos', notes: null },
    { id: 4, title: 'Metronidazol', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Tricomoníase e vaginose bacteriana', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Oral e Gel', warnings: null, target_population: 'Adultos', notes: null },
    { id: 5, title: 'Aciclovir', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Manejo de Herpes Genital', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: '200mg', route: 'Oral', warnings: null, target_population: 'Adultos', notes: null },
    { id: 6, title: 'Secnidazol', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Alternativa para Tricomoníase', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: '1g', route: 'Oral', warnings: null, target_population: 'Adultos', notes: null },
    { id: 7, title: 'Fluconazol', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Candidíase vulvovaginal', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Mulheres', notes: 'Opção oral' },
    { id: 8, title: 'Itraconazol', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Candidíase vulvovaginal', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Mulheres', notes: 'Opção oral' },
    { id: 9, title: 'Nistatina', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Candidíase vulvovaginal', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Tópico', warnings: null, target_population: 'Mulheres', notes: 'Opção tópica' },
    { id: 10, title: 'Miconazol', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Candidíase vulvovaginal', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Tópico', warnings: null, target_population: 'Mulheres', notes: 'Opção tópica' },
    { id: 11, title: 'Doxiciclina', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Alternativa para sífilis, donovanose e uretrites', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos', notes: null },
    { id: 12, title: 'Ciprofloxacino', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Cancroide e donovanose', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos', notes: null },
    { id: 13, title: 'Ácido Tricloroacético (ATA)', type: 'Substância', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Verrugas anogenitais (HPV)', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: '80-90%', route: 'Tópico', warnings: null, target_population: 'Adultos', notes: null },
    { id: 14, title: 'Podofilina', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Tratamento tópico de HPV', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Tópico', warnings: null, target_population: 'Adultos', notes: null },
    { id: 15, title: 'Imiquimode', type: 'Medicamento', category: 'IST', health_program: 'IST e Saúde Reprodutiva', indication: 'Tratamento tópico de HPV', protocol_name: 'PCDT IST do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública e rotinas institucionais', dosage_info: null, route: 'Tópico', warnings: null, target_population: 'Adultos', notes: null },

    // ── 2. Planejamento Reprodutivo e Atenção à Mulher ───────────
    { id: 16, title: 'Etinilestradiol + Levonorgestrel', type: 'Contraceptivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contraceptivo oral combinado', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Mulheres', notes: 'Prescrição e renovação' },
    { id: 17, title: 'Etinilestradiol + Desogestrel', type: 'Contraceptivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contraceptivo oral combinado', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Mulheres', notes: null },
    { id: 18, title: 'Noretisterona', type: 'Contraceptivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contraceptivo oral', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Mulheres', notes: null },
    { id: 19, title: 'Acetato de Medroxiprogesterona', type: 'Contraceptivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contraceptivo injetável trimestral', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Injetável (IM)', warnings: null, target_population: 'Mulheres', notes: 'Trimestral' },
    { id: 20, title: 'Enantato de Noretisterona + Valerato de Estradiol', type: 'Contraceptivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contraceptivo injetável mensal', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Injetável (IM)', warnings: null, target_population: 'Mulheres', notes: 'Combinação mensal' },
    { id: 21, title: 'Levonorgestrel', type: 'Contraceptivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contracepção de emergência', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: '0,75mg ou 1,5mg', route: 'Oral', warnings: null, target_population: 'Mulheres', notes: null },
    { id: 22, title: 'DIU (Dispositivo Intrauterino)', type: 'Dispositivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contracepção de longa duração', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Conforme capacitação do enfermeiro', dosage_info: null, route: 'Intrauterino', warnings: null, target_population: 'Mulheres', notes: 'Inserção conforme capacitação' },
    { id: 23, title: 'Etonogestrel (Implante)', type: 'Dispositivo', category: 'Saúde da Mulher', health_program: 'Planejamento Reprodutivo', indication: 'Contracepção de longa duração', protocol_name: 'Protocolos de Planejamento Reprodutivo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Conforme capacitação do enfermeiro', dosage_info: null, route: 'Subdérmico', warnings: null, target_population: 'Mulheres', notes: 'Implante subdérmico' },
    { id: 24, title: 'Ácido Fólico', type: 'Suplemento', category: 'Pré-natal', health_program: 'Atenção à Gestante / Pré-Natal', indication: 'Prevenção de defeitos do tubo neural', protocol_name: 'Protocolos de Pré-natal de Baixo Risco', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Gestantes', notes: null },
    { id: 25, title: 'Sulfato Ferroso', type: 'Suplemento', category: 'Pré-natal', health_program: 'Atenção à Gestante / Pré-Natal', indication: 'Prevenção de anemia', protocol_name: 'Protocolos de Pré-natal de Baixo Risco', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Gestantes', notes: null },
    { id: 26, title: 'Carbonato de Cálcio', type: 'Suplemento', category: 'Pré-natal', health_program: 'Atenção à Gestante / Pré-Natal', indication: 'Suplementação de cálcio na gestação', protocol_name: 'Protocolos de Pré-natal de Baixo Risco', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Gestantes', notes: null },

    // ── 3. Hipertensão e Diabetes ────────────────────────────────
    { id: 27, title: 'Captopril', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '25mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 28, title: 'Maleato de Enalapril', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '5mg, 10mg, 20mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 29, title: 'Losartana Potássica', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '50mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 30, title: 'Hidroclorotiazida', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Diurético anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '25mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 31, title: 'Propranolol', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo (betabloqueador)', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 32, title: 'Anlodipino', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo (bloqueador de canal de cálcio)', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '5mg e 10mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 33, title: 'Nifedipino', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '10mg e 20mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 34, title: 'Metildopa', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '250mg', route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 35, title: 'Hidralazina', type: 'Medicamento', category: 'Hipertensão', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Anti-hipertensivo', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos com HAS', notes: null },
    { id: 36, title: 'Cloridrato de Metformina', type: 'Medicamento', category: 'Diabetes', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Antidiabético oral', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '500mg, 850mg', route: 'Oral', warnings: null, target_population: 'Adultos com DM', notes: null },
    { id: 37, title: 'Glibenclamida', type: 'Medicamento', category: 'Diabetes', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Antidiabético oral (sulfonilureia)', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: '5mg', route: 'Oral', warnings: null, target_population: 'Adultos com DM', notes: null },
    { id: 38, title: 'Insulina Humana NPH', type: 'Medicamento', category: 'Diabetes', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Insulinoterapia basal', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: null, route: 'Subcutânea', warnings: null, target_population: 'Adultos com DM', notes: null },
    { id: 39, title: 'Insulina Regular', type: 'Medicamento', category: 'Diabetes', health_program: 'Doenças Crônicas: HAS/DM', indication: 'Insulinoterapia de ação rápida', protocol_name: 'Protocolos de Acompanhamento de Crônicos na APS', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Renovação de receitas e monitoramento de pacientes estáveis', dosage_info: null, route: 'Subcutânea', warnings: null, target_population: 'Adultos com DM', notes: null },

    // ── 4. HIV: PEP e PrEP ──────────────────────────────────────
    { id: 40, title: 'Tenofovir (TDF) + Lamivudina (3TC) + Dolutegravir (DTG)', type: 'Medicamento', category: 'HIV', health_program: 'Profilaxia HIV', indication: 'Profilaxia Pós-Exposição ao HIV (PEP)', protocol_name: 'PCDT PEP do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Enfermeiros habilitados conforme protocolos do Ministério da Saúde', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos expostos ao HIV', notes: 'Esquema PEP' },
    { id: 41, title: 'Fumarato de Tenofovir Desoproxila + Entricitabina (TDF/FTC)', type: 'Medicamento', category: 'HIV', health_program: 'Profilaxia HIV', indication: 'Profilaxia Pré-Exposição ao HIV (PrEP)', protocol_name: 'PCDT PrEP do Ministério da Saúde', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Enfermeiros habilitados conforme protocolos do Ministério da Saúde', dosage_info: '300/200mg', route: 'Oral', warnings: null, target_population: 'Populações-chave para HIV', notes: 'Esquema PrEP' },

    // ── 5. Tuberculose, Hanseníase e Dengue ─────────────────────
    { id: 42, title: 'Rifampicina + Isoniazida + Pirazinamida + Etambutol', type: 'Medicamento', category: 'Tuberculose', health_program: 'Doenças Transmissíveis', indication: 'Esquema quaternário para Tuberculose', protocol_name: 'Protocolo Nacional de Tuberculose', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Tratamento Diretamente Observado (TDO)', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Pacientes com TB', notes: 'Realizado sob TDO' },
    { id: 43, title: 'Poliquimioterapia (PQT) da Hanseníase', type: 'Medicamento', category: 'Hanseníase', health_program: 'Doenças Transmissíveis', indication: 'Tratamento da Hanseníase', protocol_name: 'Protocolo Nacional de Hanseníase', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Tratamento Diretamente Observado (TDO)', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Pacientes com Hanseníase', notes: null },
    { id: 44, title: 'Creme de Ureia 10%', type: 'Medicamento', category: 'Hanseníase', health_program: 'Doenças Transmissíveis', indication: 'Hidratação da pele em hanseníase', protocol_name: 'Protocolo Nacional de Hanseníase', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: '10%', route: 'Tópico', warnings: null, target_population: 'Pacientes com Hanseníase', notes: 'Medicamento adjuvante' },
    { id: 45, title: 'Sais de Reidratação Oral (SRO)', type: 'Medicamento', category: 'Dengue', health_program: 'Doenças Transmissíveis', indication: 'Reidratação oral na Dengue', protocol_name: 'Protocolo de Manejo da Dengue', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: 'PROIBIDO uso de AAS e AINEs na dengue', target_population: 'Pacientes com Dengue', notes: null },
    { id: 46, title: 'Soro Fisiológico 0,9%', type: 'Medicamento', category: 'Dengue', health_program: 'Doenças Transmissíveis', indication: 'Hidratação venosa na Dengue', protocol_name: 'Protocolo de Manejo da Dengue', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026', release_criteria: 'Protocolos de saúde pública', dosage_info: '0,9%', route: 'Intravenosa', warnings: 'PROIBIDO uso de AAS e AINEs na dengue', target_population: 'Pacientes com Dengue', notes: null },

    // ── 6. Outros Medicamentos da Atenção Primária ──────────────
    { id: 47, title: 'Albendazol', type: 'Medicamento', category: 'Antiparasitário', health_program: 'Atenção Primária', indication: 'Antiparasitário', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: '400mg', route: 'Oral', warnings: null, target_population: 'Adultos e crianças', notes: null },
    { id: 48, title: 'Mebendazol', type: 'Medicamento', category: 'Antiparasitário', health_program: 'Atenção Primária', indication: 'Antiparasitário', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos e crianças', notes: null },
    { id: 49, title: 'Ivermectina', type: 'Medicamento', category: 'Antiparasitário', health_program: 'Atenção Primária', indication: 'Antiparasitário', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Conforme protocolo', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos e crianças', notes: null },
    { id: 50, title: 'Permetrina (Loção 1% e 5%)', type: 'Medicamento', category: 'Dermatologia', health_program: 'Atenção Primária', indication: 'Escabiose e pediculose', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: 'Loção 1% e 5%', route: 'Tópico', warnings: null, target_population: 'Adultos e crianças', notes: null },
    { id: 51, title: 'Nicotina (Adesivo Transdérmico)', type: 'Medicamento', category: 'Tabagismo', health_program: 'Cessação do Tabagismo', indication: 'Terapia de reposição nicotínica', protocol_name: 'Programa Nacional de Cessação do Tabagismo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: '7mg, 14mg, 21mg', route: 'Transdérmico', warnings: null, target_population: 'Tabagistas', notes: null },
    { id: 52, title: 'Nicotina (Goma de Mascar)', type: 'Medicamento', category: 'Tabagismo', health_program: 'Cessação do Tabagismo', indication: 'Terapia de reposição nicotínica', protocol_name: 'Programa Nacional de Cessação do Tabagismo', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: '2mg', route: 'Oral (mastigação)', warnings: null, target_population: 'Tabagistas', notes: null },
    { id: 53, title: 'Vitamina A (Retinol)', type: 'Suplemento', category: 'Saúde da Criança', health_program: 'Puericultura', indication: 'Suplementação vitamínica infantil', protocol_name: 'Protocolos de Puericultura', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: 'Gotas', route: 'Oral', warnings: null, target_population: 'Crianças', notes: null },
    { id: 54, title: 'Vitamina D (Colecalciferol)', type: 'Suplemento', category: 'Saúde da Criança', health_program: 'Puericultura', indication: 'Suplementação vitamínica infantil', protocol_name: 'Protocolos de Puericultura', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: 'Gotas', route: 'Oral', warnings: null, target_population: 'Crianças', notes: null },
    { id: 55, title: 'Dipirona', type: 'Medicamento', category: 'Sintomático', health_program: 'Atenção Primária', indication: 'Analgésico e antitérmico', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: 'Gotas e comprimido', route: 'Oral', warnings: 'PROIBIDO uso na dengue em conjunto com AAS/AINEs', target_population: 'Adultos e crianças', notes: 'Também citado no manejo da dengue' },
    { id: 56, title: 'Paracetamol', type: 'Medicamento', category: 'Sintomático', health_program: 'Atenção Primária', indication: 'Analgésico e antitérmico', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos e crianças', notes: 'Também citado no manejo da dengue' },
    { id: 57, title: 'Dimenidrato', type: 'Medicamento', category: 'Sintomático', health_program: 'Atenção Primária', indication: 'Antiemético', protocol_name: 'Protocolos da Atenção Primária', protocol_year: null, legal_basis: 'Resolução COFEN nº 801/2026 (Anexo II)', release_criteria: 'Protocolos de saúde pública', dosage_info: null, route: 'Oral', warnings: null, target_population: 'Adultos', notes: null },
];

// ═══════════════════════════════════════════════════════════════
// Valores únicos de filtro
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = Array.from(new Set(PRESCRIPTIONS.map(p => p.category))).sort();
const PROGRAMS = Array.from(new Set(PRESCRIPTIONS.map(p => p.health_program))).sort();
const TYPES = Array.from(new Set(PRESCRIPTIONS.map(p => p.type))).sort();

// ═══════════════════════════════════════════════════════════════
// COMPONENTE DA PÁGINA
// ═══════════════════════════════════════════════════════════════
export default function PrescricoesPage() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [progFilter, setProgFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        return PRESCRIPTIONS.filter(p => {
            const s = search.toLowerCase();
            const matchSearch = !s || p.title.toLowerCase().includes(s) ||
                p.indication.toLowerCase().includes(s) ||
                p.category.toLowerCase().includes(s) ||
                p.health_program.toLowerCase().includes(s);
            const matchCat = !catFilter || p.category === catFilter;
            const matchProg = !progFilter || p.health_program === progFilter;
            const matchType = !typeFilter || p.type === typeFilter;
            return matchSearch && matchCat && matchProg && matchType;
        });
    }, [search, catFilter, progFilter, typeFilter]);

    const activeFilters = [catFilter, progFilter, typeFilter].filter(Boolean).length;

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Pill className="text-emerald-500" size={24} />
                        Prescrições Autorizadas
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Medicamentos, substâncias e tecnologias que enfermeiros podem prescrever conforme Resolução COFEN nº 801/2026 e protocolos do SUS.
                    </p>
                </div>

                {/* Search + filters */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar medicamento, indicação ou categoria..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 rounded-2xl border text-sm font-bold flex items-center gap-1.5 transition-colors ${showFilters || activeFilters > 0 ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                            <Filter size={14} />
                            Filtros{activeFilters > 0 && ` (${activeFilters})`}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm">
                                <option value="">Todas as Categorias</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={progFilter} onChange={e => setProgFilter(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm">
                                <option value="">Todos os Programas</option>
                                {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm">
                                <option value="">Todos os Tipos</option>
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {activeFilters > 0 && (
                                <button onClick={() => { setCatFilter(''); setProgFilter(''); setTypeFilter(''); }}
                                    className="text-xs text-red-500 font-bold flex items-center gap-1 col-span-full justify-center py-1">
                                    <X size={12} /> Limpar filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results count */}
                <p className="text-xs text-slate-400 font-bold">{filtered.length} de {PRESCRIPTIONS.length} prescrições</p>

                {/* Results list */}
                <div className="space-y-2">
                    {filtered.map(p => {
                        const isOpen = expanded === p.id;
                        return (
                            <div key={p.id}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                                <button onClick={() => setExpanded(isOpen ? null : p.id)}
                                    className="w-full px-4 py-3 flex items-center justify-between text-left">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-sm">{p.title}</span>
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold">{p.category}</span>
                                            {p.dosage_info && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">{p.dosage_info}</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">{p.indication}</p>
                                    </div>
                                    {isOpen ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                                </button>

                                {isOpen && (
                                    <div className="px-4 pb-4 border-t border-slate-50 dark:border-slate-800">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                            <Detail label="Tipo" value={p.type} />
                                            <Detail label="Programa de Saúde" value={p.health_program} />
                                            <Detail label="Indicação" value={p.indication} />
                                            <Detail label="Protocolo" value={p.protocol_name} />
                                            <Detail label="Base Normativa" value={p.legal_basis} />
                                            <Detail label="Critério de Liberação" value={p.release_criteria} />
                                            {p.dosage_info && <Detail label="Dose / Forma" value={p.dosage_info} />}
                                            {p.route && <Detail label="Via" value={p.route} />}
                                            <Detail label="Público-alvo" value={p.target_population} />
                                            {p.notes && <Detail label="Observações" value={p.notes} />}
                                        </div>
                                        {p.warnings && (
                                            <div className="mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl px-3 py-2">
                                                <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                                                <span className="text-xs text-red-700 dark:text-red-300 font-semibold">{p.warnings}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <Pill size={32} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-bold">Nenhuma prescrição encontrada</p>
                            <p className="text-xs text-slate-400 mt-1">Tente ajustar a busca ou os filtros</p>
                        </div>
                    )}
                </div>

                {/* Legal disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl px-4 py-3">
                    <div className="flex items-start gap-2">
                        <FileText size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 dark:text-amber-300">
                            Módulo de consulta e apoio à decisão clínica. Não constitui prescrição automática.
                            Todos os dados extraídos da Resolução COFEN nº 801/2026 e protocolos do Ministério da Saúde.
                            A prescrição de enfermagem requer inserção em equipe de saúde e respaldo de protocolos institucionais.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">{value}</p>
        </div>
    );
}
