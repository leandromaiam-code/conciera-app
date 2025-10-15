import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ConversionFunnelData {
  newLeads: number;
  scheduledAppointments: number;
  conversionRate: number;
  trend: {
    leads: number;
    appointments: number;
  };
}

export const useAnalyticsConversionFunnel = (funcionariaId?: number) => {
  const metricsQuery = useQuery({
    queryKey: ["conversion-funnel-metrics", funcionariaId],
    queryFn: async () => {
      let query = supabase
        .from("analytics_metricas_mensais_vendas")
        .select(`
          novos_leads_hoje,
          agendamentos_hoje,
          taxa_conversao,
          leads_trend,
          agendamentos_trend,
          leads_whatsapp,
          leads_instagram,
          leads_indicacao
        `)
        .order("ano_mes", { ascending: false });

      if (funcionariaId) {
        query = query.eq("funcionaria_id", funcionariaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching conversion funnel:", error);
        throw error;
      }

      return data?.[0];
    },
    enabled: true,
  });

  const conversasQuery = useQuery({
    queryKey: ["conversion-funnel-conversas", funcionariaId],
    queryFn: async () => {
      let query = supabase
        .from("analytics_conversas_metricas")
        .select(`
          total_conversas,
          conversas_com_agendamento,
          taxa_conversao_agendamento,
          tempo_medio_primeira_resposta_segundos,
          taxa_resposta_rapida
        `)
        .order("ano_mes", { ascending: false });

      if (funcionariaId) {
        query = query.eq("funcionaria_id", funcionariaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching conversation metrics:", error);
        throw error;
      }

      return data?.[0];
    },
    enabled: true,
  });

  const funnelData = useMemo(() => {
    const metrics = metricsQuery.data;
    const conversas = conversasQuery.data;

    if (!metrics && !conversas) return null;

    return {
      newLeads: metrics?.novos_leads_hoje || 0,
      scheduledAppointments: metrics?.agendamentos_hoje || 0,
      conversionRate: conversas?.taxa_conversao_agendamento || metrics?.taxa_conversao || 0,
      
      // Additional metrics
      totalConversations: conversas?.total_conversas || 0,
      averageResponseTime: conversas?.tempo_medio_primeira_resposta_segundos || 0,
      fastResponseRate: conversas?.taxa_resposta_rapida || 0,
      
      // Channel breakdown
      channelBreakdown: {
        whatsapp: metrics?.leads_whatsapp || 0,
        instagram: metrics?.leads_instagram || 0,
        referral: metrics?.leads_indicacao || 0,
      },
      
      // Trends
      trend: {
        leads: metrics?.leads_trend || 0,
        appointments: metrics?.agendamentos_trend || 0,
      },
      
      // Performance indicators
      performanceIndicators: {
        conversionQuality: (conversas?.taxa_conversao_agendamento || 0) > 25 ? 'excellent' : 
                          (conversas?.taxa_conversao_agendamento || 0) > 15 ? 'good' : 'needs_improvement',
        responseTime: (conversas?.tempo_medio_primeira_resposta_segundos || 0) < 300 ? 'fast' : 
                     (conversas?.tempo_medio_primeira_resposta_segundos || 0) < 600 ? 'good' : 'slow',
      }
    };
  }, [metricsQuery.data, conversasQuery.data]);

  return {
    funnelData,
    isLoading: metricsQuery.isLoading || conversasQuery.isLoading,
    error: metricsQuery.error || conversasQuery.error,
    refetch: () => {
      metricsQuery.refetch();
      conversasQuery.refetch();
    }
  };
};