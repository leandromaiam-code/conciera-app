import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SecondaryKPIs {
  mensagensProcessadas: number;
  mensagensGrowth: number;
  tempoMedioResposta: number;
  tempoRespostaGrowth: number;
  satisfacaoCliente: number;
  satisfacaoGrowth: number;
  taxaComparecimento: number;
  comparecimentoGrowth: number;
}

export const useDashboardSecondaryKPIs = (funcionariaId?: number, selectedMonth?: Date) => {
  return useQuery({
    queryKey: ['dashboard-secondary-kpis', funcionariaId, selectedMonth],
    queryFn: async () => {
      // Buscar métricas do mês selecionado e anterior
      const currentMonth = selectedMonth ? new Date(selectedMonth) : new Date();
      currentMonth.setDate(1);
      
      const previousMonth = new Date(currentMonth);
      previousMonth.setMonth(previousMonth.getMonth() - 1);

      // Métricas de vendas
      let metricsQuery = supabase
        .from('analytics_metricas_mensais_vendas')
        .select('*')
        .gte('ano_mes', previousMonth.toISOString())
        .order('ano_mes', { ascending: false })
        .limit(2);

      if (funcionariaId) {
        metricsQuery = metricsQuery.eq('funcionaria_id', funcionariaId);
      }

      const { data: metricsData, error: metricsError } = await metricsQuery;
      if (metricsError) throw metricsError;

      // Métricas de conversas
      let conversasQuery = supabase
        .from('analytics_conversas_metricas')
        .select('*')
        .gte('ano_mes', previousMonth.toISOString())
        .order('ano_mes', { ascending: false })
        .limit(2);

      if (funcionariaId) {
        conversasQuery = conversasQuery.eq('funcionaria_id', funcionariaId);
      }

      const { data: conversasData, error: conversasError } = await conversasQuery;
      if (conversasError) throw conversasError;

      // Taxa de comparecimento
      const { data: agendamentos } = await supabase
        .from('core_agendamentos')
        .select('compareceu')
        .gte('created_at', currentMonth.toISOString())
        .not('compareceu', 'is', null);

      const totalAgendamentos = agendamentos?.length || 0;
      const compareceram = agendamentos?.filter(a => a.compareceu === true).length || 0;
      const taxaComparecimento = totalAgendamentos > 0 
        ? (compareceram / totalAgendamentos) * 100 
        : 0;

      // Calcular mesma métrica para mês anterior
      const { data: agendamentosPrevious } = await supabase
        .from('core_agendamentos')
        .select('compareceu')
        .gte('created_at', previousMonth.toISOString())
        .lt('created_at', currentMonth.toISOString())
        .not('compareceu', 'is', null);

      const totalAgendamentosPrevious = agendamentosPrevious?.length || 0;
      const compareceramPrevious = agendamentosPrevious?.filter(a => a.compareceu === true).length || 0;
      const taxaComparecimentoPrevious = totalAgendamentosPrevious > 0
        ? (compareceramPrevious / totalAgendamentosPrevious) * 100
        : 0;

      const current = metricsData?.[0];
      const previous = metricsData?.[1];

      const conversasCurrent = conversasData?.[0];
      const conversasPrevious = conversasData?.[1];

      // Calcular KPIs
      const mensagensProcessadas = current?.total_mensagens || 0;
      const mensagensGrowth = previous
        ? ((mensagensProcessadas - (previous.total_mensagens || 0)) / (previous.total_mensagens || 1)) * 100
        : 0;

      const tempoMedioResposta = (current?.tempo_medio_resposta_segundos || 0) / 1000; // converter para segundos
      const tempoMedioRespostaPrevious = (previous?.tempo_medio_resposta_segundos || 0) / 1000;
      const tempoRespostaGrowth = tempoMedioRespostaPrevious > 0
        ? ((tempoMedioResposta - tempoMedioRespostaPrevious) / tempoMedioRespostaPrevious) * 100
        : 0;

      const satisfacaoCliente = conversasCurrent?.satisfacao_media || 0;
      const satisfacaoGrowth = conversasPrevious
        ? satisfacaoCliente - (conversasPrevious.satisfacao_media || 0)
        : 0;

      const comparecimentoGrowth = taxaComparecimento - taxaComparecimentoPrevious;

      return {
        mensagensProcessadas,
        mensagensGrowth: Math.round(mensagensGrowth),
        tempoMedioResposta: Number(tempoMedioResposta.toFixed(1)),
        tempoRespostaGrowth: Math.round(tempoRespostaGrowth),
        satisfacaoCliente: Number(satisfacaoCliente.toFixed(1)),
        satisfacaoGrowth: Number(satisfacaoGrowth.toFixed(1)),
        taxaComparecimento: Math.round(taxaComparecimento),
        comparecimentoGrowth: Math.round(comparecimentoGrowth),
      } as SecondaryKPIs;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
