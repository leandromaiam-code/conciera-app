import { TrendingUp } from "lucide-react";
import { Sparkline } from "@/components/ui/sparkline";
import { ContextualTooltip } from "@/components/ui/contextual-tooltip";

interface RevenueKPICardProps {
  rpgValue: number;
  trend: number[];
  growthPercentage: number;
  className?: string;
}

export const RevenueKPICard = ({ 
  rpgValue, 
  trend, 
  growthPercentage,
  className = "" 
}: RevenueKPICardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ContextualTooltip
      title="Receita de Pipeline Gerado (RPG)"
      description="Valor total estimado dos agendamentos confirmados no mês, baseado no valor médio de consulta"
      trend={{ value: `+${growthPercentage}%`, period: "mês anterior" }}
    >
      <div className={`kpi-card hover-elevate transition-elegant cursor-help bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-300/20 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-yellow-600 text-sm font-semibold font-inter uppercase tracking-wide mb-1">
              Receita de Pipeline
            </h3>
            <p className="text-gray-600 text-xs">Gerado este mês</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <TrendingUp className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-5xl font-bold text-gray-900 font-playfair mb-2">
            {formatCurrency(rpgValue)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-sm font-semibold">
              +{growthPercentage}%
            </span>
            <span className="text-gray-600 text-sm">vs mês anterior</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-xs">Evolução 30 dias</span>
          <Sparkline 
            data={trend} 
            width={120} 
            height={30}
            color="hsl(var(--dourado))"
          />
        </div>
      </div>
    </ContextualTooltip>
  );
};