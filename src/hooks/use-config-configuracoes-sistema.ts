import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConfigConfiguracoesSistema } from "@/types/briefing-types";

interface UseConfigConfiguracoesSistemaResult {
  sistema: ConfigConfiguracoesSistema | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  updateSistema: (data: Partial<ConfigConfiguracoesSistema>) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useConfigConfiguracoesSistema = (empresaId?: number): UseConfigConfiguracoesSistemaResult => {
  const [sistema, setSistema] = useState<ConfigConfiguracoesSistema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSistema = async () => {
    try {
      setLoading(true);
      setError(null);

      // If no empresaId provided, get the first config (assuming single-tenant for now)
      let query = supabase
        .from('config_configuracoes_sistema')
        .select('*');

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data, error: queryError } = await query.limit(1);

      if (queryError) {
        console.error('Erro ao buscar configurações do sistema:', queryError);
        setError('Erro ao carregar configurações do sistema');
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        
        // Transform database data to match expected format
        const sistemaData: ConfigConfiguracoesSistema = {
          config_configuracoes_sistema_id: BigInt(row.id),
          config_configuracoes_sistema_empresa_id: row.empresa_id,
          config_configuracoes_sistema_backup_automatico: row.backup_automatico || true,
          config_configuracoes_sistema_notificacoes_email: row.notificacoes_email || true,
          config_configuracoes_sistema_notificacoes_push: row.notificacoes_push || true,
          config_configuracoes_sistema_logs_detalhados: row.logs_detalhados || false,
          config_configuracoes_sistema_updated_at: row.updated_at || new Date().toISOString(),
          // Automation fields
          ui_auto_agendamento: row.auto_agendamento ?? true,
          ui_auto_pagamento: row.auto_pagamento ?? false,
          // Payment and calendar fields
          chave_pix: row.chave_pix || null,
          tipo_agenda_base: (row.tipo_agenda_base || 'conciera') as 'conciera' | 'google',
          google_calendar_connected: row.google_calendar_connected || false,
          google_calendar_metadata: (row.google_calendar_metadata || {}) as Record<string, any>
        };

        setSistema(sistemaData);
      } else {
        // Create default configuration if none exists
        if (empresaId) {
          await createDefaultSistema(empresaId);
        }
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar configurações do sistema');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSistema = async (empresaId: number) => {
    try {
      const defaultConfig = {
        empresa_id: empresaId,
        backup_automatico: true,
        notificacoes_email: true,
        notificacoes_push: true,
        logs_detalhados: false,
        auto_agendamento: true,
        auto_pagamento: false
      };

      const { data, error } = await supabase
        .from('config_configuracoes_sistema')
        .insert(defaultConfig)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar configuração padrão:', error);
        return;
      }

      if (data) {
        const sistemaData: ConfigConfiguracoesSistema = {
          config_configuracoes_sistema_id: BigInt(data.id),
          config_configuracoes_sistema_empresa_id: data.empresa_id,
          config_configuracoes_sistema_backup_automatico: data.backup_automatico,
          config_configuracoes_sistema_notificacoes_email: data.notificacoes_email,
          config_configuracoes_sistema_notificacoes_push: data.notificacoes_push,
          config_configuracoes_sistema_logs_detalhados: data.logs_detalhados,
          config_configuracoes_sistema_updated_at: data.updated_at,
          // Automation fields
          ui_auto_agendamento: data.auto_agendamento ?? true,
          ui_auto_pagamento: data.auto_pagamento ?? false,
          // Payment and calendar fields
          chave_pix: data.chave_pix || null,
          tipo_agenda_base: (data.tipo_agenda_base || 'conciera') as 'conciera' | 'google',
          google_calendar_connected: data.google_calendar_connected || false,
          google_calendar_metadata: (data.google_calendar_metadata || {}) as Record<string, any>
        };
        setSistema(sistemaData);
      }
    } catch (err) {
      console.error('Erro ao criar configuração padrão:', err);
    }
  };

  const updateSistema = async (updateData: Partial<ConfigConfiguracoesSistema>) => {
    if (!sistema) return;

    try {
      setSaving(true);
      setError(null);

      // Transform frontend data back to database format
      const dbData: any = {};
      
      Object.keys(updateData).forEach(key => {
        let dbField = key.replace('config_configuracoes_sistema_', '');
        // Also remove ui_ prefix for auto_agendamento and auto_pagamento
        dbField = dbField.replace('ui_', '');
        if (updateData[key as keyof ConfigConfiguracoesSistema] !== undefined) {
          dbData[dbField] = updateData[key as keyof ConfigConfiguracoesSistema];
        }
      });

      const { error: updateError } = await supabase
        .from('config_configuracoes_sistema')
        .update(dbData)
        .eq('id', Number(sistema.config_configuracoes_sistema_id));

      if (updateError) {
        console.error('Erro ao atualizar sistema:', updateError);
        setError('Erro ao salvar configurações do sistema');
        return;
      }

      // Update local state
      setSistema(prev => prev ? { ...prev, ...updateData } : null);
      
      console.log('Configurações do sistema atualizadas com sucesso');
    } catch (err) {
      console.error('Erro ao atualizar sistema:', err);
      setError('Erro inesperado ao salvar configurações');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSistema();
  }, [empresaId]);

  return {
    sistema,
    loading,
    error,
    saving,
    updateSistema,
    refetch: fetchSistema
  };
};