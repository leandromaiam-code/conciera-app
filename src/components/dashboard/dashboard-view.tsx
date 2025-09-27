// src/components/dashboard/dashboard-view.tsx

import { RevenuePerformancePanel } from "./revenue-performance-panel";
import { ConversionFunnelWidget } from "./conversion-funnel-widget";
import { OpportunityFeed } from './opportunity-feed';

export function DashboardView() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* O cabeçalho da página (AppHeader) já contém o título da rota atual.
        Remover este H2 elimina a redundância visual.
      */}
      {/* <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Painel de Performance</h2>
      </div>
      */}

      {/* V--- CORREÇÃO PRINCIPAL APLICADA AQUI ---V */}
      {/* Trocamos 'grid' por 'flex' para um controle de alinhamento mais robusto.
          'lg:flex-row' no desktop, 'flex-col' no mobile.
          'items-stretch' garante que todos os filhos diretos tenham a mesma altura.
      */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* O painel de performance ocupa 2/3 da largura em telas grandes */}
        <div className="lg:w-2/3">
          <RevenuePerformancePanel />
        </div>

        {/* O feed de oportunidades ocupa 1/3 da largura em telas grandes */}
        <div className="lg:w-1/3">
          <OpportunityFeed /> 
        </div>
        
      </div>
      
      <div className="grid gap-4">
         <ConversionFunnelWidget />
      </div>

    </div>
  );
}
