// src/components/dashboard/opportunity-feed.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock } from "lucide-react";
import { useOpportunityFeed, UpcomingAppointment } from "@/hooks/use-opportunity-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Componente para o indicador de temperatura com a nova paleta de cores
const TemperatureGauge = ({ level }: { level: number | null }) => {
  const levelSafe = level || 0;
  return (
    <div className="flex items-center space-x-1">
      {/* As cores agora usam a paleta de dourados do seu tema */}
      <div
        className={cn("w-2 h-3 rounded-sm", levelSafe >= 1 ? "bg-yellow-400" : "bg-gray-300 dark:bg-gray-600")}
      ></div>
      <div
        className={cn("w-2 h-3 rounded-sm", levelSafe >= 2 ? "bg-yellow-500" : "bg-gray-300 dark:bg-gray-600")}
      ></div>
      <div
        className={cn("w-2 h-3 rounded-sm", levelSafe >= 3 ? "bg-yellow-600" : "bg-gray-300 dark:bg-gray-600")}
      ></div>
    </div>
  );
};

const OpportunityCard = ({ opportunity }: { opportunity: UpcomingAppointment }) => {
  const appointmentDate = new Date(opportunity.data_hora);
  const formattedDate = appointmentDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const formattedTime = appointmentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge className="bg-esmeralda text-white">Confirmado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500 text-white">Não Confirmado</Badge>;
      case "cancelado":
        return <Badge className="bg-red-500 text-white">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{opportunity.cliente_nome}</p>
        </div>
        <TemperatureGauge level={opportunity.temperatura_lead} />
      </div>
      <div className="flex items-center justify-between ml-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">{opportunity.servico_interesse}</p>
        {getStatusBadge(opportunity.status)}
      </div>
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 ml-6">
        <Calendar className="w-3 h-3 mr-1" /> {formattedDate}
        <Clock className="w-3 h-3 mr-1 ml-3" /> {formattedTime}
      </div>
    </div>
  );
};

interface OpportunityFeedProps {
  onPageChange?: (page: string) => void;
}

export const OpportunityFeed = ({ onPageChange }: OpportunityFeedProps) => {
  const { opportunities, loading, error } = useOpportunityFeed();

  return (
    <Card className="col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle>Agendamentos</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow">
          {loading && (
            <div>
              <Skeleton className="h-20 w-full mb-3" />
              <Skeleton className="h-20 w-full mb-3" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {!loading && error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {!loading && !error && opportunities.length === 0 && (
            <p className="text-sm text-gray-500 text-center">Não há consultas agendadas.</p>
          )}

          {!loading &&
            !error &&
            opportunities.length > 0 &&
            opportunities.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}
        </div>

        {/* Adiciona o link no final do card, apenas se houver agendamentos */}
        {!loading && !error && opportunities.length > 0 && onPageChange && (
          <div className="mt-4 text-center">
            <button
              onClick={() => onPageChange("agenda")}
              className="text-sm font-medium text-dourado hover:text-dourado/80 transition-colors"
            >
              Ver todos agendamentos
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
