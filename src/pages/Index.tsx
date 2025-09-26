import { useState } from "react";
import { LoginCard } from "@/components/ui/login-card";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { WhatsAppSimulation } from "@/components/dashboard/whatsapp-simulation";
import { AgendaView } from "@/components/pages/agenda-view";
import { AnalyticsView } from "@/components/pages/analytics-view";
import { ConversasView } from "@/components/pages/conversas-view";
import { ConfiguracoesView } from "@/components/pages/configuracoes-view";

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
        return <DashboardView onWhatsAppClick={handleWhatsAppClick} onPageChange={setCurrentPage} />;
      case "agenda":
        return <AgendaView />;
      case "analytics":
        return <AnalyticsView />;
      case "conversas":
        return <ConversasView />;
      case "configuracoes":
        return <ConfiguracoesView />;
      default:
        return <DashboardView onWhatsAppClick={handleWhatsAppClick} onPageChange={setCurrentPage} />;
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
        onWhatsAppClick={handleWhatsAppClick}
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
