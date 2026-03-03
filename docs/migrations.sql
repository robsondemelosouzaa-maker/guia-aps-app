-- ============================================================
-- Guia APS — SQL Migrations (Fase 3)
-- Execute no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/ofynaerlvcvglglkdwaw/editor
-- ============================================================

-- 1. Autocuidado em todas as tabelas de pacientes
ALTER TABLE pregnant_women  ADD COLUMN IF NOT EXISTS autocuidado text;
ALTER TABLE children        ADD COLUMN IF NOT EXISTS autocuidado text;
ALTER TABLE chronic_patients ADD COLUMN IF NOT EXISTS autocuidado text;

-- 2. Observações e Autocuidado na tabela patients (Saúde da Mulher / Idosos)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS observations text;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS autocuidado  text;

-- 3. Tabela de checklists por paciente (se não existir)
CREATE TABLE IF NOT EXISTS patient_checklists (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id   uuid NOT NULL,
  patient_table text NOT NULL,
  period_key   text NOT NULL,
  item_key     text NOT NULL,
  item_label   text NOT NULL,
  checked      boolean DEFAULT false,
  checked_at   timestamp with time zone,
  created_at   timestamp with time zone DEFAULT timezone('utc', now()),
  UNIQUE(patient_id, patient_table, period_key, item_key)
);

-- 4. RLS na tabela patient_checklists
ALTER TABLE patient_checklists ENABLE ROW LEVEL SECURITY;

-- Usuário só vê seus próprios checklists
DROP POLICY IF EXISTS "user sees own checklists" ON patient_checklists;
CREATE POLICY "user sees own checklists" ON patient_checklists
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. (Opcional) Garantir RLS nas tabelas de pacientes existentes
-- Se as tabelas já têm RLS habilitado com políticas de user_id, não precisa alterar.
-- Confirme no painel: Authentication > Policies

-- ============================================================
-- FIM DAS MIGRATIONS
-- ============================================================
