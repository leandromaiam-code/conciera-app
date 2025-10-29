-- Corrigir search_path nas funções criadas/modificadas
-- para prevenir ataques de injeção de schema

CREATE OR REPLACE FUNCTION public.update_conversas_realtime()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_conversa_exists BOOLEAN;
BEGIN
    IF NEW.cliente_id IS NULL OR NEW.funcionaria_id IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT EXISTS(
        SELECT 1 FROM core_conversas WHERE session_id = NEW.session_id
    ) INTO v_conversa_exists;

    IF v_conversa_exists THEN
        UPDATE core_conversas
        SET 
            ultima_mensagem_preview = LEFT(NEW.content_text, 200),
            timestamp_ultima_mensagem = NEW.created_at,
            contagem_mensagens = contagem_mensagens + 1,
            cliente_id = CASE 
                WHEN NEW.cliente_id IS NOT NULL THEN NEW.cliente_id
                ELSE core_conversas.cliente_id
            END,
            funcionaria_id = COALESCE(core_conversas.funcionaria_id, NEW.funcionaria_id)
        WHERE session_id = NEW.session_id;
    ELSE
        INSERT INTO core_conversas (
            session_id,
            cliente_id,
            funcionaria_id,
            canal,
            status,
            ultima_mensagem_preview,
            timestamp_ultima_mensagem,
            contagem_mensagens
        )
        VALUES (
            NEW.session_id,
            NEW.cliente_id,
            NEW.funcionaria_id,
            COALESCE(NEW.canal, 'whatsapp'),
            'ativa',
            LEFT(NEW.content_text, 200),
            NEW.created_at,
            1
        );
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_cliente_id_por_telefone()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.telefone IS DISTINCT FROM NEW.telefone THEN
        UPDATE core_conversas c
        SET cliente_id = NEW.id
        FROM ingestion_memoria_clientes_historico_01 m
        WHERE m.session_id = c.session_id
        AND m.telefone = NEW.telefone
        AND c.cliente_id = OLD.id;
        
        UPDATE ingestion_memoria_clientes_historico_01
        SET cliente_id = NEW.id
        WHERE telefone = NEW.telefone
        AND cliente_id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fix_all_cliente_id_inconsistencies()
RETURNS TABLE(
    conversas_corrigidas INTEGER,
    mensagens_corrigidas INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_conversas_count INTEGER := 0;
    v_mensagens_count INTEGER := 0;
BEGIN
    WITH updated_conversas AS (
        UPDATE core_conversas c
        SET cliente_id = subq.cliente_correto_id
        FROM (
            SELECT DISTINCT ON (c.id) 
                c.id as conversa_id,
                cl.id as cliente_correto_id
            FROM core_conversas c
            JOIN ingestion_memoria_clientes_historico_01 m ON m.session_id = c.session_id
            JOIN core_clientes cl ON cl.telefone = m.telefone
            WHERE (c.cliente_id != cl.id OR c.cliente_id = 0)
            AND m.telefone IS NOT NULL
        ) subq
        WHERE c.id = subq.conversa_id
        RETURNING c.id
    )
    SELECT COUNT(*) INTO v_conversas_count FROM updated_conversas;
    
    WITH updated_mensagens AS (
        UPDATE ingestion_memoria_clientes_historico_01 m
        SET cliente_id = cl.id
        FROM core_clientes cl
        WHERE m.telefone = cl.telefone
        AND (m.cliente_id IS NULL OR m.cliente_id != cl.id)
        AND m.telefone IS NOT NULL
        RETURNING m.id
    )
    SELECT COUNT(*) INTO v_mensagens_count FROM updated_mensagens;
    
    RETURN QUERY SELECT v_conversas_count, v_mensagens_count;
END;
$$;