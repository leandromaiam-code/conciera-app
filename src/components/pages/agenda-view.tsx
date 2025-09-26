import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar as CalendarIcon, Phone } from "lucide-react";
import { useState } from "react";

interface Agendamento {
  id: string;
  paciente_nome: string;
  procedimento: string;
  horario: string;
  telefone: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  temperatura: 1 | 2 | 3;
  valor_estimado?: number;
}

const agendamentos: Agendamento[] = [
  {
    id: "1",
    paciente_nome: "Maria Silva",
    procedimento: "Harmonização Facial",
    horario: "14:30",
    telefone: "(11) 99999-1234",
    status: "confirmado",
    temperatura: 3,
    valor_estimado: 2800
  },
  {
    id: "2",
    paciente_nome: "João Santos", 
    procedimento: "Implante Capilar",
    horario: "16:00",
    telefone: "(11) 99999-5678",
    status: "pendente",
    temperatura: 2,
    valor_estimado: 8500
  },
  {
    id: "3",
    paciente_nome: "Ana Costa",
    procedimento: "Rinoplastia",
    horario: "09:15",
    telefone: "(11) 99999-9012",
    status: "confirmado",
    temperatura: 3,
    valor_estimado: 12000
  }
];

const TemperatureIndicator = ({ temperatura }: { temperatura: 1 | 2 | 3 }) => (
  <div className="flex gap-1">
    {[1, 2, 3].map(level => (
      <div
        key={level}
        className={`w-2 h-2 rounded-full ${
          level <= temperatura ? 'bg-dourado' : 'bg-cinza-claro'
        }`}
      />
    ))}
  </div>
);

export const AgendaView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  return (
    <div className="gap-md lg:gap-lg space-y-md lg:space-y-lg">
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
                key={agendamento.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  agendamento.valor_estimado && agendamento.valor_estimado > 5000
                    ? 'border-l-4 border-l-dourado'
                    : 'border-cinza-borda'
                } ${selectedAgendamento?.id === agendamento.id ? 'bg-dourado/10' : 'bg-branco-puro'}`}
                onClick={() => setSelectedAgendamento(agendamento)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-onyx">{agendamento.paciente_nome}</h3>
                      <TemperatureIndicator temperatura={agendamento.temperatura} />
                    </div>
                    
                    <p className="text-grafite">{agendamento.procedimento}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-grafite">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {agendamento.horario}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {agendamento.telefone}
                      </div>
                    </div>

                    {agendamento.valor_estimado && (
                      <p className="text-dourado font-semibold">
                        Valor Estimado: R$ {agendamento.valor_estimado.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={agendamento.status === 'confirmado' ? 'default' : 
                               agendamento.status === 'pendente' ? 'secondary' : 'destructive'}
                    >
                      {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
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