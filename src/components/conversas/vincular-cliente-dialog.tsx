import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Cliente {
  id: number;
  nome_completo: string;
  telefone: string;
}

interface VincularClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversaId: bigint;
  sessionId: string;
  telefoneConversa?: string;
  onClienteVinculado: () => void;
}

export const VincularClienteDialog = ({
  open,
  onOpenChange,
  conversaId,
  sessionId,
  telefoneConversa,
  onClienteVinculado
}: VincularClienteDialogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchClientes();
      if (telefoneConversa) {
        setSearchTerm(telefoneConversa);
      }
    }
  }, [open, telefoneConversa]);

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
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive"
      });
    }
  };

  const handleVincular = async () => {
    if (!selectedClienteId) {
      toast({
        title: "Atenção",
        description: "Selecione um cliente para vincular",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Atualizar a conversa com o cliente_id
      const { error: conversaError } = await supabase
        .from('core_conversas')
        .update({ cliente_id: parseInt(selectedClienteId) })
        .eq('id', Number(conversaId));

      if (conversaError) throw conversaError;

      // Atualizar as mensagens da memória com o cliente_id
      const { error: memoriaError } = await supabase
        .from('ingestion_memoria_clientes_historico_01')
        .update({ cliente_id: parseInt(selectedClienteId) })
        .eq('session_id', sessionId);

      if (memoriaError) throw memoriaError;

      toast({
        title: "Sucesso",
        description: "Cliente vinculado com sucesso!",
      });

      onClienteVinculado();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao vincular cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível vincular o cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone?.includes(searchTerm)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Vincular Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-cliente">Buscar Cliente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grafite" />
              <Input
                id="search-cliente"
                placeholder="Nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="select-cliente">Selecionar Cliente</Label>
            <Select value={selectedClienteId} onValueChange={setSelectedClienteId}>
              <SelectTrigger id="select-cliente">
                <SelectValue placeholder="Escolha um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {filteredClientes.length === 0 ? (
                  <div className="p-4 text-center text-sm text-grafite">
                    Nenhum cliente encontrado
                  </div>
                ) : (
                  filteredClientes.map((cliente) => (
                    <SelectItem key={cliente.id.toString()} value={cliente.id.toString()}>
                      {cliente.nome_completo} - {cliente.telefone}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleVincular}
            disabled={loading || !selectedClienteId}
            className="bg-dourado text-onyx hover:bg-dourado/90"
          >
            {loading ? "Vinculando..." : "Vincular Cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};