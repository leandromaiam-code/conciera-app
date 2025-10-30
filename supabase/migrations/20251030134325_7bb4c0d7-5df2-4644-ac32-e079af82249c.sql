-- Adicionar coluna evento para categorizar explicitamente disponibilidades e bloqueios
ALTER TABLE config_disponibilidade_agenda 
ADD COLUMN evento TEXT DEFAULT 'disponibilidade' NOT NULL;

-- Adicionar constraint para valores válidos
ALTER TABLE config_disponibilidade_agenda 
ADD CONSTRAINT check_evento_valido 
CHECK (evento IN ('disponibilidade', 'bloqueio'));

-- Migrar dados existentes baseado na lógica atual
UPDATE config_disponibilidade_agenda 
SET evento = CASE 
  WHEN is_recorrente = true THEN 'disponibilidade'
  ELSE 'bloqueio'
END;

-- Criar índice para melhor performance em queries filtradas por evento
CREATE INDEX idx_disponibilidade_evento ON config_disponibilidade_agenda(evento);