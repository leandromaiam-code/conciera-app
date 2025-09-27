import { useState, useEffect } from "react";
import { CoreAgendamentos, ConversionFunnel } from "@/types/briefing-types";

/**
 * Hook for core agendamentos and conversion funnel data
 */
export const useCoreAgendamentos = () => {
  const [opportunities, setOpportunities] = useState<CoreAgendamentos[]>([
    {
      core_agendamentos_id: "opp-001",
      core_agendamentos_cliente_id: BigInt(1),
      core_agendamentos_conversa_id: BigInt(1),
      core_agendamentos_data_hora: "14:30",
      core_agendamentos_servico_interesse: "Harmonização Facial",
      core_agendamentos_valor_estimado: 2800,
      core_agendamentos_status: "confirmado",
      core_agendamentos_compareceu: false,
      core_agendamentos_empresa_id: 1,
      core_agendamentos_created_at: new Date().toISOString(),
      core_clientes_nome_completo: "Maria Silva",
      core_clientes_telefone: "(11) 99999-1234",
      ui_temperatura_lead: 3
    },
    {
      core_agendamentos_id: "opp-002",
      core_agendamentos_cliente_id: BigInt(2),
      core_agendamentos_conversa_id: BigInt(2),
      core_agendamentos_data_hora: "16:00",
      core_agendamentos_servico_interesse: "Implante Capilar",
      core_agendamentos_valor_estimado: 8500,
      core_agendamentos_status: "pendente",
      core_agendamentos_compareceu: false,
      core_agendamentos_empresa_id: 1,
      core_agendamentos_created_at: new Date().toISOString(),
      core_clientes_nome_completo: "João Santos",
      core_clientes_telefone: "(11) 99999-5678",
      ui_temperatura_lead: 2
    },
    {
      core_agendamentos_id: "opp-003",
      core_agendamentos_cliente_id: BigInt(3),
      core_agendamentos_conversa_id: BigInt(3),
      core_agendamentos_data_hora: "09:15",
      core_agendamentos_servico_interesse: "Rinoplastia",
      core_agendamentos_valor_estimado: 12000,
      core_agendamentos_status: "confirmado",
      core_agendamentos_compareceu: false,
      core_agendamentos_empresa_id: 1,
      core_agendamentos_created_at: new Date().toISOString(),
      core_clientes_nome_completo: "Ana Costa",
      core_clientes_telefone: "(11) 99999-9012",
      ui_temperatura_lead: 3
    }
  ]);

  const [funnelData, setFunnelData] = useState<ConversionFunnel>({
    ui_novos_leads_hoje: 18,
    ui_agendamentos_hoje: 12,
    ui_taxa_conversao: 67,
    ui_leads_trend: 15,
    ui_agendamentos_trend: 20
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
        ui_novos_leads_hoje: prev.ui_novos_leads_hoje + Math.floor(Math.random() * 2),
        ui_agendamentos_hoje: Math.floor(prev.ui_novos_leads_hoje * (prev.ui_taxa_conversao / 100))
      }));
    }, 180000); // Every 3 minutes

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return { opportunities, funnelData, isLoading };
};