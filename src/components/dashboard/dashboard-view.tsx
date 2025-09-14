import React, { useState } from "react";
import { Plus } from "lucide-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { RevenueKPICard } from "./revenue-kpi-card";
import { ConversionFunnelCard } from "./conversion-funnel-card";
import { OpportunityFeedCard } from "./opportunity-feed-card";
import { BriefingModal } from "./briefing-modal";
import { KPICard } from "./kpi-card";
import { useMockData } from "@/hooks/use-mock-data";
import { OpportunityBrief } from "@/types/opportunity";

interface DashboardViewProps {
  onWhatsAppClick: () => void;
}

export const DashboardView = ({ onWhatsAppClick }: DashboardViewProps) => {
  const [isLoading] = useState(false);
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityBrief | null>(null);
  
  const { 
    revenueData, 
    conversionMetrics, 
    opportunities,
    handleLeadsClick,
    handleAppointmentsClick 
  } = useMockData();

  const handleOpportunityClick = (opportunity: OpportunityBrief) => {
    setSelectedOpportunity(opportunity);
    setBriefingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <EnhancedSkeleton variant="kpi" className="lg:col-span-2" />
          <EnhancedSkeleton variant="kpi" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EnhancedSkeleton variant="card" className="h-96" />
          <EnhancedSkeleton variant="card" className="h-96" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Painel de Performance Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KPI Central de Receita - 2 colunas */}
        <RevenueKPICard
          rpgValue={revenueData.currentMonthRPG}
          trend={revenueData.rpgTrend}
          growthPercentage={23}
          className="lg:col-span-2"
        />
        
        {/* Funil de Conversão - 1 coluna */}
        <ConversionFunnelCard
          newLeads={conversionMetrics.newLeads}
          scheduledAppointments={conversionMetrics.scheduledAppointments}
          conversionRate={conversionMetrics.conversionRate}
          onLeadsClick={handleLeadsClick}
          onAppointmentsClick={handleAppointmentsClick}
        />
      </div>

      {/* Segunda linha - Feed de Oportunidades e KPIs Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feed de Próximas Oportunidades */}
        <OpportunityFeedCard
          opportunities={opportunities}
          onOpportunityClick={handleOpportunityClick}
        />

        {/* KPIs Secundários */}
        <div className="space-y-6">
          <KPICard
            title="Tempo Médio Resposta"
            subtitle="IA Automática"
            value="2.3s"
            trend={{ value: "-15%", isPositive: true }}
            sparklineData={[2.8, 2.6, 2.4, 2.5, 2.2, 2.3]}
            tooltipDescription="Tempo médio para processar e responder mensagens automaticamente"
          />
          
          <KPICard
            title="Satisfação Cliente"
            subtitle="Avaliação NPS"
            value="4.8"
            trend={{ value: "+0.2", isPositive: true }}
            sparklineData={[4.6, 4.7, 4.8, 4.7, 4.9, 4.8]}
            tooltipDescription="Nota média das avaliações dos clientes (escala 1-5)"
          />
        </div>
      </div>

      {/* Insights de Performance - Terceira linha */}
      <div className="grid grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="kpi-card hover-elevate">
          <h3 className="text-gray-900 text-xl font-semibold font-playfair mb-4">Picos de Atividade</h3>
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
          <h3 className="text-gray-900 text-xl font-semibold font-playfair mb-4">Performance de Conversão</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Agendamentos</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full transition-all duration-1000" style={{ width: '67%' }}></div>
                </div>
                <span className="font-semibold text-gray-900 text-sm">67%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Informações</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 rounded-full transition-all duration-1000" style={{ width: '23%' }}></div>
                </div>
                <span className="font-semibold text-gray-900 text-sm">23%</span>
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
        icon={Plus}
        onClick={() => {/* Handle quick action */}}
        label="Ação Rápida"
        variant="secondary"
        position="bottom-left"
      />

      {/* Briefing Modal */}
      <BriefingModal
        opportunity={selectedOpportunity}
        open={briefingModalOpen}
        onOpenChange={setBriefingModalOpen}
      />
    </div>
  );
};