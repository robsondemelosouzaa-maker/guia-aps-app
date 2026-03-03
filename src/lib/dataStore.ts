// DataStore Local — Guia APS
// Mock baseado em localStorage. Interface pronta para Supabase na Fase 3.
// NUNCA expor dados brutos ao assistente — apenas via funções whitelisted abaixo.

'use client';

// ── Tipos ────────────────────────────────────────────────────
export type RiskLevel = 'habitual' | 'risco';
export type Status = 'em-dia' | 'pendente' | 'critico' | 'alto-risco';

export interface Child {
    id: string; name: string; dob: string;
    nextVisit: string; status: Status; ageMonths: number;
}

export interface Pregnant {
    id: string; name: string; age: number;
    gestationalWeek: number; riskLevel: RiskLevel;
    nextVisit: string; status: Status;
}

export interface ChronicPatient {
    id: string; name: string; age: number;
    conditions: ('HAS' | 'DM2' | 'HAS+DM2')[];
    riskLevel: RiskLevel; status: Status; nextVisit: string;
}

export interface Appointment {
    id: string; patientName: string; time: string;
    type: string; status: Status;
}

// ── Mock seed data ───────────────────────────────────────────
const MOCK: {
    children: Child[];
    pregnant: Pregnant[];
    chronic: ChronicPatient[];
    appointments: Appointment[];
} = {
    children: [
        { id: 'c1', name: 'Lucas Ferreira', dob: '2025-07-10', nextVisit: '2026-03-10', status: 'pendente', ageMonths: 8 },
        { id: 'c2', name: 'Sophia Alves', dob: '2025-01-15', nextVisit: '2026-04-15', status: 'em-dia', ageMonths: 14 },
        { id: 'c3', name: 'Enzo Barbosa', dob: '2024-03-02', nextVisit: '2026-03-05', status: 'critico', ageMonths: 24 },
        { id: 'c4', name: 'Beatriz Costa', dob: '2025-09-01', nextVisit: '2026-03-15', status: 'pendente', ageMonths: 6 },
        { id: 'c5', name: 'Miguel Souza', dob: '2025-03-20', nextVisit: '2026-04-01', status: 'em-dia', ageMonths: 11 },
    ],
    pregnant: [
        { id: 'g1', name: 'Maria Oliveira', age: 28, gestationalWeek: 32, riskLevel: 'habitual', nextVisit: '2026-03-15', status: 'em-dia' },
        { id: 'g2', name: 'Ana Souza', age: 22, gestationalWeek: 14, riskLevel: 'risco', nextVisit: '2026-03-04', status: 'critico' },
        { id: 'g3', name: 'Juliana Lima', age: 31, gestationalWeek: 22, riskLevel: 'habitual', nextVisit: '2026-03-20', status: 'em-dia' },
    ],
    chronic: [
        { id: 'p1', name: 'João da Silva', age: 65, conditions: ['HAS'], riskLevel: 'risco', status: 'critico', nextVisit: '2026-03-04' },
        { id: 'p2', name: 'Ricardo Santos', age: 58, conditions: ['DM2'], riskLevel: 'habitual', status: 'pendente', nextVisit: '2026-03-10' },
        { id: 'p3', name: 'Elza Pereira', age: 72, conditions: ['HAS+DM2'], riskLevel: 'risco', status: 'em-dia', nextVisit: '2026-04-01' },
        { id: 'p4', name: 'Carlos Mota', age: 55, conditions: ['HAS'], riskLevel: 'habitual', status: 'em-dia', nextVisit: '2026-03-30' },
    ],
    appointments: [
        { id: 'a1', patientName: 'João da Silva', time: '08:30', type: 'Consulta HAS', status: 'pendente' },
        { id: 'a2', patientName: 'Maria Oliveira', time: '09:15', type: 'Pré-natal', status: 'em-dia' },
        { id: 'a3', patientName: 'Ricardo Santos', time: '10:00', type: 'Renovação DM2', status: 'pendente' },
        { id: 'a4', patientName: 'Ana Souza', time: '10:30', type: 'Pré-natal AR', status: 'critico' },
    ],
};

