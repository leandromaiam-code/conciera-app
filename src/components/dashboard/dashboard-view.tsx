// src/components/dashboard/dashboard-view.tsx

import { RevenuePerformancePanel } from "./revenue-performance-panel";
import { ConversionFunnelWidget } from "./conversion-funnel-widget";
import { OpportunityFeed } from './opportunity-feed';

export function DashboardView() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Painel de Performance</h2>
      </div>

      {/* V--- ALTERAÇÃO PRINCIPAL AQUI ---V */}
      {/* Adicionamos 'lg:grid-rows-[1fr]' para forçar as linhas do grid a terem a mesma altura */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 lg:grid-rows-[1fr]">
        
        {/* O painel de performance agora ocupa 2 colunas */}
        <RevenuePerformancePanel />

        {/* O feed de oportunidades ocupa 1 coluna */}
        <OpportunityFeed /> 
        
      </div>
      
      <div className="grid gap-4">
         <ConversionFunnelWidget />
      </div>

    </div>
  );
}
