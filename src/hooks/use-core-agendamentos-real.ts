import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CoreAgendamentos } from "@/types/briefing-types";

interface AgendamentoCompleto extends CoreAgendamentos {
  cliente_nome?: string;
  cliente_telefone?: string;
  briefing_temperatura_lead?: number;
}

interface UseCoreAgendamentosResult {
  agendamentos: AgendamentoCompleto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateAgendamento: (agendamentoId: bigint, data: Partial<CoreAgendamentos>) => Promise<void>;
}

export const useCoreAgendamentosReal = (
  dataInicio?: Date,
  dataFim?: Date,
  status?: string
): UseCoreAgendamentosResult => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando busca de agendamentos...');
      
      // Build query for agendamentos
      let query = supabase
        .from('core_agendamentos')
        .select('*')
        .order('data_hora', { ascending: true });

      // Apply filters
      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      if (dataInicio) {
        console.log('Filtrando por data início:', dataInicio.toISOString());
        query = query.gte('data_hora', dataInicio.toISOString());
      }

      if (dataFim) {
        console.log('Filtrando por data fim:', dataFim.toISOString());
        query = query.lte('data_hora', dataFim.toISOString());
      }

      console.log('Executando query...');
      const { data: agendamentosData, error: queryError } = await query;

      if (queryError) {
        console.error('Erro na query:', queryError);
        setError(`Erro ao carregar agendamentos: ${queryError.message}`);
        return;
      }

      console.log('Dados recebidos:', agendamentosData?.length || 0, 'agendamentos');

      if (!agendamentosData || agendamentosData.length === 0) {
        setAgendamentos([]);
        return;
      }

      // Get unique client IDs and agendamento IDs for batch queries
      const clienteIds = [...new Set(agendamentosData.map(a => a.cliente_id))];
      const agendamentoIds = agendamentosData.map(a => a.id);

      // Fetch clientes data
      const { data: clientesData } = await supabase
        .from('core_clientes')
        .select('id, nome_completo, telefone')
        .in('id', clienteIds);

      // Fetch briefings data  
      const { data: briefingsData } = await supabase
        .from('core_briefings')
        .select('agendamento_id, temperatura_lead')
        .in('agendamento_id', agendamentoIds);

      // Create lookup maps for faster access
      const clientesMap = new Map();
      clientesData?.forEach(cliente => {
        clientesMap.set(cliente.id, cliente);
      });

      const briefingsMap = new Map();
      briefingsData?.forEach(briefing => {
        briefingsMap.set(briefing.agendamento_id, briefing);
      });

      // Transform database data to match expected format
      const transformedAgendamentos: AgendamentoCompleto[] = agendamentosData.map(row => {
        const cliente = clientesMap.get(row.cliente_id);
        const briefing = briefingsMap.get(row.id);
        
        return {
          core_agendamentos_id: row.id?.toString() || '',
          core_agendamentos_conversa_id: row.conversa_id ? BigInt(row.conversa_id) : undefined,
          core_agendamentos_cliente_id: BigInt(row.cliente_id),
          core_agendamentos_empresa_id: row.empresa_id,
          core_agendamentos_data_hora: row.data_hora,
          core_agendamentos_servico_interesse: row.servico_interesse || '',
          core_agendamentos_status: row.status || 'pendente',
          core_agendamentos_valor_estimado: row.valor_estimado,
          core_agendamentos_compareceu: row.compareceu,
          core_agendamentos_id_agenda: row.id_agenda,
          core_agendamentos_created_at: row.created_at,
          // Client data from lookup
          core_clientes_nome_completo: cliente?.nome_completo || 'Cliente não informado',
          core_clientes_telefone: cliente?.telefone || '',
          cliente_nome: cliente?.nome_completo || 'Cliente não informado',
          cliente_telefone: cliente?.telefone || '',
          briefing_temperatura_lead: briefing?.temperatura_lead || 2
        };
      });

      setAgendamentos(transformedAgendamentos);
    } catch (err) {
      console.error('Erro inesperado ao buscar agendamentos:', err);
      setError(`Erro inesperado: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      console.log('Finalizando busca, setting loading = false');
      setLoading(false);
    }
  };

  const updateAgendamento = async (agendamentoId: bigint, updateData: Partial<CoreAgendamentos>) => {
    try {
      setError(null);

      // Transform frontend data back to database format
      const dbData: any = {};
      
      Object.keys(updateData).forEach(key => {
        const dbField = key.replace('core_agendamentos_', '');
        if (updateData[key as keyof CoreAgendamentos] !== undefined) {
          dbData[dbField] = updateData[key as keyof CoreAgendamentos];
        }
      });

      const { error: updateError } = await supabase
        .from('core_agendamentos')
        .update(dbData)
        .eq('id', Number(agendamentoId));

      if (updateError) {
        console.error('Erro ao atualizar agendamento:', updateError);
        setError('Erro ao atualizar agendamento');
        return;
      }

      // Refetch to get updated data
      await fetchAgendamentos();
      
      console.log('Agendamento atualizado com sucesso');
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      setError('Erro inesperado ao atualizar agendamento');
      throw err;
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('agendamentos-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'core_agendamentos'
      }, () => {
        // Refetch data when changes occur
        fetchAgendamentos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial load and refetch when filters change
  useEffect(() => {
    fetchAgendamentos();
  }, [dataInicio, dataFim, status]);

  return {
    agendamentos,
    loading,
    error,
    refetch: fetchAgendamentos,
    updateAgendamento
  };
};