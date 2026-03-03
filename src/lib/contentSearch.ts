// Motor de busca local, sem dependências externas — Guia APS
// Executa no cliente para garantir funcionamento offline.

import protocolsData from '@/content/protocols.json';

export type Protocol = {
    id: string;
    title: string;
    module: string | null;
    tags: string[];
    ciapCodes: string[];
    source: string;
    sourceFull: string;
    version: string;
    updatedAt: string;
    summary: string;
    body: string;
    checklist: string[];
};

const protocols = protocolsData as Protocol[];

// ── Normaliza string: remove acentos, lowercase ────────────
function normalize(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// ── Extrai um trecho de até ~200 chars ao redor do match ───
function snippet(text: string, query: string, maxLen = 200): string {
    const idx = normalize(text).indexOf(normalize(query));
    if (idx === -1) return text.slice(0, maxLen) + '…';
    const start = Math.max(0, idx - 60);
    const end = Math.min(text.length, idx + maxLen - 60);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

// ── Score heurístico por campo ──────────────────────────────
function score(proto: Protocol, q: string): number {
    const nq = normalize(q);
    let s = 0;
    if (normalize(proto.title).includes(nq)) s += 10;
    if (proto.tags.some(t => normalize(t).includes(nq))) s += 8;
    if (proto.ciapCodes.some(c => c.toLowerCase() === nq.toLowerCase())) s += 12;
    if (normalize(proto.summary).includes(nq)) s += 5;
    if (normalize(proto.body).includes(nq)) s += 3;
    return s;
}

export type SearchResult = {
    protocol: Protocol;
    snippet: string;
    score: number;
};

// ── Busca principal ─────────────────────────────────────────
export function searchContent(query: string, limit = 8): SearchResult[] {
    const q = query.trim();
    if (q.length < 2) return [];

    return protocols
        .map(proto => ({ protocol: proto, snippet: snippet(proto.body || proto.summary, q), score: score(proto, q) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

// ── Busca por ID (para página de detalhe) ─────────────────
export function getProtocolById(id: string): Protocol | undefined {
    return protocols.find(p => p.id === id);
}

// ── Busca por módulo ───────────────────────────────────────
export function getProtocolsByModule(moduleSlug: string): Protocol[] {
    return protocols.filter(p => p.module === moduleSlug);
}

// ── Todos os protocolos ────────────────────────────────────
export function getAllProtocols(): Protocol[] {
    return protocols;
}

// ── Sugestão de termos quando sem resultado ────────────────
export function suggestTerms(query: string, limit = 4): string[] {
    const q = normalize(query);
    const allTags = protocols.flatMap(p => p.tags);
    const unique = Array.from(new Set(allTags));
    return unique
        .filter(t => normalize(t).includes(q) || q.includes(normalize(t)))
        .slice(0, limit);
}
