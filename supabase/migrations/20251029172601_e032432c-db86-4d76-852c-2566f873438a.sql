-- 1. Tornar cliente_id nullable para permitir conversas sem cliente cadastrado
ALTER TABLE core_conversas 
ALTER COLUMN cliente_id DROP NOT NULL;

-- 2. Corrigir trigger para usar NULL ao invés de 0
CREATE OR REPLACE FUNCTION public.update_conversas_realtime()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_conversa_exists BOOLEAN;
BEGIN
    IF NEW.funcionaria_id IS NULL THEN
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
            cliente_id = COALESCE(NEW.cliente_id, core_conversas.cliente_id)
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

-- 3. Criar função para gerar conversas retroativas
CREATE OR REPLACE FUNCTION public.create_missing_conversas()
RETURNS TABLE(
    session_id_criado TEXT,
    telefone TEXT,
    mensagens_contadas INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
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
    SELECT DISTINCT ON (m.session_id)
        m.session_id,
        m.cliente_id,
        m.funcionaria_id,
        COALESCE(m.canal, 'whatsapp'),
        'ativa',
        LEFT(m.content_text, 200),
        MAX(m.created_at) OVER (PARTITION BY m.session_id),
        COUNT(*) OVER (PARTITION BY m.session_id)
    FROM ingestion_memoria_clientes_historico_01 m
    LEFT JOIN core_conversas c ON c.session_id = m.session_id
    WHERE c.id IS NULL
    AND m.session_id IS NOT NULL
    AND m.funcionaria_id IS NOT NULL
    ORDER BY m.session_id, m.created_at DESC
    RETURNING 
        core_conversas.session_id,
        SUBSTRING(core_conversas.session_id FROM 'tel:([0-9]+)'),
        core_conversas.contagem_mensagens;
END;
$$;

-- 4. Separar Júlia e Carla
DO $$
DECLARE
    v_julia_id BIGINT;
BEGIN
    INSERT INTO core_clientes (nome_completo, telefone, empresa_id)
    VALUES ('Júlia', '553171701177', 6)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_julia_id;
    
    IF v_julia_id IS NULL THEN
        SELECT id INTO v_julia_id
        FROM core_clientes
        WHERE telefone = '553171701177' AND empresa_id = 6
        LIMIT 1;
    END IF;
    
    UPDATE ingestion_memoria_clientes_historico_01
    SET cliente_id = v_julia_id
    WHERE telefone = '553171701177';
    
    UPDATE core_conversas
    SET cliente_id = v_julia_id
    WHERE session_id IN (
        'id:6_tel:553171701177@s.whatsapp.net',
        'id:4_tel:553171701177@s.whatsapp.net'
    );
END $$;

-- 5. Criar conversas retroativas
SELECT * FROM public.create_missing_conversas();