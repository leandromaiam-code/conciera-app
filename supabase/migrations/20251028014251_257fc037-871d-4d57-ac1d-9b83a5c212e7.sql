-- Tabela principal de playbooks (automações)
CREATE TABLE IF NOT EXISTS public.config_playbooks (
    id BIGSERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL,
    funcionaria_id INTEGER,
    tipo TEXT NOT NULL CHECK (tipo IN ('lembrete_consulta', 'reativacao_conversa', 'pos_atendimento', 'follow_up', 'outros')),
    nome TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'arquivado')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_playbooks_empresa ON public.config_playbooks(empresa_id);
CREATE INDEX idx_playbooks_funcionaria ON public.config_playbooks(funcionaria_id);
CREATE INDEX idx_playbooks_tipo ON public.config_playbooks(tipo);
CREATE INDEX idx_playbooks_status ON public.config_playbooks(status);

-- RLS
ALTER TABLE public.config_playbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company playbooks"
ON public.config_playbooks
FOR ALL
USING (empresa_id = get_user_empresa_id());

-- Trigger para updated_at
CREATE TRIGGER update_playbooks_updated_at
    BEFORE UPDATE ON public.config_playbooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabela de passos dos playbooks
CREATE TABLE IF NOT EXISTS public.config_playbooks_steps (
    id BIGSERIAL PRIMARY KEY,
    playbook_id BIGINT NOT NULL REFERENCES public.config_playbooks(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    nome_passo TEXT NOT NULL,
    momento_execucao JSONB NOT NULL DEFAULT '{
        "tipo": "antes_agendamento",
        "valor": 24,
        "unidade": "horas"
    }'::jsonb,
    condicoes JSONB DEFAULT '{}'::jsonb,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_playbooks_steps_playbook ON public.config_playbooks_steps(playbook_id);
CREATE INDEX idx_playbooks_steps_ordem ON public.config_playbooks_steps(playbook_id, ordem);

-- RLS
ALTER TABLE public.config_playbooks_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company playbook steps"
ON public.config_playbooks_steps
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.config_playbooks p
        WHERE p.id = playbook_id AND p.empresa_id = get_user_empresa_id()
    )
);

-- Trigger para updated_at
CREATE TRIGGER update_playbooks_steps_updated_at
    BEFORE UPDATE ON public.config_playbooks_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabela de variações de mensagens
CREATE TABLE IF NOT EXISTS public.config_playbooks_messages (
    id BIGSERIAL PRIMARY KEY,
    step_id BIGINT NOT NULL REFERENCES public.config_playbooks_steps(id) ON DELETE CASCADE,
    variacao_numero INTEGER NOT NULL,
    conteudo TEXT NOT NULL,
    peso_distribuicao INTEGER DEFAULT 1,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_playbooks_messages_step ON public.config_playbooks_messages(step_id);

-- RLS
ALTER TABLE public.config_playbooks_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company playbook messages"
ON public.config_playbooks_messages
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.config_playbooks_steps s
        JOIN public.config_playbooks p ON p.id = s.playbook_id
        WHERE s.id = step_id AND p.empresa_id = get_user_empresa_id()
    )
);

-- Trigger para updated_at
CREATE TRIGGER update_playbooks_messages_updated_at
    BEFORE UPDATE ON public.config_playbooks_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabela de controle/log de execuções
CREATE TABLE IF NOT EXISTS public.config_playbooks_control (
    id BIGSERIAL PRIMARY KEY,
    playbook_id BIGINT NOT NULL REFERENCES public.config_playbooks(id) ON DELETE CASCADE,
    step_id BIGINT REFERENCES public.config_playbooks_steps(id) ON DELETE SET NULL,
    message_id BIGINT REFERENCES public.config_playbooks_messages(id) ON DELETE SET NULL,
    agendamento_id BIGINT REFERENCES public.core_agendamentos(id) ON DELETE SET NULL,
    conversa_id BIGINT REFERENCES public.core_conversas(id) ON DELETE SET NULL,
    cliente_id BIGINT REFERENCES public.core_clientes(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviado', 'falha', 'cancelado')),
    data_programada TIMESTAMPTZ,
    data_execucao TIMESTAMPTZ,
    resultado JSONB,
    mensagem_enviada TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_playbooks_control_playbook ON public.config_playbooks_control(playbook_id);
CREATE INDEX idx_playbooks_control_status ON public.config_playbooks_control(status);
CREATE INDEX idx_playbooks_control_data_programada ON public.config_playbooks_control(data_programada);
CREATE INDEX idx_playbooks_control_agendamento ON public.config_playbooks_control(agendamento_id);
CREATE INDEX idx_playbooks_control_conversa ON public.config_playbooks_control(conversa_id);
CREATE INDEX idx_playbooks_control_cliente ON public.config_playbooks_control(cliente_id);

-- RLS
ALTER TABLE public.config_playbooks_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their company playbook executions"
ON public.config_playbooks_control
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.config_playbooks p
        WHERE p.id = playbook_id AND p.empresa_id = get_user_empresa_id()
    )
);