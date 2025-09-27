-- Add basic RLS policies for tables that have RLS enabled but no policies

-- Core agendamentos policies
CREATE POLICY "Authenticated users can view agendamentos" 
ON public.core_agendamentos 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert agendamentos" 
ON public.core_agendamentos 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update agendamentos" 
ON public.core_agendamentos 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Core briefings policies  
CREATE POLICY "Authenticated users can view briefings" 
ON public.core_briefings 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert briefings" 
ON public.core_briefings 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update briefings" 
ON public.core_briefings 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Core clientes policies
CREATE POLICY "Authenticated users can view clientes" 
ON public.core_clientes 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert clientes" 
ON public.core_clientes 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clientes" 
ON public.core_clientes 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Core conversas policies
CREATE POLICY "Authenticated users can view conversas" 
ON public.core_conversas 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversas" 
ON public.core_conversas 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conversas" 
ON public.core_conversas 
FOR UPDATE 
USING (auth.role() = 'authenticated');