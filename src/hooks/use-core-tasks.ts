import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: number;
  empresa_id: number;
  funcionaria_id: number | null;
  cliente_id: number | null;
  categoria: string;
  titulo: string;
  descricao: string | null;
  prazo: string | null;
  status: string;
  prioridade: string;
  created_at: string;
  updated_at: string;
  cliente_nome?: string;
  cliente_telefone?: string;
}

export const useTasks = () => {
  return useQuery({
    queryKey: ["core_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("core_tasks")
        .select(`
          *,
          core_clientes (
            nome_completo,
            telefone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map(task => ({
        ...task,
        cliente_nome: task.core_clientes?.nome_completo,
        cliente_telefone: task.core_clientes?.telefone
      })) as Task[];
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: Omit<Partial<Task>, 'id' | 'created_at' | 'updated_at' | 'cliente_nome' | 'cliente_telefone'> & { empresa_id: number; titulo: string }) => {
      const { data, error } = await supabase
        .from("core_tasks")
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["core_tasks"] });
      toast.success("Task criada com sucesso");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar task: " + error.message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...taskData }: Partial<Task> & { id: number }) => {
      const { data, error } = await supabase
        .from("core_tasks")
        .update(taskData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["core_tasks"] });
      toast.success("Task atualizada com sucesso");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar task: " + error.message);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("core_tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["core_tasks"] });
      toast.success("Task excluída com sucesso");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir task: " + error.message);
    },
  });
};
