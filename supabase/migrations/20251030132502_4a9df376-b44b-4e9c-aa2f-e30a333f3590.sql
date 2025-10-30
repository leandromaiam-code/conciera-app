-- Add tipo_consulta column to config_disponibilidade_agenda
ALTER TABLE config_disponibilidade_agenda 
ADD COLUMN tipo_consulta text NOT NULL DEFAULT 'ambos';

-- Add check constraint to ensure valid values
ALTER TABLE config_disponibilidade_agenda 
ADD CONSTRAINT config_disponibilidade_agenda_tipo_consulta_check 
CHECK (tipo_consulta IN ('primeira_consulta', 'retorno', 'ambos'));