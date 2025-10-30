import { useAnalyticsConversionFunnel } from "@/hooks/use-analytics-conversion-funnel";
import { TrendingUp, Users, CalendarCheck, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Widget de Funil de Conversão - Novos Leads → Agendamentos → Taxa
 * Foca exclusivamente no processo de conversão de leads
 */
interface ConversionFunnelWidgetProps {
  selectedMonth?: Date;
}

export const ConversionFunnelWidget = ({ selectedMonth }: ConversionFunnelWidgetProps) => {
  const { funnelData, isLoading } = useAnalyticsConversionFunnel(undefined, selectedMonth);

  if (isLoading || !funnelData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
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
      subtitle: "Este mês",
      value: funnelData.newLeads,
      trend: funnelData.trend.leads,
      icon: Users,
      color: "text-esmeralda",
      bgColor: "bg-esmeralda/10",
      onClick: () => console.log("Navegar para leads")
    },
    {
      title: "Agendamentos",
      subtitle: "Este mês",
      value: funnelData.scheduledAppointments,
      trend: funnelData.trend.appointments,
      icon: CalendarCheck,
      color: "text-dourado",
      bgColor: "bg-dourado/10",
      onClick: () => console.log("Navegar para agendamentos")
    },
    {
      title: "Taxa de Conversão",
      subtitle: "Lead → Agendamento",
      value: `${funnelData.conversionRate.toFixed(1)}%`,
      trend: Math.round((funnelData.trend.appointments + funnelData.trend.leads) / 2),
      icon: TrendingUp,
      color: "text-onyx",
      bgColor: "bg-onyx/10",
      onClick: () => console.log("Navegar para analytics")
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
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
              item.trend >= 0 ? 'text-esmeralda' : 'text-erro'
            }`}>
              {item.trend >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {item.trend >= 0 ? '+' : ''}{item.trend}%
            </div>
          </div>

          <div className="mb-xxs">
            <div className="text-xl sm:text-2xl font-bold text-onyx font-playfair group-hover:scale-105 transition-elegant">
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
