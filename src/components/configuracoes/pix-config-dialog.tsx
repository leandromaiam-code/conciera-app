import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PixConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPixKey?: string;
  onSave: (pixKey: string) => Promise<void>;
}

export const PixConfigDialogDialog = ({
  isOpen,
  onClose,
  currentPixKey = "",
  onSave,
}: PixConfigDialogProps) => {
  const { toast } = useToast();
  const [pixKey, setPixKey] = useState(currentPixKey);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPixKey(currentPixKey);
  }, [currentPixKey, isOpen]);

  const handleSave = async () => {
    if (!pixKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave PIX válida",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await onSave(pixKey.trim());
      toast({
        title: "Sucesso",
        description: "Chave PIX configurada com sucesso!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar chave PIX",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Chave PIX</DialogTitle>
          <DialogDescription>
            Configure sua chave PIX para receber pagamentos automáticos
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pix-key">Chave PIX</Label>
            <Input
              id="pix-key"
              placeholder="Digite sua chave PIX (CPF, e-mail, telefone ou chave aleatória)"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              A chave PIX será usada para gerar QR codes de pagamento
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};