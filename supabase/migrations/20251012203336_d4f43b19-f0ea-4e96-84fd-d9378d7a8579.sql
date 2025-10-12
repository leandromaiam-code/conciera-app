-- Migration: Adicionar colunas status e categoria em config_script_vendas
-- Adicionar coluna status
ALTER TABLE config_script_vendas 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo';

-- Adicionar coluna categoria
ALTER TABLE config_script_vendas
ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'captacao';

-- Adicionar constraints
ALTER TABLE config_script_vendas
DROP CONSTRAINT IF EXISTS status_check;

ALTER TABLE config_script_vendas
ADD CONSTRAINT status_check CHECK (status IN ('ativo', 'inativo', 'teste'));

ALTER TABLE config_script_vendas
DROP CONSTRAINT IF EXISTS categoria_check;

ALTER TABLE config_script_vendas
ADD CONSTRAINT categoria_check CHECK (categoria IN ('captacao', 'qualificacao', 'agendamento', 'nutricao'));

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_script_vendas_status ON config_script_vendas(status);
CREATE INDEX IF NOT EXISTS idx_script_vendas_categoria ON config_script_vendas(categoria);
CREATE INDEX IF NOT EXISTS idx_agendamentos_compareceu ON core_agendamentos(compareceu);
CREATE INDEX IF NOT EXISTS idx_conversas_session ON core_conversas(session_id);

-- Comentários para documentação
COMMENT ON COLUMN config_script_vendas.status IS 'Status do playbook: ativo, inativo ou teste';
COMMENT ON COLUMN config_script_vendas.categoria IS 'Categoria do playbook: captacao, qualificacao, agendamento ou nutricao';