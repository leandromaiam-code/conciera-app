import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useDisponibilidadeAgenda, DisponibilidadeAgenda } from "@/hooks/use-disponibilidade-agenda";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Calendar as CalendarIcon, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditSlotDialog } from "./edit-slot-dialog";

interface DisponibilidadeGridDialogProps {
  open: boolean;
  onClose: () => void;
}

const diasSemana = [
  { value: 'segunda', label: 'Segunda' },
  { value: 'terca', label: 'Terça' },
  { value: 'quarta', label: 'Quarta' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'sexta', label: 'Sexta' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' }
];

const turnos = [
  { value: 'manha', label: 'Manhã', icon: '🌅' },
  { value: 'tarde', label: 'Tarde', icon: '☀️' },
  { value: 'noite', label: 'Noite', icon: '🌙' }
];

export function DisponibilidadeGridDialog({ open, onClose }: DisponibilidadeGridDialogProps) {
  const { disponibilidades, createDisponibilidade, updateDisponibilidade, deleteDisponibilidade } = useDisponibilidadeAgenda();
  
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [editingSlot, setEditingSlot] = useState<{ dia: string; turno: string; slot: DisponibilidadeAgenda | null } | null>(null);
  
  const recorrentes = disponibilidades.filter(d => d.is_recorrente);
  const periodos = disponibilidades.filter(d => !d.is_recorrente);

  const handleSlotClick = (dia: string, turno: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = recorrentes.find(
      d => d.dia_semana === dia && d.turno === turno && d.is_recorrente
    );
    setEditingSlot({ dia, turno, slot: existing || null });
  };

  const handleSaveSlot = async (data: {
    horario_inicio: string;
    horario_fim: string;
    tipo: string;
    procedimento: string;
  }) => {
    if (!editingSlot) return;

    const existing = recorrentes.find(
      d => d.dia_semana === editingSlot.dia && d.turno === editingSlot.turno
    );

    if (existing) {
      await updateDisponibilidade.mutateAsync({
        id: existing.id,
        horario_inicio: data.horario_inicio,
        horario_fim: data.horario_fim,
        tipo: data.tipo as any,
        procedimento: data.procedimento,
        ativo: true
      });
      toast.success("Disponibilidade atualizada");
    } else {
      await createDisponibilidade.mutateAsync({
        dia_semana: editingSlot.dia as any,
        turno: editingSlot.turno as any,
        horario_inicio: data.horario_inicio,
        horario_fim: data.horario_fim,
        tipo: data.tipo as any,
        procedimento: data.procedimento,
        ativo: true,
        is_recorrente: true
      });
      toast.success("Disponibilidade criada");
    }
  };

  const handleAddPeriodo = async () => {
    if (!dateRange.from) {
      toast.error("Selecione pelo menos a data de início");
      return;
    }

    await createDisponibilidade.mutateAsync({
      dia_semana: 'segunda' as any, // Não usado para períodos
      turno: 'manha',
      horario_inicio: '08:00',
      horario_fim: '18:00',
      tipo: 'ambos',
      procedimento: 'todos',
      ativo: false, // Bloqueio por padrão
      is_recorrente: false,
      data_inicio: format(dateRange.from, 'yyyy-MM-dd'),
      data_fim: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(dateRange.from, 'yyyy-MM-dd')
    });

    setDateRange({ from: undefined, to: undefined });
  };

  const isSlotActive = (dia: string, turno: string) => {
    const slot = recorrentes.find(
      d => d.dia_semana === dia && d.turno === turno
    );
    return slot?.ativo || false;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Disponibilidade</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="semanal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="semanal">Padrão Semanal</TabsTrigger>
            <TabsTrigger value="periodos">Exceções e Períodos</TabsTrigger>
          </TabsList>

          <TabsContent value="semanal" className="space-y-4 bg-background">
            <div className="text-sm text-foreground/70 mb-4 p-4 bg-muted/50 rounded-lg border">
              💡 Clique nos slots para ativar/desativar ou use o ícone <Pencil className="w-3 h-3 inline mx-1" /> para editar horários específicos
            </div>

            {/* Grid de Disponibilidade */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-4 bg-primary/10 border-b-2 border-primary/20">
                <div className="p-3 font-semibold border-r text-sm text-foreground"></div>
                {turnos.map(turno => (
                  <div key={turno.value} className="p-3 text-center font-semibold border-r last:border-r-0 text-sm text-foreground">
                    <span className="mr-1">{turno.icon}</span>
                    {turno.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {diasSemana.map((dia, idx) => (
                <div key={dia.value} className={`grid grid-cols-4 ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}>
                  <div className="p-3 font-semibold border-r border-t flex items-center text-sm text-foreground bg-muted/30">
                    {dia.label}
                  </div>
                  {turnos.map(turno => {
                    const isActive = isSlotActive(dia.value, turno.value);
                    const slot = recorrentes.find(d => d.dia_semana === dia.value && d.turno === turno.value);
                    
                    return (
                      <div key={turno.value} className="border-r border-t last:border-r-0 p-2 bg-background">
                        <button
                          onClick={(e) => handleSlotClick(dia.value, turno.value, e)}
                          className={`w-full h-full min-h-[70px] rounded-md transition-all flex flex-col items-center justify-center gap-1.5 border-2 ${
                            isActive 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm' 
                              : 'bg-card hover:bg-accent text-muted-foreground border-border hover:border-primary/30'
                          }`}
                        >
                          {slot ? (
                            <>
                              <Pencil className="w-3.5 h-3.5 mb-0.5" />
                              <span className="text-xs font-semibold">
                                {slot.horario_inicio} - {slot.horario_fim}
                              </span>
                              <span className="text-[10px] opacity-75">
                                {slot.procedimento}
                              </span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5" />
                              <span className="text-[10px] mt-1">Adicionar</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-foreground/70 mt-4 p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-primary rounded border-2 border-primary"></div>
                <span className="font-medium">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-card rounded border-2 border-border"></div>
                <span className="font-medium">Indisponível</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Pencil className="w-4 h-4" />
                <span className="font-medium">Clique para editar horários</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="periodos" className="space-y-4 bg-background">
            <div className="text-sm text-foreground/70 mb-4 p-4 bg-muted/50 rounded-lg border">
              📅 Adicione períodos específicos de bloqueio ou disponibilidade excepcional
            </div>

            {/* Add Period Form */}
            <div className="border rounded-lg p-6 space-y-6 bg-card shadow-sm">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">Selecione o período</Label>
                <div className="flex gap-2 justify-center p-4 bg-background rounded-lg border">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                    disabled={(date) => date < addDays(new Date(), -1)}
                    className="border rounded-md pointer-events-auto bg-card"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddPeriodo} disabled={!dateRange.from} size="lg">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Adicionar Período de Bloqueio
                </Button>
              </div>
            </div>

            {/* List of Periods */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Períodos Configurados</Label>
              {periodos.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                  Nenhum período específico configurado
                </div>
              ) : (
                <div className="space-y-3">
                  {periodos.map(periodo => (
                    <div key={periodo.id} className="flex items-center justify-between p-4 border-2 rounded-lg bg-card shadow-sm hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {periodo.data_inicio && format(new Date(periodo.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                          {periodo.data_fim && periodo.data_fim !== periodo.data_inicio && (
                            <> até {format(new Date(periodo.data_fim), "dd/MM/yyyy", { locale: ptBR })}</>
                          )}
                        </div>
                        <div className="text-sm font-medium mt-1">
                          {periodo.ativo ? (
                            <span className="text-green-600 dark:text-green-400">✅ Disponível</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">🚫 Bloqueado</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={periodo.ativo}
                          onCheckedChange={(checked) => 
                            updateDisponibilidade.mutateAsync({ id: periodo.id, ativo: checked })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteDisponibilidade.mutateAsync(periodo.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>

      <EditSlotDialog
        open={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        slot={editingSlot?.slot || null}
        diaSemana={editingSlot?.dia || ''}
        turno={editingSlot?.turno || ''}
        onSave={handleSaveSlot}
      />
    </Dialog>
  );
}
