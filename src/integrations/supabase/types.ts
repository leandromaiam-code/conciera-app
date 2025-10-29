export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_conversas_diarias: {
        Row: {
          agendamentos_gerados_hoje: number | null
          conversas_novas_hoje: number | null
          created_at: string | null
          data_referencia: string
          empresa_id: number
          funcionaria_id: number
          id: number
          tempo_medio_resposta_hoje: number | null
          updated_at: string | null
        }
        Insert: {
          agendamentos_gerados_hoje?: number | null
          conversas_novas_hoje?: number | null
          created_at?: string | null
          data_referencia: string
          empresa_id: number
          funcionaria_id: number
          id?: number
          tempo_medio_resposta_hoje?: number | null
          updated_at?: string | null
        }
        Update: {
          agendamentos_gerados_hoje?: number | null
          conversas_novas_hoje?: number | null
          created_at?: string | null
          data_referencia?: string
          empresa_id?: number
          funcionaria_id?: number
          id?: number
          tempo_medio_resposta_hoje?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_conversas_metricas: {
        Row: {
          ano_mes: string
          conversas_com_agendamento: number | null
          conversas_email: number | null
          conversas_finalizadas: number | null
          conversas_iniciadas: number | null
          conversas_instagram: number | null
          conversas_telefone: number | null
          conversas_whatsapp: number | null
          created_at: string | null
          empresa_id: number
          funcionaria_id: number
          id: number
          satisfacao_media: number | null
          taxa_conversao_agendamento: number | null
          taxa_resposta_rapida: number | null
          tempo_medio_primeira_resposta_segundos: number | null
          tempo_medio_resolucao_minutos: number | null
          total_conversas: number | null
          updated_at: string | null
        }
        Insert: {
          ano_mes: string
          conversas_com_agendamento?: number | null
          conversas_email?: number | null
          conversas_finalizadas?: number | null
          conversas_iniciadas?: number | null
          conversas_instagram?: number | null
          conversas_telefone?: number | null
          conversas_whatsapp?: number | null
          created_at?: string | null
          empresa_id: number
          funcionaria_id: number
          id?: number
          satisfacao_media?: number | null
          taxa_conversao_agendamento?: number | null
          taxa_resposta_rapida?: number | null
          tempo_medio_primeira_resposta_segundos?: number | null
          tempo_medio_resolucao_minutos?: number | null
          total_conversas?: number | null
          updated_at?: string | null
        }
        Update: {
          ano_mes?: string
          conversas_com_agendamento?: number | null
          conversas_email?: number | null
          conversas_finalizadas?: number | null
          conversas_iniciadas?: number | null
          conversas_instagram?: number | null
          conversas_telefone?: number | null
          conversas_whatsapp?: number | null
          created_at?: string | null
          empresa_id?: number
          funcionaria_id?: number
          id?: number
          satisfacao_media?: number | null
          taxa_conversao_agendamento?: number | null
          taxa_resposta_rapida?: number | null
          tempo_medio_primeira_resposta_segundos?: number | null
          tempo_medio_resolucao_minutos?: number | null
          total_conversas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_metricas_mensais_vendas: {
        Row: {
          agendamentos_hoje: number | null
          agendamentos_trend: number | null
          ano_mes: string
          clientes_diferentes: number | null
          clientes_novos: number | null
          clientes_recorrentes: number | null
          conversas_finalizadas: number | null
          conversas_iniciadas: number | null
          created_at: string | null
          data_ultimo_atendimento: string | null
          dia_semana_mais_ativo: string | null
          funcionaria_id: number
          hora_pico_fim: string | null
          hora_pico_inicio: string | null
          id: number
          leads_indicacao: number | null
          leads_instagram: number | null
          leads_outros: number | null
          leads_trend: number | null
          leads_whatsapp: number | null
          media_qtde_msg_por_cliente: number | null
          mensagens_ai: number | null
          mensagens_clientes: number | null
          novos_leads_hoje: number | null
          primeira_mensagem_mes: string | null
          rpg_diario: number | null
          rpg_mensal: number | null
          sparkline_30d: Json | null
          taxa_conversao: number | null
          taxa_resposta_rapida: number | null
          tempo_medio_atendimento_minutos: number | null
          tempo_medio_resposta_segundos: number | null
          total_mensagens: number | null
          ultima_mensagem_mes: string | null
          updated_at: string | null
          valor_medio_consulta: number | null
        }
        Insert: {
          agendamentos_hoje?: number | null
          agendamentos_trend?: number | null
          ano_mes: string
          clientes_diferentes?: number | null
          clientes_novos?: number | null
          clientes_recorrentes?: number | null
          conversas_finalizadas?: number | null
          conversas_iniciadas?: number | null
          created_at?: string | null
          data_ultimo_atendimento?: string | null
          dia_semana_mais_ativo?: string | null
          funcionaria_id: number
          hora_pico_fim?: string | null
          hora_pico_inicio?: string | null
          id?: number
          leads_indicacao?: number | null
          leads_instagram?: number | null
          leads_outros?: number | null
          leads_trend?: number | null
          leads_whatsapp?: number | null
          media_qtde_msg_por_cliente?: number | null
          mensagens_ai?: number | null
          mensagens_clientes?: number | null
          novos_leads_hoje?: number | null
          primeira_mensagem_mes?: string | null
          rpg_diario?: number | null
          rpg_mensal?: number | null
          sparkline_30d?: Json | null
          taxa_conversao?: number | null
          taxa_resposta_rapida?: number | null
          tempo_medio_atendimento_minutos?: number | null
          tempo_medio_resposta_segundos?: number | null
          total_mensagens?: number | null
          ultima_mensagem_mes?: string | null
          updated_at?: string | null
          valor_medio_consulta?: number | null
        }
        Update: {
          agendamentos_hoje?: number | null
          agendamentos_trend?: number | null
          ano_mes?: string
          clientes_diferentes?: number | null
          clientes_novos?: number | null
          clientes_recorrentes?: number | null
          conversas_finalizadas?: number | null
          conversas_iniciadas?: number | null
          created_at?: string | null
          data_ultimo_atendimento?: string | null
          dia_semana_mais_ativo?: string | null
          funcionaria_id?: number
          hora_pico_fim?: string | null
          hora_pico_inicio?: string | null
          id?: number
          leads_indicacao?: number | null
          leads_instagram?: number | null
          leads_outros?: number | null
          leads_trend?: number | null
          leads_whatsapp?: number | null
          media_qtde_msg_por_cliente?: number | null
          mensagens_ai?: number | null
          mensagens_clientes?: number | null
          novos_leads_hoje?: number | null
          primeira_mensagem_mes?: string | null
          rpg_diario?: number | null
          rpg_mensal?: number | null
          sparkline_30d?: Json | null
          taxa_conversao?: number | null
          taxa_resposta_rapida?: number | null
          tempo_medio_atendimento_minutos?: number | null
          tempo_medio_resposta_segundos?: number | null
          total_mensagens?: number | null
          ultima_mensagem_mes?: string | null
          updated_at?: string | null
          valor_medio_consulta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_vendas_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_procedimentos_vendas: {
        Row: {
          ano_mes: string
          created_at: string | null
          empresa_id: number
          id: number
          procedimento: string
          quantidade: number | null
          receita_total: number | null
          ticket_medio: number | null
          updated_at: string | null
        }
        Insert: {
          ano_mes: string
          created_at?: string | null
          empresa_id: number
          id?: number
          procedimento: string
          quantidade?: number | null
          receita_total?: number | null
          ticket_medio?: number | null
          updated_at?: string | null
        }
        Update: {
          ano_mes?: string
          created_at?: string | null
          empresa_id?: number
          id?: number
          procedimento?: string
          quantidade?: number | null
          receita_total?: number | null
          ticket_medio?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      config_audios: {
        Row: {
          created_at: string
          id: string
          name: string | null
          similarity_boost: string | null
          speed: string | null
          stability: string | null
          style: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          similarity_boost?: string | null
          speed?: string | null
          stability?: string | null
          style?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          similarity_boost?: string | null
          speed?: string | null
          stability?: string | null
          style?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      config_configuracoes_canais: {
        Row: {
          email_ativo: boolean
          formularios_ativo: boolean
          funcionaria_id: number
          id: number
          instagram_ativo: boolean
          instagram_conectado_em: string | null
          instagram_status: string | null
          instagram_username: string | null
          portal_ativo: boolean
          telefone_ativo: boolean
          updated_at: string | null
          whatsapp_ativo: boolean
          whatsapp_business_conectado_em: string | null
          whatsapp_business_status: string | null
          whatsapp_business_telefone: string | null
          whatsapp_web_conectado_em: string | null
          whatsapp_web_session_id: string | null
          whatsapp_web_status: string | null
          whatsapp_web_telefone: string | null
        }
        Insert: {
          email_ativo?: boolean
          formularios_ativo?: boolean
          funcionaria_id: number
          id?: number
          instagram_ativo?: boolean
          instagram_conectado_em?: string | null
          instagram_status?: string | null
          instagram_username?: string | null
          portal_ativo?: boolean
          telefone_ativo?: boolean
          updated_at?: string | null
          whatsapp_ativo?: boolean
          whatsapp_business_conectado_em?: string | null
          whatsapp_business_status?: string | null
          whatsapp_business_telefone?: string | null
          whatsapp_web_conectado_em?: string | null
          whatsapp_web_session_id?: string | null
          whatsapp_web_status?: string | null
          whatsapp_web_telefone?: string | null
        }
        Update: {
          email_ativo?: boolean
          formularios_ativo?: boolean
          funcionaria_id?: number
          id?: number
          instagram_ativo?: boolean
          instagram_conectado_em?: string | null
          instagram_status?: string | null
          instagram_username?: string | null
          portal_ativo?: boolean
          telefone_ativo?: boolean
          updated_at?: string | null
          whatsapp_ativo?: boolean
          whatsapp_business_conectado_em?: string | null
          whatsapp_business_status?: string | null
          whatsapp_business_telefone?: string | null
          whatsapp_web_conectado_em?: string | null
          whatsapp_web_session_id?: string | null
          whatsapp_web_status?: string | null
          whatsapp_web_telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_canais_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: true
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      config_configuracoes_sistema: {
        Row: {
          backup_automatico: boolean
          empresa_id: number
          id: number
          logs_detalhados: boolean
          notificacoes_email: boolean
          notificacoes_push: boolean
          updated_at: string | null
        }
        Insert: {
          backup_automatico?: boolean
          empresa_id: number
          id?: number
          logs_detalhados?: boolean
          notificacoes_email?: boolean
          notificacoes_push?: boolean
          updated_at?: string | null
        }
        Update: {
          backup_automatico?: boolean
          empresa_id?: number
          id?: number
          logs_detalhados?: boolean
          notificacoes_email?: boolean
          notificacoes_push?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_sistema_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      config_detalhes_produtos_servicos: {
        Row: {
          content: Json | null
          created_at: string
          embedding: string | null
          funcionaria_id: number | null
          id: number
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          embedding?: string | null
          funcionaria_id?: number | null
          id?: number
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          embedding?: string | null
          funcionaria_id?: number | null
          id?: number
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_produtos_precos_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      config_estilo_funcionaria: {
        Row: {
          audio_id: string | null
          created_at: string
          enviar_audio: string | null
          explicacao_detalhada: number | null
          explicacao_direta: number | null
          funcionaria_id: number | null
          id: number
          idioma_nativo: string | null
          linguagem_coloquial: number | null
          linguagem_sofisticada: number | null
          persuasao_forte: number | null
          persuasao_informativo: number | null
          postura_especialista: number | null
          postura_intima: number | null
          tom_bem_humorado: number | null
          tom_formal: number | null
          updated_at: string
        }
        Insert: {
          audio_id?: string | null
          created_at?: string
          enviar_audio?: string | null
          explicacao_detalhada?: number | null
          explicacao_direta?: number | null
          funcionaria_id?: number | null
          id?: number
          idioma_nativo?: string | null
          linguagem_coloquial?: number | null
          linguagem_sofisticada?: number | null
          persuasao_forte?: number | null
          persuasao_informativo?: number | null
          postura_especialista?: number | null
          postura_intima?: number | null
          tom_bem_humorado?: number | null
          tom_formal?: number | null
          updated_at?: string
        }
        Update: {
          audio_id?: string | null
          created_at?: string
          enviar_audio?: string | null
          explicacao_detalhada?: number | null
          explicacao_direta?: number | null
          funcionaria_id?: number | null
          id?: number
          idioma_nativo?: string | null
          linguagem_coloquial?: number | null
          linguagem_sofisticada?: number | null
          persuasao_forte?: number | null
          persuasao_informativo?: number | null
          postura_especialista?: number | null
          postura_intima?: number | null
          tom_bem_humorado?: number | null
          tom_formal?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estilo_funcionaria_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      config_funcionaria_virtual: {
        Row: {
          agenda: string | null
          created_at: string
          descricao_beneficios: string | null
          empresa_id: number | null
          enable: boolean | null
          equipe: string
          id: number
          modo_treinamento: string | null
          nome: string
          objetivo: string
          telefone_agente: string | null
          telefone_referencia: string | null
          ultima_prospeccao: string | null
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          created_at?: string
          descricao_beneficios?: string | null
          empresa_id?: number | null
          enable?: boolean | null
          equipe: string
          id?: number
          modo_treinamento?: string | null
          nome: string
          objetivo: string
          telefone_agente?: string | null
          telefone_referencia?: string | null
          ultima_prospeccao?: string | null
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          created_at?: string
          descricao_beneficios?: string | null
          empresa_id?: number | null
          enable?: boolean | null
          equipe?: string
          id?: number
          modo_treinamento?: string | null
          nome?: string
          objetivo?: string
          telefone_agente?: string | null
          telefone_referencia?: string | null
          ultima_prospeccao?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funcionaria_virtual_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      config_ignore_list: {
        Row: {
          contato_bloqueado: string | null
          created_at: string
          funcionaria_id: number | null
          id: number
          updated_at: string
        }
        Insert: {
          contato_bloqueado?: string | null
          created_at?: string
          funcionaria_id?: number | null
          id?: never
          updated_at?: string
        }
        Update: {
          contato_bloqueado?: string | null
          created_at?: string
          funcionaria_id?: number | null
          id?: never
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ignore_list_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      config_instance: {
        Row: {
          created_at: string
          empresa_id: number | null
          funcionaria_id: number | null
          id: number
          instance_name: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          empresa_id?: number | null
          funcionaria_id?: number | null
          id?: number
          instance_name?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: number | null
          funcionaria_id?: number | null
          id?: number
          instance_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      config_playbooks: {
        Row: {
          created_at: string | null
          descricao: string | null
          empresa_id: number
          funcionaria_id: number | null
          id: number
          nome: string
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          empresa_id: number
          funcionaria_id?: number | null
          id?: number
          nome: string
          status?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          empresa_id?: number
          funcionaria_id?: number | null
          id?: number
          nome?: string
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      config_playbooks_control: {
        Row: {
          agendamento_id: number | null
          cliente_id: number | null
          conversa_id: number | null
          created_at: string | null
          data_execucao: string | null
          data_programada: string | null
          id: number
          mensagem_enviada: string | null
          message_id: number | null
          playbook_id: number
          resultado: Json | null
          status: string
          step_id: number | null
        }
        Insert: {
          agendamento_id?: number | null
          cliente_id?: number | null
          conversa_id?: number | null
          created_at?: string | null
          data_execucao?: string | null
          data_programada?: string | null
          id?: number
          mensagem_enviada?: string | null
          message_id?: number | null
          playbook_id: number
          resultado?: Json | null
          status?: string
          step_id?: number | null
        }
        Update: {
          agendamento_id?: number | null
          cliente_id?: number | null
          conversa_id?: number | null
          created_at?: string | null
          data_execucao?: string | null
          data_programada?: string | null
          id?: number
          mensagem_enviada?: string | null
          message_id?: number | null
          playbook_id?: number
          resultado?: Json | null
          status?: string
          step_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "config_playbooks_control_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "core_agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_playbooks_control_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "core_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_playbooks_control_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "core_conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_playbooks_control_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "v_cliente_id_inconsistencias"
            referencedColumns: ["conversa_id"]
          },
          {
            foreignKeyName: "config_playbooks_control_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_detalhadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_playbooks_control_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "config_playbooks_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_playbooks_control_playbook_id_fkey"
            columns: ["playbook_id"]
            isOneToOne: false
            referencedRelation: "config_playbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_playbooks_control_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "config_playbooks_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      config_playbooks_messages: {
        Row: {
          ativo: boolean | null
          conteudo: string
          created_at: string | null
          id: number
          peso_distribuicao: number | null
          step_id: number
          updated_at: string | null
          variacao_numero: number
        }
        Insert: {
          ativo?: boolean | null
          conteudo: string
          created_at?: string | null
          id?: number
          peso_distribuicao?: number | null
          step_id: number
          updated_at?: string | null
          variacao_numero: number
        }
        Update: {
          ativo?: boolean | null
          conteudo?: string
          created_at?: string | null
          id?: number
          peso_distribuicao?: number | null
          step_id?: number
          updated_at?: string | null
          variacao_numero?: number
        }
        Relationships: [
          {
            foreignKeyName: "config_playbooks_messages_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "config_playbooks_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      config_playbooks_steps: {
        Row: {
          ativo: boolean | null
          condicoes: Json | null
          created_at: string | null
          id: number
          momento_execucao: Json
          nome_passo: string
          ordem: number
          playbook_id: number
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          condicoes?: Json | null
          created_at?: string | null
          id?: number
          momento_execucao?: Json
          nome_passo: string
          ordem: number
          playbook_id: number
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          condicoes?: Json | null
          created_at?: string | null
          id?: number
          momento_execucao?: Json
          nome_passo?: string
          ordem?: number
          playbook_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "config_playbooks_steps_playbook_id_fkey"
            columns: ["playbook_id"]
            isOneToOne: false
            referencedRelation: "config_playbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      config_script_vendas: {
        Row: {
          agendamento: string | null
          apresentacao_frase: string
          categoria: string | null
          created_at: string
          data: string
          descricao: string | null
          empresa_id: number
          empresa_nome: string
          fechamento_frase: string
          foco: string
          funcionaria_id: number
          id: number
          nome_agente: string
          objetivo: string
          personalidade: string | null
          script_agendamento: string | null
          script_apresentacao_produto_servico: string | null
          script_completo: string | null
          script_fechamento: string | null
          script_fechamento2: string | null
          script_implicacao: string | null
          script_implicacao_conexao: string | null
          script_necessidade: string | null
          script_necessidade_conexao: string | null
          script_problema: string | null
          script_problema_conexao: string | null
          script_qualificacao: string | null
          script_situacao: string | null
          script_situacao_conexao: string | null
          servico_produto: string
          status: string | null
          tipo_fechamento: string | null
          updated_at: string
        }
        Insert: {
          agendamento?: string | null
          apresentacao_frase: string
          categoria?: string | null
          created_at?: string
          data: string
          descricao?: string | null
          empresa_id: number
          empresa_nome: string
          fechamento_frase: string
          foco: string
          funcionaria_id: number
          id?: number
          nome_agente: string
          objetivo: string
          personalidade?: string | null
          script_agendamento?: string | null
          script_apresentacao_produto_servico?: string | null
          script_completo?: string | null
          script_fechamento?: string | null
          script_fechamento2?: string | null
          script_implicacao?: string | null
          script_implicacao_conexao?: string | null
          script_necessidade?: string | null
          script_necessidade_conexao?: string | null
          script_problema?: string | null
          script_problema_conexao?: string | null
          script_qualificacao?: string | null
          script_situacao?: string | null
          script_situacao_conexao?: string | null
          servico_produto: string
          status?: string | null
          tipo_fechamento?: string | null
          updated_at?: string
        }
        Update: {
          agendamento?: string | null
          apresentacao_frase?: string
          categoria?: string | null
          created_at?: string
          data?: string
          descricao?: string | null
          empresa_id?: number
          empresa_nome?: string
          fechamento_frase?: string
          foco?: string
          funcionaria_id?: number
          id?: number
          nome_agente?: string
          objetivo?: string
          personalidade?: string | null
          script_agendamento?: string | null
          script_apresentacao_produto_servico?: string | null
          script_completo?: string | null
          script_fechamento?: string | null
          script_fechamento2?: string | null
          script_implicacao?: string | null
          script_implicacao_conexao?: string | null
          script_necessidade?: string | null
          script_necessidade_conexao?: string | null
          script_problema?: string | null
          script_problema_conexao?: string | null
          script_qualificacao?: string | null
          script_situacao?: string | null
          script_situacao_conexao?: string | null
          servico_produto?: string
          status?: string | null
          tipo_fechamento?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_vendas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_vendas_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      config_translations: {
        Row: {
          chave: string
          created_at: string
          id: number
          idioma: string
          updated_at: string
          valor: string
        }
        Insert: {
          chave: string
          created_at?: string
          id?: number
          idioma: string
          updated_at?: string
          valor: string
        }
        Update: {
          chave?: string
          created_at?: string
          id?: number
          idioma?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      core_agendamentos: {
        Row: {
          cliente_id: number
          compareceu: boolean | null
          conversa_id: number | null
          created_at: string | null
          data_hora: string
          empresa_id: number
          id: number
          id_agenda: string | null
          notas: string | null
          origem_lead: string | null
          servico_interesse: string
          status: string
          valor_estimado: number | null
        }
        Insert: {
          cliente_id: number
          compareceu?: boolean | null
          conversa_id?: number | null
          created_at?: string | null
          data_hora: string
          empresa_id: number
          id?: number
          id_agenda?: string | null
          notas?: string | null
          origem_lead?: string | null
          servico_interesse: string
          status?: string
          valor_estimado?: number | null
        }
        Update: {
          cliente_id?: number
          compareceu?: boolean | null
          conversa_id?: number | null
          created_at?: string | null
          data_hora?: string
          empresa_id?: number
          id?: number
          id_agenda?: string | null
          notas?: string | null
          origem_lead?: string | null
          servico_interesse?: string
          status?: string
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "core_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "core_conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "v_cliente_id_inconsistencias"
            referencedColumns: ["conversa_id"]
          },
          {
            foreignKeyName: "agendamentos_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_detalhadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      core_arquivos: {
        Row: {
          caminho_arquivo: string
          created_at: string
          data_upload: string | null
          empresa_id: number | null
          funcionaria_id: number | null
          id: number
          nome_arquivo: string
          updated_at: string
        }
        Insert: {
          caminho_arquivo: string
          created_at?: string
          data_upload?: string | null
          empresa_id?: number | null
          funcionaria_id?: number | null
          id?: number
          nome_arquivo: string
          updated_at?: string
        }
        Update: {
          caminho_arquivo?: string
          created_at?: string
          data_upload?: string | null
          empresa_id?: number | null
          funcionaria_id?: number | null
          id?: number
          nome_arquivo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      core_briefings: {
        Row: {
          abordagem_recomendada: string | null
          agendamento_id: number
          created_at: string | null
          desejos_e_referencias: Json | null
          id: number
          perfil_paciente: Json | null
          pontos_de_dor: Json | null
          resumo_conversa: string | null
          servico_desejado: string | null
          temperatura_lead: number | null
        }
        Insert: {
          abordagem_recomendada?: string | null
          agendamento_id: number
          created_at?: string | null
          desejos_e_referencias?: Json | null
          id?: number
          perfil_paciente?: Json | null
          pontos_de_dor?: Json | null
          resumo_conversa?: string | null
          servico_desejado?: string | null
          temperatura_lead?: number | null
        }
        Update: {
          abordagem_recomendada?: string | null
          agendamento_id?: number
          created_at?: string | null
          desejos_e_referencias?: Json | null
          id?: number
          perfil_paciente?: Json | null
          pontos_de_dor?: Json | null
          resumo_conversa?: string | null
          servico_desejado?: string | null
          temperatura_lead?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "briefings_ia_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: true
            referencedRelation: "core_agendamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      core_clientes: {
        Row: {
          cidade: string | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          "e-mail": string | null
          empresa_id: number
          estado: string | null
          genero: string | null
          historico_procedimentos: Json | null
          id: number
          interesses_declarados: Json | null
          nome_completo: string | null
          objecoes_comuns: Json | null
          perfil_comportamental: Json | null
          telefone: string
        }
        Insert: {
          cidade?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          "e-mail"?: string | null
          empresa_id: number
          estado?: string | null
          genero?: string | null
          historico_procedimentos?: Json | null
          id?: number
          interesses_declarados?: Json | null
          nome_completo?: string | null
          objecoes_comuns?: Json | null
          perfil_comportamental?: Json | null
          telefone: string
        }
        Update: {
          cidade?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          "e-mail"?: string | null
          empresa_id?: number
          estado?: string | null
          genero?: string | null
          historico_procedimentos?: Json | null
          id?: number
          interesses_declarados?: Json | null
          nome_completo?: string | null
          objecoes_comuns?: Json | null
          perfil_comportamental?: Json | null
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      core_conversas: {
        Row: {
          canal: string
          cliente_id: number | null
          contagem_mensagens: number
          created_at: string | null
          funcionaria_id: number
          id: number
          session_id: string | null
          status: string
          timestamp_ultima_mensagem: string | null
          ultima_mensagem_preview: string | null
        }
        Insert: {
          canal: string
          cliente_id?: number | null
          contagem_mensagens?: number
          created_at?: string | null
          funcionaria_id: number
          id?: number
          session_id?: string | null
          status: string
          timestamp_ultima_mensagem?: string | null
          ultima_mensagem_preview?: string | null
        }
        Update: {
          canal?: string
          cliente_id?: number | null
          contagem_mensagens?: number
          created_at?: string | null
          funcionaria_id?: number
          id?: number
          session_id?: string | null
          status?: string
          timestamp_ultima_mensagem?: string | null
          ultima_mensagem_preview?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "core_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      core_empresa: {
        Row: {
          autoridade_empresa: string | null
          beneficios_produto: string | null
          cliente_ideal: string | null
          created_at: string
          descricao: string
          dores_cliente: string | null
          email_contato: string | null
          endereco_empresa: string | null
          forma_venda: string
          horario_atendimento: string | null
          id: number
          nome: string
          preco_consulta: string | null
          problema_cliente: string | null
          profissionais_empresa: string | null
          segmento: string
          segmento_especifico: string | null
          servicos: string | null
          telefone: string | null
          tipo_produto: string
          updated_at: string
        }
        Insert: {
          autoridade_empresa?: string | null
          beneficios_produto?: string | null
          cliente_ideal?: string | null
          created_at?: string
          descricao: string
          dores_cliente?: string | null
          email_contato?: string | null
          endereco_empresa?: string | null
          forma_venda: string
          horario_atendimento?: string | null
          id?: number
          nome: string
          preco_consulta?: string | null
          problema_cliente?: string | null
          profissionais_empresa?: string | null
          segmento: string
          segmento_especifico?: string | null
          servicos?: string | null
          telefone?: string | null
          tipo_produto: string
          updated_at?: string
        }
        Update: {
          autoridade_empresa?: string | null
          beneficios_produto?: string | null
          cliente_ideal?: string | null
          created_at?: string
          descricao?: string
          dores_cliente?: string | null
          email_contato?: string | null
          endereco_empresa?: string | null
          forma_venda?: string
          horario_atendimento?: string | null
          id?: number
          nome?: string
          preco_consulta?: string | null
          problema_cliente?: string | null
          profissionais_empresa?: string | null
          segmento?: string
          segmento_especifico?: string | null
          servicos?: string | null
          telefone?: string | null
          tipo_produto?: string
          updated_at?: string
        }
        Relationships: []
      }
      core_tasks: {
        Row: {
          categoria: string
          cliente_id: number | null
          created_at: string | null
          descricao: string | null
          empresa_id: number
          funcionaria_id: number | null
          id: number
          prazo: string | null
          prioridade: string
          status: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          categoria?: string
          cliente_id?: number | null
          created_at?: string | null
          descricao?: string | null
          empresa_id: number
          funcionaria_id?: number | null
          id?: number
          prazo?: string | null
          prioridade?: string
          status?: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          categoria?: string
          cliente_id?: number | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: number
          funcionaria_id?: number | null
          id?: number
          prazo?: string | null
          prioridade?: string
          status?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "core_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      core_user_connections: {
        Row: {
          access_token_encrypted: string
          connected_at: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          metadata: Json | null
          provider: string
          provider_user_id: string
          provider_username: string | null
          refresh_token_encrypted: string | null
          scopes: Json | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token_encrypted: string
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          provider: string
          provider_user_id: string
          provider_username?: string | null
          refresh_token_encrypted?: string | null
          scopes?: Json | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token_encrypted?: string
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          metadata?: Json | null
          provider?: string
          provider_user_id?: string
          provider_username?: string | null
          refresh_token_encrypted?: string | null
          scopes?: Json | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      core_users: {
        Row: {
          auth_id: string | null
          cpf: string | null
          created_at: string
          data_cadastro: string
          email: string | null
          empresa_id: number | null
          endereço: string | null
          etapa: string | null
          id: number
          nome: string | null
          plano: string | null
          senha: string | null
          status: string | null
          telefone: string | null
          ultimo_acesso: string | null
          ultimo_contato: string | null
          updated_at: string
          vencimento: string | null
          whatsapp: string | null
        }
        Insert: {
          auth_id?: string | null
          cpf?: string | null
          created_at?: string
          data_cadastro?: string
          email?: string | null
          empresa_id?: number | null
          endereço?: string | null
          etapa?: string | null
          id?: never
          nome?: string | null
          plano?: string | null
          senha?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          ultimo_contato?: string | null
          updated_at?: string
          vencimento?: string | null
          whatsapp?: string | null
        }
        Update: {
          auth_id?: string | null
          cpf?: string | null
          created_at?: string
          data_cadastro?: string
          email?: string | null
          empresa_id?: number | null
          endereço?: string | null
          etapa?: string | null
          id?: never
          nome?: string | null
          plano?: string | null
          senha?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          ultimo_contato?: string | null
          updated_at?: string
          vencimento?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystem_paciente_clinica_vinculos: {
        Row: {
          empresa_id: number
          id: number
          paciente_global_id: number
          primeiro_contato: string | null
          status_relacionamento: string | null
          ultimo_contato: string | null
        }
        Insert: {
          empresa_id: number
          id?: number
          paciente_global_id: number
          primeiro_contato?: string | null
          status_relacionamento?: string | null
          ultimo_contato?: string | null
        }
        Update: {
          empresa_id?: number
          id?: number
          paciente_global_id?: number
          primeiro_contato?: string | null
          status_relacionamento?: string | null
          ultimo_contato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paciente_clinica_vinculos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "core_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paciente_clinica_vinculos_paciente_global_id_fkey"
            columns: ["paciente_global_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_pacientes_global"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystem_pacientes_global: {
        Row: {
          auth_id: string | null
          cidade: string | null
          consentimentos: Json | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          estado: string | null
          genero: string | null
          historico_procedimentos_agregado: Json | null
          id: number
          interesses_declarados_agregado: Json | null
          nome_completo: string | null
          perfil_comportamental: Json | null
          preferencias_comunicacao: Json | null
          telefone: string | null
        }
        Insert: {
          auth_id?: string | null
          cidade?: string | null
          consentimentos?: Json | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          genero?: string | null
          historico_procedimentos_agregado?: Json | null
          id?: number
          interesses_declarados_agregado?: Json | null
          nome_completo?: string | null
          perfil_comportamental?: Json | null
          preferencias_comunicacao?: Json | null
          telefone?: string | null
        }
        Update: {
          auth_id?: string | null
          cidade?: string | null
          consentimentos?: Json | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          genero?: string | null
          historico_procedimentos_agregado?: Json | null
          id?: number
          interesses_declarados_agregado?: Json | null
          nome_completo?: string | null
          perfil_comportamental?: Json | null
          preferencias_comunicacao?: Json | null
          telefone?: string | null
        }
        Relationships: []
      }
      ingestion_memoria_clientes_historico_01: {
        Row: {
          canal: string | null
          cliente_id: number | null
          content_text: string | null
          created_at: string | null
          funcionaria_id: number | null
          id: number
          message: Json
          role: string | null
          session_id: string
          telefone: string | null
        }
        Insert: {
          canal?: string | null
          cliente_id?: number | null
          content_text?: string | null
          created_at?: string | null
          funcionaria_id?: number | null
          id?: number
          message: Json
          role?: string | null
          session_id: string
          telefone?: string | null
        }
        Update: {
          canal?: string | null
          cliente_id?: number | null
          content_text?: string | null
          created_at?: string | null
          funcionaria_id?: number | null
          id?: number
          message?: Json
          role?: string | null
          session_id?: string
          telefone?: string | null
        }
        Relationships: []
      }
      ingestion_memoria_simulacao: {
        Row: {
          created_at: string | null
          funcionaria_id: number | null
          id: number
          message: Json
          message_text: string | null
          role: string | null
          session_id: string
          tel_cliente: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          funcionaria_id?: number | null
          id?: number
          message: Json
          message_text?: string | null
          role?: string | null
          session_id: string
          tel_cliente?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          funcionaria_id?: number | null
          id?: number
          message?: Json
          message_text?: string | null
          role?: string | null
          session_id?: string
          tel_cliente?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memoria_sofia_teste_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_webhook_logs: {
        Row: {
          created_at: string
          dados: Json | null
          event: string | null
          evento: string | null
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dados?: Json | null
          event?: string | null
          evento?: string | null
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dados?: Json | null
          event?: string | null
          evento?: string | null
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      memoria_clientes_historico_01: {
        Row: {
          canal: string | null
          cliente_id: number | null
          content_text: string | null
          created_at: string | null
          funcionaria_id: number | null
          id: number
          message: Json
          role: string | null
          session_id: string
          telefone: string | null
        }
        Insert: {
          canal?: string | null
          cliente_id?: number | null
          content_text?: string | null
          created_at?: string | null
          funcionaria_id?: number | null
          id?: number
          message: Json
          role?: string | null
          session_id: string
          telefone?: string | null
        }
        Update: {
          canal?: string | null
          cliente_id?: number | null
          content_text?: string | null
          created_at?: string | null
          funcionaria_id?: number | null
          id?: number
          message?: Json
          role?: string | null
          session_id?: string
          telefone?: string | null
        }
        Relationships: []
      }
      memoria_simulacao_historico_01: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_cliente_id_inconsistencias: {
        Row: {
          conversa_cliente_id: number | null
          conversa_cliente_nome: string | null
          conversa_cliente_telefone: string | null
          conversa_criada_em: string | null
          conversa_id: number | null
          memoria_cliente_id: number | null
          memoria_cliente_nome: string | null
          memoria_cliente_telefone: string | null
          session_id: string | null
          total_mensagens: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_cliente_id_fkey"
            columns: ["conversa_cliente_id"]
            isOneToOne: false
            referencedRelation: "core_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      v_conversas_detalhadas: {
        Row: {
          canal: string | null
          cliente_id: number | null
          cliente_telefone: string | null
          contagem_mensagens: number | null
          created_at: string | null
          empresa_nome: string | null
          funcionaria_id: number | null
          funcionaria_nome: string | null
          id: number | null
          mensagens_ai: number | null
          mensagens_cliente: number | null
          nome_completo: string | null
          session_id: string | null
          status: string | null
          timestamp_ultima_mensagem: string | null
          total_mensagens_real: number | null
          ultima_mensagem_preview: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "core_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_funcionaria_id_fkey"
            columns: ["funcionaria_id"]
            isOneToOne: false
            referencedRelation: "config_funcionaria_virtual"
            referencedColumns: ["id"]
          },
        ]
      }
      v_mensagens_sem_cliente: {
        Row: {
          empresa_nome: string | null
          funcionaria_id: number | null
          funcionaria_nome: string | null
          primeira_mensagem: string | null
          telefone: string | null
          total_mensagens: number | null
          ultima_mensagem: string | null
          ultima_mensagem_texto: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calcular_metricas_conversas:
        | {
            Args: {
              ano_mes_param: string
              empresa_id_param: number
              funcionaria_id_param: number
            }
            Returns: undefined
          }
        | {
            Args: {
              ano_mes_param: string
              empresa_id_param: number
              funcionaria_id_param: number
            }
            Returns: undefined
          }
      calcular_rpg_mensal: {
        Args: { ano_mes_param: string; empresa_id_param: number }
        Returns: number
      }
      create_missing_conversas: {
        Args: never
        Returns: {
          mensagens_contadas: number
          session_id_criado: string
          telefone: string
        }[]
      }
      decrypt_token: { Args: { encrypted_token: string }; Returns: string }
      disconnect_user_connection: {
        Args: { p_provider: string; p_user_id: string }
        Returns: boolean
      }
      encrypt_token: { Args: { token: string }; Returns: string }
      fix_all_cliente_id_inconsistencies: {
        Args: never
        Returns: {
          conversas_corrigidas: number
          mensagens_corrigidas: number
        }[]
      }
      fix_conversas_cliente_zero: { Args: never; Returns: number }
      get_funcionaria_empresa_id: {
        Args: { _funcionaria_id: number }
        Returns: number
      }
      get_user_active_connections: {
        Args: { p_user_id: string }
        Returns: {
          connected_at: string
          id: string
          last_sync_at: string
          provider: string
          provider_user_id: string
          provider_username: string
          scopes: Json
        }[]
      }
      get_user_connection_token: {
        Args: { p_provider: string; p_user_id: string }
        Returns: {
          access_token: string
          metadata: Json
          provider_user_id: string
          refresh_token: string
        }[]
      }
      get_user_empresa_id: { Args: never; Returns: number }
      save_user_connection: {
        Args: {
          p_access_token: string
          p_metadata?: Json
          p_provider: string
          p_provider_user_id: string
          p_provider_username?: string
          p_refresh_token?: string
          p_scopes?: Json
          p_token_expires_at?: string
          p_user_id: string
        }
        Returns: string
      }
      vincular_cliente_memoria: {
        Args: {
          p_cliente_id: number
          p_funcionaria_id: number
          p_telefone: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
