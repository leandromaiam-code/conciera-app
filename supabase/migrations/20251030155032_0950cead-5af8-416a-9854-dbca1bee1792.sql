-- Etapa 1: Função para resetar métricas diárias
CREATE OR REPLACE FUNCTION public.reset_metricas_diarias()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset apenas se for um novo dia
  UPDATE analytics_metricas_mensais_vendas
  SET 
    novos_leads_hoje = 0,
    agendamentos_hoje = 0,
    updated_at = NOW()
  WHERE DATE(updated_at) < CURRENT_DATE;
END;
$$;

-- Executar reset imediatamente para corrigir dados existentes
SELECT reset_metricas_diarias();

-- Modificar trigger para resetar diariamente antes de calcular
CREATE OR REPLACE FUNCTION public.trigger_atualizar_analytics_nova_mensagem()
RETURNS trigger
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
  
  -- Reset diário automático antes de recalcular
  PERFORM reset_metricas_diarias();
  
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