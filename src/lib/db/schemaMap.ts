// Mapeamento central: moduleSlug → tabela Supabase + aliases de campo
// CORRIGIDO 2026-03-08: baseado na inspeção real do schema.
// Cada módulo aponta para a tabela onde os dados REALMENTE existem.
//
// TABELAS REAIS:
//   patients         → 189 rows (geral, mulher, idosos)
//   pregnant_women   → 46 rows  (gestantes + puerpério)
//   children         → 50 rows  (crianças CD)
//   chronic_patients → 28 rows  (crônicos HAS/DM)

export type ModuleSlug =
    | 'gestante'
    | 'puerperio'
    | 'crianca'
    | 'cronicos'
    | 'mulher'
    | 'idosos'
    | 'geral';

export interface ModuleConfig {
    tableName: string;
    displayName: string;
    phoneField: string;
    nameField: string;
    riskField: string;
    /** Filtros extras para listar apenas pacientes do módulo */
    baseFilter?: Record<string, unknown>;
    /** Campos a esconder do form dinâmico */
    hiddenFields: string[];
    /** Campos somente leitura */
    readonlyFields: string[];
    /** Ordenação padrão */
    defaultOrder: { column: string; ascending: boolean };
    /** Tem botão "Já teve o bebê" */
    hasBabyBorn?: boolean;
    /** Checklists disponíveis */
    hasChecklist?: boolean;
    /** Defaults ao criar novo paciente neste módulo */
    createDefaults?: Record<string, unknown>;
}

export const MODULES: Record<ModuleSlug, ModuleConfig> = {
    // ── Gestantes: pregnant_women WHERE is_pregnant = true ────────────
    gestante: {
        tableName: 'pregnant_women',
        displayName: 'Gestantes',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { is_pregnant: true },
        hiddenFields: ['id', 'user_id', 'created_at', 'clinical_data', 'is_pregnant'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        hasBabyBorn: true,
        hasChecklist: true,
        createDefaults: { is_pregnant: true },
    },

    // ── Puerpério: pregnant_women WHERE is_pregnant = false ───────────
    puerperio: {
        tableName: 'pregnant_women',
        displayName: 'Puerpério',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { is_pregnant: false },
        hiddenFields: ['id', 'user_id', 'created_at', 'clinical_data', 'is_pregnant'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        hasBabyBorn: true,
        hasChecklist: true,
    },

    // ── Crianças (CD): children ──────────────────────────────────────
    crianca: {
        tableName: 'children',
        displayName: 'Crianças (CD)',
        phoneField: 'guardian_phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: ['id', 'user_id', 'created_at'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'birth_date', ascending: true },
        hasChecklist: true,
    },

    // ── Crônicos (HAS/DM): chronic_patients ──────────────────────────
    cronicos: {
        tableName: 'chronic_patients',
        displayName: 'Crônicos (HAS/DM)',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: ['id', 'user_id', 'created_at', 'clinical_data'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
    },

    // ── Saúde da Mulher: patients WHERE gender = 'Feminino' ──────────
    // Inclui gestantes que TAMBÉM existam na tabela patients,
    // mas não puxa de pregnant_women (tabela separada).
    mulher: {
        tableName: 'patients',
        displayName: 'Saúde da Mulher',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { gender: 'Feminino' },
        hiddenFields: ['id', 'user_id', 'created_at', 'clinical_data', 'is_pregnant', 'is_chronic', 'is_child'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        createDefaults: { gender: 'Feminino' },
    },

    // ── Idosos: patients WHERE age >= 60 ─────────────────────────────
    idosos: {
        tableName: 'patients',
        displayName: 'Idosos',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: ['id', 'user_id', 'created_at', 'clinical_data', 'is_pregnant', 'is_chronic', 'is_child'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
    },

    // ── Geral: patients (todos) ──────────────────────────────────────
    geral: {
        tableName: 'patients',
        displayName: 'Pacientes Gerais',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: ['id', 'user_id', 'created_at', 'clinical_data'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
    },
};

export const RISK_LEVELS = ['Habitual', 'Risco', 'Alto Risco'] as const;
export type RiskLevel = typeof RISK_LEVELS[number];

/** Mapeamento de chave de campo → rótulo exibido no formulário */
export const FIELD_LABELS: Record<string, string> = {
    name: 'Nome',
    age: 'Idade',
    gender: 'Sexo',
    birth_date: 'Data de Nascimento',
    phone: 'Telefone',
    address: 'Endereço',
    acs_area: 'Área ACS',
    cpf: 'CPF',
    risk_level: 'Risco',
    risk_reason: 'Motivo do Risco',
    dum: 'DUM',
    dpp: 'DPP',
    condition: 'Condição Crônica',
    last_bp_check: 'Última Aferição PA',
    last_hba1c: 'Última HbA1c',
    last_hba1c_date: 'Data HbA1c',
    insulin_expiry_date: 'Validade Insulina',
    guardian_name: 'Nome do Responsável',
    guardian_phone: 'Tel. Responsável',
    observations: 'Observações Clínicas',
    autocuidado: 'Autocuidado / Orientações',
    medications: 'Medicamentos em Uso',
};
