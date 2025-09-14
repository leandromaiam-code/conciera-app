export interface OpportunityBrief {
  id: string;
  patientName: string;
  procedure: string;
  scheduledTime: Date;
  temperature: 1 | 2 | 3; // 1 = cold, 2 = warm, 3 = hot
  resumo_conversa: string;
  perfil_paciente: string[];
  pontos_de_dor: string[];
  desejos_e_referencias: string[];
  abordagem_recomendada: string;
  estimatedValue: number;
}

export interface ConversionMetrics {
  newLeads: number;
  scheduledAppointments: number;
  conversionRate: number;
}

export interface RevenueData {
  currentMonthRPG: number;
  rpgTrend: number[];
  averageConsultationValue: number;
}