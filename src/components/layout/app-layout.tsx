import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  pageTitle: string;
  onWhatsAppClick?: () => void;
}

const getPageTitle = (page: string): string => {
  const titles: Record<string, string> = {
    dashboard: "Dashboard Omnichannel",
    agenda: "Controle de Agendamentos", 
    analytics: "Analytics e Relatórios",
    conversas: "Histórico de Conversas",
    playbooks: "Gestão de Playbooks",
    configuracoes: "Configurações do Sistema"
  };
  return titles[page] || "CONCIERA Suite™️";
};

export const AppLayout = ({ children, currentPage, onPageChange, onWhatsAppClick }: AppLayoutProps) => {
  const pageTitle = getPageTitle(currentPage);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar 
        currentPage={currentPage} 
        onPageChange={onPageChange}
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      />
      <AppHeader 
        pageTitle={pageTitle} 
        onWhatsAppClick={onWhatsAppClick}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />
      
      <main className={`${isMobile ? 'pt-16 p-md' : 'ml-20 pt-20 p-xxl'} mobile-safe-area`}>
        {children}
      </main>
    </div>
  );
};