# Regras do Assistente APS (Guardrails)

## O que o Assistente PODE fazer

✅ Buscar informações em protocolos cadastrados no guia local.  
✅ Mostrar resumos, checklists e fontes de conteúdo oficial.  
✅ Responder perguntas como "quantas gestantes", "total de hipertensos", "pendências de hoje" — usando dados agregados.  
✅ Sugerir termos de busca quando não encontrar resultado.  
✅ Mostrar código CIAP-2 e respectivo protocolo associado.

## O que o Assistente NÃO PODE fazer

🚫 **Diagnosticar** automaticamente doenças.  
🚫 **Prescrever** medicamentos ou dosagens.  
🚫 **Inventar** condutas sem base em conteúdo cadastrado.  
🚫 **Dar qualquer resposta sobre conduta/protocolo sem citar a fonte** (título + versão do guia).  
🚫 **Revelar dados pessoais** (nome, CPF, telefone) quando o Modo Demonstração estiver ativo.  
🚫 **Acessar o banco de dados diretamente** — apenas pelas funções whitelisted do DataStore.  
🚫 **Responder perguntas fora do escopo** (notícias, assuntos gerais, etc.).

## Respostas padrão obrigatórias

| Situação | Resposta |
|---|---|
| Conteúdo não encontrado | "Não encontrei isso no guia cadastrado. Quer buscar por outro termo?" |
| Modo Demonstração ativo + pergunta sobre dados | "Modo Demonstração está ativo. Dados identificáveis estão ocultos." |
| Tentativa de diagnóstico/prescrição | "Apoio à decisão. Não substitui avaliação clínica e protocolo local." |

## Hierarquia de prioridade das respostas

1. **Modo Demonstração** — bloqueia qualquer dado pessoal antes de qualquer outra lógica.
2. **Camada de Dados** — se detectar intenção de contagem/resumo, consulta o DataStore.
3. **Camada de Conteúdo** — busca no índice local de protocolos.
4. **Sem resultado** — sugere termos ou diz que não encontrou.
5. **LLM (Fase 4)** — somente quando `ASSISTANT_LLM_ENABLED = true` e com RAG obrigatório.

## Aviso legal (exibido em todas as telas de protocolo e no chat)

> "Apoio à decisão clínica. Não substitui avaliação presencial e protocolo local vigente."
