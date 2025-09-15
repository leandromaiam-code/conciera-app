import { MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { useOpportunityFeed } from "@/hooks/use-opportunity-feed";

/**
 * Widget de Funil de Conversão
 * Exibe métricas de conversão em tempo real com navegação para detalhes
 */
export const ConversionFunnelWidget = () => {
  const { funnelData, isLoading } = useOpportunityFeed();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="kpi-card animate-pulse">
            <div className="h-16 bg-cinza-fundo-hover rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const funnelItems = [
    {
      title: "Novos Leads",
      subtitle: "Hoje",
      value: funnelData.novos_leads_hoje,
      trend: funnelData.leads_trend,
      icon: MessageSquare,
      color: "text-dourado",
      bgColor: "bg-dourado/10",
      onClick: () => console.log("Navigate to Conversas - Leads filter")
    },
    {
      title: "Agendamentos", 
      subtitle: "Convertidos hoje",
      value: funnelData.agendamentos_hoje,
      trend: funnelData.agendamentos_trend,
      icon: Calendar,
      color: "text-esmeralda",
      bgColor: "bg-esmeralda/10",
      onClick: () => console.log("Navigate to Agenda view")
    },
    {
      title: "Taxa de Conversão",
      subtitle: "Lead → Agendamento",
      value: `${funnelData.taxa_conversao}%`,
      trend: 5, // Mock positive trend for conversion rate
      icon: TrendingUp,
      color: "text-onyx",
      bgColor: "bg-onyx/10",
      onClick: () => console.log("Navigate to Analytics view")
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-sm">
      {funnelItems.map((item) => (
        <div
          key={item.title}
          className="kpi-card cursor-pointer transition-elegant hover-elevate group"
          onClick={item.onClick}
        >
          <div className="flex items-start justify-between mb-sm">
            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div className={`text-xs font-semibold flex items-center gap-xxs ${
              item.trend > 0 ? 'text-esmeralda' : 'text-erro'
            }`}>
              <TrendingUp size={12} className={item.trend < 0 ? 'rotate-180' : ''} />
              +{item.trend}%
            </div>
          </div>

          <div className="mb-xxs">
            <div className="text-2xl font-bold text-onyx font-playfair group-hover:scale-105 transition-elegant">
              {item.value}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-onyx">{item.title}</h3>
            <p className="text-xs text-grafite">{item.subtitle}</p>
          </div>

          {/* Interactive indicator */}
          <div className="mt-sm pt-sm border-t border-cinza-borda opacity-0 group-hover:opacity-100 transition-elegant">
            <span className="text-xs text-dourado">Clique para detalhes →</span>
          </div>
        </div>
      ))}
    </div>
  );
};