import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CoreEmpresa } from "@/types/briefing-types";

interface UseCoreEmpresaResult {
  empresa: CoreEmpresa | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  updateEmpresa: (data: Partial<CoreEmpresa>) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useCoreEmpresa = (empresaId?: number): UseCoreEmpresaResult => {
  const [empresa, setEmpresa] = useState<CoreEmpresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresa = async () => {
    try {
      setLoading(true);
      setError(null);

      // If no empresaId provided, get the first company (assuming single-tenant for now)
      let query = supabase
        .from('core_empresa')
        .select('*');

      if (empresaId) {
        query = query.eq('id', empresaId);
      }

      const { data, error: queryError } = await query.limit(1);

      if (queryError) {
        console.error('Erro ao buscar empresa:', queryError);
        setError('Erro ao carregar dados da empresa');
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        
        // Transform database data to match expected format
        const empresaData: CoreEmpresa = {
          core_empresa_id: row.id,
          core_empresa_nome: row.nome || '',
          core_empresa_segmento: row.segmento || '',
          core_empresa_segmento_especifico: row.segmento_especifico || '',
          core_empresa_descricao: row.descricao || '',
          core_empresa_tipo_produto: row.tipo_produto || '',
          core_empresa_forma_venda: row.forma_venda || '',
          core_empresa_telefone: row.telefone || '',
          core_empresa_email_contato: row.email_contato || '',
          core_empresa_endereco_empresa: row.endereco_empresa || '',
          core_empresa_horario_atendimento: row.horario_atendimento || '',
          core_empresa_autoridade_empresa: row.autoridade_empresa || '',
          core_empresa_beneficios_produto: row.beneficios_produto || '',
          core_empresa_dores_cliente: row.dores_cliente || '',
          core_empresa_problema_cliente: row.problema_cliente || '',
          core_empresa_cliente_ideal: row.cliente_ideal || '',
          core_empresa_servicos: (row as any).servicos || '',
          core_empresa_preco_consulta: row.preco_consulta || '',
          core_empresa_profissionais_empresa: row.profissionais_empresa || '',
          core_empresa_created_at: row.created_at || new Date().toISOString(),
          core_empresa_updated_at: row.updated_at || new Date().toISOString()
        };

        setEmpresa(empresaData);
      } else {
        setEmpresa(null);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  const updateEmpresa = async (updateData: Partial<CoreEmpresa>) => {
    if (!empresa) return;

    try {
      setSaving(true);
      setError(null);

      // Transform frontend data back to database format
      const dbData: any = {};
      
      Object.keys(updateData).forEach(key => {
        const dbField = key.replace('core_empresa_', '');
        if (updateData[key as keyof CoreEmpresa] !== undefined) {
          dbData[dbField] = updateData[key as keyof CoreEmpresa];
        }
      });

      const { error: updateError } = await supabase
        .from('core_empresa')
        .update(dbData)
        .eq('id', empresa.core_empresa_id);

      if (updateError) {
        console.error('Erro ao atualizar empresa:', updateError);
        setError('Erro ao salvar dados da empresa');
        return;
      }

      // Update local state
      setEmpresa(prev => prev ? { ...prev, ...updateData } : null);
      
      console.log('Dados da empresa atualizados com sucesso');
    } catch (err) {
      console.error('Erro ao atualizar empresa:', err);
      setError('Erro inesperado ao salvar dados');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, [empresaId]);

  return {
    empresa,
    loading,
    error,
    saving,
    updateEmpresa,
    refetch: fetchEmpresa
  };
};