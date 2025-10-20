import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConfigInstance {
  id: number;
  empresa_id: number;
  funcionaria_id: number | null;
  instance_name: string | null;
  status: string | null;
  created_at: string;
}

interface UseConfigInstanceResult {
  instance: ConfigInstance | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  disconnectWhatsApp: (instanceName: string) => Promise<void>;
  disconnecting: boolean;
}

export const useConfigInstance = (empresaId?: number): UseConfigInstanceResult => {
  const [instance, setInstance] = useState<ConfigInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstance = async () => {
    if (!empresaId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await (supabase as any)
        .from('config_instance')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (queryError) {
        console.error('Erro ao buscar config_instance:', queryError);
        setError('Erro ao carregar status da instância');
        return;
      }

      if (data) {
        setInstance({
          // @ts-ignore
          id: data.id,
          // @ts-ignore
          empresa_id: data.empresa_id,
          // @ts-ignore
          funcionaria_id: data.funcionaria_id,
          // @ts-ignore
          instance_name: data.instance_name,
          // @ts-ignore
          status: data.status,
          // @ts-ignore
          created_at: data.created_at
        });
      } else {
        setInstance(null);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar status da instância');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWhatsApp = async (instanceName: string) => {
    try {
      setDisconnecting(true);
      
      // Send webhook to disconnect
      const response = await fetch(
        "https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_whatsapp_web",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acao: "desconectar",
            instance_name: instanceName,
            empresa_id: empresaId
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook retornou ${response.status}`);
      }

      console.log('✅ Desconexão iniciada com sucesso');
      
      // Refetch to get updated status
      await fetchInstance();
    } catch (error) {
      console.error("❌ Erro ao desconectar WhatsApp:", error);
      throw error;
    } finally {
      setDisconnecting(false);
    }
  };

  useEffect(() => {
    fetchInstance();
  }, [empresaId]);

  return {
    instance,
    loading,
    error,
    refetch: fetchInstance,
    disconnectWhatsApp,
    disconnecting
  };
};
