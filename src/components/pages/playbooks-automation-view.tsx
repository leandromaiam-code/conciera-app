import { useState } from "react";
import { Plus, Play, Pause, Archive, Edit, Trash2, Clock, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaybooksAutomation } from "@/hooks/use-playbooks-automation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { PlaybookEditorDialog } from "@/components/playbooks/playbook-editor-dialog";
import { PlaybookAutomation } from "@/hooks/use-playbooks-automation";
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

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    lembrete_consulta: 'Lembrete de Consulta',
    reativacao_conversa: 'Reativação de Conversa',
    pos_atendimento: 'Pós-Atendimento',
    follow_up: 'Follow-up',
    outros: 'Outros',
  };
  return labels[tipo] || tipo;
};

const getTipoColor = (tipo: string) => {
  const colors: Record<string, string> = {
    lembrete_consulta: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    reativacao_conversa: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    pos_atendimento: 'bg-green-500/10 text-green-700 dark:text-green-300',
    follow_up: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
    outros: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  };
  return colors[tipo] || colors.outros;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ativo: 'bg-green-500/10 text-green-700 dark:text-green-300',
    pausado: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    arquivado: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  };
  return colors[status] || colors.arquivado;
};

export const PlaybooksAutomationView = () => {
  const { profile } = useUserProfile();
  const { playbooks, isLoading, updatePlaybook, deletePlaybook } = usePlaybooksAutomation(profile?.empresa_id);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookAutomation | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playbookToDelete, setPlaybookToDelete] = useState<number | null>(null);

  const handleCreateNew = () => {
    setSelectedPlaybook(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (playbook: PlaybookAutomation) => {
    setSelectedPlaybook(playbook);
    setIsEditorOpen(true);
  };

  const handleToggleStatus = async (playbook: PlaybookAutomation) => {
    const newStatus = playbook.status === 'ativo' ? 'pausado' : 'ativo';
    await updatePlaybook.mutateAsync({ id: playbook.id, status: newStatus });
  };

  const handleArchive = async (playbook: PlaybookAutomation) => {
    await updatePlaybook.mutateAsync({ id: playbook.id, status: 'arquivado' });
  };

  const handleDeleteConfirm = async () => {
    if (playbookToDelete) {
      await deletePlaybook.mutateAsync(playbookToDelete);
      setDeleteDialogOpen(false);
      setPlaybookToDelete(null);
    }
  };

  const activePlaybooks = playbooks?.filter(p => p.status === 'ativo').length || 0;
  const totalExecutions = 0; // TODO: Calcular do banco

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playbooks Ativos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlaybooks}</div>
            <p className="text-xs text-muted-foreground">
              {playbooks?.length || 0} total cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções (30d)</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Mensagens enviadas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Playbooks de Automação</h2>
          <p className="text-muted-foreground">
            Configure fluxos automáticos de mensagens para lembretes e reativação
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Playbook
        </Button>
      </div>

      {/* Playbooks Grid */}
      {!playbooks || playbooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum playbook configurado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie seu primeiro playbook de automação para começar a enviar mensagens automáticas
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Playbook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playbooks.map((playbook) => (
            <Card key={playbook.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{playbook.nome}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getTipoColor(playbook.tipo)} variant="secondary">
                        {getTipoLabel(playbook.tipo)}
                      </Badge>
                      <Badge className={getStatusColor(playbook.status)} variant="secondary">
                        {playbook.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {playbook.descricao && (
                  <CardDescription className="line-clamp-2 mt-2">
                    {playbook.descricao}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(playbook)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(playbook)}
                  >
                    {playbook.status === 'ativo' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                  {playbook.status !== 'arquivado' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchive(playbook)}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPlaybookToDelete(playbook.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <PlaybookEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        playbook={selectedPlaybook}
        empresaId={profile?.empresa_id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este playbook? Esta ação não pode ser desfeita.
              Todos os passos e mensagens associadas também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
