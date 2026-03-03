// DAL — Data Access Layer v2
// Chama rotas de API server-side que usam a service role key.
// Isso contorna o RLS do Supabase sem precisar de sessão Supabase Auth.
'use client';

import { type ModuleSlug } from './schemaMap';

// ── helpers ──────────────────────────────────────────────────
async function api(url: string, options?: RequestInit) {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) } });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error ?? res.statusText);
    }
    return res.json();
}

// ── Lista pacientes ───────────────────────────────────────────
export async function listPatients(
    moduleSlug: ModuleSlug,
    filters?: { risk_level?: string; search?: string; babyBorn?: boolean }
) {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.risk_level) params.set('risk_level', filters.risk_level);
    if (filters?.babyBorn !== undefined) params.set('babyBorn', String(filters.babyBorn));

    const qs = params.toString();
    return api(`/api/patients/${moduleSlug}${qs ? `?${qs}` : ''}`);
}

// ── Criar paciente ────────────────────────────────────────────
export async function createPatient(
    moduleSlug: ModuleSlug,
    payload: Record<string, unknown>
) {
    return api(`/api/patients/${moduleSlug}`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// ── Atualizar paciente ────────────────────────────────────────
export async function updatePatient(
    moduleSlug: ModuleSlug,
    id: string,
    patch: Record<string, unknown>
) {
    return api(`/api/patients/${moduleSlug}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
    });
}

// ── Excluir paciente ──────────────────────────────────────────
export async function deletePatient(moduleSlug: ModuleSlug, id: string) {
    return api(`/api/patients/${moduleSlug}/${id}`, { method: 'DELETE' });
}

// ── Contagens reais ───────────────────────────────────────────
export async function getCounts() {
    return api('/api/assistant/counts');
}

// ── Checklist ─────────────────────────────────────────────────
export async function getChecklist(patientId: string, patientTable: string, periodKey?: string) {
    const params = new URLSearchParams({ patientId, patientTable });
    if (periodKey) params.set('periodKey', periodKey);
    return api(`/api/checklists?${params.toString()}`);
}

export async function upsertChecklistItem(item: {
    patient_id: string; patient_table: string;
    period_key: string; item_key: string;
    item_label: string; checked: boolean;
}) {
    return api('/api/checklists', { method: 'POST', body: JSON.stringify(item) });
}
