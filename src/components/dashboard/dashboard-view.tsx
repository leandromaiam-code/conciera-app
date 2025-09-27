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

      {/* V--- CORREÇÃO APLICADA AQUI ---V */}
      {/* A classe 'grid' por si só não força o alinhamento.
        'lg:items-stretch' instrui explicitamente todos os itens do grid
        a se esticarem verticalmente para preencher a altura da célula,
        garantindo que todos na mesma linha tenham a mesma altura.
      */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 lg:items-stretch">
        
        {/* O seu painel de performance original, sem alterações */}
        <RevenuePerformancePanel />

        {/* O seu feed de oportunidades original, sem alterações */}
        <OpportunityFeed /> 
        
      </div>
      
      <div className="grid gap-4">
         <ConversionFunnelWidget />
      </div>

    </div>
  );
}
