import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";

interface NovoClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteCriado: (clienteId: number) => void;
}

export const NovoClienteDialog = ({
  open,
  onOpenChange,
  onClienteCriado
}: NovoClienteDialogProps) => {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    telefone: "",
    email: "",
    cpf: ""
  });

  const resetForm = () => {
    setFormData({
      nome_completo: "",
      telefone: "",
      email: "",
      cpf: ""
    });
  };

  const handleSubmit = async () => {
    if (!formData.nome_completo || !formData.telefone) {
      toast({
        title: "Atenção",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!profile?.empresa_id) {
      toast({
        title: "Erro",
        description: "Empresa não identificada. Faça login novamente.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('core_clientes')
        .insert({
          nome_completo: formData.nome_completo,
          telefone: formData.telefone,
          empresa_id: profile.empresa_id
        })
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      });

      onClienteCriado(data.id);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome_completo}
              onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(00) 00000-0000"
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
            {loading ? "Salvando..." : "Cadastrar Cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
