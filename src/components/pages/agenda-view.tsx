import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar as CalendarIcon, Phone } from "lucide-react";
import { useState } from "react";

interface Agendamento {
  core_agendamentos_id: string;
  core_clientes_nome_completo: string;
  core_agendamentos_servico_interesse: string;
  core_agendamentos_data_hora: string;
  core_clientes_telefone: string;
  core_agendamentos_status: 'confirmado' | 'pendente' | 'cancelado';
  ui_temperatura_lead: 1 | 2 | 3;
  core_agendamentos_valor_estimado?: number;
}

const agendamentos: Agendamento[] = [
  {
    core_agendamentos_id: "1",
    core_clientes_nome_completo: "Maria Silva",
    core_agendamentos_servico_interesse: "Harmonização Facial",
    core_agendamentos_data_hora: "14:30",
    core_clientes_telefone: "(11) 99999-1234",
    core_agendamentos_status: "confirmado",
    ui_temperatura_lead: 3,
    core_agendamentos_valor_estimado: 2800
  },
  {
    core_agendamentos_id: "2",
    core_clientes_nome_completo: "João Santos", 
    core_agendamentos_servico_interesse: "Implante Capilar",
    core_agendamentos_data_hora: "16:00",
    core_clientes_telefone: "(11) 99999-5678",
    core_agendamentos_status: "pendente",
    ui_temperatura_lead: 2,
    core_agendamentos_valor_estimado: 8500
  },
  {
    core_agendamentos_id: "3",
    core_clientes_nome_completo: "Ana Costa",
    core_agendamentos_servico_interesse: "Rinoplastia",
    core_agendamentos_data_hora: "09:15",
    core_clientes_telefone: "(11) 99999-9012",
    core_agendamentos_status: "confirmado",
    ui_temperatura_lead: 3,
    core_agendamentos_valor_estimado: 12000
  }
];

const TemperatureIndicator = ({ ui_temperatura_lead }: { ui_temperatura_lead: 1 | 2 | 3 }) => (
  <div className="flex gap-1">
    {[1, 2, 3].map(level => (
      <div
        key={level}
        className={`w-2 h-2 rounded-full ${
          level <= ui_temperatura_lead ? 'bg-dourado' : 'bg-cinza-claro'
        }`}
      />
    ))}
  </div>
);

export const AgendaView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  return (
    <div className="space-y-md 1g:space-y1g">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button className="bg-dourado text-onyx hover:bg-dourado/90 w-full sm:w-auto">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:gap-lg">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border w-full"
            />
          </CardContent>
        </Card>

        {/* Agendamentos List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agendamentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.core_agendamentos_id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  agendamento.core_agendamentos_valor_estimado && agendamento.core_agendamentos_valor_estimado > 5000
                    ? 'border-l-4 border-l-dourado'
                    : 'border-cinza-borda'
                } ${selectedAgendamento?.core_agendamentos_id === agendamento.core_agendamentos_id ? 'bg-dourado/10' : 'bg-branco-puro'}`}
                onClick={() => setSelectedAgendamento(agendamento)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-onyx">{agendamento.core_clientes_nome_completo}</h3>
                      <TemperatureIndicator ui_temperatura_lead={agendamento.ui_temperatura_lead} />
                    </div>
                    
                    <p className="text-grafite">{agendamento.core_agendamentos_servico_interesse}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-grafite">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {agendamento.core_agendamentos_data_hora}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {agendamento.core_clientes_telefone}
                      </div>
                    </div>

                    {agendamento.core_agendamentos_valor_estimado && (
                      <p className="text-dourado font-semibold">
                        Valor Estimado: R$ {agendamento.core_agendamentos_valor_estimado.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={agendamento.core_agendamentos_status === 'confirmado' ? 'default' : 
                               agendamento.core_agendamentos_status === 'pendente' ? 'secondary' : 'destructive'}
                    >
                      {agendamento.core_agendamentos_status.charAt(0).toUpperCase() + agendamento.core_agendamentos_status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};