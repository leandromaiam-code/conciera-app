-- Adicionar campo de notas aos agendamentos
ALTER TABLE core_agendamentos 
ADD COLUMN notas TEXT;

-- Adicionar comentário explicativo
COMMENT ON COLUMN core_agendamentos.notas IS 'Notas adicionais sobre o agendamento';

-- Criar índice para melhorar performance de buscas
CREATE INDEX IF NOT EXISTS idx_core_conversas_status ON core_conversas(status);
CREATE INDEX IF NOT EXISTS idx_core_agendamentos_status ON core_agendamentos(status);