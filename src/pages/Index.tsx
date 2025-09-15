import { useState } from "react";
import { LoginCard } from "@/components/ui/login-card";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { WhatsAppSimulation } from "@/components/dashboard/whatsapp-simulation";
import { AgendaView } from "@/pages/AgendaView";
import { AnalyticsView } from "@/pages/AnalyticsView";
import { ConversasView } from "@/pages/ConversasView";
import { PlaybooksView } from "@/pages/PlaybooksView";
import { ConfiguracoesView } from "@/pages/ConfiguracoesView";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleWhatsAppClick = () => {
    setIsWhatsAppOpen(true);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardView onWhatsAppClick={handleWhatsAppClick} />;
      case "agenda":
        return <AgendaView />;
      case "analytics":
        return <AnalyticsView />;
      case "conversas":
        return <ConversasView />;
      case "playbooks":
        return <PlaybooksView />;
      case "configuracoes":
        return <ConfiguracoesView />;
      default:
        return <DashboardView onWhatsAppClick={handleWhatsAppClick} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginCard onLogin={handleLogin} />;
  }

  return (
    <>
      <AppLayout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        pageTitle=""
      >
        {renderPageContent()}
      </AppLayout>
      
      <WhatsAppSimulation 
        isOpen={isWhatsAppOpen} 
        onClose={() => setIsWhatsAppOpen(false)} 
      />
    </>
  );
};

export default Index;
