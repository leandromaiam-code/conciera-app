-- Adicionar colunas para suportar períodos específicos e recorrência
ALTER TABLE public.config_disponibilidade_agenda
ADD COLUMN data_inicio DATE,
ADD COLUMN data_fim DATE,
ADD COLUMN is_recorrente BOOLEAN NOT NULL DEFAULT true;

-- Adicionar comentários para documentação
COMMENT ON COLUMN public.config_disponibilidade_agenda.data_inicio IS 'Data de início do período de disponibilidade (null para padrão recorrente)';
COMMENT ON COLUMN public.config_disponibilidade_agenda.data_fim IS 'Data de fim do período de disponibilidade (null para padrão recorrente)';
COMMENT ON COLUMN public.config_disponibilidade_agenda.is_recorrente IS 'TRUE para disponibilidade recorrente semanal, FALSE para período específico';

-- Criar índice para melhorar performance de consultas por data
CREATE INDEX idx_disponibilidade_datas ON public.config_disponibilidade_agenda(data_inicio, data_fim) WHERE data_inicio IS NOT NULL;