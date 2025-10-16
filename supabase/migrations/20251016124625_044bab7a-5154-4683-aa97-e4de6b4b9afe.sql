-- ============================================================================
-- CORREÇÃO COMPLETA DE SEGURANÇA RLS
-- ============================================================================

-- 1. Criar funções Security Definer para helpers seguros
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT empresa_id 
  FROM public.core_users 
  WHERE auth_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.get_funcionaria_empresa_id(_funcionaria_id INTEGER)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT empresa_id 
  FROM public.config_funcionaria_virtual 
  WHERE id = _funcionaria_id
  LIMIT 1
$$;

-- 2. Habilitar RLS em memoria_clientes_historico_01
-- ============================================================================

ALTER TABLE public.memoria_clientes_historico_01 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their company messages"
ON public.memoria_clientes_historico_01
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(
    CAST(SUBSTRING(session_id FROM 'id:(\d+)_tel:') AS INTEGER)
  ) = public.get_user_empresa_id()
);

-- 3. Adicionar políticas em config_configuracoes_canais
-- ============================================================================

CREATE POLICY "Users can manage their company channel configs"
ON public.config_configuracoes_canais
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 4. Adicionar políticas em config_configuracoes_sistema
-- ============================================================================

CREATE POLICY "Users can manage their company system configs"
ON public.config_configuracoes_sistema
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 5. Adicionar políticas em ecosystem_paciente_clinica_vinculos
-- ============================================================================

CREATE POLICY "Users can manage their company patient links"
ON public.ecosystem_paciente_clinica_vinculos
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 6. Adicionar políticas em ecosystem_pacientes_global
-- ============================================================================

CREATE POLICY "Users can view patients linked to their company"
ON public.ecosystem_pacientes_global
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.ecosystem_paciente_clinica_vinculos v
    WHERE v.paciente_global_id = id
      AND v.empresa_id = public.get_user_empresa_id()
  )
);

CREATE POLICY "Users can insert new global patients"
ON public.ecosystem_pacientes_global
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their company patients"
ON public.ecosystem_pacientes_global
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.ecosystem_paciente_clinica_vinculos v
    WHERE v.paciente_global_id = id
      AND v.empresa_id = public.get_user_empresa_id()
  )
);

-- 7. Melhorar políticas existentes - analytics_conversas_diarias
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert conversas diarias" ON public.analytics_conversas_diarias;
DROP POLICY IF EXISTS "Authenticated users can update conversas diarias" ON public.analytics_conversas_diarias;
DROP POLICY IF EXISTS "Authenticated users can view conversas diarias" ON public.analytics_conversas_diarias;

CREATE POLICY "Users can manage their company conversas diarias"
ON public.analytics_conversas_diarias
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 8. Melhorar políticas existentes - analytics_conversas_metricas
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert conversas metricas" ON public.analytics_conversas_metricas;
DROP POLICY IF EXISTS "Authenticated users can update conversas metricas" ON public.analytics_conversas_metricas;
DROP POLICY IF EXISTS "Authenticated users can view conversas metricas" ON public.analytics_conversas_metricas;

CREATE POLICY "Users can manage their company conversas metricas"
ON public.analytics_conversas_metricas
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 9. Melhorar políticas existentes - analytics_metricas_mensais_vendas
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on metricas_vendas" ON public.analytics_metricas_mensais_vendas;

CREATE POLICY "Users can manage their company metricas vendas"
ON public.analytics_metricas_mensais_vendas
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 10. Melhorar políticas existentes - analytics_procedimentos_vendas
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert procedimentos vendas" ON public.analytics_procedimentos_vendas;
DROP POLICY IF EXISTS "Authenticated users can update procedimentos vendas" ON public.analytics_procedimentos_vendas;
DROP POLICY IF EXISTS "Authenticated users can view procedimentos vendas" ON public.analytics_procedimentos_vendas;

CREATE POLICY "Users can manage their company procedimentos vendas"
ON public.analytics_procedimentos_vendas
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 11. Melhorar políticas existentes - config_detalhes_produtos_servicos
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on vector_produtos" ON public.config_detalhes_produtos_servicos;

CREATE POLICY "Users can manage their company produtos servicos"
ON public.config_detalhes_produtos_servicos
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 12. Melhorar políticas existentes - config_estilo_funcionaria
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on estilo_funciona" ON public.config_estilo_funcionaria;

