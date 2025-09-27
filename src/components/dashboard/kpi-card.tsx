// src/components/dashboard/kpi-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, Calendar, Smile, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Definindo o tipo das props para o KPICard
type KPICardProps = {
  title: string;
  value: string;
  iconType: 'dollar' | 'arrow' | 'calendar' | 'smile';
  className?: string;
  chartData?: any[];
};

// Criamos um sub-componente robusto para renderizar o ícone correto.
// Isto evita o mapeamento de objetos que estava a causar o erro.
const CardIcon = ({ iconType, ...props }: { iconType: KPICardProps['iconType'] } & LucideProps) => {
  switch (iconType) {
    case 'dollar':
      return <DollarSign {...props} />;
    case 'arrow':
      return <ArrowUpRight {...props} />;
    case 'calendar':
      return <Calendar {...props} />;
    case 'smile':
      return <Smile {...props} />;
    default:
      return null; // Retorna nulo se o tipo for inválido
  }
};

export function KPICard({ title, value, iconType, className }: KPICardProps) {
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardIcon iconType={iconType} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-center">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
