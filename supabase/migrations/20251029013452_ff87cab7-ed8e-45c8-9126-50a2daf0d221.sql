-- Drop existing view if exists
DROP VIEW IF EXISTS v_conversas_detalhadas CASCADE;

-- Create improved view that groups by phone number and filters by company
CREATE OR REPLACE VIEW v_conversas_detalhadas AS
WITH telefone_conversas AS (
  SELECT DISTINCT
    c.id,
    c.session_id,
    c.cliente_id,
    c.funcionaria_id,
    c.canal,
    c.status,
    c.ultima_mensagem_preview,
    c.timestamp_ultima_mensagem,
    c.created_at,
    c.contagem_mensagens,
    -- Extract phone from session_id or get from memoria table
    COALESCE(
      m.telefone,
      SUBSTRING(c.session_id FROM 'tel:([0-9]+)')
    ) as telefone,
    cl.nome_completo,
    cl.telefone as cliente_telefone,
    fv.nome as funcionaria_nome,
    e.nome as empresa_nome
  FROM core_conversas c
  LEFT JOIN core_clientes cl ON c.cliente_id = cl.id
  LEFT JOIN config_funcionaria_virtual fv ON c.funcionaria_id = fv.id
  LEFT JOIN core_empresa e ON fv.empresa_id = e.id
  LEFT JOIN LATERAL (
    SELECT telefone 
    FROM ingestion_memoria_clientes_historico_01 
    WHERE session_id = c.session_id 
    LIMIT 1
  ) m ON true
)
SELECT 
  tc.id,
  tc.session_id,
  tc.cliente_id,
  tc.funcionaria_id,
  tc.canal,
  tc.status,
  tc.ultima_mensagem_preview,
  tc.timestamp_ultima_mensagem,
  tc.created_at,
  tc.contagem_mensagens,
  -- Show client name if exists, otherwise show phone
  COALESCE(tc.nome_completo, tc.telefone) as nome_completo,
  tc.telefone as cliente_telefone,
  tc.funcionaria_nome,
  tc.empresa_nome,
  -- Count total real messages from memoria table
  (
    SELECT COUNT(*) 
    FROM ingestion_memoria_clientes_historico_01 m
    WHERE m.telefone = tc.telefone 
    AND m.funcionaria_id = tc.funcionaria_id
  ) as total_mensagens_real,
  (
    SELECT COUNT(*) 
    FROM ingestion_memoria_clientes_historico_01 m
    WHERE m.telefone = tc.telefone 
    AND m.funcionaria_id = tc.funcionaria_id
    AND m.role = 'user'
  ) as mensagens_cliente,
  (
    SELECT COUNT(*) 
    FROM ingestion_memoria_clientes_historico_01 m
    WHERE m.telefone = tc.telefone 
    AND m.funcionaria_id = tc.funcionaria_id
    AND m.role = 'ai'
  ) as mensagens_ai
FROM telefone_conversas tc
ORDER BY tc.timestamp_ultima_mensagem DESC NULLS LAST;

-- Enable RLS on the view
ALTER VIEW v_conversas_detalhadas SET (security_invoker = on);

-- Grant access to authenticated users
GRANT SELECT ON v_conversas_detalhadas TO authenticated;