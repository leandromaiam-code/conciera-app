-- Popular dados iniciais para demonstração usando funcionaria_id válido
INSERT INTO analytics_metricas_mensais_vendas (
    ano_mes, funcionaria_id, rpg_mensal, rpg_diario, valor_medio_consulta,
    novos_leads_hoje, agendamentos_hoje, taxa_conversao,
    sparkline_30d, leads_whatsapp, leads_instagram, leads_indicacao,
    total_mensagens, mensagens_ai, mensagens_clientes,
    clientes_diferentes, conversas_iniciadas, conversas_finalizadas
) VALUES (
    DATE_TRUNC('month', NOW()), 4, 42800, 1850, 2380,
    18, 12, 67,
    '[32000,33200,35100,34800,36500,38200,37900,39600,41300,40800]'::jsonb,
    145, 23, 8, 
    2847, 1423, 1424,
    89, 156, 134
) ON CONFLICT (ano_mes, funcionaria_id) DO UPDATE SET
    rpg_mensal = EXCLUDED.rpg_mensal,
    rpg_diario = EXCLUDED.rpg_diario,
    valor_medio_consulta = EXCLUDED.valor_medio_consulta,
    novos_leads_hoje = EXCLUDED.novos_leads_hoje,
    agendamentos_hoje = EXCLUDED.agendamentos_hoje,
    taxa_conversao = EXCLUDED.taxa_conversao,
    sparkline_30d = EXCLUDED.sparkline_30d,
    leads_whatsapp = EXCLUDED.leads_whatsapp,
    leads_instagram = EXCLUDED.leads_instagram,
    leads_indicacao = EXCLUDED.leads_indicacao,
    updated_at = NOW();

-- Popular dados de conversas métricas
INSERT INTO analytics_conversas_metricas (
    ano_mes, empresa_id, funcionaria_id,
    total_conversas, conversas_whatsapp, conversas_instagram,
    conversas_com_agendamento, taxa_conversao_agendamento,
    tempo_medio_primeira_resposta_segundos, taxa_resposta_rapida
) VALUES (
    DATE_TRUNC('month', NOW()), 1, 4,
    156, 145, 23,
    43, 27.6,
    285, 78.5
) ON CONFLICT (ano_mes, empresa_id, funcionaria_id) DO UPDATE SET
    total_conversas = EXCLUDED.total_conversas,
    conversas_whatsapp = EXCLUDED.conversas_whatsapp,
    conversas_instagram = EXCLUDED.conversas_instagram,
    conversas_com_agendamento = EXCLUDED.conversas_com_agendamento,
    taxa_conversao_agendamento = EXCLUDED.taxa_conversao_agendamento,
    tempo_medio_primeira_resposta_segundos = EXCLUDED.tempo_medio_primeira_resposta_segundos,
    taxa_resposta_rapida = EXCLUDED.taxa_resposta_rapida,
    updated_at = NOW();

-- Popular dados de procedimentos
INSERT INTO analytics_procedimentos_vendas (
    ano_mes, empresa_id, procedimento,
    quantidade, receita_total, ticket_medio
) VALUES 
(DATE_TRUNC('month', NOW()), 1, 'Harmonização Facial', 8, 19200, 2400),
(DATE_TRUNC('month', NOW()), 1, 'Preenchimento Labial', 12, 18000, 1500),
(DATE_TRUNC('month', NOW()), 1, 'Botox', 15, 22500, 1500),
(DATE_TRUNC('month', NOW()), 1, 'Limpeza de Pele', 23, 9200, 400)
ON CONFLICT (ano_mes, empresa_id, procedimento) DO UPDATE SET
    quantidade = EXCLUDED.quantidade,
    receita_total = EXCLUDED.receita_total,
    ticket_medio = EXCLUDED.ticket_medio,
    updated_at = NOW();