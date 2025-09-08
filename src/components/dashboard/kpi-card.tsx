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
    <div className={`kpi-card hover-elevate transition-elegant ${className}`}>
      <div className="mb-4">
        <h3 className="text-gray-900 text-xl font-semibold font-serif mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-5xl font-bold text-gray-900 font-serif">
          {value}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};