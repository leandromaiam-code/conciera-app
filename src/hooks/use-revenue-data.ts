import { useState, useEffect } from "react";
import { RevenueMetrics } from "@/types/briefing-types";

/**
 * Hook for revenue performance data
 * Simulates real-time revenue metrics with realistic growth patterns
 */
export const useRevenueData = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    rpg_mensal: 42800,
    rpg_diario: 1850,
    valor_medio_consulta: 380,
    sparkline_30d: [
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
        rpg_diario: prev.rpg_diario + Math.floor(Math.random() * 200) - 50,
        rpg_mensal: prev.rpg_mensal + Math.floor(Math.random() * 500) - 100
      }));
    }, 300000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return { metrics, isLoading };
};