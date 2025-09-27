import { useState, useEffect } from "react";
import { AnalyticsMetricasMensaisVendas } from "@/types/briefing-types";

/**
 * Hook for analytics metrics from analytics_metricas_mensais_vendas table
 * Simulates real-time revenue metrics with realistic growth patterns
 */
export const useAnalyticsMetricasMensaisVendas = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetricasMensaisVendas>({
    analytics_metricas_mensal_vendas_rpg_mensal: 42800,
    analytics_metricas_mensal_vendas_rpg_diario: 1850,
    analytics_metricas_mensal_vendas_valor_medio_consulta: 380,
    analytics_metricas_mensal_vendas_sparkline_30d: [
      32000, 33200, 35100, 34800, 36500, 38200, 37900, 39600, 
      41300, 40800, 42100, 43800, 42500, 44200, 45900, 44600,
      46300, 48000, 47200, 48900, 50600, 49800, 51500, 53200,
      52400, 54100, 55800, 54000, 55700, 42800
    ]
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Simulate real-time updates every 5 minutes
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        analytics_metricas_mensal_vendas_rpg_diario: prev.analytics_metricas_mensal_vendas_rpg_diario + Math.floor(Math.random() * 200) - 50,
        analytics_metricas_mensal_vendas_rpg_mensal: prev.analytics_metricas_mensal_vendas_rpg_mensal + Math.floor(Math.random() * 500) - 100
      }));
    }, 300000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return { metrics, isLoading };
};