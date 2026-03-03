# Como Adicionar Conteúdo ao Guia APS

**Arquivo:** `src/content/protocols.json`

Cada item precisa seguir esta estrutura:

```json
{
  "id": "slug-unico",
  "title": "Título do Protocolo",
  "module": "crianca | gestante | mulher | cronicos | null",
  "tags": ["palavras", "chave", "para busca"],
  "ciapCodes": ["K86", "T90"],
  "source": "Nome curto da fonte",
  "sourceFull": "Referência bibliográfica completa (ABNT ou Vancouver)",
  "version": "2024",
  "updatedAt": "2024-01-01",
  "summary": "Resumo de 2–3 frases. Será exibido no resultado da busca.",
  "body": "Texto completo (suporta **negrito**, listas com - ou 1. 2.)",
  "checklist": [
    "Item 1 do checklist",
    "Item 2 do checklist"
  ]
}
```

## Regras Obrigatórias

1. **`id`** deve ser único e lowercase com hifens (ex: `has-protocolo`).
2. **`source`** e **`sourceFull`** são obrigatórios — o app mostra a fonte em toda tela de protocolo.
3. **`tags`** é o que a busca usa para encontrar o conteúdo. Inclua variações e sinônimos.
4. Não invente dados clínicos. Use somente fontes oficiais (MS, COFEN, INCA, WONCA).
5. Se o protocolo não for de nenhum módulo específico, use `"module": null`.

## Boas práticas

- Mantenha o `summary` com 2–4 frases. Ele aparece no resultado da busca e na resposta do Assistente.
- O `checklist` é opcional mas recomendado para protocolos de consulta.
- Use **negrito** (`**texto**`) para destacar termos importantes no `body`.
- Atualize `updatedAt` ao modificar o conteúdo.
