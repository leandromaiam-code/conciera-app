import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

    // Validações
    if (!formData.nome_agente || formData.nome_agente.length < 2) {
      toast({
        title: "Validação",
        description: "Nome do agente é obrigatório (mínimo 2 caracteres).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.objetivo || formData.objetivo.length < 10) {
      toast({
        title: "Validação",
        description: "Objetivo é obrigatório (mínimo 10 caracteres).",
        variant: "destructive",
      });
      return;
    }

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
            <Tabs defaultValue="basico" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basico">Básico</TabsTrigger>
                <TabsTrigger value="spin">SPIN</TabsTrigger>
                <TabsTrigger value="vendas">Vendas</TabsTrigger>
                <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
                <TabsTrigger value="completo">Script</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 pr-4">
                {/* Tab 1: Básico */}
                <TabsContent value="basico" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_agente">Nome do Agente *</Label>
                      <Input
                        id="nome_agente"
                        value={formData.nome_agente}
                        onChange={(e) => handleChange("nome_agente", e.target.value)}
                        placeholder="Ex: Maria"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="empresa_nome">Nome da Empresa</Label>
                      <Input
                        id="empresa_nome"
                        value={formData.empresa_nome}
                        onChange={(e) => handleChange("empresa_nome", e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objetivo">Objetivo *</Label>
                    <Textarea
                      id="objetivo"
                      value={formData.objetivo}
                      onChange={(e) => handleChange("objetivo", e.target.value)}
                      placeholder="Descreva o objetivo principal..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personalidade">Personalidade</Label>
                    <Textarea
                      id="personalidade"
                      value={formData.personalidade}
                      onChange={(e) => handleChange("personalidade", e.target.value)}
                      placeholder="Como deve ser a personalidade da assistente..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foco">Foco</Label>
                    <Textarea
                      id="foco"
                      value={formData.foco}
                      onChange={(e) => handleChange("foco", e.target.value)}
                      placeholder="Qual o foco principal..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servico_produto">Serviço/Produto</Label>
                    <Textarea
                      id="servico_produto"
                      value={formData.servico_produto}
                      onChange={(e) => handleChange("servico_produto", e.target.value)}
                      placeholder="Descreva os serviços e produtos..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => handleChange("descricao", e.target.value)}
                      placeholder="Descrição geral..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apresentacao_frase">Frase de Apresentação</Label>
                    <Textarea
                      id="apresentacao_frase"
                      value={formData.apresentacao_frase}
                      onChange={(e) => handleChange("apresentacao_frase", e.target.value)}
                      placeholder="Frase inicial de apresentação..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechamento_frase">Frase de Fechamento</Label>
                    <Textarea
                      id="fechamento_frase"
                      value={formData.fechamento_frase}
                      onChange={(e) => handleChange("fechamento_frase", e.target.value)}
                      placeholder="Frase de fechamento..."
                      rows={2}
                    />
                  </div>
                </TabsContent>

                {/* Tab 2: SPIN */}
                <TabsContent value="spin" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="script_situacao">Script Situação</Label>
                    <Textarea
                      id="script_situacao"
                      value={formData.script_situacao}
                      onChange={(e) => handleChange("script_situacao", e.target.value)}
                      placeholder="Perguntas sobre a situação atual do cliente..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_situacao_conexao">Script Situação Conexão</Label>
                    <Textarea
                      id="script_situacao_conexao"
                      value={formData.script_situacao_conexao}
                      onChange={(e) => handleChange("script_situacao_conexao", e.target.value)}
                      placeholder="Conexão para perguntas de situação..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_problema">Script Problema</Label>
                    <Textarea
                      id="script_problema"
                      value={formData.script_problema}
                      onChange={(e) => handleChange("script_problema", e.target.value)}
                      placeholder="Perguntas sobre problemas e dores..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_problema_conexao">Script Problema Conexão</Label>
                    <Textarea
                      id="script_problema_conexao"
                      value={formData.script_problema_conexao}
                      onChange={(e) => handleChange("script_problema_conexao", e.target.value)}
                      placeholder="Conexão para perguntas de problema..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_implicacao">Script Implicação</Label>
                    <Textarea
                      id="script_implicacao"
                      value={formData.script_implicacao}
                      onChange={(e) => handleChange("script_implicacao", e.target.value)}
                      placeholder="Perguntas sobre implicações do problema..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_implicacao_conexao">Script Implicação Conexão</Label>
                    <Textarea
                      id="script_implicacao_conexao"
                      value={formData.script_implicacao_conexao}
                      onChange={(e) => handleChange("script_implicacao_conexao", e.target.value)}
                      placeholder="Conexão para perguntas de implicação..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_necessidade">Script Necessidade</Label>
                    <Textarea
                      id="script_necessidade"
                      value={formData.script_necessidade}
                      onChange={(e) => handleChange("script_necessidade", e.target.value)}
                      placeholder="Perguntas sobre necessidades e soluções..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_necessidade_conexao">Script Necessidade Conexão</Label>
                    <Textarea
                      id="script_necessidade_conexao"
                      value={formData.script_necessidade_conexao}
                      onChange={(e) => handleChange("script_necessidade_conexao", e.target.value)}
                      placeholder="Conexão para perguntas de necessidade..."
                      rows={4}
                    />
                  </div>
                </TabsContent>

                {/* Tab 3: Vendas */}
                <TabsContent value="vendas" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="script_apresentacao_produto_servico">Script Apresentação Produto/Serviço</Label>
                    <Textarea
                      id="script_apresentacao_produto_servico"
                      value={formData.script_apresentacao_produto_servico}
                      onChange={(e) => handleChange("script_apresentacao_produto_servico", e.target.value)}
                      placeholder="Como apresentar produtos e serviços..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_qualificacao">Script Qualificação</Label>
                    <Textarea
                      id="script_qualificacao"
                      value={formData.script_qualificacao}
                      onChange={(e) => handleChange("script_qualificacao", e.target.value)}
                      placeholder="Como qualificar o lead..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_fechamento">Script Fechamento</Label>
                    <Textarea
                      id="script_fechamento"
                      value={formData.script_fechamento}
                      onChange={(e) => handleChange("script_fechamento", e.target.value)}
                      placeholder="Como fazer o fechamento da venda..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_fechamento2">Script Fechamento 2</Label>
                    <Textarea
                      id="script_fechamento2"
                      value={formData.script_fechamento2}
                      onChange={(e) => handleChange("script_fechamento2", e.target.value)}
                      placeholder="Alternativa de fechamento..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_fechamento">Tipo de Fechamento</Label>
                    <Input
                      id="tipo_fechamento"
                      value={formData.tipo_fechamento}
                      onChange={(e) => handleChange("tipo_fechamento", e.target.value)}
                      placeholder="Ex: direto, consultivo, assumptivo"
                    />
                  </div>
                </TabsContent>

                {/* Tab 4: Agendamento */}
                <TabsContent value="agendamento" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="agendamento">Agendamento</Label>
                    <Textarea
                      id="agendamento"
                      value={formData.agendamento}
                      onChange={(e) => handleChange("agendamento", e.target.value)}
                      placeholder="Informações sobre agendamento..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script_agendamento">Script Agendamento</Label>
                    <Textarea
                      id="script_agendamento"
                      value={formData.script_agendamento}
                      onChange={(e) => handleChange("script_agendamento", e.target.value)}
                      placeholder="Como conduzir o agendamento..."
                      rows={6}
                    />
                  </div>
                </TabsContent>

                {/* Tab 5: Script Completo */}
                <TabsContent value="completo" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="script_completo">Script Completo</Label>
                    <Textarea
                      id="script_completo"
                      value={formData.script_completo}
                      onChange={(e) => handleChange("script_completo", e.target.value)}
                      placeholder="Script completo consolidado..."
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                {/* Tab 6: Configurações */}
                <TabsContent value="config" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => handleChange("categoria", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="captacao">Captação</SelectItem>
                        <SelectItem value="atendimento">Atendimento</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
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
