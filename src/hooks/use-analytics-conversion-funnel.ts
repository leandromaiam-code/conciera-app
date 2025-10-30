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

export const useAnalyticsConversionFunnel = (funcionariaId?: number, selectedMonth?: Date) => {
  const anoMes = selectedMonth 
    ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-01`
    : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;

  const metricsQuery = useQuery({
    queryKey: ["conversion-funnel-metrics", funcionariaId, anoMes],
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
          leads_indicacao,
          clientes_novos,
          clientes_diferentes
        `)
        .eq("ano_mes", anoMes);

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
    queryKey: ["conversion-funnel-conversas", funcionariaId, anoMes],
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
        .eq("ano_mes", anoMes);

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
      // Dados MENSAIS para o funil
      newLeads: metrics?.clientes_novos || 0,
      scheduledAppointments: conversas?.conversas_com_agendamento || 0,
      conversionRate: conversas?.taxa_conversao_agendamento || metrics?.taxa_conversao || 0,
      
      // Dados diários separados
      newLeadsToday: metrics?.novos_leads_hoje || 0,
      scheduledAppointmentsToday: metrics?.agendamentos_hoje || 0,
      
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