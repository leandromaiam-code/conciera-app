import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsMetricasMensaisVendas } from "@/types/briefing-types";

interface UseAnalyticsMetricasMensaisVendasRealResult {
  metrics: AnalyticsMetricasMensaisVendas | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAnalyticsMetricasMensaisVendasReal = (
  funcionariaId?: number,
  anoMes?: string
): UseAnalyticsMetricasMensaisVendasRealResult => {
  const [metrics, setMetrics] = useState<AnalyticsMetricasMensaisVendas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('analytics_metricas_mensais_vendas')
        .select('*')
        .order('ano_mes', { ascending: false });

      if (funcionariaId) {
        query = query.eq('funcionaria_id', funcionariaId);
      }

      if (anoMes) {
        query = query.eq('ano_mes', anoMes);
      }

      const { data, error: queryError } = await query.limit(1);

      if (queryError) {
        console.error('Erro ao buscar métricas:', queryError);
        setError('Erro ao carregar métricas de vendas');
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        
        // Use real data from database
        const rpgMensal = row.rpg_mensal || 0;
        const rpgDiario = row.rpg_diario || 0;
        const valorMedioConsulta = row.valor_medio_consulta || 0;
        
        // Parse sparkline from JSONB field or create empty array
        let sparkline30d: number[] = [];
        if (row.sparkline_30d && Array.isArray(row.sparkline_30d)) {
          sparkline30d = row.sparkline_30d.map(val => typeof val === 'number' ? val : 0);
        } else {
          sparkline30d = Array(30).fill(0);
        }

        // Transform database data to match expected format
        const metricsData: AnalyticsMetricasMensaisVendas = {
          analytics_metricas_mensal_vendas_rpg_mensal: rpgMensal,
          analytics_metricas_mensal_vendas_rpg_diario: rpgDiario,
          analytics_metricas_mensal_vendas_valor_medio_consulta: valorMedioConsulta,
          analytics_metricas_mensal_vendas_sparkline_30d: sparkline30d,
          novos_leads_hoje: row.novos_leads_hoje || 0,
          agendamentos_hoje: row.agendamentos_hoje || 0
        };

        setMetrics(metricsData);
      } else {
        // Create default metrics if none exist
        const defaultMetrics: AnalyticsMetricasMensaisVendas = {
          analytics_metricas_mensal_vendas_rpg_mensal: 0,
          analytics_metricas_mensal_vendas_rpg_diario: 0,
          analytics_metricas_mensal_vendas_valor_medio_consulta: 0,
          analytics_metricas_mensal_vendas_sparkline_30d: Array(30).fill(0),
          novos_leads_hoje: 0,
          agendamentos_hoje: 0
        };
        setMetrics(defaultMetrics);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('metrics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analytics_metricas_mensais_vendas'
      }, () => {
        // Refetch data when changes occur
        fetchMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [funcionariaId, anoMes]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};