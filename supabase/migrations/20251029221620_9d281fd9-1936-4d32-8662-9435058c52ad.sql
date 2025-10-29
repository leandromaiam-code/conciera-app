-- Add auto_agendamento and auto_pagamento columns to config_configuracoes_sistema
ALTER TABLE config_configuracoes_sistema 
ADD COLUMN IF NOT EXISTS auto_agendamento BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS auto_pagamento BOOLEAN DEFAULT false;