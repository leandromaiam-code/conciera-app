// src/hooks/use-opportunity-feed.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Definimos a estrutura dos dados que vamos buscar e usar no componente
export interface UpcomingAppointment {
  id: number;
  data_hora: string;
  servico_interesse: string;
  cliente_nome: string | null;
  temperatura_lead: number | null;
}

export const useOpportunityFeed = () => {
  const [opportunities, setOpportunities] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('core_agendamentos')
        .select(`
          id,
          data_hora,
          servico_interesse,
          core_clientes ( nome_completo ),
          core_briefings ( temperatura_lead )
        `)
        .gte('data_hora', new Date().toISOString()) // Filtra apenas agendamentos a partir de agora
        .order('data_hora', { ascending: true })   // Ordena pelos mais próximos
        .limit(4);                                  // Limita o resultado (ex: 4)

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        setError('Não foi possível carregar as próximas consultas.');
        setOpportunities([]);
      } else if (data) {
        const formattedData = data.map((agendamento: any) => ({
          id: agendamento.id,
          data_hora: agendamento.data_hora,
          servico_interesse: agendamento.servico_interesse,
          cliente_nome: agendamento.core_clientes?.nome_completo || 'Cliente',
          temperatura_lead: agendamento.core_briefings ? agendamento.core_briefings.temperatura_lead : null,
        }));
        setOpportunities(formattedData);
      }

      setLoading(false);
    };

    fetchUpcomingAppointments();
  }, []);

  return { opportunities, loading, error };
};
