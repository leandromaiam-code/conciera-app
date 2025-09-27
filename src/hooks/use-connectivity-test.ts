import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook para testar conectividade e autenticação
export const useConnectivityTest = () => {
  const [status, setStatus] = useState<{
    auth: boolean;
    basicQuery: boolean;
    agendamentosAccess: boolean;
    error: string | null;
  }>({
    auth: false,
    basicQuery: false,
    agendamentosAccess: false,
    error: null
  });

  useEffect(() => {
    const runTests = async () => {
      try {
        console.log('🔍 Executando testes de conectividade...');
        
        // Teste 1: Autenticação
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        const authOK = !authError && !!user;
        console.log('Auth test:', authOK ? '✅ OK' : '❌ FAIL', authError?.message || '');

        // Teste 2: Query básica
        const { data: basicData, error: basicError } = await supabase
          .from('core_agendamentos')
          .select('count(*)', { count: 'exact', head: true });
        const basicOK = !basicError;
        console.log('Basic query test:', basicOK ? '✅ OK' : '❌ FAIL', basicError?.message || '');

        // Teste 3: Acesso à tabela core_agendamentos
        const { data: agendamentosData, error: agendamentosError } = await supabase
          .from('core_agendamentos')
          .select('id')
          .limit(1);
        const agendamentosOK = !agendamentosError;
        console.log('Agendamentos access test:', agendamentosOK ? '✅ OK' : '❌ FAIL', agendamentosError?.message || '');

        setStatus({
          auth: authOK,
          basicQuery: basicOK,
          agendamentosAccess: agendamentosOK,
          error: authError?.message || basicError?.message || agendamentosError?.message || null
        });

      } catch (err) {
        console.error('❌ Connectivity test error:', err);
        setStatus({
          auth: false,
          basicQuery: false,
          agendamentosAccess: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    };

    runTests();
  }, []);

  return status;
};