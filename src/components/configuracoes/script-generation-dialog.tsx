import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ScriptGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId?: number;
  funcionariaId?: number;
}

export const ScriptGenerationDialog = ({ isOpen, onClose, empresaId, funcionariaId }: ScriptGenerationDialogProps) => {
  const { toast } = useToast();
  const [informacoesGerais, setInformacoesGerais] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRecreateDialog, setShowRecreateDialog] = useState(false);

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && empresaId) {
      loadEmpresaData();
    }
  }, [isOpen, empresaId]);

  const loadEmpresaData = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('core_empresa')
        .select('descricao')
        .eq('id', empresaId)
        .single();

      if (error) throw error;

      const descricao = data?.descricao || "";
      setInformacoesGerais(descricao);
      setOriginalValue(descricao);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar informações da empresa.",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const hasChanges = () => {
    return informacoesGerais !== originalValue;
  };

  const handleCancel = () => {
    if (hasChanges()) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    setInformacoesGerais(originalValue);
    onClose();
  };

  const handleRecreateScript = () => {
    setShowRecreateDialog(true);
  };

  const handleConfirmRecreate = async () => {
    setShowRecreateDialog(false);
    setLoading(true);

    try {
      const response = await fetch('https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_recriar_script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresa_id: empresaId,
          funcionaria_id: funcionariaId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Script de atendimento recriado com sucesso!",
        });
        
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error('Falha na resposta do webhook');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao recriar script. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Geração de Script de Vendas</DialogTitle>
            <DialogDescription>
              Edite as informações gerais da empresa para recriar o script de atendimento personalizado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="informacoes-gerais" className="text-base">
                Informações Gerais
              </Label>
              {dataLoading ? (
                <div className="flex items-center justify-center h-40 border border-cinza-borda rounded-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-grafite" />
                </div>
              ) : (
                <Textarea
                  id="informacoes-gerais"
                  value={informacoesGerais}
                  onChange={(e) => setInformacoesGerais(e.target.value)}
                  className="h-40 resize-none"
                  placeholder="Descreva sua empresa, serviços, diferenciais e público-alvo..."
                />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="bg-dourado text-onyx hover:bg-dourado/90"
              onClick={handleRecreateScript}
              disabled={loading || dataLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recriando...
                </>
              ) : (
                "Recriar Script de Atendimento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog - Confirmação de Cancelamento */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja sair sem salvar?</AlertDialogTitle>
            <AlertDialogDescription>
              Você fez alterações no texto. Se sair agora, todas as alterações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog - Confirmação de Recriação */}
      <AlertDialog open={showRecreateDialog} onOpenChange={setShowRecreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar recriação do script</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja recriar o script de atendimento? Esta ação irá substituir o script atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRecreateDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-dourado text-onyx hover:bg-dourado/90"
              onClick={handleConfirmRecreate}
            >
              Confirmar Recriação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
