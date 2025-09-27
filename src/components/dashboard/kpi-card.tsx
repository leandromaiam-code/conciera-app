import { TrendingUp, TrendingDown } from "lucide-react";

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

export const KPICard = ({ title, subtitle, value, trend, className = "" }: KPICardProps) => {
  return (
    <div className={`kpi-card ${className}`}>
      <div className="mb-sm">
        <h3 className="text-onyx mb-xxs text-sm md:text-base">{title}</h3>
        <p className="text-secondary text-grafite text-xs md:text-sm">{subtitle}</p>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-onyx font-playfair">
          {value}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-xxs text-xs md:text-sm font-semibold ${
            trend.isPositive ? 'text-esmeralda' : 'text-erro'
          }`}>
            {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};