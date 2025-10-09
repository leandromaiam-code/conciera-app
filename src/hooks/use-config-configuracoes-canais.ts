import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConfigConfiguracaoCanais } from "@/types/briefing-types";

interface UseConfigConfiguracaoCanaisResult {
  canais: ConfigConfiguracaoCanais | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  updateCanal: (canal: string, ativo: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useConfigConfiguracaoCanais = (funcionariaId?: number): UseConfigConfiguracaoCanaisResult => {
  const [canais, setCanais] = useState<ConfigConfiguracaoCanais | null>(null);
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
        const row = data[0];
        
        // Transform database data to match expected format
        const canaisData: ConfigConfiguracaoCanais = {
          config_configuracoes_canais_id: row.id.toString(),
          config_configuracoes_canais_funcionaria_id: row.funcionaria_id,
          config_configuracoes_canais_whatsapp_ativo: row.whatsapp_ativo || false,
          config_configuracoes_canais_instagram_ativo: row.instagram_ativo || false,
          config_configuracoes_canais_email_ativo: row.email_ativo || false,
          config_configuracoes_canais_telefone_ativo: row.telefone_ativo || false,
          config_configuracoes_canais_portal_ativo: row.portal_ativo || false,
          config_configuracoes_canais_formularios_ativo: row.formularios_ativo || false,
          config_configuracoes_canais_updated_at: row.updated_at || new Date().toISOString(),
          // UI fields - these would normally come from a separate mapping or calculation
          ui_nome: 'Canal Principal',
          ui_tipo: 'whatsapp',
          ui_status: 'conectado',
          ui_icon: null
        };

        setCanais(canaisData);
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
        instagram_ativo: false,
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
        const canaisData: ConfigConfiguracaoCanais = {
          config_configuracoes_canais_id: data.id.toString(),
          config_configuracoes_canais_funcionaria_id: data.funcionaria_id,
          config_configuracoes_canais_whatsapp_ativo: data.whatsapp_ativo,
          config_configuracoes_canais_instagram_ativo: data.instagram_ativo,
          config_configuracoes_canais_email_ativo: data.email_ativo,
          config_configuracoes_canais_telefone_ativo: data.telefone_ativo,
          config_configuracoes_canais_portal_ativo: data.portal_ativo,
          config_configuracoes_canais_formularios_ativo: data.formularios_ativo,
          config_configuracoes_canais_updated_at: data.updated_at,
          // UI fields
          ui_nome: 'Canal Principal',
          ui_tipo: 'whatsapp',
          ui_status: 'conectado',
          ui_icon: null
        };
        setCanais(canaisData);
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
        .eq('id', Number(canais.config_configuracoes_canais_id));

      if (updateError) {
        console.error('Erro ao atualizar canal:', updateError);
        setError('Erro ao atualizar configuração do canal');
        return;
      }

      // Update local state
      setCanais(prev => prev ? {
        ...prev,
        [`config_configuracoes_canais_${updateField}`]: ativo
      } as ConfigConfiguracaoCanais : null);

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