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
  deleteAgendamento: (agendamentoId: bigint) => Promise<void>;
  marcarComparecimento: (agendamentoId: bigint, compareceu: boolean) => Promise<void>;
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
      
      let query = supabase
        .from('core_agendamentos')
        .select(`
          *,
          core_clientes (
            nome_completo,
            telefone
          ),
          core_briefings (
            temperatura_lead
          )
        `)
        .order('data_hora', { ascending: true });

      // Apply filters
      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      if (dataInicio) {
        query = query.gte('data_hora', dataInicio.toISOString());
      }

      if (dataFim) {
        query = query.lte('data_hora', dataFim.toISOString());
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Erro ao buscar agendamentos:', queryError);
        setError('Erro ao carregar agendamentos');
        return;
      }

      // Transform database data to match expected format
      const transformedAgendamentos: AgendamentoCompleto[] = (data || []).map(row => ({
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
        // Joined data with safer access
        core_clientes_nome_completo: Array.isArray(row.core_clientes) ? row.core_clientes[0]?.nome_completo : row.core_clientes?.nome_completo || 'Cliente não informado',
        core_clientes_telefone: Array.isArray(row.core_clientes) ? row.core_clientes[0]?.telefone : row.core_clientes?.telefone || '',
        cliente_nome: Array.isArray(row.core_clientes) ? row.core_clientes[0]?.nome_completo : row.core_clientes?.nome_completo || 'Cliente não informado',
        cliente_telefone: Array.isArray(row.core_clientes) ? row.core_clientes[0]?.telefone : row.core_clientes?.telefone || '',
        briefing_temperatura_lead: Array.isArray(row.core_briefings) ? row.core_briefings[0]?.temperatura_lead : row.core_briefings?.temperatura_lead || 2
      }));

      setAgendamentos(transformedAgendamentos);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar agendamentos');
    } finally {
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

  const deleteAgendamento = async (agendamentoId: bigint) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('core_agendamentos')
        .delete()
        .eq('id', Number(agendamentoId));

      if (deleteError) {
        console.error('Erro ao deletar agendamento:', deleteError);
        setError('Erro ao deletar agendamento');
        throw deleteError;
      }

      await fetchAgendamentos();
    } catch (err) {
      console.error('Erro ao deletar agendamento:', err);
      setError('Erro inesperado ao deletar agendamento');
      throw err;
    }
  };

  const marcarComparecimento = async (agendamentoId: bigint, compareceu: boolean) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('core_agendamentos')
        .update({ compareceu })
        .eq('id', Number(agendamentoId));

      if (updateError) {
        console.error('Erro ao marcar comparecimento:', updateError);
        setError('Erro ao marcar comparecimento');
        throw updateError;
      }

      await fetchAgendamentos();
    } catch (err) {
      console.error('Erro ao marcar comparecimento:', err);
      setError('Erro inesperado ao marcar comparecimento');
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
    updateAgendamento,
    deleteAgendamento,
    marcarComparecimento
  };
};