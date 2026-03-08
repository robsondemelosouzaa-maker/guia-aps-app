'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    X, Save, Trash2, MessageCircle, Baby, ChevronDown, ChevronUp,
    Phone, CheckSquare, AlertTriangle, Loader2, ExternalLink
} from 'lucide-react';
import { updatePatient, deletePatient, upsertChecklistItem, getChecklist } from '@/lib/db/dal';
import { MODULES, FIELD_LABELS, RISK_LEVELS, type ModuleSlug } from '@/lib/db/schemaMap';
import { txt } from '@/i18n/ptBR';

// WhatsApp helper
function makeWhatsApp(phone: string): string | null {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return null;
    const number = digits.startsWith('55') ? digits : '55' + digits;
    return `https://wa.me/${number}`;
}

// ── Toast simples ─────────────────────────────────────────────
function Toast({ message, type, onDone }: { message: string; type: 'ok' | 'err'; onDone: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div className={`fixed bottom-32 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-bold flex items-center gap-2 ${type === 'ok' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {type === 'ok' ? '✅' : '❌'} {message}
        </div>
    );
}

// ── Field renderers ───────────────────────────────────────────
function FieldInput({
    name, value, onChange, type = 'text'
}: { name: string; value: unknown; onChange: (v: unknown) => void; type?: string }) {
    const label = FIELD_LABELS[name] ?? name.replace(/_/g, ' ');

    if (type === 'boolean') {
        return (
            <div className="flex items-center justify-between py-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                <button
                    onClick={() => onChange(!value)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    role="switch" aria-checked={!!value}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : ''}`} />
                </button>
            </div>
        );
    }

    if (name === 'observations' || name === 'autocuidado' || name === 'medications') {
        return (
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                <textarea
                    rows={3}
                    value={String(value ?? '')}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-emerald-400 transition-colors"
                    placeholder={`Escreva ${label.toLowerCase()}…`}
                />
            </div>
        );
    }

    if (name === 'risk_level') {
        return (
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                <select
                    value={String(value ?? '')}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors">
                    {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
        );
    }

    if (name === 'gender') {
        return (
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                <select
                    value={String(value ?? '')}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors">
                    {['Feminino', 'Masculino', 'Não Informado'].map(g => <option key={g}>{g}</option>)}
                </select>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
            <input
                type={type === 'date' ? 'date' : type === 'integer' || type === 'numeric' ? 'number' : 'text'}
                value={String(value ?? '')}
                onChange={e => onChange(type === 'integer' || type === 'numeric' ? Number(e.target.value) : e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
            />
        </div>
    );
}

// ── Checklist accordion ───────────────────────────────────────
interface ChecklistPeriod { key: string; label: string; items: { key: string; label: string }[] }
interface ChecklistItemDB { period_key: string; item_key: string; checked: boolean }

function ChecklistSection({ patientId, tableName, periods }: {
    patientId: string; tableName: string; periods: ChecklistPeriod[];
}) {
    const [open, setOpen] = useState<string | null>(periods[0]?.key ?? null);
    const [state, setState] = useState<Record<string, boolean>>({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getChecklist(patientId, tableName).then(rows => {
            const map: Record<string, boolean> = {};
            (rows as ChecklistItemDB[]).forEach(r => {
                map[`${r.period_key}__${r.item_key}`] = r.checked;
            });
            setState(map);
            setLoaded(true);
        }).catch(() => setLoaded(true));
    }, [patientId, tableName]);

    const toggle = async (period: ChecklistPeriod, item: { key: string; label: string }) => {
        const k = `${period.key}__${item.key}`;
        const next = !state[k];
        setState(prev => ({ ...prev, [k]: next }));
        await upsertChecklistItem({
            patient_id: patientId, patient_table: tableName,
            period_key: period.key, item_key: item.key,
            item_label: item.label, checked: next,
        }).catch(() => setState(prev => ({ ...prev, [k]: !next })));
    };

    if (!loaded) return <div className="py-4 text-center text-sm text-slate-400">Carregando checklist…</div>;

    return (
        <div className="space-y-2">
            {periods.map(period => {
                const done = period.items.filter(i => state[`${period.key}__${i.key}`]).length;
                const total = period.items.length;
                const isOpen = open === period.key;
                return (
                    <div key={period.key} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setOpen(isOpen ? null : period.key)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm">{period.label}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${done === total ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                    }`}>{done}/{total}</span>
                            </div>
                            {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>
                        {isOpen && (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {period.items.map(item => {
                                    const checked = !!state[`${period.key}__${item.key}`];
                                    return (
                                        <button key={item.key} onClick={() => toggle(period, item)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'
                                                }`}>
                                                {checked && <span className="text-white text-xs font-black">✓</span>}
                                            </div>
                                            <span className={`text-sm font-medium ${checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
            <p className="text-[10px] text-slate-400 text-center pt-1">Fonte: Ministério da Saúde / BVS Atenção Primária</p>
        </div>
    );
}

// ── Field type detection ──────────────────────────────────────
function getFieldType(key: string, value: unknown): string {
    if (typeof value === 'boolean') return 'boolean';
    if (key.includes('date') || key === 'dum' || key === 'dpp') return 'date';
    if (key === 'age' || key === 'last_hba1c') return 'numeric';
    return 'text';
}

// ── MAIN: PatientDrawer ───────────────────────────────────────
interface PatientDrawerProps {
    patient: Record<string, unknown> | null;
    moduleSlug: ModuleSlug;
    checklistPeriods?: ChecklistPeriod[];
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
    onDeleted: () => void;
}

export function PatientDrawer({
    patient, moduleSlug, checklistPeriods,
    open, onClose, onUpdated, onDeleted,
}: PatientDrawerProps) {
    const config = MODULES[moduleSlug];
    const [form, setForm] = useState<Record<string, unknown>>({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [tab, setTab] = useState<'dados' | 'observacoes' | 'checklist'>('dados');
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
    const [confirmDel, setConfirmDel] = useState(false);

    useEffect(() => {
        if (patient) setForm({ ...patient });
    }, [patient]);

    const field = (key: string) => form[key];
    const setField = (key: string, v: unknown) => setForm(prev => ({ ...prev, [key]: v }));

    // Visible fields
    const formFields = Object.keys(form).filter(k =>
        !config.hiddenFields.includes(k) &&
        k !== 'observations' && k !== 'autocuidado' && k !== 'medications'
    );

    const phone = String(form[config.phoneField] ?? '');
    const waLink = makeWhatsApp(phone);

    const save = async () => {
        if (!patient?.id) return;
        setSaving(true);
        try {
            const patch = { ...form };
            delete patch.id; delete patch.user_id; delete patch.created_at;
            await updatePatient(moduleSlug, String(patient.id), patch);
            setSaving(false);
            setToast({ msg: 'Alterações salvas com sucesso!', type: 'ok' });
            onUpdated();
        } catch (e: unknown) {
            setSaving(false);
            setToast({ msg: `Erro ao salvar: ${(e as Error).message}`, type: 'err' });
        }
    };

    const handleDelete = async () => {
        if (!patient?.id) return;
        setDeleting(true);
        try {
            await deletePatient(moduleSlug, String(patient.id));
            setDeleting(false);
            onDeleted();
            onClose();
        } catch (e: unknown) {
            setDeleting(false);
            setToast({ msg: `Erro ao excluir: ${(e as Error).message}`, type: 'err' });
        }
    };

    if (!open || !patient) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
            {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            <aside className="fixed z-50 flex flex-col
        bottom-0 left-0 right-0 h-[92vh] rounded-t-3xl
        md:right-0 md:top-0 md:bottom-0 md:left-auto md:h-screen md:w-[480px] md:rounded-none md:rounded-l-3xl
        bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-100 dark:border-slate-800
        overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-black text-lg truncate">{String(form[config.nameField] ?? 'Paciente')}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            {/* Risk badge */}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${String(form.risk_level) === 'Alto Risco' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                                String(form.risk_level) === 'Risco' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                                    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                }`}>{String(form.risk_level ?? 'Habitual')}</span>

                            {/* Baby born badge */}
                            {config.hasBabyBorn && form.is_pregnant === false && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300">
                                    🍼 Pós-parto
                                </span>
                            )}
                        </div>
                    </div>
                    {/* WhatsApp */}
                    {waLink ? (
                        <a href={waLink} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0">
                            <MessageCircle size={14} /> WhatsApp
                        </a>
                    ) : phone ? (
                        <a href={`tel:${phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-xl shrink-0">
                            <Phone size={14} /> {phone}
                        </a>
                    ) : null}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-5 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {(['dados', 'observacoes', ...(checklistPeriods?.length ? ['checklist'] : [])] as const).map(t => (
                        <button key={t} onClick={() => setTab(t as typeof tab)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${tab === t ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                                'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}>
                            {t === 'dados' ? 'Dados' : t === 'observacoes' ? 'Obs. e Autocuidado' : 'Checklist'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">

                    {/* Baby born toggle — always visible when gestante */}
                    {config.hasBabyBorn && tab === 'dados' && (
                        <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Baby size={16} className="text-pink-500" />
                                <span className="text-sm font-bold text-pink-700 dark:text-pink-300">Já teve o bebê</span>
                            </div>
                            <button
                                onClick={() => setField('is_pregnant', !form.is_pregnant)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${!form.is_pregnant ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                role="switch" aria-checked={!form.is_pregnant}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${!form.is_pregnant ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    )}

                    {/* Tab: Dados */}
                    {tab === 'dados' && (
                        <div className="space-y-4">
                            {formFields.map(key => (
                                <FieldInput
                                    key={key}
                                    name={key}
                                    value={field(key)}
                                    onChange={v => setField(key, v)}
                                    type={getFieldType(key, field(key))}
                                />
                            ))}
                        </div>
                    )}

                    {/* Tab: Observações + Autocuidado */}
                    {tab === 'observacoes' && (
                        <div className="space-y-5">
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle size={14} className="text-amber-500" />
                                    <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">{txt.content.disclaimer}</p>
                                </div>
                            </div>
                            <FieldInput name="observations" value={field('observations')} onChange={v => setField('observations', v)} />
                            <FieldInput name="autocuidado" value={field('autocuidado')} onChange={v => setField('autocuidado', v)} />
                            <FieldInput name="medications" value={field('medications')} onChange={v => setField('medications', v)} />
                        </div>
                    )}

                    {/* Tab: Checklist */}
                    {tab === 'checklist' && checklistPeriods && (
                        <ChecklistSection
                            patientId={String(patient.id)}
                            tableName={config.tableName}
                            periods={checklistPeriods}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
                    <button onClick={save} disabled={saving}
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Salvando…' : 'Salvar alterações'}
                    </button>

                    {!confirmDel ? (
                        <button onClick={() => setConfirmDel(true)} className="w-full h-10 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors flex items-center justify-center gap-2">
                            <Trash2 size={15} /> Excluir paciente
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleDelete} disabled={deleting}
                                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-2xl transition-colors flex items-center justify-center gap-2">
                                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                Confirmar exclusão
                            </button>
                            <button onClick={() => setConfirmDel(false)} className="px-4 h-10 text-slate-500 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
