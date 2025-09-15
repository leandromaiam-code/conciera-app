import { useState } from "react";
import { LoginCard } from "@/components/ui/login-card";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { WhatsAppSimulation } from "@/components/dashboard/whatsapp-simulation";

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
        return (
          <div className="animate-fade-in">
            <div className="kpi-card text-center py-xxl">
              <h2 className="text-onyx mb-sm">Controle de Agendamentos</h2>
              <p className="text-secondary text-grafite">
                Funcionalidade em desenvolvimento - Interface de gestão da agenda em breve.
              </p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="animate-fade-in">
            <div className="kpi-card text-center py-xxl">
              <h2 className="text-onyx mb-sm">Analytics e Relatórios</h2>
              <p className="text-secondary text-grafite">
                Métricas avançadas e relatórios personalizados em desenvolvimento.
              </p>
            </div>
          </div>
        );
      case "conversas":
        return (
          <div className="animate-fade-in">
            <div className="kpi-card text-center py-xxl">
              <h2 className="text-onyx mb-sm">Histórico de Conversas</h2>
              <p className="text-secondary text-grafite">
                Acesso completo ao histórico de interações em breve.
              </p>
            </div>
          </div>
        );
      case "playbooks":
        return (
          <div className="animate-fade-in">
            <div className="kpi-card text-center py-xxl">
              <h2 className="text-onyx mb-sm">Gestão de Playbooks</h2>
              <p className="text-secondary text-grafite">
                Centro de controle da inteligência de IA em desenvolvimento.
              </p>
            </div>
          </div>
        );
      case "configuracoes":
        return (
          <div className="animate-fade-in">
            <div className="kpi-card text-center py-xxl">
              <h2 className="text-onyx mb-sm">Configurações do Sistema</h2>
              <p className="text-secondary text-grafite">
                Painel de configurações e preferências em breve.
              </p>
            </div>
          </div>
        );
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
