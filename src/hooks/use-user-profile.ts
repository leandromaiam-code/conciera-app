import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface UserProfile {
  id: number;
  auth_id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  empresa_id: number | null;
  status: string | null;
  etapa: string | null;
  plano: string | null;
  data_cadastro: string;
  ultimo_acesso: string | null;
  created_at: string;
  updated_at: string;
  cpf: string | null;
  senha: string | null;
  endereço: string | null;
  ultimo_contato: string | null;
  whatsapp: string | null;
  vencimento: string | null;
}

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('core_users')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching user profile:', fetchError);
        setError('Erro ao carregar perfil do usuário');
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'auth_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) {
      throw new Error('Usuário não autenticado ou perfil não carregado');
    }

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('core_users')
        .update(updates)
        .eq('auth_id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error('Erro ao atualizar perfil');
      }

      // Refetch to get updated data
      await fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Erro ao atualizar perfil');
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Update last access when user becomes active
  useEffect(() => {
    if (profile && user) {
      const updateLastAccess = async () => {
        try {
          await supabase
            .from('core_users')
            .update({ ultimo_acesso: new Date().toISOString() })
            .eq('auth_id', user.id);
        } catch (error) {
          console.error('Error updating last access:', error);
        }
      };

      // Update last access every 5 minutes if user is active
      const interval = setInterval(updateLastAccess, 5 * 60 * 1000);
      
      // Update immediately
      updateLastAccess();

      return () => clearInterval(interval);
    }
  }, [profile, user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};