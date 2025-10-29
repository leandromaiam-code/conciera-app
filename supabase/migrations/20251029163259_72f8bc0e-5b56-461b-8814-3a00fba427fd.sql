-- ============================================
-- CORREÇÃO E MELHORIA DO SISTEMA DE CLIENTE_ID
-- ============================================

-- 1. CORRIGIR DADOS EXISTENTES
-- Atualizar conversas que estão apontando para cliente_id errado
UPDATE core_conversas c
SET cliente_id = subq.cliente_correto_id
FROM (
    SELECT DISTINCT ON (c.id) 
        c.id as conversa_id,
        cl.id as cliente_correto_id
    FROM core_conversas c
    JOIN ingestion_memoria_clientes_historico_01 m ON m.session_id = c.session_id
    JOIN core_clientes cl ON cl.telefone = m.telefone
    WHERE c.cliente_id != cl.id
    AND m.telefone IS NOT NULL
) subq
WHERE c.id = subq.conversa_id;

-- Atualizar mensagens na memória que têm cliente_id NULL mas o telefone existe
UPDATE ingestion_memoria_clientes_historico_01 m
SET cliente_id = cl.id
FROM core_clientes cl
WHERE m.telefone = cl.telefone
AND m.cliente_id IS NULL
AND m.telefone IS NOT NULL;

-- 2. ADICIONAR CONSTRAINT PARA PREVENIR DUPLICAÇÕES
-- Garante que não existam telefones duplicados por empresa
DO $$ 
BEGIN
    -- Verificar se a constraint já existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_telefone_empresa'
    ) THEN
        ALTER TABLE core_clientes 
        ADD CONSTRAINT unique_telefone_empresa 
        UNIQUE (telefone, empresa_id);
    END IF;
END $$;

-- 3. MODIFICAR A FUNÇÃO update_conversas_realtime
-- Agora atualiza o cliente_id quando há um valor mais recente
CREATE OR REPLACE FUNCTION public.update_conversas_realtime()
RETURNS TRIGGER AS $$
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
            -- MUDANÇA: Atualiza cliente_id se houver um novo valor
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
$$ LANGUAGE plpgsql;

-- 4. CRIAR FUNÇÃO DE SINCRONIZAÇÃO INTELIGENTE
-- Mantém cliente_id sincronizado quando há alterações nos telefones
CREATE OR REPLACE FUNCTION public.sync_cliente_id_por_telefone()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando o telefone de um cliente é alterado
    IF TG_OP = 'UPDATE' AND OLD.telefone IS DISTINCT FROM NEW.telefone THEN
        -- Atualizar conversas que usavam o telefone antigo
        UPDATE core_conversas c
        SET cliente_id = NEW.id
        FROM ingestion_memoria_clientes_historico_01 m
        WHERE m.session_id = c.session_id
        AND m.telefone = NEW.telefone
        AND c.cliente_id = OLD.id;
        
        -- Atualizar mensagens na memória
        UPDATE ingestion_memoria_clientes_historico_01
        SET cliente_id = NEW.id
        WHERE telefone = NEW.telefone
        AND cliente_id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para sincronização automática
DROP TRIGGER IF EXISTS trigger_sync_cliente_telefone ON core_clientes;
CREATE TRIGGER trigger_sync_cliente_telefone
AFTER UPDATE ON core_clientes
FOR EACH ROW
EXECUTE FUNCTION sync_cliente_id_por_telefone();

-- 5. CRIAR FUNÇÃO PARA CORRIGIR INCONSISTÊNCIAS EM LOTE
-- Útil para manutenção e correção de dados
CREATE OR REPLACE FUNCTION public.fix_all_cliente_id_inconsistencies()
RETURNS TABLE(
    conversas_corrigidas INTEGER,
    mensagens_corrigidas INTEGER
) AS $$
DECLARE
    v_conversas_count INTEGER := 0;
    v_mensagens_count INTEGER := 0;
BEGIN
    -- Corrigir conversas
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
    
    -- Corrigir mensagens
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
$$ LANGUAGE plpgsql;

-- 6. CRIAR VIEW PARA MONITORAR INCONSISTÊNCIAS
CREATE OR REPLACE VIEW v_cliente_id_inconsistencias AS
SELECT 
    c.id as conversa_id,
    c.session_id,
    c.cliente_id as conversa_cliente_id,
    cl_conversa.nome_completo as conversa_cliente_nome,
    cl_conversa.telefone as conversa_cliente_telefone,
    m.cliente_id as memoria_cliente_id,
    cl_memoria.nome_completo as memoria_cliente_nome,
    cl_memoria.telefone as memoria_cliente_telefone,
    COUNT(m.id) as total_mensagens,
    c.created_at as conversa_criada_em
FROM core_conversas c
LEFT JOIN core_clientes cl_conversa ON cl_conversa.id = c.cliente_id
LEFT JOIN ingestion_memoria_clientes_historico_01 m ON m.session_id = c.session_id
LEFT JOIN core_clientes cl_memoria ON cl_memoria.id = m.cliente_id
WHERE (c.cliente_id != m.cliente_id OR (c.cliente_id = 0 AND m.cliente_id IS NOT NULL))
  AND m.cliente_id IS NOT NULL
GROUP BY 
    c.id, c.session_id, c.cliente_id, 
    cl_conversa.nome_completo, cl_conversa.telefone,
    m.cliente_id, cl_memoria.nome_completo, cl_memoria.telefone,
    c.created_at
ORDER BY c.created_at DESC;