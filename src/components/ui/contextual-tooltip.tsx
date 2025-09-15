import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContextualTooltipProps {
  children: ReactNode;
  title: string;
  description?: string;
  trend?: {
    value: string;
    period: string;
  };
  className?: string;
}

export const ContextualTooltip = ({ 
  children, 
  title, 
  description, 
  trend,
  className = ""
}: ContextualTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={className}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{title}</p>
            {description && (
              <p className="text-xs text-grafite">{description}</p>
            )}
            {trend && (
              <p className="text-xs text-dourado font-medium">
                {trend.value} vs {trend.period}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};