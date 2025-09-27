import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsConversasMetricas {
  id: number;
  ano_mes: string;
  empresa_id: number;
  funcionaria_id: number;
  total_conversas: number;
  conversas_iniciadas: number;
  conversas_finalizadas: number;
  tempo_medio_primeira_resposta_segundos: number;
  tempo_medio_resolucao_minutos: number;
  taxa_resposta_rapida: number;
  conversas_whatsapp: number;
  conversas_instagram: number;
  conversas_email: number;
  conversas_telefone: number;
  conversas_com_agendamento: number;
  taxa_conversao_agendamento: number;
  satisfacao_media: number;
  created_at: string;
  updated_at: string;
}

export const useAnalyticsConversasMetricas = (funcionariaId?: number) => {
  return useQuery({
    queryKey: ["analytics-conversas-metricas", funcionariaId],
    queryFn: async () => {
      let query = supabase
        .from("analytics_conversas_metricas")
        .select("*")
        .order("ano_mes", { ascending: false });

      if (funcionariaId) {
        query = query.eq("funcionaria_id", funcionariaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching conversas metricas:", error);
        throw error;
      }

      return data as AnalyticsConversasMetricas[];
    },
    enabled: true,
  });
};

export const useAnalyticsConversasMetricasReal = (funcionariaId?: number) => {
  const { data: metrics, isLoading, error } = useAnalyticsConversasMetricas(funcionariaId);

  // Transform data for dashboard consumption
  const transformedData = {
    conversasFunnel: {
      totalConversas: metrics?.[0]?.total_conversas || 0,
      conversasComAgendamento: metrics?.[0]?.conversas_com_agendamento || 0,
      taxaConversao: metrics?.[0]?.taxa_conversao_agendamento || 0,
      tempoMedioResposta: metrics?.[0]?.tempo_medio_primeira_resposta_segundos || 0,
      taxaRespostaRapida: metrics?.[0]?.taxa_resposta_rapida || 0,
    },
    canaisDistribuicao: {
      whatsapp: metrics?.[0]?.conversas_whatsapp || 0,
      instagram: metrics?.[0]?.conversas_instagram || 0,
      email: metrics?.[0]?.conversas_email || 0,
      telefone: metrics?.[0]?.conversas_telefone || 0,
    },
    satisfacao: {
      media: metrics?.[0]?.satisfacao_media || 0,
      tempoResolucao: metrics?.[0]?.tempo_medio_resolucao_minutos || 0,
    }
  };

  return {
    funnelData: transformedData,
    isLoading,
    error,
    refetch: () => {}, // Placeholder for refetch functionality
  };
};