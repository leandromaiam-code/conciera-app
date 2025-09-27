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
  chartData?: any[];
};

export function KPICard({ title, value, iconType, className }: KPICardProps) {
  // Mapeia o tipo do ícone para o componente correspondente
  const iconMap = {
    dollar: DollarSign,
    arrow: ArrowUpRight,
    calendar: Calendar,
    smile: Smile,
  };

  const Icon = iconMap[iconType];

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        
        {/* V--- CORREÇÃO APLICADA AQUI ---V
          Adicionamos uma verificação condicional. O ícone só será renderizado
          se a variável 'Icon' for um componente válido (e não 'undefined').
        */}
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-center">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
