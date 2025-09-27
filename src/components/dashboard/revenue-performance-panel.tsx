// src/components/dashboard/revenue-performance-panel.tsx

import { KPICard } from "./kpi-card";
import { useRevenueData } from "@/hooks/use-revenue-data";
import { Skeleton } from "../ui/skeleton";

export function RevenuePerformancePanel() {
  const { data, loading } = useRevenueData();

  if (loading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    // AQUI ESTÁ A MUDANÇA PRINCIPAL:
    // Adicionamos 'h-full' ao Card e 'flex flex-col' ao CardContent
    // para que o conteúdo se estique verticalmente.
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 h-full">
      <KPICard
        title="Receita Gerada (RPG)"
        value={`R$ ${data.receitaGerada.toLocaleString('pt-BR')}`}
        iconType="dollar"
        chartData={data.revenueChartData}
        className="h-full" // Garante que o card individual ocupe a altura
      />
      <KPICard
        title="Taxa de Conversão"
        value={`${data.taxaConversao}%`}
        iconType="arrow"
        chartData={data.conversionChartData}
        className="h-full" // Garante que o card individual ocupe a altura
      />
      <KPICard
        title="Agendamentos Hoje"
        value={`+${data.agendamentosHoje}`}
        iconType="calendar"
        chartData={data.appointmentsChartData}
        className="h-full" // Garante que o card individual ocupe a altura
      />
      <KPICard
        title="Satisfação"
        value={`${data.satisfacao}%`}
        iconType="smile"
        chartData={data.satisfactionChartData}
        className="h-full" // Garante que o card individual ocupe a altura
      />
    </div>
  );
}
