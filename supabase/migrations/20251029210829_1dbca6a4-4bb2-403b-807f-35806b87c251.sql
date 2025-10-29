-- 1. Criar função para calcular métricas mensais de vendas
CREATE OR REPLACE FUNCTION calcular_analytics_vendas_empresa(
  p_empresa_id INTEGER,
  p_ano_mes DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_funcionaria_id INTEGER;
BEGIN
  FOR v_funcionaria_id IN 
    SELECT id FROM config_funcionaria_virtual WHERE empresa_id = p_empresa_id
  LOOP
    INSERT INTO analytics_metricas_mensais_vendas (
      ano_mes, funcionaria_id,
      novos_leads_hoje, agendamentos_hoje, taxa_conversao,
      rpg_mensal, rpg_diario, valor_medio_consulta,
      leads_whatsapp, leads_instagram, leads_indicacao, leads_outros
    )
    SELECT 
      DATE_TRUNC('month', p_ano_mes)::DATE,
      v_funcionaria_id,
      COUNT(DISTINCT m.cliente_id) as novos_leads,
      (SELECT COUNT(*) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id) as agendamentos,
      CASE 
        WHEN COUNT(DISTINCT m.cliente_id) > 0 THEN
          ((SELECT COUNT(*) FROM core_agendamentos a 
            WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
            AND a.empresa_id = p_empresa_id)::NUMERIC / COUNT(DISTINCT m.cliente_id)) * 100
        ELSE 0
      END as taxa_conversao,
      COALESCE((SELECT SUM(valor_estimado) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id), 0) as rpg_mensal,
      COALESCE((SELECT SUM(valor_estimado) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id), 0) / 30 as rpg_diario,
      COALESCE((SELECT AVG(valor_estimado) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id), 0) as valor_medio_consulta,
      COUNT(DISTINCT m.cliente_id) FILTER (WHERE m.canal = 'whatsapp') as leads_whatsapp,
      COUNT(DISTINCT m.cliente_id) FILTER (WHERE m.canal = 'instagram') as leads_instagram,
      0 as leads_indicacao,
      COUNT(DISTINCT m.cliente_id) FILTER (WHERE m.canal NOT IN ('whatsapp', 'instagram')) as leads_outros
    FROM ingestion_memoria_clientes_historico_01 m
    WHERE m.funcionaria_id = v_funcionaria_id
    AND DATE_TRUNC('month', m.created_at) = DATE_TRUNC('month', p_ano_mes)
    GROUP BY v_funcionaria_id
    ON CONFLICT (ano_mes, funcionaria_id) 
    DO UPDATE SET
      novos_leads_hoje = EXCLUDED.novos_leads_hoje,
      agendamentos_hoje = EXCLUDED.agendamentos_hoje,
      taxa_conversao = EXCLUDED.taxa_conversao,
      rpg_mensal = EXCLUDED.rpg_mensal,
      rpg_diario = EXCLUDED.rpg_diario,
      valor_medio_consulta = EXCLUDED.valor_medio_consulta,
      leads_whatsapp = EXCLUDED.leads_whatsapp,
      leads_instagram = EXCLUDED.leads_instagram,
      leads_outros = EXCLUDED.leads_outros,
      updated_at = NOW();
  END LOOP;
END;
$$;

-- 2. Criar função para calcular procedimentos/vendas
CREATE OR REPLACE FUNCTION calcular_analytics_procedimentos_empresa(
  p_empresa_id INTEGER,
  p_ano_mes DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM analytics_procedimentos_vendas
  WHERE empresa_id = p_empresa_id
  AND ano_mes = DATE_TRUNC('month', p_ano_mes)::DATE;

  INSERT INTO analytics_procedimentos_vendas (
    ano_mes, empresa_id, procedimento, quantidade, receita_total, ticket_medio
  )
  SELECT 
    DATE_TRUNC('month', p_ano_mes)::DATE,
    p_empresa_id,
    servico_interesse,
    COUNT(*) as quantidade,
    COALESCE(SUM(valor_estimado), 0) as receita_total,
    COALESCE(AVG(valor_estimado), 0) as ticket_medio
  FROM core_agendamentos
  WHERE empresa_id = p_empresa_id
  AND DATE_TRUNC('month', data_hora) = DATE_TRUNC('month', p_ano_mes)
  AND servico_interesse IS NOT NULL
  GROUP BY servico_interesse;
END;
$$;

-- 3. Criar trigger para atualização automática
CREATE OR REPLACE FUNCTION trigger_atualizar_analytics_agendamento()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM calcular_analytics_vendas_empresa(
    NEW.empresa_id, 
    DATE_TRUNC('month', NEW.data_hora)::DATE
  );
  PERFORM calcular_analytics_procedimentos_empresa(
    NEW.empresa_id,
    DATE_TRUNC('month', NEW.data_hora)::DATE
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS atualizar_analytics_vendas_agendamento ON core_agendamentos;
CREATE TRIGGER atualizar_analytics_vendas_agendamento
AFTER INSERT OR UPDATE ON core_agendamentos
FOR EACH ROW
EXECUTE FUNCTION trigger_atualizar_analytics_agendamento();

-- 4. Popular dados retroativos para empresa_id = 6 (últimos 6 meses)
SELECT calcular_analytics_vendas_empresa(6, '2025-05-01');
SELECT calcular_analytics_procedimentos_empresa(6, '2025-05-01');

SELECT calcular_analytics_vendas_empresa(6, '2025-06-01');
SELECT calcular_analytics_procedimentos_empresa(6, '2025-06-01');

SELECT calcular_analytics_vendas_empresa(6, '2025-07-01');
SELECT calcular_analytics_procedimentos_empresa(6, '2025-07-01');

SELECT calcular_analytics_vendas_empresa(6, '2025-08-01');
SELECT calcular_analytics_procedimentos_empresa(6, '2025-08-01');

SELECT calcular_analytics_vendas_empresa(6, '2025-09-01');
SELECT calcular_analytics_procedimentos_empresa(6, '2025-09-01');

SELECT calcular_analytics_vendas_empresa(6, '2025-10-01');
SELECT calcular_analytics_procedimentos_empresa(6, '2025-10-01');

-- 5. Ativar RLS nas tabelas de analytics
ALTER TABLE analytics_metricas_mensais_vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_procedimentos_vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversas_metricas ENABLE ROW LEVEL SECURITY;