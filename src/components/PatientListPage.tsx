'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { PatientDrawer } from '@/components/PatientDrawer';
import { listPatients, createPatient } from '@/lib/db/dal';
import { MODULES, RISK_LEVELS, type ModuleSlug } from '@/lib/db/schemaMap';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui-states';
import { Plus, Search, Filter, MessageCircle, Phone } from 'lucide-react';
import gestanteChecklist from '@/content/checklists/gestante.json';
import cdChecklist from '@/content/checklists/cd.json';

// WhatsApp helper (duplicated here for list use)
function makeWALink(phone: string) {
    const d = phone.replace(/\D/g, '');
    if (d.length < 10) return null;
    return `https://wa.me/${d.startsWith('55') ? d : '55' + d}`;
}

function getRiskColor(risk: string) {
    if (risk === 'Alto Risco') return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
    if (risk === 'Risco') return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
    return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
}

const CHECKLIST_MAP: Record<string, unknown[]> = {
    gestante: gestanteChecklist,
    crianca: cdChecklist,
};

// ── New Patient Form ──────────────────────────────────────────
function NewPatientModal({ moduleSlug, open, onClose, onCreated }: {
    moduleSlug: ModuleSlug; open: boolean; onClose: () => void; onCreated: () => void;
}) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [risk, setRisk] = useState('Habitual');
    const [condition, setCondition] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { setErr('Nome é obrigatório.'); return; }
        if (moduleSlug === 'cronicos' && !condition) { setErr('Condição crônica é obrigatória.'); return; }
        setLoading(true); setErr('');
        try {
            const mod = MODULES[moduleSlug];
            const payload: Record<string, unknown> = {
                [mod.nameField]: name.trim(),
                [mod.phoneField]: phone,
                [mod.riskField]: risk,
                // Defaults do módulo (is_pregnant, is_child, gender, etc)
                ...(mod.createDefaults ?? {}),
            };
            // Adicionar condition para crônicos
            if (moduleSlug === 'cronicos' && condition) {
                payload.condition = condition;
            }
            await createPatient(moduleSlug, payload);
            onCreated();
            onClose();
            setName(''); setPhone(''); setRisk('Habitual'); setCondition('');
        } catch (e: unknown) {
            setErr((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
                    <h2 className="font-black text-xl">Novo paciente</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome completo *</label>
                            <input value={name} onChange={e => setName(e.target.value)} required autoFocus
                                className="w-full mt-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-400" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Telefone</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="(00) 00000-0000"
                                className="w-full mt-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-400" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risco</label>
                            <select value={risk} onChange={e => setRisk(e.target.value)}
                                className="w-full mt-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-400">
                                {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        {moduleSlug === 'cronicos' && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Condição Crônica *</label>
                                <select value={condition} onChange={e => setCondition(e.target.value)}
                                    className="w-full mt-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-400">
                                    <option value="">Selecione a condição...</option>
                                    <option value="HAS">HAS (Hipertensão)</option>
                                    <option value="DM">DM (Diabetes)</option>
                                    <option value="HAS + DM">HAS + DM</option>
                                </select>
                            </div>
                        )}
                    </div>
                    {err && <p className="text-red-500 text-xs font-semibold">{err}</p>}
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={loading}
                            className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl transition-all">
                            {loading ? 'Salvando…' : 'Adicionar'}
                        </button>
                        <button type="button" onClick={onClose} className="px-4 h-11 text-slate-500 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

// ── Patient List Page ─────────────────────────────────────────
export function PatientListPage({ moduleSlug }: { moduleSlug: ModuleSlug }) {
    const config = MODULES[moduleSlug];
    const [patients, setPatients] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('');
    const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
    const [showNew, setShowNew] = useState(false);

    const load = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const data = await listPatients(moduleSlug, {
                search: search || undefined,
                risk_level: riskFilter || undefined,
            });
            setPatients(data as Record<string, unknown>[]);
        } catch (e: unknown) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [moduleSlug, search, riskFilter]);

    useEffect(() => { load(); }, [load]);

    const checklist = CHECKLIST_MAP[moduleSlug];

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black">{config.displayName}</h1>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">{patients.length} paciente{patients.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => setShowNew(true)}
                        className="flex items-center gap-2 h-11 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
                        <Plus size={18} /> Adicionar
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por nome…"
                            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 transition-colors" />
                    </div>
                    <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
                        className="h-11 px-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-400 text-slate-700 dark:text-slate-300">
                        <option value="">Todos os riscos</option>
                        {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* Content */}
                {loading && <LoadingState />}
                {error && <ErrorState body={error} onRetry={load} />}
                {!loading && !error && patients.length === 0 && (
                    <EmptyState
                        title={search ? 'Nenhum resultado' : 'Nenhum paciente cadastrado'}
                        body={search ? 'Tente outro nome.' : "Clique em 'Adicionar' para cadastrar."}
                        actionLabel="Adicionar"
                        onAction={() => setShowNew(true)}
                    />
                )}
                {!loading && !error && patients.length > 0 && (
                    <div className="space-y-2">
                        {patients.map(p => {
                            const name = String(p[config.nameField] ?? 'Paciente');
                            const phone = String(p[config.phoneField] ?? '');
                            const risk = String(p[config.riskField] ?? 'Habitual');
                            const waLink = phone ? makeWALink(phone) : null;
                            const status = String(p.status ?? '');
                            const dum = p.dum ? String(p.dum) : '';
                            const dpp = p.dpp ? String(p.dpp) : '';
                            const isGestanteModule = moduleSlug === 'gestante' || moduleSlug === 'puerperio';
                            const statusColors: Record<string, string> = {
                                gestante: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                                deu_a_luz: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
                                abortou: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
                                finalizada: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                            };
                            const statusLabels: Record<string, string> = {
                                gestante: '🤰 Gestante',
                                deu_a_luz: '🍼 Deu à luz',
                                abortou: '⚠️ Abortou',
                                finalizada: '✅ Finalizada',
                            };
                            const fmtDate = (d: string) => {
                                if (!d) return '';
                                const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
                                return m ? `${m[3]}/${m[2]}/${m[1]}` : d;
                            };
                            return (
                                <button key={String(p.id)} onClick={() => setSelected(p)}
                                    className="w-full flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3.5 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group text-left">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md">
                                        {name[0]?.toUpperCase() ?? '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{name}</p>
                                            {isGestanteModule && status && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${statusColors[status] || 'bg-slate-100 text-slate-500'}`}>
                                                    {statusLabels[status] || status}
                                                </span>
                                            )}
                                            {!isGestanteModule && config.hasBabyBorn && p.is_pregnant === false && (
                                                <span className="text-[10px] bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-full font-bold shrink-0">🍼 Pós-parto</span>
                                            )}
                                        </div>
                                        {phone && <p className="text-xs text-slate-400 font-medium">{phone}</p>}
                                        {isGestanteModule && (dum || dpp) && (
                                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                                {dum && <span>DUM: {fmtDate(dum)}</span>}
                                                {dum && dpp && <span> · </span>}
                                                {dpp && <span>DPP: {fmtDate(dpp)}</span>}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${getRiskColor(risk)}`}>{risk}</span>
                                        {waLink && (
                                            <a href={waLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                                className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
                                                title="Abrir WhatsApp">
                                                <MessageCircle size={14} />
                                            </a>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Patient Drawer */}
            <PatientDrawer
                patient={selected}
                moduleSlug={moduleSlug}
                checklistPeriods={checklist as never}
                open={!!selected}
                onClose={() => setSelected(null)}
                onUpdated={load}
                onDeleted={() => { setSelected(null); load(); }}
            />

            {/* New Patient Modal */}
            <NewPatientModal
                moduleSlug={moduleSlug}
                open={showNew}
                onClose={() => setShowNew(false)}
                onCreated={load}
            />
        </AppShell>
    );
}
