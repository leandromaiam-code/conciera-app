-- Inserir agendamentos futuros para teste usando empresa_id correto
-- Usar empresa_id = 4 que já existe no banco

-- Primeiro inserir clientes com o empresa_id correto
INSERT INTO core_clientes (telefone, nome_completo, empresa_id, created_at)
VALUES 
  ('11987654321', 'Ana Silva', 4, NOW()),
  ('11987654322', 'Carlos Santos', 4, NOW()),
  ('11987654323', 'Marina Costa', 4, NOW()),
  ('11987654324', 'João Oliveira', 4, NOW()),
  ('11987654325', 'Patricia Lima', 4, NOW());

-- Inserir agendamentos futuros com datas de outubro de 2025
INSERT INTO core_agendamentos (cliente_id, empresa_id, data_hora, servico_interesse, valor_estimado, status, origem_lead, created_at)
SELECT 
  c.id as cliente_id,
  4 as empresa_id,
  CASE 
    WHEN c.nome_completo = 'Ana Silva' THEN '2025-10-01 14:00:00+00'::timestamp with time zone
    WHEN c.nome_completo = 'Carlos Santos' THEN '2025-10-02 10:30:00+00'::timestamp with time zone
    WHEN c.nome_completo = 'Marina Costa' THEN '2025-10-03 16:00:00+00'::timestamp with time zone
    WHEN c.nome_completo = 'João Oliveira' THEN '2025-10-04 09:00:00+00'::timestamp with time zone
    ELSE '2025-10-05 15:30:00+00'::timestamp with time zone
  END as data_hora,
  CASE 
    WHEN c.nome_completo = 'Ana Silva' THEN 'Harmonização Facial'
    WHEN c.nome_completo = 'Carlos Santos' THEN 'Botox'
    WHEN c.nome_completo = 'Marina Costa' THEN 'Preenchimento Labial'
    WHEN c.nome_completo = 'João Oliveira' THEN 'Limpeza de Pele'
    ELSE 'Microagulhamento'
  END as servico_interesse,
  CASE 
    WHEN c.nome_completo = 'Ana Silva' THEN 2500
    WHEN c.nome_completo = 'Carlos Santos' THEN 1200
    WHEN c.nome_completo = 'Marina Costa' THEN 800
    WHEN c.nome_completo = 'João Oliveira' THEN 350
    ELSE 600
  END as valor_estimado,
  'confirmado' as status,
  'whatsapp' as origem_lead,
  NOW() as created_at
FROM core_clientes c 
WHERE c.empresa_id = 4 
  AND c.telefone IN ('11987654321', '11987654322', '11987654323', '11987654324', '11987654325');

-- Inserir briefings para os agendamentos futuros
INSERT INTO core_briefings (agendamento_id, temperatura_lead, servico_desejado, resumo_conversa, created_at)
SELECT 
  a.id as agendamento_id,
  CASE 
    WHEN a.valor_estimado > 2000 THEN 3
    WHEN a.valor_estimado > 1000 THEN 2
    ELSE 1
  END as temperatura_lead,
  a.servico_interesse as servico_desejado,
  'Cliente interessado em ' || a.servico_interesse || '. Demonstrou alta intenção de compra.' as resumo_conversa,
  NOW() as created_at
FROM core_agendamentos a
WHERE a.data_hora >= '2025-10-01'
  AND a.empresa_id = 4;