import { KPICard } from "./kpi-card";
import { OrchestrationPanel } from "./orchestration-panel";

interface DashboardViewProps {
  onWhatsAppClick: () => void;
}

export const DashboardView = ({ onWhatsAppClick }: DashboardViewProps) => {
  return (
    <div className="animate-fade-in space-y-lg">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-3 gap-lg">
        {/* Orchestration Panel - Takes 2 columns */}
        <OrchestrationPanel onWhatsAppClick={onWhatsAppClick} />

        {/* KPI Cards - Takes 1 column */}
        <div className="space-y-md">
          <KPICard
            title="Agendamentos Hoje"
            subtitle="Consultas confirmadas"
            value={24}
            trend={{ value: "+12%", isPositive: true }}
          />
          
          <KPICard
            title="Taxa de Conversão"
            subtitle="Chat para agendamento"
            value="87%"
            trend={{ value: "+5%", isPositive: true }}
          />
        </div>
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-4 gap-md">
        <KPICard
          title="Mensagens Processadas"
          subtitle="Últimas 24h"
          value={156}
          trend={{ value: "+18%", isPositive: true }}
        />
        
        <KPICard
          title="Tempo Médio Resposta"
          subtitle="Resolução automática"
          value="2.3s"
          trend={{ value: "-15%", isPositive: true }}
        />
        
        <KPICard
          title="Satisfação Cliente"
          subtitle="Avaliação média"
          value="4.8"
          trend={{ value: "+0.2", isPositive: true }}
        />
        
        <KPICard
          title="Receita Gerada"
          subtitle="Via automação hoje"
          value="R$ 8.4k"
          trend={{ value: "+23%", isPositive: true }}
        />
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-2 gap-lg">
        <div className="kpi-card">
          <h3 className="text-onyx mb-sm">Picos de Atividade</h3>
          <div className="space-y-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary text-grafite">08:00 - 10:00</span>
              <span className="font-semibold text-onyx">42 mensagens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-grafite">14:00 - 16:00</span>
              <span className="font-semibold text-onyx">38 mensagens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-grafite">18:00 - 20:00</span>
              <span className="font-semibold text-onyx">29 mensagens</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <h3 className="text-onyx mb-sm">Tipos de Solicitação</h3>
          <div className="space-y-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary text-grafite">Agendamentos</span>
              <div className="flex items-center gap-xs">
                <div className="w-16 h-2 bg-cinza-fundo-hover rounded-full overflow-hidden">
                  <div className="h-full bg-esmeralda rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="font-semibold text-onyx text-sm">65%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-grafite">Informações</span>
              <div className="flex items-center gap-xs">
                <div className="w-16 h-2 bg-cinza-fundo-hover rounded-full overflow-hidden">
                  <div className="h-full bg-dourado rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="font-semibold text-onyx text-sm">25%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary text-grafite">Reagendamentos</span>
              <div className="flex items-center gap-xs">
                <div className="w-16 h-2 bg-cinza-fundo-hover rounded-full overflow-hidden">
                  <div className="h-full bg-grafite rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="font-semibold text-onyx text-sm">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};