import { MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionFunnelCardProps {
  newLeads: number;
  scheduledAppointments: number;
  conversionRate: number;
  onLeadsClick: () => void;
  onAppointmentsClick: () => void;
  className?: string;
}

export const ConversionFunnelCard = ({
  newLeads,
  scheduledAppointments,
  conversionRate,
  onLeadsClick,
  onAppointmentsClick,
  className = ""
}: ConversionFunnelCardProps) => {
  return (
    <div className={`kpi-card hover-elevate transition-elegant ${className}`}>
      <h3 className="text-onyx text-xl font-semibold font-playfair mb-6">
        Funil de Conversão Hoje
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Novos Leads */}
        <Button
          variant="ghost"
          onClick={onLeadsClick}
          className="flex flex-col items-center p-6 h-auto hover:bg-dourado/5 transition-elegant"
        >
          <div className="p-3 bg-dourado/10 rounded-full mb-3">
            <MessageSquare className="text-dourado" size={20} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-onyx font-playfair mb-1">
              {newLeads}
            </div>
            <p className="text-grafite text-sm">Novos Leads</p>
          </div>
        </Button>

        {/* Agendamentos */}
        <Button
          variant="ghost"
          onClick={onAppointmentsClick}
          className="flex flex-col items-center p-6 h-auto hover:bg-esmeralda/5 transition-elegant"
        >
          <div className="p-3 bg-esmeralda/10 rounded-full mb-3">
            <Calendar className="text-esmeralda" size={20} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-onyx font-playfair mb-1">
              {scheduledAppointments}
            </div>
            <p className="text-grafite text-sm">Agendamentos</p>
          </div>
        </Button>

        {/* Taxa de Conversão */}
        <div className="flex flex-col items-center p-6">
          <div className="p-3 bg-grafite/10 rounded-full mb-3">
            <TrendingUp className="text-grafite" size={20} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-onyx font-playfair mb-1">
              {conversionRate}%
            </div>
            <p className="text-grafite text-sm">Conversão</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-cinza-borda">
        <p className="text-grafite text-xs text-center">
          Clique nos números para ver detalhes nas conversas
        </p>
      </div>
    </div>
  );
};