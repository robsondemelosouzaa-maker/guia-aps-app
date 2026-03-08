// Mapeamento central: moduleSlug → tabela Supabase + aliases de campo
// UNIFICADO: todos os módulos consultam a tabela `patients` com filtros distintos
// Atualizado em 2026-03-08 após migração de unificação do schema.

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
    /** Tem campo baby_born (is_pregnant / is_puerperio) */
    hasBabyBorn?: boolean;
    /** Checklists disponíveis */
    hasChecklist?: boolean;
    /** Defaults ao criar novo paciente neste módulo */
    createDefaults?: Record<string, unknown>;
}

// Campos técnicos que nunca aparecem no formulário de edição
const COMMON_HIDDEN = [
    'id', 'user_id', 'created_at',
    'is_pregnant', 'is_puerperio', 'is_chronic', 'is_child',
    'clinical_data',
];

export const MODULES: Record<ModuleSlug, ModuleConfig> = {
    // ── Gestante: mulheres com is_pregnant = true ────────────────────────
    gestante: {
        tableName: 'patients',
        displayName: 'Gestantes',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { is_pregnant: true },
        hiddenFields: [...COMMON_HIDDEN, 'condition', 'last_bp_check', 'last_hba1c',
            'last_hba1c_date', 'insulin_expiry_date', 'guardian_name', 'guardian_phone'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        hasBabyBorn: true,
        hasChecklist: true,
        createDefaults: { is_pregnant: true, is_puerperio: false, is_chronic: false, is_child: false, gender: 'Feminino' },
    },

    // ── Puerpério: mulheres com is_puerperio = true ──────────────────────
    puerperio: {
        tableName: 'patients',
        displayName: 'Puerpério',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { is_puerperio: true },
        hiddenFields: [...COMMON_HIDDEN, 'condition', 'last_bp_check', 'last_hba1c',
            'last_hba1c_date', 'insulin_expiry_date', 'guardian_name', 'guardian_phone'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        hasBabyBorn: true,
        hasChecklist: true,
        createDefaults: { is_puerperio: true, is_pregnant: false, is_chronic: false, is_child: false, gender: 'Feminino' },
    },

    // ── Crianças (CD): is_child = true ───────────────────────────────────
    crianca: {
        tableName: 'patients',
        displayName: 'Crianças (CD)',
        phoneField: 'guardian_phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { is_child: true },
        hiddenFields: [...COMMON_HIDDEN, 'address', 'acs_area', 'cpf', 'dum', 'dpp',
            'condition', 'last_bp_check', 'last_hba1c', 'last_hba1c_date', 'insulin_expiry_date'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'birth_date', ascending: true },
        hasChecklist: true,
        createDefaults: { is_child: true, is_pregnant: false, is_chronic: false, is_puerperio: false },
    },

    // ── Crônicos: is_chronic = true ───────────────────────────────────────
    cronicos: {
        tableName: 'patients',
        displayName: 'Crônicos (HAS/DM)',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { is_chronic: true },
        hiddenFields: [...COMMON_HIDDEN, 'dum', 'dpp', 'guardian_name', 'guardian_phone'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        createDefaults: { is_chronic: true, is_pregnant: false, is_child: false, is_puerperio: false },
    },

    // ── Saúde da Mulher: gender = 'Feminino' (inclui gestantes automaticamente) ──
    mulher: {
        tableName: 'patients',
        displayName: 'Saúde da Mulher',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        baseFilter: { gender: 'Feminino' },
        hiddenFields: [...COMMON_HIDDEN, 'guardian_name', 'guardian_phone'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        createDefaults: { gender: 'Feminino', is_pregnant: false, is_chronic: false, is_child: false, is_puerperio: false },
    },

    // ── Idosos: age >= 60 (filtro especial na API, não no baseFilter) ─────
    idosos: {
        tableName: 'patients',
        displayName: 'Idosos',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: [...COMMON_HIDDEN, 'dum', 'dpp', 'guardian_name', 'guardian_phone'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        createDefaults: { is_pregnant: false, is_chronic: false, is_child: false, is_puerperio: false },
    },

    // ── Geral: todos os pacientes ─────────────────────────────────────────
    geral: {
        tableName: 'patients',
        displayName: 'Pacientes Gerais',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: [...COMMON_HIDDEN],
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
