import { useState, useEffect } from "react";
import { OpportunityItem, ConversionFunnel } from "@/types/briefing-types";

/**
 * Hook for opportunity feed and conversion funnel data
 */
export const useOpportunityFeed = () => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([
    {
      id: "opp-001",
      paciente_nome: "Maria Silva",
      procedimento: "Harmonização Facial",
      horario: "14:30",
      temperatura: 3,
      valor_estimado: 2800
    },
    {
      id: "opp-002", 
      paciente_nome: "João Santos",
      procedimento: "Implante Capilar",
      horario: "16:00",
      temperatura: 2,
      valor_estimado: 8500
    },
    {
      id: "opp-003",
      paciente_nome: "Ana Costa",
      procedimento: "Rinoplastia",
      horario: "09:15",
      temperatura: 3,
      valor_estimado: 12000
    }
  ]);

  const [funnelData, setFunnelData] = useState<ConversionFunnel>({
    novos_leads_hoje: 18,
    agendamentos_hoje: 12,
    taxa_conversao: 67,
    leads_trend: 15,
    agendamentos_trend: 20
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setFunnelData(prev => ({
        ...prev,
        novos_leads_hoje: prev.novos_leads_hoje + Math.floor(Math.random() * 2),
        agendamentos_hoje: Math.floor(prev.novos_leads_hoje * (prev.taxa_conversao / 100))
      }));
    }, 180000); // Every 3 minutes

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return { opportunities, funnelData, isLoading };
};