CREATE POLICY "Users can manage their company estilo funcionaria"
ON public.config_estilo_funcionaria
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 13. Melhorar políticas existentes - config_funcionaria_virtual
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on funcionaria_vir" ON public.config_funcionaria_virtual;

CREATE POLICY "Users can manage their company funcionarias"
ON public.config_funcionaria_virtual
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 14. Melhorar políticas existentes - config_ignore_list
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on ignore_list" ON public.config_ignore_list;

CREATE POLICY "Users can manage their company ignore list"
ON public.config_ignore_list
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 15. Melhorar políticas existentes - config_script_vendas
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on script_vendas" ON public.config_script_vendas;

CREATE POLICY "Users can manage their company scripts vendas"
ON public.config_script_vendas
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 16. Melhorar políticas existentes - core_agendamentos
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete agendamentos" ON public.core_agendamentos;
DROP POLICY IF EXISTS "Authenticated users can insert agendamentos" ON public.core_agendamentos;
DROP POLICY IF EXISTS "Authenticated users can update agendamentos" ON public.core_agendamentos;
DROP POLICY IF EXISTS "Authenticated users can view agendamentos" ON public.core_agendamentos;

CREATE POLICY "Users can manage their company agendamentos"
ON public.core_agendamentos
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 17. Melhorar políticas existentes - core_arquivos
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on arquivos" ON public.core_arquivos;

CREATE POLICY "Users can manage their company arquivos"
ON public.core_arquivos
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 18. Melhorar políticas existentes - core_briefings
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert briefings" ON public.core_briefings;
DROP POLICY IF EXISTS "Authenticated users can update briefings" ON public.core_briefings;
DROP POLICY IF EXISTS "Authenticated users can view briefings" ON public.core_briefings;

CREATE POLICY "Users can manage their company briefings"
ON public.core_briefings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.core_agendamentos a
    WHERE a.id = agendamento_id
      AND a.empresa_id = public.get_user_empresa_id()
  )
);

-- 19. Melhorar políticas existentes - core_clientes
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete clientes" ON public.core_clientes;
DROP POLICY IF EXISTS "Authenticated users can insert clientes" ON public.core_clientes;
DROP POLICY IF EXISTS "Authenticated users can update clientes" ON public.core_clientes;
DROP POLICY IF EXISTS "Authenticated users can view clientes" ON public.core_clientes;

CREATE POLICY "Users can manage their company clientes"
ON public.core_clientes
FOR ALL
TO authenticated
USING (empresa_id = public.get_user_empresa_id());

-- 20. Melhorar políticas existentes - core_conversas
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete conversas" ON public.core_conversas;
DROP POLICY IF EXISTS "Authenticated users can insert conversas" ON public.core_conversas;
DROP POLICY IF EXISTS "Authenticated users can update conversas" ON public.core_conversas;
DROP POLICY IF EXISTS "Authenticated users can view conversas" ON public.core_conversas;

CREATE POLICY "Users can manage their company conversas"
ON public.core_conversas
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 21. Melhorar políticas existentes - core_empresa
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.core_empresa;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on empresa" ON public.core_empresa;

CREATE POLICY "Users can manage their own empresa"
ON public.core_empresa
FOR ALL
TO authenticated
USING (id = public.get_user_empresa_id());

-- 22. Melhorar políticas existentes - ingestion_memoria_clientes_historico_01
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete memoria" ON public.ingestion_memoria_clientes_historico_01;
DROP POLICY IF EXISTS "Authenticated users can insert memoria" ON public.ingestion_memoria_clientes_historico_01;
DROP POLICY IF EXISTS "Authenticated users can update memoria" ON public.ingestion_memoria_clientes_historico_01;
DROP POLICY IF EXISTS "Authenticated users can view memoria" ON public.ingestion_memoria_clientes_historico_01;

CREATE POLICY "Users can manage their company memoria historico"
ON public.ingestion_memoria_clientes_historico_01
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);

-- 23. Melhorar políticas existentes - ingestion_memoria_simulacao
-- ============================================================================

DROP POLICY IF EXISTS "Allow all operations for authenticated users on memoria_sofia_t" ON public.ingestion_memoria_simulacao;

CREATE POLICY "Users can manage their company memoria simulacao"
ON public.ingestion_memoria_simulacao
FOR ALL
TO authenticated
USING (
  public.get_funcionaria_empresa_id(funcionaria_id) = public.get_user_empresa_id()
);