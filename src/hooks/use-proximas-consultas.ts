import { useCoreAgendamentosReal } from "./use-core-agendamentos-real";
import { useMemo } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useProximasConsultas = () => {
  // Debug authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Auth status no useProximasConsultas:', user ? 'autenticado' : 'não autenticado');
    };
    checkAuth();
  }, []);

  // Buscar agendamentos a partir de hoje
  const hoje = new Date();
  const { agendamentos, loading, error, refetch, updateAgendamento } = useCoreAgendamentosReal(
    hoje, // dataInicio = hoje
    undefined, // dataFim = undefined (sem limite final)
    undefined  // status = undefined (todos os status)
  );

  const proximasConsultas = useMemo(() => {
    console.log('Processando agendamentos no useProximasConsultas:', agendamentos?.length || 0);
    
    if (!agendamentos) {
      console.log('Agendamentos é null/undefined');
      return [];
    }

    const filteredAndSorted = agendamentos
      // Filtrar apenas agendamentos futuros e não cancelados
      .filter(agendamento => {
        const dataAgendamento = new Date(agendamento.core_agendamentos_data_hora);
        const agora = new Date();
        const isFuture = dataAgendamento >= agora;
        const notCanceled = agendamento.core_agendamentos_status !== 'cancelado';
        
        console.log(`Agendamento ${agendamento.core_agendamentos_id}:`, {
          data: agendamento.core_agendamentos_data_hora,
          isFuture,
          notCanceled,
          status: agendamento.core_agendamentos_status
        });
        
        return isFuture && notCanceled;
      })
      // Ordenar por data (mais próximo primeiro)
      .sort((a, b) => {
        const dataA = new Date(a.core_agendamentos_data_hora);
        const dataB = new Date(b.core_agendamentos_data_hora);
        return dataA.getTime() - dataB.getTime();
      })
      // Limitar para TOP 3
      .slice(0, 3)
      // Formatar dados para o componente
      .map(agendamento => ({
        ...agendamento,
        // Formatar data para o padrão brasileiro
        core_agendamentos_data_hora: format(
          new Date(agendamento.core_agendamentos_data_hora), 
          "dd/MM/yyyy 'às' HH:mm"
        ),
        // Mapear temperatura do briefing para UI (1-3 scale)
        ui_temperatura_lead: Math.min(Math.max(agendamento.briefing_temperatura_lead || 1, 1), 3) as 1 | 2 | 3
      }));

    console.log('Próximas consultas finais:', filteredAndSorted.length);
    return filteredAndSorted;
  }, [agendamentos]);

  return {
    opportunities: proximasConsultas,
    isLoading: loading,
    error,
    refetch,
    updateAgendamento
  };
};