-- Adicionar políticas DELETE para agendamentos e clientes
CREATE POLICY "Authenticated users can delete agendamentos"
ON public.core_agendamentos
FOR DELETE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clientes"
ON public.core_clientes
FOR DELETE
USING (auth.role() = 'authenticated');

-- Adicionar políticas RLS para tabelas sem políticas
ALTER TABLE public.ingestion_memoria_clientes_historico_01 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view memoria"
ON public.ingestion_memoria_clientes_historico_01
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert memoria"
ON public.ingestion_memoria_clientes_historico_01
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update memoria"
ON public.ingestion_memoria_clientes_historico_01
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete memoria"
ON public.ingestion_memoria_clientes_historico_01
FOR DELETE
USING (auth.role() = 'authenticated');

-- Adicionar políticas para core_conversas
ALTER TABLE public.core_conversas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can delete conversas"
ON public.core_conversas
FOR DELETE
USING (auth.role() = 'authenticated');