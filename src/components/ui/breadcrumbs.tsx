import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  id?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onPageChange: (page: string) => void;
}

export const Breadcrumbs = ({ items, onPageChange }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-grafite">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange('dashboard')}
        className="h-7 px-2 text-grafite hover:text-onyx"
      >
        <Home size={14} className="mr-1" />
        Dashboard
      </Button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={14} className="mx-1 text-grafite/50" />
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="h-7 px-2 text-grafite hover:text-onyx"
            >
              {item.label}
            </Button>
          ) : (
            <span className="px-2 text-onyx font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};