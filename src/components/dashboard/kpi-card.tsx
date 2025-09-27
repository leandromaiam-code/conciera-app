// src/components/dashboard/kpi-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Definindo o tipo das props para o KPICard
interface KPICardProps {
  title: string;
  subtitle: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, subtitle, value, trend, className = "" }: KPICardProps) {
  return (
    // A estrutura flex garante o alinhamento e preenchimento de altura
    <Card className={cn("h-full flex flex-col justify-between", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
        <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {value}
          </div>
          
          {trend && (
            <div className={cn(
                "flex items-center gap-1 text-xs font-semibold",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
