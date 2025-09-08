import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ""
}: EmptyStateProps) => {
  return (
    <div className={`text-center py-16 px-8 animate-fade-in ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-grafite/10 mb-6">
        <Icon size={32} className="text-grafite" />
      </div>
      
      <h3 className="text-xl font-semibold text-onyx mb-2 font-playfair">
        {title}
      </h3>
      
      <p className="text-grafite text-sm max-w-md mx-auto mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="btn-primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};