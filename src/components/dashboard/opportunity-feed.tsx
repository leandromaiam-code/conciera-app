import { Clock, TrendingUp } from "lucide-react";
import { useOpportunityFeed } from "@/hooks/use-opportunity-feed";

interface OpportunityFeedProps {
  onPageChange?: (page: string) => void;
}

/**
 * Feed de Oportunidades de Alto Valor
 * Lista interativa dos próximos agendamentos com maior potencial de receita
 */
export const OpportunityFeed = ({ onPageChange }: OpportunityFeedProps) => {
  const { opportunities, isLoading } = useOpportunityFeed();

  if (isLoading) {
    return (
      <div className="space-y-sm">
        <div className="h-6 bg-cinza-fundo-hover rounded animate-pulse mb-md"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-cinza-fundo-hover rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  const getTemperaturaColor = (temp: 1 | 2 | 3) => {
    switch (temp) {
      case 3: return "text-esmeralda";
      case 2: return "text-dourado"; 
      case 1: return "text-grafite";
    }
  };

  const getTemperaturaPoints = (temp: 1 | 2 | 3) => {
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < temp ? "bg-dourado" : "bg-cinza-borda"
        }`}
      />
    ));
  };

  const handleOpportunityClick = (opportunity: any) => {
    console.log("Open BriefingModal for:", opportunity.id);
    // Future: Open BriefingModal with opportunity details
  };

  return (
    <div className="space-y-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-onyx">Próximas Consultas</h3>
        <div className="flex items-center gap-xxs text-xs text-grafite">
          <TrendingUp size={12} />
          <span>Alto Valor</span>
        </div>
      </div>

      <div className="space-y-xs">
        {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="kpi-card py-sm px-md cursor-pointer transition-elegant hover-elevate hover:border-dourado/30 group"
              onClick={() => handleOpportunityClick(opportunity)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-1">
                    <h4 className="font-semibold text-onyx group-hover:text-dourado transition-elegant text-sm">
                      {opportunity.paciente_nome}
                    </h4>
                    <div className="flex items-center gap-xxs">
                      {getTemperaturaPoints(opportunity.temperatura)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-grafite mb-1">
                    {opportunity.procedimento}
                  </p>
                  
                  <div className="flex items-center gap-lg text-xs text-grafite">
                    <div className="flex items-center gap-xxs">
                      <Clock size={12} />
                      <span>{opportunity.horario}</span>
                    </div>
                    <div className="font-semibold text-dourado">
                      R$ {opportunity.valor_estimado.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className={`text-xs font-medium ${getTemperaturaColor(opportunity.temperatura)}`}>
                    {opportunity.temperatura === 3 ? 'Quente' : 
                     opportunity.temperatura === 2 ? 'Morno' : 'Frio'}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-elegant text-xs text-dourado">
                    Ver briefing →
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>

      {/* Footer CTA - sem separação visual */}
      <div className="mt-xs">
        <button 
          onClick={() => onPageChange?.("agenda")}
          className="text-xs text-dourado hover:text-onyx transition-elegant font-medium"
        >
          Ver todas as oportunidades na Agenda →
        </button>
      </div>
    </div>
  );
};