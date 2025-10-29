-- Adicionar campos para configuração de PIX e Agenda Base
ALTER TABLE config_configuracoes_sistema
ADD COLUMN IF NOT EXISTS chave_pix TEXT,
ADD COLUMN IF NOT EXISTS tipo_agenda_base TEXT DEFAULT 'conciera' CHECK (tipo_agenda_base IN ('conciera', 'google')),
ADD COLUMN IF NOT EXISTS google_calendar_connected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS google_calendar_metadata JSONB DEFAULT '{}'::jsonb;