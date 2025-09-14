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
      <h3 className="text-gray-900 text-xl font-semibold font-playfair mb-6">
        Funil de Conversão Hoje
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Novos Leads */}
        <Button
          variant="ghost"
          onClick={onLeadsClick}
          className="flex flex-col items-center p-6 h-auto hover:bg-yellow-50 transition-elegant"
        >
          <div className="p-3 bg-yellow-100 rounded-full mb-3">
            <MessageSquare className="text-yellow-600" size={20} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 font-playfair mb-1">
              {newLeads}
            </div>
            <p className="text-gray-600 text-sm">Novos Leads</p>
          </div>
        </Button>

        {/* Agendamentos */}
        <Button
          variant="ghost"
          onClick={onAppointmentsClick}
          className="flex flex-col items-center p-6 h-auto hover:bg-green-50 transition-elegant"
        >
          <div className="p-3 bg-green-100 rounded-full mb-3">
            <Calendar className="text-green-600" size={20} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 font-playfair mb-1">
              {scheduledAppointments}
            </div>
            <p className="text-gray-600 text-sm">Agendamentos</p>
          </div>
        </Button>

        {/* Taxa de Conversão */}
        <div className="flex flex-col items-center p-6">
          <div className="p-3 bg-gray-100 rounded-full mb-3">
            <TrendingUp className="text-gray-600" size={20} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 font-playfair mb-1">
              {conversionRate}%
            </div>
            <p className="text-gray-600 text-sm">Conversão</p>
          </div>
        </div>
      </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-xs text-center">
          Clique nos números para ver detalhes nas conversas
        </p>
      </div>
    </div>
  );
};