import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { NovoClienteDialog } from "./novo-cliente-dialog";

interface Cliente {
  id: number;
  nome_completo: string;
  telefone: string;
}

interface AgendamentoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamentoId?: bigint;
  onSuccess: () => void;
}

export const AgendamentoFormDialog = ({
  open,
  onOpenChange,
  agendamentoId,
  onSuccess
}: AgendamentoFormDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [novoClienteDialogOpen, setNovoClienteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: "",
    empresa_id: 1,
    servico_interesse: "",
    data: new Date(),
    hora: "",
    valor_estimado: "",
    status: "pendente",
    notas: ""
  });

  useEffect(() => {
    if (open) {
      fetchClientes();
      if (agendamentoId) {
        fetchAgendamento();
      } else {
        resetForm();
      }
    }
  }, [open, agendamentoId]);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('core_clientes')
        .select('id, nome_completo, telefone')
        .order('nome_completo');

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchAgendamento = async () => {
    try {
      const { data, error } = await supabase
        .from('core_agendamentos')
        .select('*')
        .eq('id', Number(agendamentoId))
        .single();

      if (error) throw error;

      const dataHora = new Date(data.data_hora);
      setFormData({
        cliente_id: data.cliente_id.toString(),
        empresa_id: data.empresa_id,
        servico_interesse: data.servico_interesse,
        data: dataHora,
        hora: format(dataHora, 'HH:mm'),
        valor_estimado: data.valor_estimado?.toString() || "",
        status: data.status,
        notas: data.notas || ""
      });
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do agendamento",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      cliente_id: "",
      empresa_id: 1,
      servico_interesse: "",
      data: new Date(),
      hora: "",
      valor_estimado: "",
      status: "pendente",
      notas: ""
    });
  };

  const handleSubmit = async () => {
    if (!formData.cliente_id || !formData.servico_interesse || !formData.hora) {
      toast({
        title: "Atenção",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Combinar data e hora
      const [hora, minuto] = formData.hora.split(':');
      const dataHora = new Date(formData.data);
      dataHora.setHours(parseInt(hora), parseInt(minuto), 0, 0);

      const agendamentoData = {
        cliente_id: parseInt(formData.cliente_id),
        empresa_id: formData.empresa_id,
        servico_interesse: formData.servico_interesse,
        data_hora: dataHora.toISOString(),
        valor_estimado: formData.valor_estimado ? parseFloat(formData.valor_estimado) : null,
        status: formData.status,
        notas: formData.notas || null,
        origem_lead: 'manual'
      };

      if (agendamentoId) {
        // Atualizar
        const { error } = await supabase
          .from('core_agendamentos')
          .update(agendamentoData)
          .eq('id', Number(agendamentoId));

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Agendamento atualizado com sucesso!",
        });
      } else {
        // Criar
        const { error } = await supabase
          .from('core_agendamentos')
          .insert(agendamentoData);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Agendamento criado com sucesso!",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o agendamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClienteCriado = async (clienteId: number) => {
    await fetchClientes();
    setFormData({ ...formData, cliente_id: clienteId.toString() });
  };

  return (
    <>
      <NovoClienteDialog
        open={novoClienteDialogOpen}
        onOpenChange={setNovoClienteDialogOpen}
        onClienteCriado={handleClienteCriado}
      />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {agendamentoId ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cliente">Cliente *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setNovoClienteDialogOpen(true)}
                className="h-8 gap-1 text-dourado hover:text-dourado/80"
              >
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </div>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
            >
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id.toString()} value={cliente.id.toString()}>
                    {cliente.nome_completo} - {cliente.telefone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="servico">Serviço de Interesse *</Label>
            <Input
              id="servico"
              value={formData.servico_interesse}
              onChange={(e) => setFormData({ ...formData, servico_interesse: e.target.value })}
              placeholder="Ex: Consulta, Procedimento..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.data ? format(formData.data, "dd/MM/yyyy") : "Selecione..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.data}
                    onSelect={(date) => date && setFormData({ ...formData, data: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hora">Hora *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grafite" />
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor Estimado (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor_estimado}
                onChange={(e) => setFormData({ ...formData, valor_estimado: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
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

          <div className="grid gap-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Adicione observações sobre o agendamento..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-dourado text-onyx hover:bg-dourado/90"
          >
            {loading ? "Salvando..." : agendamentoId ? "Atualizar" : "Criar Agendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};