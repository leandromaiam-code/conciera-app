// src/components/dashboard/revenue-performance-panel.tsx

import { KPICard } from "./kpi-card";
import { useRevenueData } from "@/hooks/use-revenue-data";
import { Skeleton } from "../ui/skeleton";

export function RevenuePerformancePanel() {
  const { data, loading } = useRevenueData();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 h-full">
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-sm text-red-500">Não foi possível carregar os dados de performance.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 h-full">
      <KPICard
        title="Receita Gerada (RPG)"
        value={`R$ ${data.receitaGerada.toLocaleString('pt-BR')}`}
        iconType="dollar"
        chartData={data.revenueChartData}
        className="h-full"
      />
      <KPICard
        title="Taxa de Conversão"
        value={`${data.taxaConversao}%`}
        iconType="arrow"
        chartData={data.conversionChartData}
        className="h-full"
      />
      <KPICard
        title="Agendamentos Hoje"
        value={`+${data.agendamentosHoje}`}
        iconType="calendar"
        chartData={data.appointmentsChartData}
        className="h-full"
      />
      <KPICard
        title="Satisfação"
        value={`${data.satisfacao}%`}
        iconType="smile"
        chartData={data.satisfactionChartData}
        className="h-full"
      />
    </div>
  );
}
