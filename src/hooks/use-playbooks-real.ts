import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Playbook {
  id: number;
  nome_agente: string;
  descricao: string | null;
  categoria: string;
  status: string;
  conversas_utilizadas: number;
  taxa_sucesso: number;
  criado_em: string;
  prompt_personalizado?: string;
  objetivo: string;
  empresa_nome: string;
}

export const usePlaybooksReal = (empresaId?: number) => {
  return useQuery({
    queryKey: ['playbooks-real', empresaId],
    queryFn: async () => {
      let query = supabase
        .from('config_script_vendas')
        .select(`
          id,
          nome_agente,
          descricao,
          categoria,
          status,
          created_at,
          objetivo,
          script_completo,
          empresa_nome
        `)
        .order('created_at', { ascending: false });

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data: scripts, error: scriptsError } = await query;

      if (scriptsError) throw scriptsError;

      // Para cada script, calcular conversas utilizadas e taxa de sucesso
      const playbooks = await Promise.all(
        (scripts || []).map(async (script) => {
          // Buscar conversas que usaram este script (baseado no funcionaria_id)
          const { data: conversas, error: conversasError } = await supabase
            .from('core_conversas')
            .select('id, session_id')
            .eq('funcionaria_id', script.id);

          const conversas_utilizadas = conversas?.length || 0;

          // Calcular taxa de sucesso: conversas com agendamento / total de conversas
          if (conversas_utilizadas > 0 && conversas) {
            const sessionIds = conversas.map(c => c.session_id);
            
            const { data: agendamentos } = await supabase
              .from('core_agendamentos')
              .select('conversa_id')
              .in('conversa_id', conversas.map(c => c.id));

            const taxa_sucesso = agendamentos 
              ? (agendamentos.length / conversas_utilizadas) * 100 
              : 0;

            return {
              id: script.id,
              nome_agente: script.nome_agente,
              descricao: script.descricao,
              categoria: script.categoria || 'captacao',
              status: script.status || 'ativo',
              conversas_utilizadas,
              taxa_sucesso: Math.round(taxa_sucesso),
              criado_em: script.created_at,
              prompt_personalizado: script.script_completo,
              objetivo: script.objetivo,
              empresa_nome: script.empresa_nome,
            } as Playbook;
          }

          return {
            id: script.id,
            nome_agente: script.nome_agente,
            descricao: script.descricao,
            categoria: script.categoria || 'captacao',
            status: script.status || 'ativo',
            conversas_utilizadas: 0,
            taxa_sucesso: 0,
            criado_em: script.created_at,
            prompt_personalizado: script.script_completo,
            objetivo: script.objetivo,
            empresa_nome: script.empresa_nome,
          } as Playbook;
        })
      );

      return playbooks;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
