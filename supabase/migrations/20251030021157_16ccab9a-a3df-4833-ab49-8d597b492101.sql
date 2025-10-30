-- Create table for agenda availability configuration
CREATE TABLE IF NOT EXISTS public.config_disponibilidade_agenda (
  id BIGSERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL,
  dia_semana TEXT NOT NULL CHECK (dia_semana IN ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo')),
  turno TEXT NOT NULL CHECK (turno IN ('manha', 'tarde', 'noite')),
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'ambos' CHECK (tipo IN ('primeira_consulta', 'retorno', 'ambos')),
  procedimento TEXT DEFAULT 'todos',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.config_disponibilidade_agenda ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage their company availability"
ON public.config_disponibilidade_agenda
FOR ALL
USING (empresa_id = get_user_empresa_id());

-- Create trigger for updated_at
CREATE TRIGGER update_config_disponibilidade_agenda_updated_at
BEFORE UPDATE ON public.config_disponibilidade_agenda
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();