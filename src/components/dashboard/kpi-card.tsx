// src/components/dashboard/kpi-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, Calendar, Smile } from "lucide-react";
import { SparklineChart } from './sparkline-chart'; // Supondo que você tenha este componente
import { cn } from "@/lib/utils";

// ... (definições de tipo e props)

export function KPICard({ title, value, iconType, chartData, className }: KPICardProps) {
  const Icon = {
    dollar: DollarSign,
    arrow: ArrowUpRight,
    calendar: Calendar,
    smile: Smile,
  }[iconType];

  return (
    // AQUI A MUDANÇA: 'h-full' e 'flex flex-col' para o Card
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      {/* AQUI A MUDANÇA: 'flex-grow' para o CardContent se expandir */}
      <CardContent className="flex flex-col flex-grow justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {/* O gráfico agora tem mais espaço para respirar */}
        <div className="h-16 pt-4"> 
          <SparklineChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
