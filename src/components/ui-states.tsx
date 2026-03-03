// Unhappy Path Components — Guia APS
// LoadingState | EmptyState | ErrorState | OfflineState
'use client';

import React from 'react';
import { Wifi, AlertTriangle, SearchX, FileQuestion, RefreshCw, Plus } from 'lucide-react';
import { txt } from '@/i18n/ptBR';

// ────────────────────────────────────────
// LoadingState
// ────────────────────────────────────────
export function LoadingState({ label = txt.states.loading }: { label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400" role="status" aria-live="polite">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
            </div>
            <p className="text-sm font-semibold animate-pulse">{label}</p>
        </div>
    );
}

// ────────────────────────────────────────
// EmptyState
// ────────────────────────────────────────
interface EmptyStateProps {
    title?: string;
    body?: string;
    emoji?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    title = txt.unhappy.empty.title,
    body = txt.unhappy.empty.body,
    emoji = '📭',
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-xs mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                {emoji}
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">{title}</h3>
                <p className="text-sm text-slate-400 font-medium">{body}</p>
            </div>
            {actionLabel && onAction && (
                <button onClick={onAction} className="btn-primary mt-2">
                    <Plus size={16} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

// ────────────────────────────────────────
// ErrorState
// ────────────────────────────────────────
interface ErrorStateProps {
    title?: string;
    body?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = txt.unhappy.error.title,
    body = txt.unhappy.error.body,
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-xs mx-auto">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">{title}</h3>
                <p className="text-sm text-slate-400 font-medium">{body}</p>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary mt-2 gap-2">
                    <RefreshCw size={16} />
                    {txt.unhappy.error.action}
                </button>
            )}
        </div>
    );
}

// ────────────────────────────────────────
// EmptySearchState
// ────────────────────────────────────────
export function EmptySearchState({ query }: { query: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-xs mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <SearchX size={28} className="text-slate-400" />
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">
                    {txt.unhappy.emptySearch.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                    Nenhum resultado para <em>"{query}"</em>. {txt.unhappy.emptySearch.body}
                </p>
            </div>
        </div>
    );
}

// ────────────────────────────────────────
// OfflineState (full-page)
// ────────────────────────────────────────
export function OfflineState({ onRetry }: { onRetry?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-xs mx-auto">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
                <Wifi size={28} className="text-amber-400" />
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">{txt.unhappy.offline.title}</h3>
                <p className="text-sm text-slate-400 font-medium">{txt.unhappy.offline.body}</p>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary mt-2 gap-2">
                    <RefreshCw size={16} />
                    {txt.unhappy.offline.action}
                </button>
            )}
        </div>
    );
}

// ────────────────────────────────────────
// OfflineBanner (sticky top banner)
// ────────────────────────────────────────
export function OfflineBanner() {
    return (
        <div
            role="alert"
            aria-live="assertive"
            className="fixed top-16 left-0 right-0 z-50 flex items-center gap-3 px-6 py-3
                 bg-amber-500 text-white text-sm font-semibold shadow-lg"
        >
            <Wifi size={16} className="shrink-0" />
            <span>{txt.unhappy.offline.title}. {txt.unhappy.offline.body}</span>
        </div>
    );
}

// ────────────────────────────────────────
// UnsavedChangesDialog
// ────────────────────────────────────────
interface UnsavedDialogProps {
    open: boolean;
    onSaveDraft: () => void;
    onDiscard: () => void;
    onCancel: () => void;
}

export function UnsavedChangesDialog({ open, onSaveDraft, onDiscard, onCancel }: UnsavedDialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                <div className="space-y-1">
                    <h2 className="font-black text-lg">{txt.unhappy.unsavedChanges.title}</h2>
                    <p className="text-slate-500 text-sm font-medium">{txt.unhappy.unsavedChanges.body}</p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                    <button onClick={onSaveDraft} className="btn-primary justify-center">
                        {txt.actions.saveDraft}
                    </button>
                    <button onClick={onDiscard}
                        className="px-4 py-3 rounded-2xl text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        {txt.actions.discard}
                    </button>
                    <button onClick={onCancel}
                        className="px-4 py-3 rounded-2xl text-slate-500 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        {txt.actions.keepEditing}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ────────────────────────────────────────
// DisclaimerBanner (protocolo)
// ────────────────────────────────────────
export function DisclaimerBanner() {
    return (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 rounded-2xl">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                {txt.content.disclaimer}
            </p>
        </div>
    );
}

// ────────────────────────────────────────
// FonteCard
// ────────────────────────────────────────
interface FonteCardProps {
    source: string;
    version: string;
    updatedAt: string;
}

export function FonteCard({ source, version, updatedAt }: FonteCardProps) {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{txt.content.source}</p>
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{source}</p>
            <div className="flex gap-4 text-xs text-slate-400 font-medium">
                <span>{txt.content.version}: {version}</span>
                <span>{txt.content.updatedAt}: {updatedAt}</span>
            </div>
        </div>
    );
}
