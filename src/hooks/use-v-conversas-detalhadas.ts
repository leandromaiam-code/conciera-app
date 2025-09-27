import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VConversasDetalhadas } from "@/types/briefing-types";

interface UseVConversasDetalhadasResult {
  conversas: VConversasDetalhadas[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateConversaStatus: (conversaId: bigint, novoStatus: string) => Promise<void>;
}

export const useVConversasDetalhadas = (
  searchTerm?: string,
  filterStatus?: string,
  filterCanal?: string
): UseVConversasDetalhadasResult => {
  const [conversas, setConversas] = useState<VConversasDetalhadas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('v_conversas_detalhadas')
        .select('*')
        .order('timestamp_ultima_mensagem', { ascending: false });

      // Apply filters
      if (filterStatus && filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }

      if (filterCanal && filterCanal !== 'todos') {
        query = query.eq('canal', filterCanal);
      }

      if (searchTerm && searchTerm.trim()) {
        query = query.or(
          `nome_completo.ilike.%${searchTerm}%,` +
          `cliente_telefone.ilike.%${searchTerm}%`
        );
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Erro ao buscar conversas:', queryError);
        setError('Erro ao carregar conversas');
        return;
      }

      // Transform database data to match expected format
      const transformedConversas: VConversasDetalhadas[] = (data || []).map(row => ({
        v_conversas_detalhadas_id: BigInt(row.id || 0),
        v_conversas_detalhadas_session_id: row.session_id || '',
        v_conversas_detalhadas_cliente_id: BigInt(row.cliente_id || 0),
        v_conversas_detalhadas_funcionaria_id: row.funcionaria_id || 0,
        v_conversas_detalhadas_canal: row.canal || '',
        v_conversas_detalhadas_status: row.status || '',
        v_conversas_detalhadas_ultima_mensagem_preview: row.ultima_mensagem_preview || '',
        v_conversas_detalhadas_timestamp_ultima_mensagem: row.timestamp_ultima_mensagem || '',
        v_conversas_detalhadas_nome_completo: row.nome_completo || '',
        v_conversas_detalhadas_cliente_telefone: row.cliente_telefone || '',
        v_conversas_detalhadas_funcionaria_nome: row.funcionaria_nome || '',
        v_conversas_detalhadas_empresa_nome: row.empresa_nome || '',
        v_conversas_detalhadas_contagem_mensagens: row.contagem_mensagens || 0,
        v_conversas_detalhadas_created_at: row.created_at || '',
        // UI fields - could be derived from other data or set as defaults
        ui_temperatura_lead: 2, // Default temperature
        ui_servico_desejado: 'Consulta' // Default service
      }));

      setConversas(transformedConversas);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const updateConversaStatus = async (conversaId: bigint, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('core_conversas')
        .update({ status: novoStatus })
        .eq('id', Number(conversaId));

      if (error) {
        console.error('Erro ao atualizar status da conversa:', error);
        throw new Error('Erro ao atualizar status da conversa');
      }

      // Refetch to get updated data
      await fetchConversas();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      throw err;
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('conversas-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'core_conversas'
      }, () => {
        // Refetch data when changes occur
        fetchConversas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial load and refetch when filters change
  useEffect(() => {
    fetchConversas();
  }, [searchTerm, filterStatus, filterCanal]);

  return {
    conversas,
    loading,
    error,
    refetch: fetchConversas,
    updateConversaStatus
  };
};