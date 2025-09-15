import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  pageTitle: string;
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

export const AppLayout = ({ children, currentPage, onPageChange }: AppLayoutProps) => {
  const pageTitle = getPageTitle(currentPage);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar currentPage={currentPage} onPageChange={onPageChange} />
      <AppHeader pageTitle={pageTitle} />
      
      <main className="ml-20 pt-20 p-xxl">
        {children}
      </main>
    </div>
  );
};