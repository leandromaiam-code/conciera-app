import { 
  LayoutDashboard, 
  Calendar,
  BarChart3,
  MessageSquare,
  BookOpen,
  Settings
} from "lucide-react";
import { useState } from "react";
import concieraLogo from "@/assets/conciera-logo.png";

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
        <img 
          src={concieraLogo} 
          alt="CONCIERA" 
          className="w-10 h-10 object-contain filter brightness-0 invert"
        />
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
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gray-700 text-yellow-500' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-yellow-500'
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
};