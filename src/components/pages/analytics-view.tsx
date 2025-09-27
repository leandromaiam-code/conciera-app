import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/kpi-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, MessageSquare, Calendar, DollarSign, Target } from "lucide-react";

const monthlyData = [
  { month: 'Jan', leads: 45, agendamentos: 32, receita: 85000 },
  { month: 'Fev', leads: 52, agendamentos: 38, receita: 92000 },
  { month: 'Mar', leads: 48, agendamentos: 35, receita: 88000 },
  { month: 'Abr', leads: 61, agendamentos: 44, receita: 105000 },
  { month: 'Mai', leads: 55, agendamentos: 41, receita: 98000 },
  { month: 'Jun', leads: 67, agendamentos: 48, receita: 118000 },
];

const channelData = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'WhatsApp', value: 30, color: '#25D366' },
  { name: 'Indicação', value: 20, color: '#FFD700' },
  { name: 'Outros', value: 5, color: '#6B7280' },
];

const procedureData = [
  { procedimento: 'Harmonização Facial', quantidade: 25, receita: 70000 },
  { procedimento: 'Implante Capilar', quantidade: 12, receita: 102000 },
  { procedimento: 'Rinoplastia', quantidade: 8, receita: 96000 },
  { procedimento: 'Lipo HD', quantidade: 15, receita: 135000 },
  { procedimento: 'Botox', quantidade: 35, receita: 52500 },
];

export const AnalyticsView = () => {
  return (
    <div className="space-y-6">

      {/* KPIs Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <KPICard
          title="Leads Totais"
          subtitle="Leads captados no mês"
          value="1.247"
          trend={{ value: "15%", isPositive: true }}
        />
        <KPICard
          title="Taxa Conversão"
          subtitle="Leads para agendamentos"
          value="72%"
          trend={{ value: "5%", isPositive: true }}
        />
        <KPICard
          title="Receita Total"
          subtitle="Faturamento do mês"
          value="R$ 598K"
          trend={{ value: "23%", isPositive: true }}
        />
        <KPICard
          title="Agendamentos"
          subtitle="Consultas marcadas"
          value="896"
          trend={{ value: "12%", isPositive: true }}
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
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="agendamentos" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  name="Agendamentos"
                />
              </LineChart>
            </ResponsiveContainer>
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
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Procedure */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Receita por Procedimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={procedureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="procedimento" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'receita' ? `R$ ${value.toLocaleString()}` : value,
                    name === 'receita' ? 'Receita' : 'Quantidade'
                  ]}
                />
                <Bar dataKey="receita" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
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
                {procedureData.map((item, index) => (
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