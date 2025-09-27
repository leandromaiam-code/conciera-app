/**
 * Conciera v2.0 - Strategic Briefing System
 * Data structures for AI-powered patient insights and opportunity management
 */

export interface OpportunityBriefing {
  id: string;
  resumo_conversa: string;
  perfil_paciente: string[];
  pontos_de_dor: string[];
  desejos_e_referencias: string[];
  abordagem_recomendada: string;
  temperatura_lead: 1 | 2 | 3; // 1=Frio, 2=Morno, 3=Quente
  valor_estimado: number;
  servico_desejado: string;
  nome_completo: string;
  data_hora: string;
}

export interface RevenueMetrics {
  rpg_mensal: number; // Receita de Pipeline Gerado
  rpg_diario: number;
  valor_medio_consulta: number;
  sparkline_30d: number[];
}

export interface ConversionFunnel {
  novos_leads_hoje: number;
  agendamentos_hoje: number;
  taxa_conversao: number;
  leads_trend: number; // % change from yesterday
  agendamentos_trend: number;
}

export interface OpportunityItem {
  id: string;
  nome_completo: string;
  procedimento: string;
  horario: string;
  temperatura_lead: 1 | 2 | 3;
  valor_estimado: number;
  briefing?: OpportunityBriefing;
}