import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDisponibilidadeAgenda, DisponibilidadeAgenda } from "@/hooks/use-disponibilidade-agenda";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [selectedPeriod, setSelectedPeriod] = useState<'recorrente' | 'periodo'>('recorrente');
  
  const recorrentes = disponibilidades.filter(d => d.is_recorrente);
  const periodos = disponibilidades.filter(d => !d.is_recorrente);

  const handleToggleSlot = async (dia: string, turno: string) => {
    const existing = recorrentes.find(
      d => d.dia_semana === dia && d.turno === turno && d.is_recorrente
    );

    if (existing) {
      await updateDisponibilidade.mutateAsync({
        id: existing.id,
        ativo: !existing.ativo
      });
    } else {
      await createDisponibilidade.mutateAsync({
        dia_semana: dia as any,
        turno: turno as any,
        horario_inicio: turno === 'manha' ? '08:00' : turno === 'tarde' ? '14:00' : '18:00',
        horario_fim: turno === 'manha' ? '12:00' : turno === 'tarde' ? '18:00' : '22:00',
        tipo: 'ambos',
        procedimento: 'todos',
        ativo: true,
        is_recorrente: true
      });
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

          <TabsContent value="semanal" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Clique para ativar/desativar disponibilidade em cada turno
            </div>

            {/* Grid de Disponibilidade */}
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-muted">
                <div className="p-3 font-medium border-r text-sm"></div>
                {turnos.map(turno => (
                  <div key={turno.value} className="p-3 text-center font-medium border-r last:border-r-0 text-sm">
                    <span className="mr-1">{turno.icon}</span>
                    {turno.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {diasSemana.map((dia, idx) => (
                <div key={dia.value} className={`grid grid-cols-4 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                  <div className="p-3 font-medium border-r border-t flex items-center text-sm">
                    {dia.label}
                  </div>
                  {turnos.map(turno => {
                    const isActive = isSlotActive(dia.value, turno.value);
                    const slot = recorrentes.find(d => d.dia_semana === dia.value && d.turno === turno.value);
                    
                    return (
                      <div key={turno.value} className="border-r border-t last:border-r-0 p-2">
                        <button
                          onClick={() => handleToggleSlot(dia.value, turno.value)}
                          className={`w-full h-full min-h-[60px] rounded-md transition-all flex flex-col items-center justify-center gap-1 ${
                            isActive 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                          }`}
                        >
                          {slot ? (
                            <>
                              <span className="text-xs font-medium">
                                {slot.horario_inicio} - {slot.horario_fim}
                              </span>
                              <span className="text-[10px] opacity-75">
                                {slot.procedimento}
                              </span>
                            </>
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <span>Indisponível</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="periodos" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Adicione períodos específicos de bloqueio ou disponibilidade excepcional
            </div>

            {/* Add Period Form */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label>Selecione o período</Label>
                <div className="flex gap-2 justify-center">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                    disabled={(date) => date < addDays(new Date(), -1)}
                    className="border rounded-md pointer-events-auto"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddPeriodo} disabled={!dateRange.from}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Adicionar Período de Bloqueio
                </Button>
              </div>
            </div>

            {/* List of Periods */}
            <div className="space-y-2">
              <Label>Períodos Configurados</Label>
              {periodos.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
                  Nenhum período específico configurado
                </div>
              ) : (
                <div className="space-y-2">
                  {periodos.map(periodo => (
                    <div key={periodo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">
                          {periodo.data_inicio && format(new Date(periodo.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                          {periodo.data_fim && periodo.data_fim !== periodo.data_inicio && (
                            <> até {format(new Date(periodo.data_fim), "dd/MM/yyyy", { locale: ptBR })}</>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {periodo.ativo ? '✅ Disponível' : '🚫 Bloqueado'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
    </Dialog>
  );
}
