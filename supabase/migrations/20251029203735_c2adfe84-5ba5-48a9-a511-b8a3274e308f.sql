-- Função para atualizar status das conversas baseado no tempo de inatividade
CREATE OR REPLACE FUNCTION atualizar_status_conversas_inativas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atualizar para 'finalizada' após 24h sem mensagens
  UPDATE core_conversas
  SET status = 'finalizada'
  WHERE status IN ('ativa', 'em-andamento', 'inativa')
    AND timestamp_ultima_mensagem < NOW() - INTERVAL '24 hours';
  
  -- Atualizar para 'inativa' após 1h sem mensagens (mas menos de 24h)
  UPDATE core_conversas
  SET status = 'inativa'
  WHERE status IN ('ativa', 'em-andamento')
    AND timestamp_ultima_mensagem < NOW() - INTERVAL '1 hour'
    AND timestamp_ultima_mensagem >= NOW() - INTERVAL '24 hours';
END;
$$;

-- Função trigger que verifica status ao inserir nova mensagem
CREATE OR REPLACE FUNCTION check_conversa_status_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reativar conversa se receber nova mensagem
  UPDATE core_conversas
  SET status = 'em-andamento'
  WHERE session_id = NEW.session_id
    AND status IN ('inativa', 'finalizada');
  
  RETURN NEW;
END;
$$;

-- Criar trigger para atualizar status quando nova mensagem chegar
DROP TRIGGER IF EXISTS trigger_reativar_conversa ON ingestion_memoria_clientes_historico_01;
CREATE TRIGGER trigger_reativar_conversa
  AFTER INSERT ON ingestion_memoria_clientes_historico_01
  FOR EACH ROW
  EXECUTE FUNCTION check_conversa_status_on_message();

-- Executar atualização inicial de status
SELECT atualizar_status_conversas_inativas();