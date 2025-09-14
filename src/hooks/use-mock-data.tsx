import { OpportunityBrief, ConversionMetrics, RevenueData } from "@/types/opportunity";

// Mock data hook for Conciera v2.0
export const useMockData = () => {
  // Mock Revenue Data
  const revenueData: RevenueData = {
    currentMonthRPG: 45600,
    rpgTrend: [32000, 35200, 38100, 40500, 42300, 43800, 45600],
    averageConsultationValue: 450
  };

  // Mock Conversion Metrics
  const conversionMetrics: ConversionMetrics = {
    newLeads: 18,
    scheduledAppointments: 12,
    conversionRate: Math.round((12 / 18) * 100)
  };

  // Mock Opportunities
  const opportunities: OpportunityBrief[] = [
    {
      id: "1",
      patientName: "Ana Silva",
      procedure: "Lente de Contato Dental",
      scheduledTime: new Date(new Date().setHours(14, 30)),
      temperature: 3,
      resumo_conversa: "Paciente demonstrou muito interesse em lentes de contato dental para melhorar o sorriso. Mencionou que tem um casamento em 3 meses e quer estar com o sorriso perfeito. Já pesquisou bastante sobre o procedimento e está pronta para agendar.",
      perfil_paciente: ["Alta intenção de compra", "Procedimento de alto valor", "Timeline definida"],
      pontos_de_dor: ["Insegurança com o sorriso atual", "Evento importante próximo", "Quer resultado rápido"],
      desejos_e_referencias: ["Sorriso de celebridade", "Resultado natural", "Procedimento seguro"],
      abordagem_recomendada: "Focar na transformação completa do sorriso e no timeline para o casamento. Mostrar casos similares e garantir sobre a segurança do procedimento. Oferecer simulação digital do resultado.",
      estimatedValue: 8500
    },
    {
      id: "2", 
      patientName: "Carlos Santos",
      procedure: "Implante Dentário",
      scheduledTime: new Date(new Date().setHours(16, 0)),
      temperature: 2,
      resumo_conversa: "Paciente perdeu um dente frontal recentemente e está preocupado com a estética. Trabalha com atendimento ao público e precisa de uma solução rápida. Demonstrou interesse no implante mas tem algumas dúvidas sobre o processo.",
      perfil_paciente: ["Necessidade funcional", "Preocupação estética", "Profissional liberal"],
      pontos_de_dor: ["Impacto no trabalho", "Constrangimento social", "Urgência na resolução"],
      desejos_e_referencias: ["Resultado invisível", "Processo rápido", "Sem dor"],
      abordagem_recomendada: "Tranquilizar sobre o processo e tempo de cicatrização. Explicar opções de prótese temporária durante o tratamento. Focar nos benefícios funcionais e estéticos de longo prazo.",
      estimatedValue: 4200
    },
    {
      id: "3",
      patientName: "Maria Oliveira", 
      procedure: "Clareamento + Restaurações",
      scheduledTime: new Date(new Date().setHours(10, 15)),
      temperature: 1,
      resumo_conversa: "Paciente interessada em melhorar o sorriso de forma geral. Tem várias restaurações antigas que precisam ser trocadas e gostaria de clarear os dentes. Está pesquisando orçamentos em várias clínicas.",
      perfil_paciente: ["Comparando preços", "Tratamento extenso", "Primeira consulta"],
      pontos_de_dor: ["Restaurações escurecidas", "Dentes amarelados", "Orçamento limitado"],
      desejos_e_referencias: ["Sorriso mais jovem", "Dentes brancos", "Bom custo-benefício"],
      abordagem_recomendada: "Apresentar plano de tratamento completo com opções de pagamento. Mostrar diferença de qualidade dos materiais. Oferecer desconto para tratamento completo na clínica.",
      estimatedValue: 2800
    }
  ];

  const handleLeadsClick = () => {
    // Navigate to conversations with leads filter
    console.log("Navigating to leads view");
  };

  const handleAppointmentsClick = () => {
    // Navigate to agenda view  
    console.log("Navigating to appointments view");
  };

  return {
    revenueData,
    conversionMetrics,
    opportunities,
    handleLeadsClick,
    handleAppointmentsClick
  };
};