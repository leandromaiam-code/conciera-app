import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar as CalendarIcon, Phone, AlertCircle, Edit, Trash2, CheckCircle, XCircle, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useCoreAgendamentosReal } from "@/hooks/use-core-agendamentos-real";
import { useToast } from "@/hooks/use-toast";
import { CoreAgendamentos } from "@/types/briefing-types";
import { AgendamentoFormDialog } from "@/components/agenda/agendamento-form-dialog";
import { DisponibilidadeGridDialog } from "@/components/agenda/disponibilidade-grid-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingAgendamentoId, setEditingAgendamentoId] = useState<bigint | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<bigint | null>(null);
  const [showDisponibilidadeDialog, setShowDisponibilidadeDialog] = useState(false);
  
  // Memoize date calculations to prevent unnecessary re-renders
  const { startOfDay, endOfDay } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return { startOfDay: start, endOfDay: end };
  }, [selectedDate.getTime()]);

  const { 
    agendamentos, 
    loading, 
    error, 
    updateAgendamento,
    deleteAgendamento,
    marcarComparecimento, 
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

  const handleNovoAgendamento = () => {
    setEditingAgendamentoId(undefined);
    setShowFormDialog(true);
  };

  const handleEditarAgendamento = (id: bigint) => {
    setEditingAgendamentoId(id);
    setShowFormDialog(true);
  };

  const handleDeleteClick = (id: bigint) => {
    setAgendamentoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (agendamentoToDelete) {
      try {
        await deleteAgendamento(agendamentoToDelete);
        toast({
          title: "Sucesso",
          description: "Agendamento excluído com sucesso",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o agendamento",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setAgendamentoToDelete(null);
  };

  const handleMarcarComparecimento = async (id: bigint, compareceu: boolean) => {
    try {
      await marcarComparecimento(id, compareceu);
      toast({
        title: "Sucesso",
        description: `Comparecimento ${compareceu ? 'confirmado' : 'desmarcado'}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o comparecimento",
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
          <Button 
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setShowDisponibilidadeDialog(true)}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Configurar Disponibilidade
          </Button>
          
          <Button 
            className="bg-dourado text-onyx hover:bg-dourado/90 w-full sm:w-auto"
            onClick={handleNovoAgendamento}
          >
            <Plus className="w-4 h-4 mr-2" />
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
                    <div className="flex flex-col gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-onyx">{agendamento.core_clientes_nome_completo}</h3>
                          <TemperatureIndicator ui_temperatura_lead={uiTemperature} />
                        </div>
                        
                        <p className="text-grafite">{agendamento.core_agendamentos_servico_interesse}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-grafite">
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

                      <div className="flex flex-col gap-2 pt-2 border-t border-cinza-borda">
                        <Select
                          value={agendamento.core_agendamentos_status}
                          onValueChange={(newStatus) => 
                            handleStatusChange(BigInt(agendamento.core_agendamentos_id), newStatus)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarAgendamento(BigInt(agendamento.core_agendamentos_id));
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(BigInt(agendamento.core_agendamentos_id));
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>

                        {agendamento.core_agendamentos_status === 'confirmado' && (
                          <div className="flex gap-2 w-full">
                            <Button
                              size="sm"
                              variant={agendamento.core_agendamentos_compareceu === true ? "default" : "outline"}
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarcarComparecimento(BigInt(agendamento.core_agendamentos_id), true);
                              }}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Compareceu
                            </Button>
                            <Button
                              size="sm"
                              variant={agendamento.core_agendamentos_compareceu === false ? "destructive" : "outline"}
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarcarComparecimento(BigInt(agendamento.core_agendamentos_id), false);
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Faltou
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AgendamentoFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        agendamentoId={editingAgendamentoId}
        onSuccess={refetch}
      />

      <DisponibilidadeGridDialog
        open={showDisponibilidadeDialog}
        onClose={() => setShowDisponibilidadeDialog(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};