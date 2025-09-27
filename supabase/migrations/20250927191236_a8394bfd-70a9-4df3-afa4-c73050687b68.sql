-- FASE 6: Funções de agregação
CREATE OR REPLACE FUNCTION calcular_metricas_conversas(
    empresa_id_param INTEGER, 
    funcionaria_id_param INTEGER,
    ano_mes_param DATE
) RETURNS VOID AS $$
DECLARE
    inicio_mes DATE := DATE_TRUNC('month', ano_mes_param);
    fim_mes DATE := inicio_mes + INTERVAL '1 month' - INTERVAL '1 day';
BEGIN
    INSERT INTO analytics_conversas_metricas (
        ano_mes, empresa_id, funcionaria_id,
        total_conversas, conversas_whatsapp, 
        conversas_com_agendamento, taxa_conversao_agendamento
    )
    SELECT 
        inicio_mes,
        empresa_id_param,
        funcionaria_id_param,
        COUNT(*) as total_conversas,
        COUNT(*) FILTER (WHERE c.canal = 'whatsapp') as conversas_whatsapp,
        COUNT(a.id) as conversas_com_agendamento,
        CASE 
            WHEN COUNT(*) > 0 THEN (COUNT(a.id)::NUMERIC / COUNT(*)) * 100 
            ELSE 0 
        END as taxa_conversao
    FROM core_conversas c
    LEFT JOIN core_agendamentos a ON a.conversa_id = c.id
    WHERE c.funcionaria_id = funcionaria_id_param
    AND c.created_at BETWEEN inicio_mes AND fim_mes
    GROUP BY c.funcionaria_id
    ON CONFLICT (ano_mes, empresa_id, funcionaria_id) 
    DO UPDATE SET
        total_conversas = EXCLUDED.total_conversas,
        conversas_whatsapp = EXCLUDED.conversas_whatsapp,
        conversas_com_agendamento = EXCLUDED.conversas_com_agendamento,
        taxa_conversao_agendamento = EXCLUDED.taxa_conversao_agendamento,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para calcular RPG mensal
CREATE OR REPLACE FUNCTION calcular_rpg_mensal(empresa_id_param INTEGER, ano_mes_param DATE)
RETURNS NUMERIC AS $$
DECLARE
    rpg_total NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(valor_estimado), 0) INTO rpg_total
    FROM core_agendamentos 
    WHERE empresa_id = empresa_id_param
    AND DATE_TRUNC('month', data_hora) = DATE_TRUNC('month', ano_mes_param);
    
    RETURN rpg_total;
END;
$$ LANGUAGE plpgsql;

-- FASE 7: Triggers de atualização
CREATE OR REPLACE FUNCTION atualizar_analytics_conversas()
RETURNS TRIGGER AS $$
DECLARE
    v_empresa_id INTEGER;
BEGIN
    -- Buscar empresa_id
    SELECT empresa_id INTO v_empresa_id
    FROM config_funcionaria_virtual 
    WHERE id = NEW.funcionaria_id;
    
    IF v_empresa_id IS NOT NULL THEN
        -- Recalcular métricas do mês atual
        PERFORM calcular_metricas_conversas(
            v_empresa_id,
            NEW.funcionaria_id, 
            DATE_TRUNC('month', NOW())
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_atualizar_analytics_conversas'
    ) THEN
        CREATE TRIGGER trigger_atualizar_analytics_conversas
            AFTER INSERT OR UPDATE ON core_conversas
            FOR EACH ROW
            EXECUTE FUNCTION atualizar_analytics_conversas();
    END IF;
END
$$;

-- FASE 8: Habilitar RLS nas novas tabelas
ALTER TABLE analytics_conversas_metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_procedimentos_vendas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Authenticated users can view conversas metricas"
ON analytics_conversas_metricas FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversas metricas"
ON analytics_conversas_metricas FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conversas metricas"
ON analytics_conversas_metricas FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view conversas diarias"
ON analytics_conversas_diarias FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversas diarias"
ON analytics_conversas_diarias FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conversas diarias"
ON analytics_conversas_diarias FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view procedimentos vendas"
ON analytics_procedimentos_vendas FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert procedimentos vendas"
ON analytics_procedimentos_vendas FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update procedimentos vendas"
ON analytics_procedimentos_vendas FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');