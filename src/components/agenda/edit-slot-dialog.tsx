import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DisponibilidadeAgenda } from "@/hooks/use-disponibilidade-agenda";

interface EditSlotDialogProps {
  open: boolean;
  onClose: () => void;
  slot: DisponibilidadeAgenda | null;
  diaSemana: string;
  turno: string;
  onSave: (data: {
    horario_inicio: string;
    horario_fim: string;
    tipo: string;
    tipo_consulta: string;
    procedimento: string;
  }) => void;
}

export function EditSlotDialog({ open, onClose, slot, diaSemana, turno, onSave }: EditSlotDialogProps) {
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [tipo, setTipo] = useState("ambos");
  const [tipoConsulta, setTipoConsulta] = useState("ambos");
  const [procedimento, setProcedimento] = useState("todos");

  useEffect(() => {
    if (slot) {
      setHorarioInicio(slot.horario_inicio);
      setHorarioFim(slot.horario_fim);
      setTipo(slot.tipo);
      setTipoConsulta((slot as any).tipo_consulta || "ambos");
      setProcedimento(slot.procedimento);
    } else {
      // Default values for new slots
      const defaults = {
        manha: { inicio: '08:00', fim: '12:00' },
        tarde: { inicio: '14:00', fim: '18:00' },
        noite: { inicio: '18:00', fim: '22:00' }
      };
      const defaultTime = defaults[turno as keyof typeof defaults] || { inicio: '08:00', fim: '18:00' };
      setHorarioInicio(defaultTime.inicio);
      setHorarioFim(defaultTime.fim);
      setTipo("ambos");
      setTipoConsulta("ambos");
      setProcedimento("todos");
    }
  }, [slot, turno]);

  const handleSave = () => {
    onSave({
      horario_inicio: horarioInicio,
      horario_fim: horarioFim,
      tipo,
      tipo_consulta: tipoConsulta,
      procedimento
    });
    onClose();
  };

  const getDiaLabel = (dia: string) => {
    const labels: Record<string, string> = {
      segunda: 'Segunda-feira',
      terca: 'Terça-feira',
      quarta: 'Quarta-feira',
      quinta: 'Quinta-feira',
      sexta: 'Sexta-feira',
      sabado: 'Sábado',
      domingo: 'Domingo'
    };
    return labels[dia] || dia;
  };

  const getTurnoLabel = (t: string) => {
    const labels: Record<string, string> = {
      manha: 'Manhã',
      tarde: 'Tarde',
      noite: 'Noite'
    };
    return labels[t] || t;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Editar Disponibilidade
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {getDiaLabel(diaSemana)} - {getTurnoLabel(turno)}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horario-inicio" className="text-sm font-medium">
                Horário Início
              </Label>
              <Input
                id="horario-inicio"
                type="time"
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario-fim" className="text-sm font-medium">
                Horário Fim
              </Label>
              <Input
                id="horario-fim"
                type="time"
                value={horarioFim}
                onChange={(e) => setHorarioFim(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-medium">
                Tipo de Atendimento
              </Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambos">Ambos</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-consulta" className="text-sm font-medium">
                Tipo Consulta
              </Label>
              <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                <SelectTrigger id="tipo-consulta">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambos">Ambos</SelectItem>
                  <SelectItem value="primeira_consulta">1ª Consulta</SelectItem>
                  <SelectItem value="retorno">Retorno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedimento" className="text-sm font-medium">
              Procedimentos
            </Label>
            <Select value={procedimento} onValueChange={setProcedimento}>
              <SelectTrigger id="procedimento">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Procedimentos</SelectItem>
                <SelectItem value="avaliacao">Apenas Avaliação</SelectItem>
                <SelectItem value="consulta">Apenas Consulta</SelectItem>
                <SelectItem value="retorno">Apenas Retorno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
