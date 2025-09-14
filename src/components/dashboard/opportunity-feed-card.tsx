import { Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunityBrief } from "@/types/opportunity";

interface OpportunityFeedCardProps {
  opportunities: OpportunityBrief[];
  onOpportunityClick: (opportunity: OpportunityBrief) => void;
  className?: string;
}

export const OpportunityFeedCard = ({
  opportunities,
  onOpportunityClick,
  className = ""
}: OpportunityFeedCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTemperatureColor = (temp: 1 | 2 | 3) => {
    switch (temp) {
      case 3: return 'text-dourado';
      case 2: return 'text-esmeralda';
      case 1: return 'text-grafite';
    }
  };

  const renderTemperatureStars = (temperature: 1 | 2 | 3) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= temperature 
                ? getTemperatureColor(temperature) 
                : 'text-cinza-borda'
            }
            fill={star <= temperature ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`kpi-card hover-elevate transition-elegant ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-onyx text-xl font-semibold font-playfair">
          Próximas Oportunidades
        </h3>
        <div className="text-grafite text-sm">
          {opportunities.length} hoje
        </div>
      </div>
      
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <Button
            key={opportunity.id}
            variant="ghost"
            onClick={() => onOpportunityClick(opportunity)}
            className="w-full p-4 h-auto hover:bg-dourado/5 transition-elegant border border-cinza-borda hover:border-dourado/30"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-onyx">{opportunity.patientName}</p>
                  {renderTemperatureStars(opportunity.temperature)}
                </div>
                <p className="text-grafite text-sm mb-1">{opportunity.procedure}</p>
                <div className="flex items-center gap-4 text-xs text-grafite">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(opportunity.scheduledTime)}
                  </div>
                  <div className="text-dourado font-semibold">
                    {formatCurrency(opportunity.estimatedValue)}
                  </div>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-grafite text-sm">Nenhuma oportunidade hoje</p>
        </div>
      )}
    </div>
  );
};