-- Corrigir função para calcular dados de HOJE corretamente
CREATE OR REPLACE FUNCTION public.calcular_analytics_vendas_empresa(p_empresa_id integer, p_ano_mes date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
      
      -- CORREÇÃO: Contar APENAS leads de HOJE (CURRENT_DATE)
      (SELECT COUNT(DISTINCT m2.cliente_id) 
       FROM ingestion_memoria_clientes_historico_01 m2
       JOIN config_funcionaria_virtual cfv2 ON cfv2.id = m2.funcionaria_id
       WHERE m2.funcionaria_id = v_funcionaria_id
       AND cfv2.empresa_id = p_empresa_id
       AND DATE(m2.created_at) = CURRENT_DATE
       AND m2.cliente_id IS NOT NULL) as novos_leads_hoje,
      
      -- CORREÇÃO: Contar APENAS agendamentos de HOJE (CURRENT_DATE)
      (SELECT COUNT(*) 
       FROM core_agendamentos a2
       WHERE a2.empresa_id = p_empresa_id
       AND DATE(a2.created_at) = CURRENT_DATE) as agendamentos_hoje,
      
      -- Taxa de conversão (do mês)
      CASE 
        WHEN COUNT(DISTINCT m.cliente_id) > 0 THEN
          ((SELECT COUNT(*) FROM core_agendamentos a 
            WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
            AND a.empresa_id = p_empresa_id)::NUMERIC / COUNT(DISTINCT m.cliente_id)) * 100
        ELSE 0
      END as taxa_conversao,
      
      -- RPG mensal
      COALESCE((SELECT SUM(valor_estimado) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id), 0) as rpg_mensal,
      
      -- RPG diário
      COALESCE((SELECT SUM(valor_estimado) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id), 0) / 30 as rpg_diario,
      
      -- Valor médio consulta
      COALESCE((SELECT AVG(valor_estimado) FROM core_agendamentos a 
       WHERE DATE_TRUNC('month', a.data_hora) = DATE_TRUNC('month', p_ano_mes)
       AND a.empresa_id = p_empresa_id), 0) as valor_medio_consulta,
      
      -- Leads por canal (do mês inteiro)
      COUNT(DISTINCT m.cliente_id) FILTER (WHERE m.canal = 'whatsapp') as leads_whatsapp,
      COUNT(DISTINCT m.cliente_id) FILTER (WHERE m.canal = 'instagram') as leads_instagram,
      0 as leads_indicacao,
      COUNT(DISTINCT m.cliente_id) FILTER (WHERE m.canal NOT IN ('whatsapp', 'instagram')) as leads_outros
    FROM ingestion_memoria_clientes_historico_01 m
    JOIN config_funcionaria_virtual cfv ON cfv.id = m.funcionaria_id
    WHERE m.funcionaria_id = v_funcionaria_id
    AND cfv.empresa_id = p_empresa_id
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
$function$;

-- Criar trigger para atualização em tempo real quando novas mensagens chegarem
CREATE OR REPLACE FUNCTION public.trigger_atualizar_analytics_nova_mensagem()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id INTEGER;
BEGIN
  -- Buscar empresa_id da funcionária
  SELECT empresa_id INTO v_empresa_id
  FROM config_funcionaria_virtual 
  WHERE id = NEW.funcionaria_id;
  
  -- Atualizar métricas do mês atual
  IF v_empresa_id IS NOT NULL THEN
    PERFORM calcular_analytics_vendas_empresa(
      v_empresa_id, 
      CURRENT_DATE
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger (drop se já existir)
DROP TRIGGER IF EXISTS atualizar_analytics_nova_mensagem ON ingestion_memoria_clientes_historico_01;

CREATE TRIGGER atualizar_analytics_nova_mensagem
AFTER INSERT ON ingestion_memoria_clientes_historico_01
FOR EACH ROW
WHEN (NEW.cliente_id IS NOT NULL)
EXECUTE FUNCTION trigger_atualizar_analytics_nova_mensagem();

-- Recalcular dados existentes para o mês atual
DO $$
DECLARE
  v_empresa_id INTEGER;
BEGIN
  FOR v_empresa_id IN SELECT DISTINCT id FROM core_empresa
  LOOP
    PERFORM calcular_analytics_vendas_empresa(v_empresa_id, CURRENT_DATE);
  END LOOP;
END;
$$;