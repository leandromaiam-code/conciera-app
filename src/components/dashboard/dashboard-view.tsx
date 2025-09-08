import React, { useState } from "react";
import { KPICard } from "./kpi-card";
import { OrchestrationPanel } from "./orchestration-panel";
import { MessageSquare, Plus } from "lucide-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";

interface DashboardViewProps {
  onWhatsAppClick: () => void;
}

export const DashboardView = ({ onWhatsAppClick }: DashboardViewProps) => {
  const [isLoading] = useState(false); // For demonstration of skeleton states

  // Simulate reading from configuration - in real app this would come from context/props
  const [activeChannels] = useState({
    whatsappAtivo: true,
    telefoneAtivo: true,
    emailAtivo: false,
    portalAtivo: false,
    instagramAtivo: false,
    formulariosAtivo: false
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <EnhancedSkeleton key={i} variant="kpi" />
          ))}
        </div>
        <EnhancedSkeleton variant="card" className="h-96" />
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Orchestration Panel - Takes 2 columns */}
        <OrchestrationPanel 
          onWhatsAppClick={onWhatsAppClick} 
          activeChannels={activeChannels}
        />

        {/* KPI Cards - Takes 1 column */}
        <div className="space-y-6">
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
      <div className="grid grid-cols-4 gap-6">
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
      <div className="grid grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="kpi-card hover-elevate">
          <h3 className="text-gray-900 text-xl font-semibold font-serif mb-4">Picos de Atividade</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">08:00 - 10:00</span>
              <span className="font-semibold text-gray-900">42 mensagens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">14:00 - 16:00</span>
              <span className="font-semibold text-gray-900">38 mensagens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">18:00 - 20:00</span>
              <span className="font-semibold text-gray-900">29 mensagens</span>
            </div>
          </div>
        </div>

        <div className="kpi-card hover-elevate">
          <h3 className="text-gray-900 text-xl font-semibold font-serif mb-4">Tipos de Solicitação</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Agendamentos</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                </div>
                <span className="font-semibold text-gray-900 text-sm">65%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Informações</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
                </div>
                <span className="font-semibold text-gray-900 text-sm">25%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Reagendamentos</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600 rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
                </div>
                <span className="font-semibold text-gray-900 text-sm">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Actions */}
      <FloatingActionButton
        icon={MessageSquare}
        onClick={onWhatsAppClick}
        label="Abrir WhatsApp"
        position="bottom-right"
      />
      
      <FloatingActionButton
        icon={Plus}
        onClick={() => {/* Handle quick action */}}
        label="Ação Rápida"
        variant="secondary"
        position="bottom-left"
      />
    </div>
  );
};