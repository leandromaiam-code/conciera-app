import { cn } from "@/lib/utils";

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar" | "kpi";
  lines?: number;
}

export function EnhancedSkeleton({ 
  className, 
  variant = "default", 
  lines = 1,
  ...props 
}: EnhancedSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("p-6 bg-card rounded-xl shadow-md animate-pulse", className)} {...props}>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
          <div className="h-8 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2 animate-pulse", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-3 bg-muted rounded",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={cn("flex items-center space-x-3 animate-pulse", className)} {...props}>
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="space-y-1 flex-1">
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-2 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (variant === "kpi") {
    return (
      <div className={cn("kpi-card animate-pulse", className)} {...props}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="flex justify-between items-end">
            <div className="h-12 bg-muted rounded w-1/3" />
            <div className="h-6 bg-muted rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("animate-pulse rounded-md bg-muted", className)} 
      {...props} 
    />
  );
}