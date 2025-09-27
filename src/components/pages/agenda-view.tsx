import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar as CalendarIcon, Phone, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useCoreAgendamentosReal } from "@/hooks/use-core-agendamentos-real";
import { useToast } from "@/hooks/use-toast";
import { CoreAgendamentos } from "@/types/briefing-types";

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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'confirmado':
      return 'default';
    case 'pendente':
      return 'secondary';
    case 'cancelado':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const AgendamentoSkeleton = () => (
  <div className="p-4 rounded-lg border border-cinza-borda space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="w-2 h-2 rounded-full" />
        ))}
      </div>
    </div>
    <Skeleton className="h-4 w-40" />
    <div className="flex items-center gap-4">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-4 w-28" />
  </div>
);

export const AgendaView = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAgendamento, setSelectedAgendamento] = useState<CoreAgendamentos | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  
  // Calculate date range for today's appointments
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const { 
    agendamentos, 
    loading, 
    error, 
    updateAgendamento, 
    refetch 
  } = useCoreAgendamentosReal(startOfDay, endOfDay, statusFilter);

  const handleStatusChange = async (agendamentoId: bigint, newStatus: string) => {
    try {
      await updateAgendamento(agendamentoId, {
        core_agendamentos_status: newStatus
      });
      toast({
        title: "Agendamento atualizado",
        description: `Status alterado para ${newStatus}`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agendamento",
        variant: "destructive"
      });
    }
  };

  // Transform briefing temperature to UI temperature
  const getUITemperature = (briefingTemp?: number): 1 | 2 | 3 => {
    if (!briefingTemp) return 2;
    return Math.max(1, Math.min(3, briefingTemp)) as 1 | 2 | 3;
  };

  return (
    <div className="space-y-md lg:space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-dourado text-onyx hover:bg-dourado/90 w-full sm:w-auto">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
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
            <CardTitle>
              Agendamentos de {selectedDate.toLocaleDateString('pt-BR')}
              {agendamentos.length > 0 && (
                <span className="text-sm font-normal text-grafite ml-2">
                  ({agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <AgendamentoSkeleton key={i} />
              ))
            ) : agendamentos.length === 0 ? (
              <div className="text-center py-8 text-grafite">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum agendamento encontrado para esta data.</p>
              </div>
            ) : (
              agendamentos.map((agendamento) => {
                const uiTemperature = getUITemperature(agendamento.core_briefings_temperatura_lead);
                const dataHora = new Date(agendamento.core_agendamentos_data_hora);
                
                return (
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
                          <TemperatureIndicator ui_temperatura_lead={uiTemperature} />
                        </div>
                        
                        <p className="text-grafite">{agendamento.core_agendamentos_servico_interesse}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-grafite">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {dataHora.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {agendamento.core_clientes_telefone}
                          </div>
                        </div>

                        {agendamento.core_agendamentos_valor_estimado && (
                          <p className="text-dourado font-semibold">
                            Valor Estimado: R$ {agendamento.core_agendamentos_valor_estimado.toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Select
                          value={agendamento.core_agendamentos_status}
                          onValueChange={(newStatus) => 
                            handleStatusChange(BigInt(agendamento.core_agendamentos_id), newStatus)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};