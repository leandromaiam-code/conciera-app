import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, MessageCircle } from "lucide-react";

interface AppHeaderProps {
  pageTitle: string;
  clinicName?: string;
  userName?: string;
  onWhatsAppClick?: () => void;
}

export const AppHeader = ({ 
  pageTitle, 
  clinicName = "Clínica Exemplo",
  userName = "Dr. Silva",
  onWhatsAppClick
}: AppHeaderProps) => {
  return (
    <header className="fixed top-0 left-20 right-0 h-20 bg-background border-b border-cinza-borda z-30 flex items-center justify-between px-xxl">
      {/* Page Title */}
      <div>
        <h1 className="text-onyx">{pageTitle}</h1>
      </div>

      {/* Right Side - Clinic Identity */}
      <div className="flex items-center gap-md">
        {/* Channel Status - WhatsApp Quick Access */}
        {onWhatsAppClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onWhatsAppClick}
            className="flex items-center gap-xxs text-esmeralda hover:text-esmeralda/80 hover:bg-esmeralda/10"
          >
            <MessageCircle size={16} />
            <div className="w-2 h-2 bg-esmeralda rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">WhatsApp</span>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-grafite hover:text-onyx">
          <Bell size={20} />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-sm">
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
    </header>
  );
};