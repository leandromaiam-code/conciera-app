import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/kpi-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, MessageSquare, DollarSign } from "lucide-react";
import { useAnalyticsOverview } from "@/hooks/use-analytics-overview";
import { Skeleton } from "@/components/ui/skeleton";

export const AnalyticsView = () => {
  const { data: analytics, isLoading } = useAnalyticsOverview();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // Ordenar channelData do maior para o menor
  const sortedChannelData = [...analytics.channelData].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 mt-4">

      {/* KPIs Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <KPICard
          title="Leads Totais"
          subtitle="Leads captados no mês"
          value={analytics.leadsTotal.toString()}
          trend={{ 
            value: `${Math.abs(analytics.leadsGrowth)}%`, 
            isPositive: analytics.leadsGrowth >= 0 
          }}
        />
        <KPICard
          title="Taxa Conversão"
          subtitle="Leads para agendamentos"
          value={`${analytics.taxaConversao}%`}
          trend={{ 
            value: `${Math.abs(analytics.taxaConversaoGrowth)}%`, 
            isPositive: analytics.taxaConversaoGrowth >= 0 
          }}
        />
        <KPICard
          title="Oportunidades Geradas"
          subtitle="Faturamento do mês"
          value={`R$ ${(analytics.receitaTotal / 1000).toFixed(0)}K`}
          trend={{ 
            value: `${Math.abs(analytics.receitaGrowth)}%`, 
            isPositive: analytics.receitaGrowth >= 0 
          }}
        />
        <KPICard
          title="Agendamentos"
          subtitle="Consultas marcadas"
          value={analytics.agendamentosTotal.toString()}
          trend={{ 
            value: `${Math.abs(analytics.agendamentosGrowth)}%`, 
            isPositive: analytics.agendamentosGrowth >= 0 
          }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Leads"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="agendamentos" 
                      stroke="#D4AF37" 
                      strokeWidth={3}
                      dot={{ fill: '#D4AF37', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Agendamentos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Origem dos Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sortedChannelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sortedChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `${value} leads`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ color: '#000000', paddingTop: '20px' }}
                      formatter={(value, entry: any) => {
                        const total = sortedChannelData.reduce((sum, item) => sum + item.value, 0);
                        const percent = ((entry.payload.value / total) * 100).toFixed(0);
                        return <span style={{ color: '#000000', fontSize: '12px' }}>{`${value} (${percent}%)`}</span>;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Procedure */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Oportunidades por Procedimento
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={analytics.procedureData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="procedimento" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                    />
                    <Bar 
                      dataKey="receita" 
                      fill="#D4AF37" 
                      maxBarSize={60}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Procedimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cinza-borda">
                  <th className="text-left py-3 font-semibold">Procedimento</th>
                  <th className="text-center py-3 font-semibold">Quantidade</th>
                  <th className="text-right py-3 font-semibold">Receita Total</th>
                  <th className="text-right py-3 font-semibold">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {analytics.procedureData.map((item, index) => (
                  <tr key={index} className="border-b border-cinza-borda/50">
                    <td className="py-3 font-medium">{item.procedimento}</td>
                    <td className="text-center py-3">{item.quantidade}</td>
                    <td className="text-right py-3 text-dourado font-semibold">
                      R$ {item.receita.toLocaleString()}
                    </td>
                    <td className="text-right py-3">
                      R$ {(item.receita / item.quantidade).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};