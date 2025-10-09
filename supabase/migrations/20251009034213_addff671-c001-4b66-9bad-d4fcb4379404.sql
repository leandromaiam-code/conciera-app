-- Adicionar colunas de status e dados de conexão para cada canal
ALTER TABLE config_configuracoes_canais 
ADD COLUMN IF NOT EXISTS whatsapp_web_status TEXT DEFAULT 'desconectado',
ADD COLUMN IF NOT EXISTS whatsapp_web_telefone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_web_session_id TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_web_conectado_em TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS whatsapp_business_status TEXT DEFAULT 'desconectado', 
ADD COLUMN IF NOT EXISTS whatsapp_business_telefone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_business_conectado_em TIMESTAMPTZ,

ADD COLUMN IF NOT EXISTS instagram_status TEXT DEFAULT 'desconectado',
ADD COLUMN IF NOT EXISTS instagram_username TEXT,
ADD COLUMN IF NOT EXISTS instagram_conectado_em TIMESTAMPTZ;

-- Adicionar constraints para valores válidos de status
ALTER TABLE config_configuracoes_canais
DROP CONSTRAINT IF EXISTS valid_whatsapp_web_status;

ALTER TABLE config_configuracoes_canais
ADD CONSTRAINT valid_whatsapp_web_status 
  CHECK (whatsapp_web_status IN ('conectado', 'desconectado', 'erro', 'aguardando_qr', 'conectando'));

ALTER TABLE config_configuracoes_canais
DROP CONSTRAINT IF EXISTS valid_whatsapp_business_status;

ALTER TABLE config_configuracoes_canais
ADD CONSTRAINT valid_whatsapp_business_status 
  CHECK (whatsapp_business_status IN ('conectado', 'desconectado', 'erro'));

ALTER TABLE config_configuracoes_canais
DROP CONSTRAINT IF EXISTS valid_instagram_status;

ALTER TABLE config_configuracoes_canais
ADD CONSTRAINT valid_instagram_status 
  CHECK (instagram_status IN ('conectado', 'desconectado', 'erro'));