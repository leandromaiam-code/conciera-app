// src/pages/Auth.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// --- 1. IMPORTAR A IMAGEM DA LOGO ---
import concieraLogo from '@/assets/Black-White-transparente.png';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "Email deve ter menos de 255 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).max(100, { message: "Senha deve ter menos de 100 caracteres" }),
  nome: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome deve ter menos de 100 caracteres" }).optional()
});

export const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  // ... (Toda a sua lógica de validateForm, handleLogin, handleSignup, handleSubmit permanece EXATAMENTE A MESMA) ...
  const validateForm = () => {
    try {
      const dataToValidate = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      authSchema.parse(dataToValidate);
      setErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map(err => err.message));
      }
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors(['Email ou senha incorretos']);
        } else if (error.message.includes('Email not confirmed')) {
          setErrors(['Por favor, confirme seu email antes de fazer login']);
        } else {
          setErrors([error.message]);
        }
        return;
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao CONCIERA Suite™️",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setErrors(['Erro inesperado ao fazer login']);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: formData.nome.trim()
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors(['Este email já está cadastrado. Tente fazer login ou usar outro email.']);
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setErrors(['A senha deve ter pelo menos 6 caracteres']);
        } else {
          setErrors([error.message]);
        }
        return;
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar a conta e fazer login",
      });
      
      // Switch to login after successful signup
      setIsLogin(true);
      setFormData({ email: formData.email, password: '', nome: '' });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors(['Erro inesperado ao criar conta']);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };


  return (
    // --- 2. APLICAR A IMAGEM DE FUNDO E ESTILOS AO CONTAINER PRINCIPAL ---
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/Fundo_App.png')` }} // Caminho para a imagem
    >
      {/* Adicionado um overlay para melhorar a legibilidade do card */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Card precisa de z-index para ficar acima do overlay */}
      <Card className="w-full max-w-md z-10"> 
        <CardHeader className="space-y-1 items-center text-center">
          
          <div className="mb-4">
            <img 
              src={concieraLogo} 
              alt="CONCIERA Logo" 
              className="w-64 h-auto mx-auto" // Ajuste o tamanho conforme necessário
            />
          </div>

          <CardTitle className="text-2xl">
            {isLogin ? 'Bem-vindo(a) de volta' : 'Crie a sua Conta'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Aceda à sua suite de inteligência de receita'
              : 'Comece a transformar atendimento em resultado'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (O resto do seu formulário e botões permanece EXATAMENTE O MESMO) ... */}
             {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={loading}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-dourado text-onyx hover:bg-dourado/90"
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors([]);
                setFormData({ email: '', password: '', nome: '' });
              }}
              disabled={loading}
              className="text-grafite hover:text-onyx"
            >
              {isLogin 
                ? 'Não tem uma conta? Criar conta'
                : 'Já tem uma conta? Fazer login'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};