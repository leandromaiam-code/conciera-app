// src/components/dashboard/kpi-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, Calendar, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

// Definindo o tipo das props para o KPICard
type KPICardProps = {
  title: string;
  value: string;
  iconType: 'dollar' | 'arrow' | 'calendar' | 'smile';
  className?: string;
  chartData?: any[]; // Mantemos a prop, mas não a usamos por agora
};

export function KPICard({ title, value, iconType, className }: KPICardProps) {
  const Icon = {
    dollar: DollarSign,
    arrow: ArrowUpRight,
    calendar: Calendar,
    smile: Smile,
  }[iconType];

  return (
    // A estrutura flex para alinhamento vertical foi mantida
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-center"> {/* Alterado para centralizar o valor */}
        <div className="text-2xl font-bold">{value}</div>
        {/* A área do gráfico foi removida para corrigir o erro */}
      </CardContent>
    </Card>
  );
}
