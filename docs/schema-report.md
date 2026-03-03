# Schema Report — Guia APS Supabase

**Gerado em:** 2026-03-02  
**Projeto:** ofynaerlvcvglglkdwaw  

---

## Tabelas de Pacientes

### `pregnant_women` — Gestantes
| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| id | uuid (PK) | ✅ | gen_random_uuid() |
| user_id | uuid | | |
| name | text | ✅ | |
| age | integer | | |
| birth_date | date | | |
| phone | text | | |
| risk_level | text | | **"Habitual"** |
| risk_reason | text | | |
| dum | date | | (Data Última Menstruação) |
| dpp | date | | (Data Provável do Parto) |
| is_pregnant | boolean | | **true** → "Já teve bebê" quando false |
| clinical_data | jsonb | | |
| created_at | timestamp | | |

> ⚠️ **Colunas a adicionar:** `autocuidado text`, `observations` já existia? Verificar. `baby_born` pode usar `is_pregnant=false`.

---

### `children` — Crianças (CD)
| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| id | uuid (PK) | ✅ | |
| user_id | uuid | | |
| name | text | ✅ | |
| birth_date | date | ✅ | |
| gender | text | | "Não informado" |
| risk_level | text | | "Baixo" |
| guardian_name | text | | |
| guardian_phone | text | | |
| observations | text | | |
| created_at | timestamp | ✅ | |

> ⚠️ **Colunas a adicionar:** `autocuidado text`

---

### `chronic_patients` — Crônicos (HAS/DM)
| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| id | uuid (PK) | ✅ | |
| user_id | uuid | | |
| name | text | ✅ | |
| age | integer | | |
| phone | text | | |
| condition | text | ✅ | "HAS" |
| risk_level | text | | "Baixo" |
| last_bp_check | date | | |
| last_hba1c | numeric | | |
| last_hba1c_date | date | | |
| insulin_expiry_date | date | | |
| medications | text | | |
| observations | text | | |
| clinical_data | jsonb | | |
| created_at | timestamp | | |

> ⚠️ **Colunas a adicionar:** `autocuidado text`

---

### `patients` — Pacientes Gerais (Saúde da Mulher, Idosos, etc.)
| Campo | Tipo | Obrigatório | Padrão |
|---|---|---|---|
| id | uuid (PK) | ✅ | |
| user_id | uuid | | |
| name | text | ✅ | |
| age | integer | | |
| gender | text | | "Não Informado" |
| birth_date | date | | |
| phone | text | | |
| address | text | | |
| acs_area | text | | |
| cpf | text | | |
| risk_level | text | | "Habitual" |
| risk_reason | text | | |
| is_pregnant | boolean | | false |
| dum | date | | |
| dpp | date | | |
| is_chronic | boolean | | false |
| chronic_condition | text | | |
| is_child | boolean | | false |
| clinical_data | jsonb | | |
| created_at | timestamp | | |

> ⚠️ **Colunas a adicionar:** `observations text`, `autocuidado text`

---

### `wound_evolutions` — Evoluções de Feridas
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| patient_id | uuid | FK para patients |
| date | timestamp | |
| lesion_type | text | |
| ryb_color | text | |
| ryb_status | text | |
| conduct | text | |
| photo_url | text | |
| created_at | timestamp | |

### `inventory_notes` — Notas de Inventário
| Campo | Tipo |
|---|---|
| id | uuid |
| user_id | uuid |
| title | text |
| content | text |
| color | text |
| created_at | timestamp |
| updated_at | timestamp |

---

## Módulos → Tabelas (mapeamento)
| Módulo | Tabela |
|---|---|
| gestante | `pregnant_women` |
| crianca (CD) | `children` |
| cronicos | `chronic_patients` |
| mulher | `patients` (gender=Feminino) |
| idosos | `patients` (age ≥ 60) |
| geral | `patients` |

---

## Migrations SQL necessárias

```sql
-- 1. Autocuidado em todas as tabelas de pacientes
ALTER TABLE pregnant_women ADD COLUMN IF NOT EXISTS autocuidado text;
ALTER TABLE children ADD COLUMN IF NOT EXISTS autocuidado text;
ALTER TABLE chronic_patients ADD COLUMN IF NOT EXISTS autocuidado text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS observations text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS autocuidado text;

-- 2. Checklist de pacientes (nova tabela)
CREATE TABLE IF NOT EXISTS patient_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL,
  patient_table text NOT NULL,
  period_key text NOT NULL,
  item_key text NOT NULL,
  item_label text NOT NULL,
  checked boolean DEFAULT false,
  checked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  UNIQUE(patient_id, patient_table, period_key, item_key)
);

-- RLS patient_checklists
ALTER TABLE patient_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user sees own checklists" ON patient_checklists
  FOR ALL USING (auth.uid() = user_id);
```
