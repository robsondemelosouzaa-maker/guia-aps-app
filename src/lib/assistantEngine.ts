// Motor do Assistente APS — 2 camadas
// Camada A: busca em protocolos do guia (conteúdo)
// Camada B: leitura de dados da conta (DataStore)
// Camada C (futura): LLMProvider (Gemini RAG) — desabilitada até Fase 4

import { searchContent, suggestTerms, type Protocol, type SearchResult } from './contentSearch';
import { getPendingSummary, getModuleSummary } from './dataStore'; // Removed getCounts
import { txt } from '@/i18n/ptBR';

// ── Feature flag — Fase 4 ───────────────────────────────────
export const ASSISTANT_LLM_ENABLED = false;

// ── Interface futura para LLM (Fase 4) ─────────────────────
export interface LLMProvider {
    query(prompt: string, sources: string[]): Promise<string>;
}
// Placeholder — troque pelo GeminiProvider na Fase 4
const llmProvider: LLMProvider | null = null;

// ── Tipos de resposta ───────────────────────────────────────
export type AssistantMessage = {
    role: 'assistant' | 'user';
    content: string;
    sources?: { title: string; id: string; snippet: string }[];
    timestamp: Date;
};

// ── Detecção de intenção ─────────────────────────────────────
function detectIntent(msg: string): 'counts' | 'pending' | 'module' | 'guide' {
    const m = msg.toLowerCase();
    const dataWords = ['quantos', 'quantas', 'total', 'cadastrei', 'registrei', 'tenho', 'conta', 'minha'];
    const pendWords = ['pendente', 'pendência', 'pendências', 'atrasad', 'hoje'];
    const moduleWords = ['criança', 'gestante', 'mulher', 'crônico', 'hipertenso', 'diabético'];
    if (moduleWords.some(w => m.includes(w)) && dataWords.some(w => m.includes(w))) return 'module';
    if (dataWords.some(w => m.includes(w)) || pendWords.some(w => m.includes(w))) return 'counts';
    if (pendWords.some(w => m.includes(w))) return 'pending';
    return 'guide';
}

function detectModuleSlug(msg: string): string | null {
    const m = msg.toLowerCase();
    if (m.includes('criança') || m.includes('puericultura') || m.includes('cd')) return 'crianca';
    if (m.includes('gestante') || m.includes('pré-natal') || m.includes('prenatal')) return 'gestante';
    if (m.includes('mulher')) return 'mulher';
    if (m.includes('crônico') || m.includes('hipertenso') || m.includes('diabético')) return 'cronicos';
    return null;
}

// ── Contagens reais via API route ───────────────────────────
interface RealCounts {
    pregnantTotal: number; pregnantRisk: number; pregnantHabitual: number;
    pregnantHighRisk: number; pregnantBorn: number;
    childrenTotal: number; chronicTotal: number;
    hipertensos: number; diabeticos: number; chronicRisk: number;
    womenTotal: number; elderlyTotal: number;
}