// ── DataStore singleton ──────────────────────────────────────
function getStore() {
    if (typeof window === 'undefined') return MOCK;
    try {
        const raw = localStorage.getItem('guia-aps-store');
        if (raw) return JSON.parse(raw) as typeof MOCK;
    } catch { /* ignore */ }
    // Seed no primeiro acesso
    localStorage.setItem('guia-aps-store', JSON.stringify(MOCK));
    return MOCK;
}

// ── Assistant Data API (READ ONLY, whitelisted) ──────────────

export interface Counts {
    childrenTotal: number;
    childrenPending: number;
    pregnantTotal: number;
    pregnantRisk: number;
    pregnantHabitual: number;
    chronicTotal: number;
    hipertensos: number;
    diabeticos: number;
    chronicRisk: number;
    pendenciasHoje: number;
}

/**
 * Retorna contagens agregadas. Nunca retorna nomes.
 */
export function getCounts(): Counts {
    const s = getStore();
    const today = new Date().toISOString().split('T')[0];
    return {
        childrenTotal: s.children.length,
        childrenPending: s.children.filter(c => c.status !== 'em-dia').length,
        pregnantTotal: s.pregnant.length,
        pregnantRisk: s.pregnant.filter(p => p.riskLevel === 'risco').length,
        pregnantHabitual: s.pregnant.filter(p => p.riskLevel === 'habitual').length,
        chronicTotal: s.chronic.length,
        hipertensos: s.chronic.filter(p => p.conditions.some(c => c.includes('HAS'))).length,
        diabeticos: s.chronic.filter(p => p.conditions.some(c => c.includes('DM2'))).length,
        chronicRisk: s.chronic.filter(p => p.riskLevel === 'risco').length,
        pendenciasHoje: s.appointments.filter(a => a.status !== 'em-dia').length,
    };
}

/**
 * Retorna lista resumida de pendências — SEM PII por padrão.
 * showPII = true apenas quando Modo Demonstração estiver DESLIGADO e usuário pedir explicitamente.
 */
export function getPendingSummary(showPII = false): string[] {
    const s = getStore();
    return s.appointments
        .filter(a => a.status !== 'em-dia')
        .map(a => showPII
            ? `${a.time} — ${a.patientName} — ${a.type}`
            : `${a.time} — [paciente] — ${a.type}`
        );
}

/**
 * Resumo do módulo com contagens e status. Sem PII.
 */
export function getModuleSummary(moduleSlug: string): string {
    const s = getStore();
    switch (moduleSlug) {
        case 'crianca':
            return `${s.children.length} criança(s) cadastrada(s). Pendentes: ${s.children.filter(c => c.status !== 'em-dia').length}. Em dia: ${s.children.filter(c => c.status === 'em-dia').length}.`;
        case 'gestante':
            return `${s.pregnant.length} gestante(s) ativa(s). Risco habitual: ${s.pregnant.filter(p => p.riskLevel === 'habitual').length}. Alto risco: ${s.pregnant.filter(p => p.riskLevel === 'risco').length}.`;
        case 'cronicos':
            return `${s.chronic.length} paciente(s) crônico(s). Hipertensos: ${s.chronic.filter(p => p.conditions.some(c => c.includes('HAS'))).length}. Diabéticos: ${s.chronic.filter(p => p.conditions.some(c => c.includes('DM2'))).length}. Em risco: ${s.chronic.filter(p => p.riskLevel === 'risco').length}.`;
        case 'mulher':
            return 'Módulo Saúde da Mulher: rastreamentos e consultas registradas manualmente nesta versão.';
        default:
            return 'Módulo não reconhecido.';
    }
}
