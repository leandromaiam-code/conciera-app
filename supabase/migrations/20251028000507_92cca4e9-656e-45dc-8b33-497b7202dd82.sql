-- Create core_tasks table
CREATE TABLE public.core_tasks (
  id BIGSERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL,
  funcionaria_id INTEGER,
  cliente_id BIGINT,
  categoria TEXT NOT NULL DEFAULT 'outros',
  titulo TEXT NOT NULL,
  descricao TEXT,
  prazo TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'a_fazer',
  prioridade TEXT NOT NULL DEFAULT 'media',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_tasks_cliente FOREIGN KEY (cliente_id) REFERENCES public.core_clientes(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.core_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their company tasks
CREATE POLICY "Users can manage their company tasks"
ON public.core_tasks
FOR ALL
USING (empresa_id = get_user_empresa_id());

-- Create index for better performance
CREATE INDEX idx_tasks_empresa_id ON public.core_tasks(empresa_id);
CREATE INDEX idx_tasks_status ON public.core_tasks(status);
CREATE INDEX idx_tasks_prazo ON public.core_tasks(prazo);

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.core_tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();