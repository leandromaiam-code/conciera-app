import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook simplificado para testar conectividade básica
export const useCoreAgendamentosSimple = () => {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnectivity = async () => {
      try {
        console.log('🔍 Teste 1: Verificando conectividade básica...');
        
        // Teste 1: Query mais simples possível
        const { data: testData, error: testError } = await supabase
          .from('core_agendamentos')
          .select('id, data_hora, status')
          .limit(1);
        
        if (testError) {
          console.error('❌ Teste 1 falhou:', testError);
          setError(`Connectivity test failed: ${testError.message}`);
          return;
        }
        
        console.log('✅ Teste 1 passou - Conectividade OK');

        // Teste 2: Query sem JOINs mas com filtros
        console.log('🔍 Teste 2: Query simples com filtros...');
        const hoje = new Date();
        const { data: filteredData, error: filteredError } = await supabase
          .from('core_agendamentos')
          .select('*')
          .gte('data_hora', hoje.toISOString())
          .order('data_hora', { ascending: true });

        if (filteredError) {
          console.error('❌ Teste 2 falhou:', filteredError);
          setError(`Filtered query failed: ${filteredError.message}`);
          return;
        }

        console.log('✅ Teste 2 passou - Query com filtros OK');
        console.log('📊 Dados encontrados:', filteredData?.length || 0);

        // Teste 3: Buscar dados relacionados separadamente
        console.log('🔍 Teste 3: Buscando dados relacionados...');
        if (filteredData && filteredData.length > 0) {
          const clienteIds = [...new Set(filteredData.map(a => a.cliente_id))];
          
          const { data: clientesData, error: clientesError } = await supabase
            .from('core_clientes')
            .select('id, nome_completo, telefone')
            .in('id', clienteIds);

          if (clientesError) {
            console.error('❌ Teste 3 falhou:', clientesError);
            setError(`Related data query failed: ${clientesError.message}`);
            return;
          }

          console.log('✅ Teste 3 passou - Dados relacionados OK');
          
          // Combinar dados manualmente
          const agendamentosCompletos = filteredData.map(agendamento => ({
            ...agendamento,
            cliente_data: clientesData?.find(c => c.id === agendamento.cliente_id)
          }));

          setAgendamentos(agendamentosCompletos);
        } else {
          setAgendamentos([]);
        }

        setError(null);
      } catch (err) {
        console.error('❌ Erro inesperado:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    testConnectivity();
  }, []);

  return { agendamentos, loading, error };
};