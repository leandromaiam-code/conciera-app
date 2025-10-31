import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface PersonalizarConcieraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId?: number;
}

export const PersonalizarConcieraDialog = ({ isOpen, onClose, empresaId }: PersonalizarConcieraDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Form state
  const [nomeConciera, setNomeConciera] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [personalidade, setPersonalidade] = useState("");
  const [foco, setFoco] = useState("");

  // Original values for change detection
  const [originalValues, setOriginalValues] = useState({
    nomeConciera: "",
    objetivo: "",
    personalidade: "",
    foco: "",
  });

  // IDs needed for updates
  const [funcionariaId, setFuncionariaId] = useState<number | null>(null);
  const [scriptId, setScriptId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && empresaId) {
      loadData();
    }
  }, [isOpen, empresaId]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      // 1. Buscar funcionária virtual
      const { data: funcionaria, error: funcError } = await supabase
        .from("config_funcionaria_virtual")
        .select("id, nome")
        .eq("empresa_id", empresaId)
        .single();

      if (funcError) throw funcError;
      if (!funcionaria) {
        toast({
          title: "Erro",
          description: "Funcionária virtual não encontrada. Configure primeiro.",
          variant: "destructive",
        });
        onClose();
        return;
      }

      setFuncionariaId(funcionaria.id);
      setNomeConciera(funcionaria.nome || "");

      // 2. Buscar script de vendas
      const { data: script, error: scriptError } = await supabase
        .from("config_script_vendas")
        .select("id, objetivo, personalidade, foco")
        .eq("funcionaria_id", funcionaria.id)
        .single();

      if (scriptError && scriptError.code !== "PGRST116") {
        // PGRST116 = not found
        throw scriptError;
      }

      if (script) {
        setScriptId(script.id);
        setObjetivo(script.objetivo || "");
        setPersonalidade(script.personalidade || "");
        setFoco(script.foco || "");
      }

      // Store original values
      setOriginalValues({
        nomeConciera: funcionaria.nome || "",
        objetivo: script?.objetivo || "",
        personalidade: script?.personalidade || "",
        foco: script?.foco || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da Conciera",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      nomeConciera !== originalValues.nomeConciera ||
      objetivo !== originalValues.objetivo ||
      personalidade !== originalValues.personalidade ||
      foco !== originalValues.foco
    );
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
    // Reset form
    setNomeConciera(originalValues.nomeConciera);
    setObjetivo(originalValues.objetivo);
    setPersonalidade(originalValues.personalidade);
    setFoco(originalValues.foco);
    onClose();
  };

  const handleSave = () => {
    // Validations
    if (nomeConciera.trim().length < 2) {
      toast({
        title: "Validação",
        description: "O nome da Conciera deve ter pelo menos 2 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (objetivo.trim().length < 10) {
      toast({
        title: "Validação",
        description: "O objetivo deve ter pelo menos 10 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (personalidade.trim().length < 10) {
      toast({
        title: "Validação",
        description: "A personalidade deve ter pelo menos 10 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (foco.trim().length < 10) {
      toast({
        title: "Validação",
        description: "O foco deve ter pelo menos 10 caracteres",
        variant: "destructive",
      });
      return;
    }

    setShowSaveDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowSaveDialog(false);
    setLoading(true);

    try {
      // 1. Update funcionaria_virtual nome
      const { error: funcError } = await supabase
        .from("config_funcionaria_virtual")
        .update({ nome: nomeConciera.trim() })
        .eq("id", funcionariaId);

      if (funcError) throw funcError;

      // 2. Update script_vendas
      if (scriptId) {
        const { error: scriptError } = await supabase
          .from("config_script_vendas")
          .update({
            nome_agente: nomeConciera.trim(),
            objetivo: objetivo.trim(),
            personalidade: personalidade.trim(),
            foco: foco.trim(),
          })
          .eq("id", scriptId);

        if (scriptError) throw scriptError;
      }

      toast({
        title: "Sucesso",
        description: "Personalização da Conciera salva com sucesso!",
      });

      // Update original values
      setOriginalValues({
        nomeConciera: nomeConciera.trim(),
        objetivo: objetivo.trim(),
        personalidade: personalidade.trim(),
        foco: foco.trim(),
      });

      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personalizar Conciera</DialogTitle>
          </DialogHeader>

          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-dourado" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Assistente Virtual *</Label>
                <Input
                  id="nome"
                  value={nomeConciera}
                  onChange={(e) => setNomeConciera(e.target.value)}
                  placeholder="Ex: Maria, Ana, Paula..."
                  maxLength={50}
                  disabled={loading}
                />
                <p className="text-xs text-grafite">Mínimo 2 caracteres, máximo 50</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo Principal *</Label>
                <Textarea
                  id="objetivo"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Qual o objetivo principal da assistente? (Ex: Agendar consultas, vender procedimentos...)"
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                />
                <p className="text-xs text-grafite">Mínimo 10 caracteres, máximo 500</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalidade">Personalidade *</Label>
                <Textarea
                  id="personalidade"
                  value={personalidade}
                  onChange={(e) => setPersonalidade(e.target.value)}
                  placeholder="Como a assistente deve se comportar? (Ex: Amigável, profissional, empática...)"
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                />
                <p className="text-xs text-grafite">Mínimo 10 caracteres, máximo 500</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foco">Foco de Atuação *</Label>
                <Textarea
                  id="foco"
                  value={foco}
                  onChange={(e) => setFoco(e.target.value)}
                  placeholder="Em que a assistente deve focar? (Ex: Qualificar leads, educar sobre procedimentos...)"
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                />
                <p className="text-xs text-grafite">Mínimo 10 caracteres, máximo 500</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button
              className="bg-dourado text-onyx hover:bg-dourado/90"
              onClick={handleSave}
              disabled={loading || dataLoading || !hasChanges()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Tem certeza que deseja descartar essas alterações?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar Editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá atualizar o nome e comportamento da sua assistente virtual. As mudanças serão aplicadas
              imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} className="bg-dourado text-onyx hover:bg-dourado/90">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
