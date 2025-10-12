import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MonthlyData {
  month: string;
  leads: number;
  agendamentos: number;
  receita: number;
}

interface ChannelData {
  name: string;
  value: number;
  color: string;
}

interface ProcedureData {
  procedimento: string;
  quantidade: number;
  receita: number;
}

interface AnalyticsOverview {
  leadsTotal: number;
  leadsGrowth: number;
  taxaConversao: number;
  taxaConversaoGrowth: number;
  receitaTotal: number;
  receitaGrowth: number;
  agendamentosTotal: number;
  agendamentosGrowth: number;
  monthlyData: MonthlyData[];
  channelData: ChannelData[];
  procedureData: ProcedureData[];
}

export const useAnalyticsOverview = (funcionariaId?: number) => {
  return useQuery({
    queryKey: ['analytics-overview', funcionariaId],
    queryFn: async () => {
      // Buscar métricas mensais de vendas dos últimos 6 meses
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      let metricsQuery = supabase
        .from('analytics_metricas_mensais_vendas')
        .select('*')
        .gte('ano_mes', sixMonthsAgo.toISOString())
        .order('ano_mes', { ascending: true });

      if (funcionariaId) {
        metricsQuery = metricsQuery.eq('funcionaria_id', funcionariaId);
      }

      const { data: metricsData, error: metricsError } = await metricsQuery;
      if (metricsError) throw metricsError;

      // Buscar dados de procedimentos
      let proceduresQuery = supabase
        .from('analytics_procedimentos_vendas')
        .select('*')
        .gte('ano_mes', sixMonthsAgo.toISOString())
        .order('receita_total', { ascending: false })
        .limit(5);

      const { data: proceduresData, error: proceduresError } = await proceduresQuery;
      if (proceduresError) throw proceduresError;

      // Processar dados mensais
      const monthlyData: MonthlyData[] = (metricsData || []).map(m => ({
        month: new Date(m.ano_mes).toLocaleDateString('pt-BR', { month: 'short' }),
        leads: m.novos_leads_hoje || 0,
        agendamentos: m.agendamentos_hoje || 0,
        receita: m.rpg_diario || 0,
      }));

      // Calcular totais e crescimentos do mês atual vs mês anterior
      const currentMonth = metricsData?.[metricsData.length - 1];
      const previousMonth = metricsData?.[metricsData.length - 2];

      const leadsTotal = currentMonth?.novos_leads_hoje || 0;
      const leadsGrowth = previousMonth 
        ? ((leadsTotal - (previousMonth.novos_leads_hoje || 0)) / (previousMonth.novos_leads_hoje || 1)) * 100
        : 0;

      const agendamentosTotal = currentMonth?.agendamentos_hoje || 0;
      const agendamentosGrowth = previousMonth
        ? ((agendamentosTotal - (previousMonth.agendamentos_hoje || 0)) / (previousMonth.agendamentos_hoje || 1)) * 100
        : 0;

      const taxaConversao = currentMonth?.taxa_conversao || 0;
      const taxaConversaoGrowth = previousMonth
        ? taxaConversao - (previousMonth.taxa_conversao || 0)
        : 0;

      const receitaTotal = currentMonth?.rpg_mensal || 0;
      const receitaGrowth = previousMonth
        ? ((receitaTotal - (previousMonth.rpg_mensal || 0)) / (previousMonth.rpg_mensal || 1)) * 100
        : 0;

      // Processar dados de canais
      const channelData: ChannelData[] = [
        { 
          name: 'Instagram', 
          value: currentMonth?.leads_instagram || 0, 
          color: '#E1306C' 
        },
        { 
          name: 'WhatsApp', 
          value: currentMonth?.leads_whatsapp || 0, 
          color: '#25D366' 
        },
        { 
          name: 'Indicação', 
          value: currentMonth?.leads_indicacao || 0, 
          color: '#FFD700' 
        },
        { 
          name: 'Outros', 
          value: currentMonth?.leads_outros || 0, 
          color: '#6B7280' 
        },
      ];

      // Processar dados de procedimentos (agregar por procedimento)
      const procedureMap = new Map<string, { quantidade: number; receita: number }>();
      
      (proceduresData || []).forEach(p => {
        const existing = procedureMap.get(p.procedimento) || { quantidade: 0, receita: 0 };
        procedureMap.set(p.procedimento, {
          quantidade: existing.quantidade + (p.quantidade || 0),
          receita: existing.receita + (p.receita_total || 0),
        });
      });

      const procedureData: ProcedureData[] = Array.from(procedureMap.entries()).map(([procedimento, data]) => ({
        procedimento,
        quantidade: data.quantidade,
        receita: data.receita,
      }));

      return {
        leadsTotal,
        leadsGrowth: Math.round(leadsGrowth),
        taxaConversao: Math.round(taxaConversao),
        taxaConversaoGrowth: Math.round(taxaConversaoGrowth),
        receitaTotal,
        receitaGrowth: Math.round(receitaGrowth),
        agendamentosTotal,
        agendamentosGrowth: Math.round(agendamentosGrowth),
        monthlyData,
        channelData,
        procedureData,
      } as AnalyticsOverview;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
