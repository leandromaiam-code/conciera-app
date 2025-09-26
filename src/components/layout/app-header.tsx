import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, MessageCircle, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppHeaderProps {
  pageTitle: string;
  clinicName?: string;
  userName?: string;
  onWhatsAppClick?: () => void;
  onMenuClick?: () => void;
}

export const AppHeader = ({ 
  pageTitle, 
  clinicName = "Clínica Exemplo",
  userName = "Dr. Silva",
  onWhatsAppClick,
  onMenuClick
}: AppHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className={`fixed top-0 ${isMobile ? 'left-0' : 'left-20'} right-0 ${isMobile ? 'h-16' : 'h-20'} bg-background border-b border-cinza-borda z-30 flex items-center justify-between ${isMobile ? 'px-md mobile-safe-area' : 'px-xxl'}`}>
      {/* Left Side */}
      <div className="flex items-center gap-md">
        {/* Mobile Menu Button */}
        {isMobile && onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-grafite hover:text-onyx mobile-touch-target"
          >
            <Menu size={24} />
          </Button>
        )}
        
        {/* Page Title */}
        <div>
          <h1 className={`text-onyx ${isMobile ? 'text-lg' : ''}`}>{pageTitle}</h1>
        </div>
      </div>

      {/* Right Side - Clinic Identity */}
      <div className="flex items-center gap-sm md:gap-md">
        {/* Channel Status - WhatsApp Quick Access */}
        {onWhatsAppClick && (
          <Button
            variant="ghost"
            size={isMobile ? "icon" : "sm"}
            onClick={onWhatsAppClick}
            className="flex items-center gap-xxs text-esmeralda hover:text-esmeralda/80 hover:bg-esmeralda/10 mobile-touch-target"
          >
            <MessageCircle size={16} />
            <div className="w-2 h-2 bg-esmeralda rounded-full animate-pulse"></div>
            {!isMobile && <span className="text-xs font-medium">Simular Conciera</span>}
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-grafite hover:text-onyx mobile-touch-target">
          <Bell size={20} />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-sm">
          {!isMobile && (
            <div className="text-right">
              <p className="text-sm font-medium text-onyx">{clinicName}</p>
              <p className="text-xs text-grafite">{userName}</p>
            </div>
          )}
          <Avatar className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-dourado text-onyx text-sm font-semibold">
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {!isMobile && <ChevronDown size={16} className="text-grafite" />}
        </div>
      </div>
    </header>
  );
};