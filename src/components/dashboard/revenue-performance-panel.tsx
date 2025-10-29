import { TrendingUp } from "lucide-react";
import { useAnalyticsMetricasMensaisVendasReal } from "@/hooks/use-analytics-metricas-mensais-vendas";

/**
 * Painel Principal: Receita de Pipeline Gerado (RPG)
 * Component central do dashboard focado em performance financeira
 */
export const RevenuePerformancePanel = () => {
  const { metrics, isLoading } = useAnalyticsMetricasMensaisVendasReal();

  if (isLoading) {
    return (
      <div className="col-span-2 kpi-card">
        <div className="animate-pulse">
          <div className="h-8 bg-cinza-fundo-hover rounded mb-sm"></div>
          <div className="h-32 bg-cinza-fundo-hover rounded"></div>
        </div>
      </div>
    );
  }

  // Handle null metrics
  if (!metrics) {
    return (
      <div className="col-span-2 kpi-card">
        <div className="text-center text-grafite py-lg">
          <p>Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  // Simple sparkline calculation for trend direction
  const sparklineData = metrics.analytics_metricas_mensal_vendas_sparkline_30d;
  const lastValue = sparklineData[sparklineData.length - 1] || 0;
  const previousValue = sparklineData[sparklineData.length - 7] || 0;
  
  let trendPercentage = "0.0";
  let isPositiveTrend = true;
  
  if (previousValue > 0) {
    const diff = ((lastValue - previousValue) / previousValue) * 100;
    trendPercentage = Math.abs(diff).toFixed(1);
    isPositiveTrend = diff >= 0;
  }

  return (
    <div className="col-span-2 relative overflow-hidden">
      {/* Background gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-dourado/5 to-transparent rounded-xl"></div>
      
      <div className="kpi-card relative z-10 border border-dourado/20 min-h-[280px] py-lg">
        <div className="mb-md">
          <div className="flex items-center justify-between mb-xxs">
            <h2 className="text-onyx">Total de Oportunidades Geradas</h2>
            <div className={`flex items-center gap-xxs text-sm font-semibold ${
              isPositiveTrend ? 'text-esmeralda' : 'text-erro'
            }`}>
              <TrendingUp size={16} className={!isPositiveTrend ? 'rotate-180' : ''} />
              {isPositiveTrend ? '+' : '-'}{trendPercentage}%
            </div>
          </div>
          <p className="text-secondary text-grafite">
            Performance consolidada do mês
          </p>
        </div>

        <div className="grid grid-cols-2 gap-lg items-end">
          {/* RPG Principal */}
          <div>
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-dourado to-yellow-600 bg-clip-text font-playfair mb-xs">
              R$ {(metrics.analytics_metricas_mensal_vendas_rpg_mensal / 1000).toFixed(1).replace('.', ',')}k
            </div>
            <div className="text-sm text-grafite mb-sm">
              <span className="font-semibold text-dourado">Hoje:</span> {metrics.novosLeadsHoje || 0} oportunidades
            </div>
            <div className="text-xs text-grafite">
              Valor médio por consulta: R$ {Number(metrics.analytics_metricas_mensal_vendas_valor_medio_consulta).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="flex flex-col items-end">
            <div className="text-xs text-grafite mb-xxs text-right">Evolução 30 dias</div>
            <div className="flex items-end gap-px h-16 w-32">
              {sparklineData.slice(-15).map((value, index) => {
                const height = ((value - Math.min(...sparklineData)) / 
                  (Math.max(...sparklineData) - Math.min(...sparklineData))) * 100;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-dourado to-yellow-500 rounded-sm opacity-80"
                    style={{
                      height: `${height}%`,
                      width: '6px',
                      minHeight: '8px'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-xs mt-md pt-md border-t border-cinza-borda">
          <div className="w-2 h-2 bg-esmeralda rounded-full animate-pulse"></div>
          <span className="text-xs text-grafite">Atualização em tempo real</span>
        </div>
      </div>
    </div>
  );
};