import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCoreEmpresa } from "./use-core-empresa";

export interface DisponibilidadeAgenda {
  id: number;
  empresa_id?: number;
  dia_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  turno: 'manha' | 'tarde' | 'noite';
  horario_inicio: string;
  horario_fim: string;
  tipo: 'primeira_consulta' | 'retorno' | 'ambos';
  tipo_consulta: 'primeira_consulta' | 'retorno' | 'ambos';
  procedimento: string;
  ativo: boolean;
  data_inicio?: string;
  data_fim?: string;
  is_recorrente: boolean;
  evento: 'disponibilidade' | 'bloqueio';
  created_at?: string;
  updated_at?: string;
}

export const useDisponibilidadeAgenda = () => {
  const queryClient = useQueryClient();
  const { empresa } = useCoreEmpresa();

  const { data: disponibilidades, isLoading } = useQuery({
    queryKey: ["disponibilidade-agenda"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_disponibilidade_agenda")
        .select("*")
        .order("dia_semana", { ascending: true })
        .order("turno", { ascending: true });

      if (error) throw error;
      return data as DisponibilidadeAgenda[];
    },
  });

  const createDisponibilidade = useMutation({
    mutationFn: async (newDisponibilidade: Omit<DisponibilidadeAgenda, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
      if (!empresa?.core_empresa_id) {
        throw new Error("Empresa não encontrada");
      }
      
      const { data, error } = await supabase
        .from("config_disponibilidade_agenda")
        .insert([{ ...newDisponibilidade, empresa_id: empresa.core_empresa_id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disponibilidade-agenda"] });
      toast.success("Disponibilidade adicionada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar disponibilidade: " + error.message);
    },
  });

  const updateDisponibilidade = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DisponibilidadeAgenda> & { id: number }) => {
      const { data, error } = await supabase
        .from("config_disponibilidade_agenda")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disponibilidade-agenda"] });
      toast.success("Disponibilidade atualizada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar disponibilidade: " + error.message);
    },
  });

  const deleteDisponibilidade = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("config_disponibilidade_agenda")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disponibilidade-agenda"] });
      toast.success("Disponibilidade removida com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao remover disponibilidade: " + error.message);
    },
  });

  return {
    disponibilidades: disponibilidades || [],
    isLoading,
    createDisponibilidade,
    updateDisponibilidade,
    deleteDisponibilidade,
  };
};
