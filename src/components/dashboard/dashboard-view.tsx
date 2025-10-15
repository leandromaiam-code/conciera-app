import { KPICard } from "./kpi-card";
import { RevenuePerformancePanel } from "./revenue-performance-panel";
import { ConversionFunnelWidget } from "./conversion-funnel-widget";
import { OpportunityFeed } from "./opportunity-feed";
import { MessageSquare, Clock, Star, CalendarCheck } from "lucide-react";
import { useDashboardSecondaryKPIs } from "@/hooks/use-dashboard-secondary-kpis";
import { useDashboardInsights } from "@/hooks/use-dashboard-insights";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardViewProps {
  onWhatsAppClick: () => void;
  onPageChange?: (page: string) => void;
}

export const DashboardView = ({ onWhatsAppClick, onPageChange }: DashboardViewProps) => {
  const { data: secondaryKPIs, isLoading: isLoadingKPIs } = useDashboardSecondaryKPIs();
  const { data: insights, isLoading: isLoadingInsights } = useDashboardInsights();

  return (
    <div className="animate-fade-in space-y-sm lg:space-y-md">
      {/* Main Dashboard Grid - Revenue Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:gap-lg">
        {/* Revenue Performance Panel - Takes 2 columns on desktop, full width on mobile */}
        <div className="lg:col-span-2">
          <RevenuePerformancePanel />
        </div>

        {/* Opportunity Feed - Takes 1 column on desktop, full width on mobile */}
        <div>
          <OpportunityFeed />
        </div>
      </div>

      {/* Conversion Funnel Widget */}
      <ConversionFunnelWidget />

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-md">
        {isLoadingKPIs ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : secondaryKPIs ? (
          <>
            <KPICard
              title="Mensagens Processadas"
              subtitle="Total de mensagens"
              value={secondaryKPIs.mensagensProcessadas.toString()}
              trend={{ 
                value: `${Math.abs(secondaryKPIs.mensagensGrowth)}%`, 
                isPositive: secondaryKPIs.mensagensGrowth >= 0 
              }}
            />
            <KPICard
              title="Tempo Médio Resposta"
              subtitle="Tempo de resposta"
              value={`${secondaryKPIs.tempoMedioResposta}s`}
              trend={{ 
                value: `${Math.abs(secondaryKPIs.tempoRespostaGrowth)}%`, 
                isPositive: secondaryKPIs.tempoRespostaGrowth <= 0 
              }}
            />
            <KPICard
              title="Satisfação Cliente"
              subtitle="Avaliação média"
              value={secondaryKPIs.satisfacaoCliente.toString()}
              trend={{ 
                value: Math.abs(secondaryKPIs.satisfacaoGrowth).toString(), 
                isPositive: secondaryKPIs.satisfacaoGrowth >= 0 
              }}
            />
            <KPICard
              title="Taxa de Comparecimento"
              subtitle="Pacientes compareceram"
              value={`${secondaryKPIs.taxaComparecimento}%`}
              trend={{ 
                value: `${Math.abs(secondaryKPIs.comparecimentoGrowth)}%`, 
                isPositive: secondaryKPIs.comparecimentoGrowth >= 0 
              }}
            />
          </>
        ) : null}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md lg:gap-lg">
        <div className="kpi-card">
          <h3 className="text-onyx mb-sm">Picos de Atividade</h3>
          {isLoadingInsights ? (
            <div className="space-y-sm">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-sm">
              {insights?.activityPeaks.map((peak, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-secondary text-grafite">{peak.horario}</span>
                  <span className="font-semibold text-onyx">{peak.quantidade} mensagens</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kpi-card">
          <h3 className="text-onyx mb-sm">Tipos de Solicitação</h3>
          {isLoadingInsights ? (
            <div className="space-y-sm">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-sm">
              {insights?.requestTypes.map((type, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-secondary text-grafite">{type.tipo}</span>
                  <div className="flex items-center gap-xs">
                    <div className="w-16 h-2 bg-cinza-fundo-hover rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-esmeralda' : 
                          index === 1 ? 'bg-dourado' : 'bg-grafite'
                        }`}
                        style={{ width: `${type.percentual}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-onyx text-sm">{type.percentual}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};