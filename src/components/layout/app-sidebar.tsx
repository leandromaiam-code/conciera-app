import { 
  LayoutDashboard, 
  Calendar,
  BarChart3,
  MessageSquare,
  BookOpen,
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import concieraLogo from "@/assets/conciera-logo.png";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigationItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "agenda", icon: Calendar, label: "Agendamentos" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "conversas", icon: MessageSquare, label: "Conversas" },
  { id: "playbooks", icon: BookOpen, label: "Playbooks" },
  { id: "configuracoes", icon: Settings, label: "Configurações" },
];

export const AppSidebar = ({ currentPage, onPageChange, isOpen, onOpenChange }: AppSidebarProps) => {
  const isMobile = useIsMobile();

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (isMobile && onOpenChange) {
      onOpenChange(false);
    }
  };

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <aside className="fixed left-0 top-0 h-full w-20 bg-onyx z-40 flex flex-col items-center py-sm">
        {/* Logo */}
        <div className="mb-lg">
          <img 
            src={concieraLogo} 
            alt="CONCIERA" 
            className="w-10 h-10 object-contain filter brightness-0 invert"
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-xxs w-full px-xxs">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`nav-item w-12 h-12 flex items-center justify-center ${
                  isActive ? 'active' : ''
                }`}
                title={item.label}
              >
                <Icon size={24} />
              </button>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Mobile Drawer
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 bg-background p-0 mobile-safe-area">
        <SheetHeader className="p-md border-b border-cinza-borda">
          <div className="flex items-center gap-sm">
            <img 
              src={concieraLogo} 
              alt="CONCIERA" 
              className="w-8 h-8 object-contain"
            />
            <SheetTitle className="text-onyx font-playfair">CONCIERA Suite™️</SheetTitle>
          </div>
        </SheetHeader>
        
        <nav className="p-md">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`nav-item-mobile w-full ${
                  isActive ? 'active' : ''
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};