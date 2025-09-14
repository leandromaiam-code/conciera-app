import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown } from "lucide-react";
import { CommandSearch } from "@/components/ui/command-search";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ChannelStatusIndicator } from "@/components/dashboard/channel-status-indicator";

interface AppHeaderProps {
  pageTitle: string;
  clinicName?: string;
  userName?: string;
  currentPage?: string;
  onPageChange: (page: string) => void;
}

export const AppHeader = ({ 
  pageTitle, 
  clinicName = "Clínica Exemplo",
  userName = "Dr. Silva",
  currentPage = "dashboard",
  onPageChange
}: AppHeaderProps) => {
  const getBreadcrumbItems = () => {
    const items = [];
    
    if (currentPage !== 'dashboard') {
      items.push({ label: pageTitle });
    }
    
    return items;
  };

  return (
    <header className="fixed top-0 left-20 right-0 h-20 bg-branco-puro border-b border-cinza-borda z-30">
      <div className="flex items-center justify-between px-16 h-full">
        {/* Left Side - Page Title, Breadcrumbs and Search */}
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-6">
            <h1 className="text-onyx text-2xl font-bold font-playfair">{pageTitle}</h1>
            <div className="hidden md:block">
              <CommandSearch onPageChange={onPageChange} />
            </div>
          </div>
          <Breadcrumbs items={getBreadcrumbItems()} onPageChange={onPageChange} />
        </div>

        {/* Right Side - Channel Status and User Identity */}
        <div className="flex items-center gap-6">
          {/* Channel Status Indicator */}
          <ChannelStatusIndicator />
          
          {/* Keyboard Shortcuts Hint */}
          <div className="hidden lg:block text-xs text-grafite">
            <kbd className="px-2 py-1 bg-marfim rounded text-grafite">Alt + 1-6</kbd> para navegar
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-grafite hover:text-onyx">
            <Bell size={20} />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-onyx">{clinicName}</p>
              <p className="text-xs text-grafite">{userName}</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-dourado text-onyx text-sm font-semibold">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown size={16} className="text-grafite" />
          </div>
        </div>
      </div>
    </header>
  );
};