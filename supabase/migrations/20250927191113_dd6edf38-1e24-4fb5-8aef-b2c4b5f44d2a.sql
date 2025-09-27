-- FASE 1: Criar analytics_conversas_metricas
CREATE TABLE analytics_conversas_metricas (
    id SERIAL PRIMARY KEY,
    ano_mes DATE NOT NULL,
    empresa_id INTEGER NOT NULL,
    funcionaria_id INTEGER NOT NULL,
    
    -- Métricas de volume
    total_conversas INTEGER DEFAULT 0,
    conversas_iniciadas INTEGER DEFAULT 0,
    conversas_finalizadas INTEGER DEFAULT 0,
    
    -- Métricas de resposta
    tempo_medio_primeira_resposta_segundos INTEGER DEFAULT 0,
    tempo_medio_resolucao_minutos INTEGER DEFAULT 0,
    taxa_resposta_rapida NUMERIC DEFAULT 0,
    
    -- Métricas de origem
    conversas_whatsapp INTEGER DEFAULT 0,
    conversas_instagram INTEGER DEFAULT 0,
    conversas_email INTEGER DEFAULT 0,
    conversas_telefone INTEGER DEFAULT 0,
    
    -- Métricas de resultado
    conversas_com_agendamento INTEGER DEFAULT 0,
    taxa_conversao_agendamento NUMERIC DEFAULT 0,
    satisfacao_media NUMERIC DEFAULT 0,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(ano_mes, empresa_id, funcionaria_id)
);

-- FASE 2: Criar analytics_conversas_diarias
CREATE TABLE analytics_conversas_diarias (
    id SERIAL PRIMARY KEY,
    data_referencia DATE NOT NULL,
    empresa_id INTEGER NOT NULL,
    funcionaria_id INTEGER NOT NULL,
    
    -- Métricas do dia
    conversas_novas_hoje INTEGER DEFAULT 0,
    tempo_medio_resposta_hoje INTEGER DEFAULT 0,
    agendamentos_gerados_hoje INTEGER DEFAULT 0,
    
    -- Para dashboards em tempo real
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(data_referencia, empresa_id, funcionaria_id)
);

-- FASE 3: Criar analytics_procedimentos_vendas
CREATE TABLE analytics_procedimentos_vendas (
    id SERIAL PRIMARY KEY,
    ano_mes DATE NOT NULL,
    empresa_id INTEGER NOT NULL,
    procedimento TEXT NOT NULL,
    quantidade INTEGER DEFAULT 0,
    receita_total NUMERIC DEFAULT 0,
    ticket_medio NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(ano_mes, empresa_id, procedimento)
);

-- FASE 4: Expandir analytics_metricas_mensais_vendas
ALTER TABLE analytics_metricas_mensais_vendas 
ADD COLUMN IF NOT EXISTS rpg_mensal NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS rpg_diario NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_medio_consulta NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS sparkline_30d JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS novos_leads_hoje INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS agendamentos_hoje INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS taxa_conversao NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_trend NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS agendamentos_trend NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_instagram INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_whatsapp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_indicacao INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_outros INTEGER DEFAULT 0;

-- Adicionar constraint único para analytics_metricas_mensais_vendas se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'analytics_metricas_mensais_vendas_ano_mes_funcionaria_id_key'
    ) THEN
        ALTER TABLE analytics_metricas_mensais_vendas 
        ADD CONSTRAINT analytics_metricas_mensais_vendas_ano_mes_funcionaria_id_key 
        UNIQUE (ano_mes, funcionaria_id);
    END IF;
END
$$;

-- FASE 5: Melhorar core_agendamentos
ALTER TABLE core_agendamentos
ADD COLUMN IF NOT EXISTS origem_lead TEXT DEFAULT 'whatsapp';

-- Atualizar agendamentos existentes com valores estimados padrão
UPDATE core_agendamentos 
SET valor_estimado = 2500 
WHERE valor_estimado IS NULL;