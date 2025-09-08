import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Sparkline = ({ 
  data, 
  width = 80, 
  height = 24, 
  color = "hsl(var(--dourado))",
  className = ""
}: SparklineProps) => {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return "";
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return (
      <div className={`${className}`} style={{ width, height }}>
        <div className="w-full h-full bg-grafite/20 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <svg 
      width={width} 
      height={height} 
      className={`transition-elegant ${className}`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-fade-in"
        style={{ animationDelay: '200ms' }}
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * height}
        r="2"
        fill={color}
        className="animate-fade-in"
        style={{ animationDelay: '400ms' }}
      />
    </svg>
  );
};