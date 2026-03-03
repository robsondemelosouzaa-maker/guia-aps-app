# Roadmap — Fase 3 e Fase 4

## ✅ Fase 1 (Concluída): Fundação UX/UI
Estrutura Next.js, design system, páginas base, dark mode, responsividade.

## ✅ Fase 2 (Concluída): Informações + UX
Microcopy, estados de interface, busca offline, Assistente APS com motor local, DataStore mock.

---

## 🔜 Fase 3: Dados Reais (Supabase)

| Item | Descrição |
|---|---|
| Autenticação | Login por e-mail/senha ou OTP via Supabase Auth |
| Banco de dados | Substituir `dataStore.ts` por chamadas ao Supabase PostgreSQL |
| Perfis de usuário | Equipe, UBS, município |
| Sincronização | Dados sincronizados entre dispositivos; offline-first com Service Worker |
| LGPD | Criptografia, consentimento, direito ao esquecimento |
| Registros reais | Pacientes, consultas, procedimentos |
| Modo Offline | PWA + cache de conteúdo + queue de mutações para sync |

**Arquivo a trocar:** `src/lib/dataStore.ts` → adaptar para Client Supabase.  
A interface das funções (`getCounts`, `getPendingSummary`, `getModuleSummary`) não muda — apenas a implementação.

---

## 🔜 Fase 4: Inteligência Artificial (Gemini RAG)

| Item | Descrição |
|---|---|
| Feature flag | Ativar `ASSISTANT_LLM_ENABLED = true` em `.env` |
| GeminiProvider | Implementar `LLMProvider` (interface já criada em `assistantEngine.ts`) |
| RAG | Enviar trechos dos protocolos locais como contexto para o Gemini |
| Regra inviolável | O Gemini só responde quando houver fonte identificada no guia |
| Embeddings | Vetorizar conteúdo para busca semântica mais precisa (ex: Gemini Embedding API) |
| Multimodal | Leitura de PDFs do guia para enriquecer a base de conhecimento |

**Arquivo a ativar:** `src/lib/assistantEngine.ts` → plugar `GeminiProvider` no lugar do `null` placeholder.
