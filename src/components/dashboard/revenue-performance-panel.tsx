// src/components/dashboard/revenue-performance-panel.tsx

import { KPICard } from "./kpi-card";
import { useAnalyticsMetricasMensaisVendasReal } from "@/hooks/use-analytics-metricas-mensais-vendas-real"; // << Corrigido para o seu hook
import { Skeleton } from "../ui/skeleton";

export function RevenuePerformancePanel() {
  // Usando o seu hook original para buscar os dados
  const { metrics, isLoading } = useAnalyticsMetricasMensaisVendasReal();

  // O esqueleto de carregamento é exibido enquanto os dados não chegam
  if (isLoading || !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 h-full">
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
      </div>
    );
  }
  
  // Lógica de cálculo de tendência, adaptada do seu código original
  const sparklineData = metrics.analytics_metricas_mensal_vendas_sparkline_30d || [];
  const trendValue = sparklineData.length > 7 ? 
    ((sparklineData[sparklineData.length - 1] - sparklineData[sparklineData.length - 7]) / sparklineData[sparklineData.length - 7]) * 100 : 0;

  return (
    // A estrutura de grid e h-full é mantida para o alinhamento
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 h-full">
      <KPICard
        title="Receita Gerada (RPG)"
        subtitle="Performance do mês"
        value={`R$ ${(metrics.analytics_metricas_mensal_vendas_rpg_mensal / 1000).toFixed(1)}k`}
        trend={{
          value: `${Math.abs(trendValue).toFixed(1)}%`,
          isPositive: trendValue >= 0,
        }}
        className="h-full"
      />
      <KPICard
        title="Taxa de Conversão"
        subtitle="Leads → Agendamentos"
        value={`${metrics.analytics_metricas_mensal_vendas_taxa_conversao}%`}
        className="h-full"
        // Pode adicionar um 'trend' aqui se o hook fornecer os dados
      />
      <KPICard
        title="Agendamentos Hoje"
        subtitle="Novas oportunidades"
        value={`+${metrics.analytics_metricas_mensal_vendas_agendamentos_diario}`}
        className="h-full"
      />
      <KPICard
        title="Satisfação"
        subtitle="Média das avaliações"
        value={`${metrics.analytics_metricas_mensal_vendas_satisfacao_media}%`}
        className="h-full"
      />
    </div>
  );
}
