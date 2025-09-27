import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, MessageCircle, Menu, LogOut, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useCoreEmpresa } from "@/hooks/use-core-empresa";

interface AppHeaderProps {
  pageTitle: string;
  onWhatsAppClick?: () => void;
  onMenuClick?: () => void;
}

export const AppHeader = ({ 
  pageTitle, 
  onWhatsAppClick,
  onMenuClick
}: AppHeaderProps) => {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { empresa } = useCoreEmpresa(profile?.empresa_id || undefined);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };

  const displayName = profile?.nome || user?.user_metadata?.nome || user?.email?.split('@')[0] || "Usuário";
  const clinicName = empresa?.core_empresa_nome || "Clínica";
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-sm p-2 hover:bg-gray-100">
              {!isMobile && (
                <div className="text-right">
                  <p className="text-sm font-medium text-onyx">{clinicName}</p>
                  <p className="text-xs text-grafite">{displayName}</p>
                </div>
              )}
              <Avatar className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-dourado text-onyx text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {!isMobile && <ChevronDown size={16} className="text-grafite" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-dourado text-onyx text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};