import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, Star } from "lucide-react";

const weeklyData = [
  { name: "Seg", atendimentos: 24, satisfacao: 4.2 },
  { name: "Ter", atendimentos: 32, satisfacao: 4.5 },
  { name: "Qua", atendimentos: 28, satisfacao: 4.1 },
  { name: "Qui", atendimentos: 41, satisfacao: 4.6 },
  { name: "Sex", atendimentos: 35, satisfacao: 4.3 },
  { name: "Sáb", atendimentos: 18, satisfacao: 4.4 },
  { name: "Dom", atendimentos: 12, satisfacao: 4.0 }
];

const channelData = [
  { name: "WhatsApp", value: 45, color: "#25D366" },
  { name: "Telefone", value: 30, color: "#3B82F6" },
  { name: "Email", value: 15, color: "#EF4444" },
  { name: "Portal", value: 10, color: "#8B5CF6" }
];

const responseTimeData = [
  { time: "08:00", tempo: 2.1 },
  { time: "10:00", tempo: 1.8 },
  { time: "12:00", tempo: 3.2 },
  { time: "14:00", tempo: 2.5 },
  { time: "16:00", tempo: 2.0 },
  { time: "18:00", tempo: 1.9 }
];

export const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Relatórios</h2>
          <p className="text-gray-600">Visão completa do desempenho do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Últimos 7 dias</Button>
          <Button variant="outline" size="sm">Últimos 30 dias</Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Exportar Relatório</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Atendimentos</p>
              <p className="text-3xl font-bold text-gray-900">1,847</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-600 ml-1">vs semana anterior</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo Médio de Resposta</p>
              <p className="text-3xl font-bold text-gray-900">2.3min</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">-8%</span>
            <span className="text-gray-600 ml-1">melhoria contínua</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfação Média</p>
              <p className="text-3xl font-bold text-gray-900">4.3</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+0.2</span>
            <span className="text-gray-600 ml-1">pontos</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-gray-900">87%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+5%</span>
            <span className="text-gray-600 ml-1">vs meta</span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atendimentos por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Channel Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Response Time Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tempo de Resposta ao Longo do Dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} min`, "Tempo de Resposta"]} />
            <Line 
              type="monotone" 
              dataKey="tempo" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};