import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EditarScriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId?: number;
}

export function EditarScriptDialog({ isOpen, onClose, empresaId }: EditarScriptDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scriptId, setScriptId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Estado para todos os campos
  const [formData, setFormData] = useState({
    nome_agente: "",
    empresa_nome: "",
    objetivo: "",
    personalidade: "",
    foco: "",
    servico_produto: "",
    descricao: "",
    apresentacao_frase: "",
    fechamento_frase: "",
    script_situacao: "",
    script_situacao_conexao: "",
    script_problema: "",
    script_problema_conexao: "",
    script_implicacao: "",
    script_implicacao_conexao: "",
    script_necessidade: "",
    script_necessidade_conexao: "",
    script_apresentacao_produto_servico: "",
    script_qualificacao: "",
    script_fechamento: "",
    script_fechamento2: "",
    tipo_fechamento: "",
    agendamento: "",
    script_agendamento: "",
    script_pagamento: "",
    script_completo: "",
    categoria: "captacao",
    status: "ativo",
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    if (isOpen && empresaId) {
      loadScript();
    }
  }, [isOpen, empresaId]);

  const loadScript = async () => {
    if (!empresaId) return;

    setIsLoading(true);
    try {
      // Buscar funcionária da empresa
      const { data: funcionaria, error: funcError } = await supabase
        .from("config_funcionaria_virtual")
        .select("id")
        .eq("empresa_id", empresaId)
        .single();

      if (funcError) throw funcError;

      // Buscar script mais recente
      const { data: script, error: scriptError } = await supabase
        .from("config_script_vendas")
        .select("*")
        .eq("funcionaria_id", funcionaria.id)
        .order("data", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (scriptError && scriptError.code !== "PGRST116") throw scriptError;

      if (script) {
        const data = {
          nome_agente: script.nome_agente || "",
          empresa_nome: script.empresa_nome || "",
          objetivo: script.objetivo || "",
          personalidade: script.personalidade || "",
          foco: script.foco || "",
          servico_produto: script.servico_produto || "",
          descricao: script.descricao || "",
          apresentacao_frase: script.apresentacao_frase || "",
          fechamento_frase: script.fechamento_frase || "",
          script_situacao: script.script_situacao || "",
          script_situacao_conexao: script.script_situacao_conexao || "",
          script_problema: script.script_problema || "",
          script_problema_conexao: script.script_problema_conexao || "",
          script_implicacao: script.script_implicacao || "",
          script_implicacao_conexao: script.script_implicacao_conexao || "",
          script_necessidade: script.script_necessidade || "",
          script_necessidade_conexao: script.script_necessidade_conexao || "",
          script_apresentacao_produto_servico: script.script_apresentacao_produto_servico || "",
          script_qualificacao: script.script_qualificacao || "",
          script_fechamento: script.script_fechamento || "",
          script_fechamento2: script.script_fechamento2 || "",
          tipo_fechamento: script.tipo_fechamento || "",
          agendamento: script.agendamento || "",
          script_agendamento: script.script_agendamento || "",
          script_pagamento: (script as any).script_pagamento || "",
          script_completo: script.script_completo || "",
          categoria: script.categoria || "captacao",
          status: script.status || "ativo",
        };
        setFormData(data);
        setOriginalData(data);
        setScriptId(script.id);
      }
    } catch (error) {
      console.error("Erro ao carregar script:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o script de vendas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!scriptId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("config_script_vendas")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", scriptId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Script de vendas atualizado com sucesso!",
      });
      
      setOriginalData(formData);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar script:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar o script de vendas.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setFormData(originalData);
    setHasChanges(false);
    setShowCancelDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Script de Vendas</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-dourado" />
            </div>
          ) : (
            <Tabs defaultValue="qualificacao" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="qualificacao">Qualificação</TabsTrigger>
                <TabsTrigger value="atendimento">Script de Atendimento</TabsTrigger>
                <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
                <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 pr-4">
                {/* Tab 1: Qualificação */}
                <TabsContent value="qualificacao" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="script_qualificacao">Perguntas de Qualificação</Label>
                    <Textarea
                      id="script_qualificacao"
                      value={formData.script_qualificacao}
                      onChange={(e) => handleChange("script_qualificacao", e.target.value)}
                      placeholder="Perguntas para qualificar o lead..."
                      rows={10}
                    />
                  </div>
                </TabsContent>

                {/* Tab 2: Script de Atendimento */}
                <TabsContent value="atendimento" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <Textarea
                      value={formData.script_situacao}
                      onChange={(e) => handleChange("script_situacao", e.target.value)}
                      placeholder="Script Situação"
                      rows={4}
                    />

                    <Textarea
                      value={formData.script_situacao_conexao}
                      onChange={(e) => handleChange("script_situacao_conexao", e.target.value)}
                      placeholder="Script Situação Conexão"
                      rows={3}
                    />

                    <Textarea
                      value={formData.script_problema}
                      onChange={(e) => handleChange("script_problema", e.target.value)}
                      placeholder="Script Problema"
                      rows={4}
                    />

                    <Textarea
                      value={formData.script_problema_conexao}
                      onChange={(e) => handleChange("script_problema_conexao", e.target.value)}
                      placeholder="Script Problema Conexão"
                      rows={3}
                    />

                    <Textarea
                      value={formData.script_implicacao}
                      onChange={(e) => handleChange("script_implicacao", e.target.value)}
                      placeholder="Script Implicação"
                      rows={4}
                    />

                    <Textarea
                      value={formData.script_implicacao_conexao}
                      onChange={(e) => handleChange("script_implicacao_conexao", e.target.value)}
                      placeholder="Script Implicação Conexão"
                      rows={3}
                    />

                    <Textarea
                      value={formData.script_necessidade}
                      onChange={(e) => handleChange("script_necessidade", e.target.value)}
                      placeholder="Script Necessidade"
                      rows={4}
                    />

                    <Textarea
                      value={formData.script_necessidade_conexao}
                      onChange={(e) => handleChange("script_necessidade_conexao", e.target.value)}
                      placeholder="Script Necessidade Conexão"
                      rows={3}
                    />

                    <Textarea
                      value={formData.script_apresentacao_produto_servico}
                      onChange={(e) => handleChange("script_apresentacao_produto_servico", e.target.value)}
                      placeholder="Script Apresentação Produto/Serviço"
                      rows={5}
                    />

                    <Textarea
                      value={formData.script_fechamento}
                      onChange={(e) => handleChange("script_fechamento", e.target.value)}
                      placeholder="Script Fechamento"
                      rows={5}
                    />

                    <Textarea
                      value={formData.script_fechamento2}
                      onChange={(e) => handleChange("script_fechamento2", e.target.value)}
                      placeholder="Script Fechamento 2"
                      rows={5}
                    />

                    <Input
                      value={formData.tipo_fechamento}
                      onChange={(e) => handleChange("tipo_fechamento", e.target.value)}
                      placeholder="Tipo de Fechamento"
                    />
                  </div>
                </TabsContent>

                {/* Tab 3: Agendamento */}
                <TabsContent value="agendamento" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="script_agendamento">Script Agendamento</Label>
                    <Textarea
                      id="script_agendamento"
                      value={formData.script_agendamento}
                      onChange={(e) => handleChange("script_agendamento", e.target.value)}
                      placeholder="Como conduzir o agendamento..."
                      rows={10}
                    />
                  </div>
                </TabsContent>

                {/* Tab 4: Pagamento */}
                <TabsContent value="pagamento" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="script_pagamento">Script Pagamento</Label>
                    <Textarea
                      id="script_pagamento"
                      value={formData.script_pagamento}
                      onChange={(e) => handleChange("script_pagamento", e.target.value)}
                      placeholder="Como conduzir o pagamento..."
                      rows={10}
                    />
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="bg-dourado text-onyx hover:bg-dourado/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Deseja realmente sair sem salvar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
