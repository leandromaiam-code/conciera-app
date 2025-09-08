import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  variant?: "default" | "secondary";
  position?: "bottom-right" | "bottom-left";
  className?: string;
}

export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  label,
  variant = "default",
  position = "bottom-right",
  className
}: FloatingActionButtonProps) => {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6"
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed z-50 h-14 w-14 rounded-full shadow-lg transition-elegant hover-elevate",
        "group relative overflow-hidden",
        variant === "default" && "bg-dourado text-onyx hover:bg-dourado/90",
        variant === "secondary" && "bg-onyx text-branco-puro hover:bg-grafite",
        positionClasses[position],
        className
      )}
      size="icon"
      title={label}
    >
      <Icon size={20} className="transition-transform group-hover:scale-110" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-onyx px-2 py-1 text-xs text-branco-puro opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </Button>
  );
};