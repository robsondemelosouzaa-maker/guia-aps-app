# Guia APS — Fase 3: Setup e Como Usar

## 1. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ofynaerlvcvglglkdwaw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua anon key>
SUPABASE_SERVICE_ROLE_KEY=<sua service role key>
ALLOWED_EMAIL=valeriaassessoria1@gmail.com
```

> ⚠️ Nunca commite o `.env.local` no Git.

---

## 2. Executar as migrations SQL

1. Abra o [Editor SQL do Supabase](https://supabase.com/dashboard/project/ofynaerlvcvglglkdwaw/editor)
2. Cole o conteúdo de `docs/migrations.sql`
3. Execute

---

## 3. Instalar e rodar o app

Abra um **terminal novo** (para Node.js estar no PATH):

```bash
cd C:\Users\robso\.gemini\antigravity\scratch\guia-aps-app

# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

---

## 4. Como fazer login (Magic Link)

1. Abra o app → você será redirecionado para `/login`
2. Digite **valeriaassessoria1@gmail.com**
3. Clique em **"Enviar link de acesso"**
4. Verifique o e-mail → clique no link
5. Pronto! Sessão ficará salva (não precisa logar toda vez)

> Se tentar entrar com outro e-mail, o acesso é negado automaticamente.

---

## 5. Módulos de pacientes disponíveis

| Módulo | Rota |
|---|---|
| Gestantes | `/pacientes/gestante` |
| Crianças (CD) | `/pacientes/crianca` |
| Crônicos (HAS/DM) | `/pacientes/cronicos` |
| Saúde da Mulher | `/pacientes/mulher` |
| Idosos | `/pacientes/idosos` |

---

## 6. Como funciona o Assistente APS

O assistente está no botão flutuante (canto inferior direito) ou no header ("Assistente").

**Perguntas que ele responde com dados reais:**
- "Quantas gestantes de risco?"
- "Quantos hipertensos tenho?"
- "Total de crianças cadastradas?"
- "Quantos crônicos em alto risco?"

**Perguntas sobre protocolos:**
- "Protocolo de pré-natal"
- "Como fazer puericultura?"
- "CIAP-2 K86"
