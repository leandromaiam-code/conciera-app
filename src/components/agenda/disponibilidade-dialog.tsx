import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDisponibilidadeAgenda, DisponibilidadeAgenda } from "@/hooks/use-disponibilidade-agenda";
import { Trash2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface DisponibilidadeDialogProps {
  open: boolean;
  onClose: () => void;
}

const diasSemana = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

const turnos = [
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' },
];

const tipos = [
  { value: 'primeira_consulta', label: '1ª Consulta' },
  { value: 'retorno', label: 'Retorno' },
  { value: 'ambos', label: 'Ambos' },
];

export const DisponibilidadeDialog = ({ open, onClose }: DisponibilidadeDialogProps) => {
  const { disponibilidades, isLoading, createDisponibilidade, updateDisponibilidade, deleteDisponibilidade } = useDisponibilidadeAgenda();
  
  const [newEntry, setNewEntry] = useState({
    dia_semana: 'segunda' as DisponibilidadeAgenda['dia_semana'],
    turno: 'manha' as DisponibilidadeAgenda['turno'],
    horario_inicio: '09:00',
    horario_fim: '12:00',
    tipo: 'ambos' as DisponibilidadeAgenda['tipo'],
    tipo_consulta: 'ambos' as DisponibilidadeAgenda['tipo_consulta'],
    procedimento: 'todos',
    ativo: true,
    is_recorrente: true,
  });

  const handleAdd = () => {
    createDisponibilidade.mutate(newEntry);
  };

  const handleToggleAtivo = (id: number, currentAtivo: boolean) => {
    updateDisponibilidade.mutate({ id, ativo: !currentAtivo });
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover esta disponibilidade?')) {
      deleteDisponibilidade.mutate(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Configurar Disponibilidade</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Form para adicionar nova disponibilidade */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4">Adicionar Nova Disponibilidade</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Dia da Semana</Label>
                    <Select
                      value={newEntry.dia_semana}
                      onValueChange={(value) => setNewEntry({ ...newEntry, dia_semana: value as DisponibilidadeAgenda['dia_semana'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map((dia) => (
                          <SelectItem key={dia.value} value={dia.value}>
                            {dia.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Turno</Label>
                    <Select
                      value={newEntry.turno}
                      onValueChange={(value) => setNewEntry({ ...newEntry, turno: value as DisponibilidadeAgenda['turno'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {turnos.map((turno) => (
                          <SelectItem key={turno.value} value={turno.value}>
                            {turno.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Horário Início</Label>
                    <Input
                      type="time"
                      value={newEntry.horario_inicio}
                      onChange={(e) => setNewEntry({ ...newEntry, horario_inicio: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Horário Fim</Label>
                    <Input
                      type="time"
                      value={newEntry.horario_fim}
                      onChange={(e) => setNewEntry({ ...newEntry, horario_fim: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={newEntry.tipo}
                      onValueChange={(value) => setNewEntry({ ...newEntry, tipo: value as DisponibilidadeAgenda['tipo'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Procedimento</Label>
                    <Input
                      placeholder="todos ou separados por vírgula"
                      value={newEntry.procedimento}
                      onChange={(e) => setNewEntry({ ...newEntry, procedimento: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleAdd} className="mt-4 w-full" disabled={createDisponibilidade.isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Disponibilidade
                </Button>
              </CardContent>
            </Card>

            {/* Lista de disponibilidades existentes */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Disponibilidades Configuradas</h3>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : disponibilidades.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma disponibilidade configurada ainda.</p>
              ) : (
                disponibilidades.map((disp) => (
                  <Card key={disp.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">{diasSemana.find(d => d.value === disp.dia_semana)?.label}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{turnos.find(t => t.value === disp.turno)?.label}</span>
                            <span className="ml-2">{disp.horario_inicio} - {disp.horario_fim}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipo:</span> {tipos.find(t => t.value === disp.tipo)?.label}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Proc:</span> {disp.procedimento}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={disp.ativo}
                            onCheckedChange={() => handleToggleAtivo(disp.id, disp.ativo)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(disp.id)}
                            disabled={deleteDisponibilidade.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
