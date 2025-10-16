import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { WhatsAppSimulation } from "@/components/dashboard/whatsapp-simulation";
import { AgendaView } from "@/components/pages/agenda-view";
import { AnalyticsView } from "@/components/pages/analytics-view";
import { ConversasView } from "@/components/pages/conversas-view";
import { ConfiguracoesView } from "@/components/pages/configuracoes-view";
import { useUserProfile } from "@/hooks/use-user-profile";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const { profile } = useUserProfile();

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

      {isWhatsAppOpen && (
        <WhatsAppSimulation 
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          empresaId={profile?.empresa_id ?? undefined}
        />
      )}
    </>
  );
};

export default Index;