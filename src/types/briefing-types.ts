/**
 * Conciera v2.0 - Strategic Briefing System
 * Data structures following database table.column naming pattern
 */

// Core Briefings table
export interface CoreBriefings {
  core_briefings_id: string;
  core_briefings_agendamento_id: string;
  core_briefings_resumo_conversa: string;
  core_briefings_perfil_paciente: string[];
  core_briefings_pontos_de_dor: string[];
  core_briefings_desejos_e_referencias: string[];
  core_briefings_abordagem_recomendada: string;
  core_briefings_temperatura_lead: 1 | 2 | 3; // 1=Frio, 2=Morno, 3=Quente
  core_briefings_servico_desejado: string;
  core_briefings_created_at: string;
}

// Core Agendamentos table
export interface CoreAgendamentos {
  core_agendamentos_id: string;
  core_agendamentos_cliente_id: bigint;
  core_agendamentos_conversa_id?: bigint;
  core_agendamentos_empresa_id: number;
  core_agendamentos_data_hora: string;
  core_agendamentos_servico_interesse: string;
  core_agendamentos_status: string;
  core_agendamentos_valor_estimado?: number;
  core_agendamentos_compareceu?: boolean;
  core_agendamentos_id_agenda?: string;
  core_agendamentos_created_at?: string;
  // Related fields from JOIN tables
  core_clientes_nome_completo: string;
  core_clientes_telefone: string;
  core_briefings_temperatura_lead?: number;
  // UI derived fields
  ui_temperatura_lead?: 1 | 2 | 3;
}

// Analytics Metricas Mensais Vendas table
export interface AnalyticsMetricasMensaisVendas {
  analytics_metricas_mensal_vendas_rpg_mensal: number;
  analytics_metricas_mensal_vendas_rpg_diario: number;
  analytics_metricas_mensal_vendas_valor_medio_consulta: number;
  analytics_metricas_mensal_vendas_sparkline_30d: number[];
}

// Conversion Funnel (calculated metrics)
export interface ConversionFunnel {
  ui_novos_leads_hoje: number;
  ui_agendamentos_hoje: number;
  ui_taxa_conversao: number;
  ui_leads_trend: number; // % change from yesterday
  ui_agendamentos_trend: number;
}

// View: Conversas Detalhadas
export interface VConversasDetalhadas {
  v_conversas_detalhadas_id: bigint;
  v_conversas_detalhadas_session_id: string;
  v_conversas_detalhadas_cliente_id: bigint;
  v_conversas_detalhadas_funcionaria_id: number;
  v_conversas_detalhadas_canal: string;
  v_conversas_detalhadas_status: string;
  v_conversas_detalhadas_ultima_mensagem_preview: string;
  v_conversas_detalhadas_timestamp_ultima_mensagem: string;
  v_conversas_detalhadas_nome_completo: string;
  v_conversas_detalhadas_cliente_telefone: string;
  v_conversas_detalhadas_funcionaria_nome: string;
  v_conversas_detalhadas_empresa_nome: string;
  v_conversas_detalhadas_contagem_mensagens: number;
  v_conversas_detalhadas_created_at: string;
  // UI derived fields
  ui_temperatura_lead?: 1 | 2 | 3;
  ui_servico_desejado?: string;
}

// Config Script Vendas (Playbooks) table
export interface ConfigScriptVendas {
  config_script_vendas_id: string;
  config_script_vendas_funcionaria_id: number;
  config_script_vendas_empresa_id: number;
  config_script_vendas_objetivo: string;
  config_script_vendas_descricao: string;
  config_script_vendas_servico_produto: string;
  config_script_vendas_script_completo: string;
  config_script_vendas_personalidade: string;
  config_script_vendas_created_at: string;
  config_script_vendas_updated_at: string;
  // UI derived fields
  ui_categoria: 'captacao' | 'qualificacao' | 'agendamento' | 'nutricao';
  ui_status: 'ativo' | 'inativo' | 'teste';
  ui_conversas_utilizadas: number;
  ui_taxa_sucesso: number;
}

// Core Empresa table
export interface CoreEmpresa {
  core_empresa_id: number;
  core_empresa_nome: string;
  core_empresa_endereco_empresa?: string;
  core_empresa_preco_consulta?: string;
  core_empresa_profissionais_empresa?: string;
  core_empresa_descricao: string;
  core_empresa_segmento: string;
  core_empresa_segmento_especifico?: string;
  core_empresa_tipo_produto: string;
  core_empresa_forma_venda: string;
  core_empresa_telefone?: string;
  core_empresa_email_contato?: string;
  core_empresa_horario_atendimento?: string;
  core_empresa_autoridade_empresa?: string;
  core_empresa_beneficios_produto?: string;
  core_empresa_dores_cliente?: string;
  core_empresa_problema_cliente?: string;
  core_empresa_cliente_ideal?: string;
  core_empresa_servicos?: string;
  core_empresa_created_at: string;
  core_empresa_updated_at: string;
}

// Config Configuracoes Canais table
export interface ConfigConfiguracaoCanais {
  config_configuracoes_canais_id: string;
  config_configuracoes_canais_funcionaria_id: number;
  config_configuracoes_canais_whatsapp_ativo: boolean;
  config_configuracoes_canais_instagram_ativo: boolean;
  config_configuracoes_canais_email_ativo: boolean;
  config_configuracoes_canais_portal_ativo: boolean;
  config_configuracoes_canais_telefone_ativo: boolean;
  config_configuracoes_canais_formularios_ativo: boolean;
  config_configuracoes_canais_updated_at: string;
  // UI fields
  ui_nome: string;
  ui_tipo: 'instagram' | 'whatsapp' | 'email' | 'site';
  ui_status: 'conectado' | 'desconectado' | 'erro';
  ui_icon: any;
}

// Config Configuracoes Sistema table
export interface ConfigConfiguracoesSistema {
  config_configuracoes_sistema_id: bigint;
  config_configuracoes_sistema_empresa_id: number;
  config_configuracoes_sistema_notificacoes_push: boolean;
  config_configuracoes_sistema_notificacoes_email: boolean;
  config_configuracoes_sistema_backup_automatico: boolean;
  config_configuracoes_sistema_logs_detalhados: boolean;
  config_configuracoes_sistema_updated_at: string;
  // UI derived fields
  ui_auto_agendamento: boolean;
  ui_auto_pagamento: boolean;
}

// Legacy interfaces for backward compatibility (will be removed gradually)
export interface OpportunityBriefing extends CoreBriefings {
  id: string;
  resumo_conversa: string;
  perfil_paciente: string[];
  pontos_de_dor: string[];
  desejos_e_referencias: string[];
  abordagem_recomendada: string;
  temperatura_lead: 1 | 2 | 3;
  valor_estimado: number;
  servico_desejado: string;
  nome_completo: string;
  data_hora: string;
}

export interface RevenueMetrics extends AnalyticsMetricasMensaisVendas {
  rpg_mensal: number;
  rpg_diario: number;
  valor_medio_consulta: number;
  sparkline_30d: number[];
}

export interface OpportunityItem extends CoreAgendamentos {
  id: string;
  nome_completo: string;
  procedimento: string;
  horario: string;
  temperatura_lead: 1 | 2 | 3;
  valor_estimado: number;
  briefing?: OpportunityBriefing;
}