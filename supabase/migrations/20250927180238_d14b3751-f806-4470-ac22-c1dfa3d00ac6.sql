-- Create index for better performance on auth_id
CREATE INDEX IF NOT EXISTS idx_core_users_auth_id ON public.core_users(auth_id);

-- Enable RLS on core_users table
ALTER TABLE public.core_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for core_users
CREATE POLICY "Users can view their own profile" 
ON public.core_users 
FOR SELECT 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" 
ON public.core_users 
FOR UPDATE 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" 
ON public.core_users 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.core_users (
    auth_id,
    nome,
    email,
    status,
    etapa,
    data_cadastro
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email,
    'ativo',
    'novo_usuario',
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create core_users record when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();