import { Calendar, Clock, User, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agendamentos = [
  {
    id: 1,
    paciente: "Maria Silva",
    horario: "09:00",
    servico: "Consulta Cardiologia",
    status: "confirmado",
    telefone: "(11) 99999-9999"
  },
  {
    id: 2,
    paciente: "João Santos",
    horario: "10:30",
    servico: "Exame Rotina",
    status: "pendente",
    telefone: "(11) 88888-8888"
  },
  {
    id: 3,
    paciente: "Ana Costa",
    horario: "14:00",
    servico: "Retorno",
    status: "confirmado",
    telefone: "(11) 77777-7777"
  },
  {
    id: 4,
    paciente: "Pedro Lima",
    horario: "15:30",
    servico: "Consulta Ortopedia",
    status: "cancelado",
    telefone: "(11) 66666-6666"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmado": return "bg-green-100 text-green-800";
    case "pendente": return "bg-yellow-100 text-yellow-800";
    case "cancelado": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const AgendaView = () => {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Hoje, 15 de Janeiro de 2024
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hoje</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmados</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <User className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos de Hoje</h3>
        <div className="space-y-3">
          {agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {agendamento.horario}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{agendamento.paciente}</h4>
                  <p className="text-sm text-gray-600">{agendamento.servico}</p>
                  <p className="text-xs text-gray-500">{agendamento.telefone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(agendamento.status)}>
                  {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                </Badge>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};