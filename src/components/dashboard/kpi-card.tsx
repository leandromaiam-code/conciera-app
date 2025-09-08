import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "@/components/ui/sparkline";
import { ContextualTooltip } from "@/components/ui/contextual-tooltip";

interface KPICardProps {
  title: string;
  subtitle: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  sparklineData?: number[];
  tooltipDescription?: string;
  className?: string;
}

export const KPICard = ({ 
  title, 
  subtitle, 
  value, 
  trend, 
  sparklineData, 
  tooltipDescription,
  className = "" 
}: KPICardProps) => {
  return (
    <ContextualTooltip
      title={title}
      description={tooltipDescription}
      trend={trend ? { value: trend.value, period: "período anterior" } : undefined}
    >
      <div className={`kpi-card hover-elevate transition-elegant cursor-help ${className}`}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-onyx text-xl font-semibold font-playfair">{title}</h3>
            {sparklineData && (
              <Sparkline 
                data={sparklineData} 
                width={60} 
                height={20}
                color={trend?.isPositive ? "hsl(var(--esmeralda))" : "hsl(var(--erro))"}
              />
            )}
          </div>
          <p className="text-grafite text-sm">{subtitle}</p>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-4xl font-bold text-onyx font-playfair">
            {value}
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trend.isPositive ? 'text-esmeralda' : 'text-erro'
            }`}>
              {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </ContextualTooltip>
  );
};