import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsProcedimentosVendas {
  id: number;
  ano_mes: string;
  empresa_id: number;
  procedimento: string;
  quantidade: number;
  receita_total: number;
  ticket_medio: number;
  created_at: string;
  updated_at: string;
}

export const useAnalyticsProcedimentosVendas = (empresaId?: number) => {
  return useQuery({
    queryKey: ["analytics-procedimentos-vendas", empresaId],
    queryFn: async () => {
      let query = supabase
        .from("analytics_procedimentos_vendas")
        .select("*")
        .order("receita_total", { ascending: false });

      if (empresaId) {
        query = query.eq("empresa_id", empresaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching procedimentos vendas:", error);
        throw error;
      }

      return data as AnalyticsProcedimentosVendas[];
    },
    enabled: true,
  });
};

export const useAnalyticsProcedimentosVendasReal = (empresaId?: number) => {
  const { data: procedimentos, isLoading, error } = useAnalyticsProcedimentosVendas(empresaId);

  // Transform data for charts and analytics
  const transformedData = {
    chartData: procedimentos?.map(proc => ({
      name: proc.procedimento,
      value: proc.receita_total,
      quantidade: proc.quantidade,
      ticketMedio: proc.ticket_medio,
    })) || [],
    
    totalReceita: procedimentos?.reduce((acc, proc) => acc + proc.receita_total, 0) || 0,
    totalQuantidade: procedimentos?.reduce((acc, proc) => acc + proc.quantidade, 0) || 0,
    ticketMedioGeral: procedimentos?.length 
      ? (procedimentos.reduce((acc, proc) => acc + proc.ticket_medio, 0) / procedimentos.length)
      : 0,
      
    procedimentosMaisVendidos: procedimentos?.slice(0, 5) || [],
    
    // Data for table display
    tableData: procedimentos?.map(proc => ({
      procedimento: proc.procedimento,
      quantidade: proc.quantidade,
      receitaTotal: proc.receita_total,
      ticketMedio: proc.ticket_medio,
    })) || [],
  };

  return {
    procedimentosData: transformedData,
    isLoading,
    error,
  };
};