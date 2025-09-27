// src/components/dashboard/opportunity-feed.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Clock, Flame } from 'lucide-react';
import { useOpportunityFeed, UpcomingAppointment } from '@/hooks/use-opportunity-feed';
import { Skeleton } from '@/components/ui/skeleton';
// Removido para simplificar, pode ser adicionado depois
// import { BriefingModal } from './briefing-modal';
// import { useState } from 'react';

const OpportunityCard = ({ opportunity }: { opportunity: UpcomingAppointment }) => {
  const appointmentDate = new Date(opportunity.data_hora);
  const formattedDate = appointmentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const formattedTime = appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const getTemperatureColor = (temp: number | null) => {
    if (temp === 3) return 'text-red-500';
    if (temp === 2) return 'text-yellow-500';
    return 'text-gray-400';
  };

  return (
    <div
      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <p className="font-semibold text-sm">{opportunity.cliente_nome}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Flame className={`w-4 h-4 mr-1 ${getTemperatureColor(opportunity.temperatura_lead)}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500 ml-6">{opportunity.servico_interesse}</p>
      <div className="flex items-center text-xs text-gray-500 mt-2 ml-6">
        <Calendar className="w-3 h-3 mr-1" /> {formattedDate}
        <Clock className="w-3 h-3 mr-1 ml-3" /> {formattedTime}
      </div>
    </div>
  );
};

export const OpportunityFeed = () => {
  const { opportunities, loading, error } = useOpportunityFeed();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Próximas Oportunidades</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          // Exibe um esqueleto de carregamento enquanto busca os dados
          <div>
            <Skeleton className="h-20 w-full mb-3" />
            <Skeleton className="h-20 w-full mb-3" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        
        {!loading && error && (
          // Exibe uma mensagem de erro se a busca falhar
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {!loading && !error && opportunities.length === 0 && (
          // Exibe a mensagem se não houver agendamentos
          <p className="text-sm text-gray-500 text-center">Não há consultas agendadas.</p>
        )}

        {!loading && !error && opportunities.length > 0 && (
          // Mapeia e exibe os agendamentos reais
          opportunities.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))
        )}
      </CardContent>
    </Card>
  );
};
