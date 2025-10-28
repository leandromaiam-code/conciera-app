import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlaybookAutomation {
  id: number;
  empresa_id: number;
  funcionaria_id?: number;
  tipo: 'lembrete_consulta' | 'reativacao_conversa' | 'pos_atendimento' | 'follow_up' | 'outros';
  nome: string;
  descricao?: string;
  status: 'ativo' | 'pausado' | 'arquivado';
  created_at: string;
  updated_at: string;
}

export interface PlaybookStep {
  id: number;
  playbook_id: number;
  ordem: number;
  nome_passo: string;
  momento_execucao: {
    tipo: string;
    valor: number;
    unidade: string;
  };
  condicoes?: Record<string, any>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaybookMessage {
  id: number;
  step_id: number;
  variacao_numero: number;
  conteudo: string;
  peso_distribuicao: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaybookExecution {
  id: number;
  playbook_id: number;
  step_id?: number;
  message_id?: number;
  agendamento_id?: number;
  conversa_id?: number;
  cliente_id?: number;
  status: 'pendente' | 'enviado' | 'falha' | 'cancelado';
  data_programada?: string;
  data_execucao?: string;
  resultado?: Record<string, any>;
  mensagem_enviada?: string;
  created_at: string;
}

export const usePlaybooksAutomation = (empresaId?: number) => {
  const queryClient = useQueryClient();

  const { data: playbooks, isLoading } = useQuery({
    queryKey: ['playbooks-automation', empresaId],
    queryFn: async () => {
      let query = supabase
        .from('config_playbooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PlaybookAutomation[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createPlaybook = useMutation({
    mutationFn: async (playbook: Omit<PlaybookAutomation, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('config_playbooks')
        .insert(playbook)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks-automation'] });
      toast.success('Playbook criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar playbook:', error);
      toast.error('Erro ao criar playbook');
    },
  });

  const updatePlaybook = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PlaybookAutomation> & { id: number }) => {
      const { data, error } = await supabase
        .from('config_playbooks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks-automation'] });
      toast.success('Playbook atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar playbook:', error);
      toast.error('Erro ao atualizar playbook');
    },
  });

  const deletePlaybook = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('config_playbooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks-automation'] });
      toast.success('Playbook excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir playbook:', error);
      toast.error('Erro ao excluir playbook');
    },
  });

  return {
    playbooks,
    isLoading,
    createPlaybook,
    updatePlaybook,
    deletePlaybook,
  };
};

export const usePlaybookSteps = (playbookId?: number) => {
  const queryClient = useQueryClient();

  const { data: steps, isLoading } = useQuery({
    queryKey: ['playbook-steps', playbookId],
    queryFn: async () => {
      if (!playbookId) return [];

      const { data, error } = await supabase
        .from('config_playbooks_steps')
        .select('*')
        .eq('playbook_id', playbookId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as PlaybookStep[];
    },
    enabled: !!playbookId,
    staleTime: 1000 * 60 * 5,
  });

  const createStep = useMutation({
    mutationFn: async (step: Omit<PlaybookStep, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('config_playbooks_steps')
        .insert(step)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbook-steps'] });
      toast.success('Passo adicionado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar passo:', error);
      toast.error('Erro ao adicionar passo');
    },
  });

  const updateStep = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PlaybookStep> & { id: number }) => {
      const { data, error } = await supabase
        .from('config_playbooks_steps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbook-steps'] });
      toast.success('Passo atualizado com sucesso!');
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('config_playbooks_steps')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbook-steps'] });
      toast.success('Passo excluído com sucesso!');
    },
  });

  return {
    steps,
    isLoading,
    createStep,
    updateStep,
    deleteStep,
  };
};

export const usePlaybookMessages = (stepId?: number) => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['playbook-messages', stepId],
    queryFn: async () => {
      if (!stepId) return [];

      const { data, error } = await supabase
        .from('config_playbooks_messages')
        .select('*')
        .eq('step_id', stepId)
        .order('variacao_numero', { ascending: true });

      if (error) throw error;
      return data as PlaybookMessage[];
    },
    enabled: !!stepId,
    staleTime: 1000 * 60 * 5,
  });

  const createMessage = useMutation({
    mutationFn: async (message: Omit<PlaybookMessage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('config_playbooks_messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbook-messages'] });
      toast.success('Variação adicionada com sucesso!');
    },
  });

  const updateMessage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PlaybookMessage> & { id: number }) => {
      const { data, error } = await supabase
        .from('config_playbooks_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbook-messages'] });
      toast.success('Variação atualizada com sucesso!');
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('config_playbooks_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbook-messages'] });
      toast.success('Variação excluída com sucesso!');
    },
  });

  return {
    messages,
    isLoading,
    createMessage,
    updateMessage,
    deleteMessage,
  };
};

export const usePlaybookExecutions = (playbookId?: number) => {
  const { data: executions, isLoading } = useQuery({
    queryKey: ['playbook-executions', playbookId],
    queryFn: async () => {
      if (!playbookId) return [];

      const { data, error } = await supabase
        .from('config_playbooks_control')
        .select(`
          *,
          cliente:core_clientes(nome_completo, telefone)
        `)
        .eq('playbook_id', playbookId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!playbookId,
    staleTime: 1000 * 60,
  });

  return {
    executions,
    isLoading,
  };
};
