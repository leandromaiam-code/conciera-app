// src/components/dashboard/revenue-performance-panel.tsx

import { KPICard } from "./kpi-card";
import { useRevenueData } from "@/hooks/use-revenue-data";
import { Skeleton } from "../ui/skeleton";

export function RevenuePerformancePanel() {
  const { data, loading } = useRevenueData();

  // O esqueleto de carregamento continua a ser a primeira verificação.
  if (loading) {
    // Retorna um grid de esqueletos para manter o layout consistente durante o carregamento.
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 h-full">
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
        <Skeleton className="h-full w-full min-h-[120px]" />
      </div>
    );
  }

  // <<< CORREÇÃO APLICADA AQUI
  // Adicionamos uma verificação para garantir que 'data' não é nulo ou indefinido
  // antes de tentar aceder às suas propriedades.
  if (!data) {
    // Retorna nulo ou uma mensagem de erro, impedindo que o código abaixo seja executado.
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
