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
          <div className="">
            <div className="bg-white p-16 rounded-xl shadow-lg text-center">
              <h2 className="text-gray-900 text-2xl font-semibold font-serif mb-4">Controle de Agendamentos</h2>
              <p className="text-gray-600 text-sm">
                Funcionalidade em desenvolvimento - Interface de gestão da agenda em breve.
              </p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="">
            <div className="bg-white p-16 rounded-xl shadow-lg text-center">
              <h2 className="text-gray-900 text-2xl font-semibold font-serif mb-4">Analytics e Relatórios</h2>
              <p className="text-gray-600 text-sm">
                Métricas avançadas e relatórios personalizados em desenvolvimento.
              </p>
            </div>
          </div>
        );
      case "conversas":
        return (
          <div className="">
            <div className="bg-white p-16 rounded-xl shadow-lg text-center">
              <h2 className="text-gray-900 text-2xl font-semibold font-serif mb-4">Histórico de Conversas</h2>
              <p className="text-gray-600 text-sm">
                Acesso completo ao histórico de interações em breve.
              </p>
            </div>
          </div>
        );
      case "playbooks":
        return (
          <div className="">
            <div className="bg-white p-16 rounded-xl shadow-lg text-center">
              <h2 className="text-gray-900 text-2xl font-semibold font-serif mb-4">Gestão de Playbooks</h2>
              <p className="text-gray-600 text-sm">
                Centro de controle da inteligência de IA em desenvolvimento.
              </p>
            </div>
          </div>
        );
      case "configuracoes":
        return (
          <div className="">
            <div className="bg-white p-16 rounded-xl shadow-lg text-center">
              <h2 className="text-gray-900 text-2xl font-semibold font-serif mb-4">Configurações do Sistema</h2>
              <p className="text-gray-600 text-sm">
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
