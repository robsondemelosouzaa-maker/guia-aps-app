// Mapeamento central: moduleSlug → tabela Supabase + aliases de campo
// Baseado na inspeção real do schema em 2026-03-02

export type ModuleSlug =
    | 'gestante'
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
    /** Tem campo baby_born (is_pregnant) */
    hasBabyBorn?: boolean;
    /** Checklists disponíveis */
    hasChecklist?: boolean;
}

export const MODULES: Record<ModuleSlug, ModuleConfig> = {
    gestante: {
        tableName: 'pregnant_women',
        displayName: 'Gestantes',
        phoneField: 'phone',
        nameField: 'name',
        riskField: 'risk_level',
        hiddenFields: ['id', 'user_id', 'created_at'],
        readonlyFields: ['id', 'user_id', 'created_at'],
        defaultOrder: { column: 'name', ascending: true },
        hasBabyBorn: true,
        hasChecklist: true,
    },
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
    },
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

// Rótulos para os campos (PT-BR)
export const FIELD_LABELS: Record<string, string> = {
    name: 'Nome completo',
    age: 'Idade',
    birth_date: 'Data de nascimento',
    phone: 'Telefone',
    gender: 'Sexo',
    address: 'Endereço',
    acs_area: 'Área do ACS',
    cpf: 'CPF',
    risk_level: 'Classificação de risco',
    risk_reason: 'Motivo do risco',
    condition: 'Condição',
    is_pregnant: 'Está grávida',
    dum: 'DUM (Última menstruação)',
    dpp: 'DPP (Data provável do parto)',
    is_chronic: 'Paciente crônico',
    chronic_condition: 'Condição crônica',
    is_child: 'É criança',
    guardian_name: 'Nome do responsável',
    guardian_phone: 'Telefone do responsável',
    observations: 'Observações',
    autocuidado: 'Autocuidado',
    medications: 'Medicamentos',
    last_bp_check: 'Última aferição de PA',
    last_hba1c: 'HbA1c',
    last_hba1c_date: 'Data do HbA1c',
    insulin_expiry_date: 'Validade da insulina',
};
