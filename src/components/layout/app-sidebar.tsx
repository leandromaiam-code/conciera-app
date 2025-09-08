import { 
  LayoutDashboard, 
  Calendar,
  BarChart3,
  MessageSquare,
  BookOpen,
  Settings
} from "lucide-react";
import { ConcieraLogo } from "@/components/ui/logo";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "agenda", icon: Calendar, label: "Agendamentos" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "conversas", icon: MessageSquare, label: "Conversas" },
  { id: "playbooks", icon: BookOpen, label: "Playbooks" },
  { id: "configuracoes", icon: Settings, label: "Configurações" },
];

export const AppSidebar = ({ currentPage, onPageChange }: AppSidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-gray-900 z-40 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <ConcieraLogo className="w-10 h-10 text-white" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 w-full px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-item w-12 h-12 flex items-center justify-center rounded-lg relative group ${
                isActive 
                  ? 'active' 
                  : ''
              }`}
              title={item.label}
            >
              <Icon size={24} className="transition-transform group-hover:scale-110" />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-onyx px-2 py-1 text-xs text-branco-puro opacity-0 transition-opacity group-hover:opacity-100 z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};