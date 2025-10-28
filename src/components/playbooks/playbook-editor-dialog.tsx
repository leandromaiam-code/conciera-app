import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { usePlaybooksAutomation, usePlaybookSteps, usePlaybookMessages, PlaybookAutomation } from "@/hooks/use-playbooks-automation";

interface PlaybookEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playbook?: PlaybookAutomation | null;
  empresaId?: number;
}

export const PlaybookEditorDialog = ({ open, onOpenChange, playbook, empresaId }: PlaybookEditorDialogProps) => {
  const { createPlaybook, updatePlaybook } = usePlaybooksAutomation(empresaId);
  const { steps, createStep, updateStep, deleteStep } = usePlaybookSteps(playbook?.id);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const { messages, createMessage, updateMessage, deleteMessage } = usePlaybookMessages(selectedStepId || undefined);

  const [formData, setFormData] = useState<{
    nome: string;
    tipo: 'lembrete_consulta' | 'reativacao_conversa' | 'pos_atendimento' | 'follow_up' | 'outros';
    descricao: string;
    status: 'ativo' | 'pausado' | 'arquivado';
  }>({
    nome: '',
    tipo: 'lembrete_consulta',
    descricao: '',
    status: 'ativo',
  });

  const [newStep, setNewStep] = useState({
    nome_passo: '',
    momento_tipo: 'antes_agendamento',
    momento_valor: 24,
    momento_unidade: 'horas',
  });

  const [newMessage, setNewMessage] = useState({
    conteudo: '',
    peso_distribuicao: 1,
  });

  useEffect(() => {
    if (playbook) {
      setFormData({
        nome: playbook.nome,
        tipo: playbook.tipo,
        descricao: playbook.descricao || '',
        status: playbook.status,
      });
    } else {
      setFormData({
        nome: '',
        tipo: 'lembrete_consulta',
        descricao: '',
        status: 'ativo',
      });
    }
  }, [playbook]);

  const handleSavePlaybook = async () => {
    if (!empresaId) return;

    if (playbook) {
      await updatePlaybook.mutateAsync({
        id: playbook.id,
        ...formData,
      });
    } else {
      await createPlaybook.mutateAsync({
        ...formData,
        empresa_id: empresaId,
      });
    }
    onOpenChange(false);
  };

  const handleAddStep = async () => {
    if (!playbook || !newStep.nome_passo.trim()) return;

    const nextOrdem = (steps?.length || 0) + 1;

    await createStep.mutateAsync({
      playbook_id: playbook.id,
      ordem: nextOrdem,
      nome_passo: newStep.nome_passo,
      momento_execucao: {
        tipo: newStep.momento_tipo,
        valor: newStep.momento_valor,
        unidade: newStep.momento_unidade,
      },
      ativo: true,
    });

    setNewStep({
      nome_passo: '',
      momento_tipo: 'antes_agendamento',
      momento_valor: 24,
      momento_unidade: 'horas',
    });
  };

  const handleAddMessage = async () => {
    if (!selectedStepId || !newMessage.conteudo.trim()) return;

    const nextVariacao = (messages?.length || 0) + 1;

    await createMessage.mutateAsync({
      step_id: selectedStepId,
      variacao_numero: nextVariacao,
      conteudo: newMessage.conteudo,
      peso_distribuicao: newMessage.peso_distribuicao,
      ativo: true,
    });

    setNewMessage({
      conteudo: '',
      peso_distribuicao: 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {playbook ? 'Editar Playbook' : 'Novo Playbook de Automação'}
          </DialogTitle>
          <DialogDescription>
            Configure fluxos automáticos de mensagens com múltiplos passos e variações
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="passos" disabled={!playbook}>Passos</TabsTrigger>
            <TabsTrigger value="mensagens" disabled={!playbook || !selectedStepId}>Mensagens</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Playbook</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Lembrete 24h antes da consulta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lembrete_consulta">Lembrete de Consulta</SelectItem>
                    <SelectItem value="reativacao_conversa">Reativação de Conversa</SelectItem>
                    <SelectItem value="pos_atendimento">Pós-Atendimento</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o objetivo deste playbook..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePlaybook}>
                {playbook ? 'Atualizar' : 'Criar'} Playbook
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="passos" className="space-y-4">
            {/* Lista de Passos Existentes */}
            <div className="space-y-2">
              <Label>Passos Configurados</Label>
              {steps && steps.length > 0 ? (
                <div className="space-y-2">
                  {steps.map((step) => (
                    <Card
                      key={step.id}
                      className={`cursor-pointer transition-colors ${
                        selectedStepId === step.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedStepId(step.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-sm">{step.nome_passo}</CardTitle>
                              <CardDescription className="text-xs">
                                {step.momento_execucao.valor} {step.momento_execucao.unidade} {step.momento_execucao.tipo}
                              </CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStep.mutateAsync(step.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum passo configurado ainda</p>
              )}
            </div>

            {/* Adicionar Novo Passo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Adicionar Novo Passo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Passo</Label>
                  <Input
                    value={newStep.nome_passo}
                    onChange={(e) => setNewStep({ ...newStep, nome_passo: e.target.value })}
                    placeholder="Ex: Confirmação de horário"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      value={newStep.momento_valor}
                      onChange={(e) => setNewStep({ ...newStep, momento_valor: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <Select
                      value={newStep.momento_unidade}
                      onValueChange={(value) => setNewStep({ ...newStep, momento_unidade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutos">Minutos</SelectItem>
                        <SelectItem value="horas">Horas</SelectItem>
                        <SelectItem value="dias">Dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Momento</Label>
                    <Select
                      value={newStep.momento_tipo}
                      onValueChange={(value) => setNewStep({ ...newStep, momento_tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antes_agendamento">Antes</SelectItem>
                        <SelectItem value="apos_agendamento">Depois</SelectItem>
                        <SelectItem value="apos_inatividade">Após Inatividade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAddStep} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Passo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensagens" className="space-y-4">
            {selectedStepId && (
              <>
                {/* Lista de Mensagens Existentes */}
                <div className="space-y-2">
                  <Label>Variações de Mensagem</Label>
                  {messages && messages.length > 0 ? (
                    <div className="space-y-2">
                      {messages.map((message) => (
                        <Card key={message.id}>
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Variação {message.variacao_numero}</Badge>
                                  <Badge variant="secondary">Peso: {message.peso_distribuicao}</Badge>
                                </div>
                                <p className="text-sm">{message.conteudo}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMessage.mutateAsync(message.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma variação configurada ainda</p>
                  )}
                </div>

                {/* Adicionar Nova Mensagem */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Adicionar Variação de Mensagem</CardTitle>
                    <CardDescription className="text-xs">
                      Use variáveis: {'{{nome}}'}, {'{{data}}'}, {'{{hora}}'}, {'{{servico}}'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Conteúdo da Mensagem</Label>
                      <Textarea
                        value={newMessage.conteudo}
                        onChange={(e) => setNewMessage({ ...newMessage, conteudo: e.target.value })}
                        placeholder="Olá {{nome}}! Lembramos que sua consulta está marcada para {{data}} às {{hora}}."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Peso de Distribuição (1-10)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={newMessage.peso_distribuicao}
                        onChange={(e) => setNewMessage({ ...newMessage, peso_distribuicao: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Mensagens com peso maior serão enviadas com mais frequência
                      </p>
                    </div>

                    <Button onClick={handleAddMessage} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Variação
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
