import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConfiguracaoCanais {
  id: number;
  funcionaria_id: number;
  whatsapp_ativo: boolean;
  whatsapp_web_status: string;
  whatsapp_web_telefone?: string;
  whatsapp_web_session_id?: string;
  whatsapp_web_conectado_em?: string;
  whatsapp_business_status: string;
  whatsapp_business_telefone?: string;
  whatsapp_business_conectado_em?: string;
  instagram_ativo: boolean;
  instagram_status: string;
  instagram_username?: string;
  instagram_conectado_em?: string;
  telefone_ativo: boolean;
  email_ativo: boolean;
  portal_ativo: boolean;
  formularios_ativo: boolean;
  updated_at?: string;
}

interface UseConfigConfiguracaoCanaisResult {
  canais: ConfiguracaoCanais | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  updateCanal: (canal: string, ativo: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useConfigConfiguracaoCanais = (funcionariaId?: number): UseConfigConfiguracaoCanaisResult => {
  const [canais, setCanais] = useState<ConfiguracaoCanais | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCanais = async () => {
    try {
      setLoading(true);
      setError(null);

      // If no funcionariaId provided, get the first config (assuming single-tenant for now)
      let query = supabase
        .from('config_configuracoes_canais')
        .select('*');

      if (funcionariaId) {
        query = query.eq('funcionaria_id', funcionariaId);
      }

      const { data, error: queryError } = await query.limit(1);

      if (queryError) {
        console.error('Erro ao buscar configurações de canais:', queryError);
        setError('Erro ao carregar configurações de canais');
        return;
      }

      if (data && data.length > 0) {
        setCanais(data[0] as ConfiguracaoCanais);
      } else {
        // Create default configuration if none exists
        if (funcionariaId) {
          await createDefaultCanais(funcionariaId);
        }
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar configurações de canais');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCanais = async (funcionariaId: number) => {
    try {
      const defaultConfig = {
        funcionaria_id: funcionariaId,
        whatsapp_ativo: true,
        whatsapp_web_status: 'desconectado',
        whatsapp_business_status: 'desconectado',
        instagram_ativo: false,
        instagram_status: 'desconectado',
        email_ativo: false,
        telefone_ativo: false,
        portal_ativo: false,
        formularios_ativo: false
      };

      const { data, error } = await supabase
        .from('config_configuracoes_canais')
        .insert(defaultConfig)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar configuração padrão:', error);
        return;
      }

      if (data) {
        setCanais(data as ConfiguracaoCanais);
      }
    } catch (err) {
      console.error('Erro ao criar configuração padrão:', err);
    }
  };

  const updateCanal = async (canal: string, ativo: boolean) => {
    if (!canais) return;

    try {
      setSaving(true);
      setError(null);

      const updateField = `${canal}_ativo`;
      
      const { error: updateError } = await supabase
        .from('config_configuracoes_canais')
        .update({ [updateField]: ativo })
        .eq('id', canais.id);

      if (updateError) {
        console.error('Erro ao atualizar canal:', updateError);
        setError('Erro ao atualizar configuração do canal');
        return;
      }

      // Update local state
      setCanais(prev => prev ? {
        ...prev,
        [updateField]: ativo
      } : null);

      console.log(`Canal ${canal} ${ativo ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err) {
      console.error('Erro ao atualizar canal:', err);
      setError('Erro inesperado ao atualizar canal');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchCanais();
  }, [funcionariaId]);

  return {
    canais,
    loading,
    error,
    saving,
    updateCanal,
    refetch: fetchCanais
  };
};