async function fetchRealCounts(): Promise<RealCounts | null> {
    try {
        const res = await fetch('/api/assistant/counts', { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// ── Formata contagens em resposta legível ───────────────────
async function formatCounts(): Promise<string> {
    const c = await fetchRealCounts();
    if (!c) return 'Não foi possível carregar os dados das contagens no momento.';
    return [
        `📊 **Resumo da sua equipe:**`,
        `• 👶 Crianças (puericultura): **${c.childrenTotal}** cadastradas`,
        `• 🤰 Gestantes: **${c.pregnantTotal}** ativas — Habitual: ${c.pregnantHabitual} | Alto risco: ${c.pregnantRisk}`,
        `• ❤️ Crônicos: **${c.chronicTotal}** — Hipertensos: ${c.hipertensos} | Diabéticos: ${c.diabeticos} | Em risco: ${c.chronicRisk}`,
        `• 🌸 Mulheres: **${c.womenTotal}** cadastradas`,
        `• 👵 Idosos: **${c.elderlyTotal}** cadastrados`,
    ].join('\n');
}

// ── Formata pendências do dia ────────────────────────────────
function formatPending(): string {
    const list = getPendingSummary(false);
    if (list.length === 0) return '✅ Nenhuma pendência crítica para hoje. Parabéns!';
    return `📋 **Pendências de hoje:**\n${list.map(l => `• ${l}`).join('\n')}`;
}

// ── Formata resultado de guia ────────────────────────────────
function formatGuideResult(results: SearchResult[]): AssistantMessage['sources'] {
    return results.map(r => ({
        title: r.protocol.title,
        id: r.protocol.id,
        snippet: r.snippet,
    }));
}

function buildGuideAnswer(results: SearchResult[]): string {
    if (results.length === 0) return txt.assistant.notFound;
    const top = results[0].protocol;
    const lines: string[] = [
        `ℹ️ **${top.title}**`,
        '',
        top.summary,
    ];
    if (top.checklist.length > 0) {
        lines.push('', '**Checklist principal:**');
        top.checklist.forEach(item => lines.push(`• ${item}`));
    }
    lines.push('', `_Fonte: ${top.source} (v. ${top.version})_`);
    return lines.join('\n');
}

// ── Respostas rápidas via chips ─────────────────────────────
export async function handleChip(chip: string): Promise<AssistantMessage> {
    if (chip === 'counts' || chip === 'minhas contagens') {
        return { role: 'assistant', content: await formatCounts(), timestamp: new Date() };
    }
    if (chip === 'pending' || chip === 'pendências') {
        return { role: 'assistant', content: formatPending(), timestamp: new Date() };
    }
    if (chip === 'ciap') {
        const results = searchContent('CIAP-2');
        return {
            role: 'assistant',
            content: buildGuideAnswer(results),
            sources: formatGuideResult(results),
            timestamp: new Date(),
        };
    }
    // searchGuide — pede ao usuário para digitar
    return {
        role: 'assistant',
        content: 'Claro! Sobre qual protocolo ou tema você quer buscar?',
        timestamp: new Date(),
    };
}

// ── Resposta principal do assistente (DeepSeek) ─────────────────
// ── Busca lista de pacientes de um módulo via API ────────────
async function fetchPatientList(module: string, search?: string): Promise<any[] | null> {
    try {
        const url = `/api/patients/${module}${search ? `?search=${encodeURIComponent(search)}` : ''}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// ── Detecta se usuário quer info de um paciente específico ────
function detectPatientSearch(msg: string): string | null {
    const m = msg.toLowerCase();
    // Padrões como "paciente Maria", "encontre João", "buscar Silva"
    const patterns = [
        /paciente\s+([a-záéíóúàâêôãõçü\s]+)/i,
        /(?:encontre?|busca[rn]?|mostra[rn]?|informa[rn]?)\s+(?:o|a|os|as)?\s*(?:paciente)?\s*([a-záéíóúàâêôãõçü\s]{3,})/i,
        /(?:sobre|de)\s+(?:o|a)?\s*(?:paciente)?\s*([a-záéíóúàâêôãõçü\s]{3,})/i,
    ];
    for (const p of patterns) {
        const match = msg.match(p);
        if (match && match[1]) return match[1].trim();
    }
    return null;
}

export async function getAssistantResponse(
    userMessage: string,
    demoMode = false
): Promise<AssistantMessage> {
    const intent = detectIntent(userMessage);

    // --- Formatando o contexto a ser enviado para a LLM ---
    const c = await fetchRealCounts();
    let currentContext = '## Estatísticas da UBS:\n';
    if (c) {
        currentContext += `- Crianças em puericultura: ${c.childrenTotal}\n`;
        currentContext += `- Gestantes ativas: ${c.pregnantTotal} (Habitual: ${c.pregnantHabitual}, Alto risco: ${c.pregnantHighRisk})\n`;
        currentContext += `- Pacientes crônicos: ${c.chronicTotal} (Hipertensos: ${c.hipertensos}, Diabéticos: ${c.diabeticos})\n`;
        currentContext += `- Idosos (60+): ${c.elderlyTotal}\n`;
        currentContext += `- Mulheres cadastradas: ${c.womenTotal}\n\n`;
    }

    // Busca lista de pacientes se usuário perguntar sobre módulo específico
    const slug = detectModuleSlug(userMessage);
    if (slug || intent === 'module') {
        const moduleSlug = slug || detectModuleSlug(userMessage) || 'gestante';
        const patientSearch = detectPatientSearch(userMessage);
        const patients = await fetchPatientList(moduleSlug, patientSearch || undefined);
        if (patients && patients.length > 0) {
            currentContext += `## Pacientes do módulo "${moduleSlug}" cadastrados:\n`;
            patients.slice(0, 20).forEach((p: any) => {
                const name = p.name || p.nome || 'Sem nome';
                const age = p.age || p.idade || '';
                const risk = p.risk_level || p.risco || '';
                const condition = p.condition || p.condicao || '';
                currentContext += `- ${name}${age ? `, ${age} anos` : ''}${risk ? `, Risco: ${risk}` : ''}${condition ? `, Condição: ${condition}` : ''}\n`;
            });
            if (patients.length > 20) {
                currentContext += `... e mais ${patients.length - 20} pacientes.\n`;
            }
            currentContext += '\n';
        }
    }

    // Busca por nome específico de paciente em todos os módulos
    const patientName = detectPatientSearch(userMessage);
    if (patientName && !slug) {
        currentContext += `## Busca por paciente: "${patientName}"\n`;
        const modules = ['gestante', 'crianca', 'cronicos', 'mulher', 'idosos'];
        for (const mod of modules) {
            const found = await fetchPatientList(mod, patientName);
            if (found && found.length > 0) {
                currentContext += `Encontrado em ${mod}:\n`;
                found.forEach((p: any) => {
                    const age = p.age || p.idade || '';
                    const risk = p.risk_level || '';
                    const condition = p.condition || '';
                    currentContext += `- ${p.name || p.nome}${age ? `, ${age} anos` : ''}${risk ? `, Risco: ${risk}` : ''}${condition ? `, Condição: ${condition}` : ''}\n`;
                });
            }
        }
        currentContext += '\n';
    }

    if (intent === 'pending') {
        currentContext += `## Pendências Críticas p/ Hoje:\n${getPendingSummary(false).join('\n')}\n\n`;
    }

    // Busca protocolos no guia para enriquecer a resposta clínica
    const results = searchContent(userMessage, 3);
    const sources = formatGuideResult(results);

    if (results.length > 0) {
        currentContext += `## Protocolos relevantes no guia:\n${results.map(r => `[${r.protocol.title}]: ${r.snippet}`).join('\n\n')}\n`;
    }

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: userMessage }],
                contextData: currentContext
            })
        });

        if (!response.ok) throw new Error('API Error');

        const textResponse = await response.text();

        // Extrai texto puro do formato streamText da SDK AI ("0:Este é o texto")
        const cleanContent = textResponse
            .split('\n')
            .filter(line => line.startsWith('0:'))
            .map(line => line.substring(2))
            .map(line => {
                try { return JSON.parse(line); } catch { return line; }
            })
            .join('')
            .replace(/\\n/g, '\n');

        return {
            role: 'assistant',
            content: cleanContent || buildGuideAnswer(results),
            sources: sources?.length ? sources : undefined,
            timestamp: new Date(),
        };
    } catch (e) {
        console.error("DeepSeek API failed, falling back to local guide search...");

        if (results.length === 0) {
            const suggestions = suggestTerms(userMessage);
            const hint = suggestions.length > 0
                ? `\n\nTente buscar por: ${suggestions.map(t => `_${t}_`).join(', ')}`
                : '';
            return {
                role: 'assistant',
                content: "Hmm, estou com dificuldades de conectar ao servidor de IA no momento. 😔 " + txt.assistant.notFound + hint,
                timestamp: new Date(),
            };
        }

        return {
            role: 'assistant',
            content: buildGuideAnswer(results),
            sources,
            timestamp: new Date(),
        };
    }
}


