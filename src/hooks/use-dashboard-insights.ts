import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityPeak {
  horario: string;
  quantidade: number;
}

interface RequestType {
  tipo: string;
  percentual: number;
}

interface DashboardInsights {
  activityPeaks: ActivityPeak[];
  requestTypes: RequestType[];
}

export const useDashboardInsights = (funcionariaId?: number) => {
  return useQuery({
    queryKey: ['dashboard-insights', funcionariaId],
    queryFn: async (): Promise<DashboardInsights> => {
      // Buscar picos de atividade baseado nas mensagens
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      let mensagensQuery = supabase
        .from('ingestion_memoria_clientes_historico_01')
        .select('created_at')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());

      if (funcionariaId) {
        mensagensQuery = mensagensQuery.eq('funcionaria_id', funcionariaId);
      }

      const { data: mensagens } = await mensagensQuery;

      // Calcular picos de atividade por faixa horária
      const hourCounts: Record<string, number> = {};
      mensagens?.forEach((msg) => {
        const hour = new Date(msg.created_at).getHours();
        const range = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 2).toString().padStart(2, '0')}:00`;
        hourCounts[range] = (hourCounts[range] || 0) + 1;
      });

      const activityPeaks = Object.entries(hourCounts)
        .map(([horario, quantidade]) => ({ horario, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 3);

      // Buscar tipos de solicitação baseado nos agendamentos e conversas
      let agendamentosQuery = supabase
        .from('core_agendamentos')
        .select('id')
        .gte('created_at', startOfDay.toISOString());

      let conversasQuery = supabase
        .from('core_conversas')
        .select('id')
        .gte('created_at', startOfDay.toISOString());

      if (funcionariaId) {
        conversasQuery = conversasQuery.eq('funcionaria_id', funcionariaId);
      }

      const [{ data: agendamentos }, { data: conversas }] = await Promise.all([
        agendamentosQuery,
        conversasQuery
      ]);

      const totalConversas = conversas?.length || 0;
      const totalAgendamentos = agendamentos?.length || 0;

      // Calcular percentuais aproximados
      const agendamentosPercent = totalConversas > 0 
        ? Math.round((totalAgendamentos / totalConversas) * 100) 
        : 65;
      const informacoesPercent = 100 - agendamentosPercent - 10;

      const requestTypes: RequestType[] = [
        { tipo: 'Agendamentos', percentual: agendamentosPercent },
        { tipo: 'Informações', percentual: informacoesPercent },
        { tipo: 'Reagendamentos', percentual: 10 }
      ];

      return {
        activityPeaks: activityPeaks.length > 0 ? activityPeaks : [
          { horario: '08:00 - 10:00', quantidade: 0 },
          { horario: '14:00 - 16:00', quantidade: 0 },
          { horario: '18:00 - 20:00', quantidade: 0 }
        ],
        requestTypes
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
