import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, Task } from "@/hooks/use-core-tasks";
import { useUserProfile } from "@/hooks/use-user-profile";
import { LayoutList, LayoutGrid, Plus, Pencil, Trash2, User, Phone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CATEGORIAS = ["agendamento", "pagamento", "prospeccao", "duvida", "melhorias", "outros"];
const STATUS_OPTIONS = ["a_fazer", "em_andamento", "concluida", "cancelada"];
const PRIORIDADES = ["baixa", "media", "alta", "urgente"];

const capitalize = (text: string) => {
  return text.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

const getCategoriaColor = (categoria: string) => {
  const colors: Record<string, string> = {
    agendamento: "bg-blue-500/10 text-blue-500",
    pagamento: "bg-green-500/10 text-green-500",
    prospeccao: "bg-purple-500/10 text-purple-500",
    duvida: "bg-yellow-500/10 text-yellow-500",
    melhorias: "bg-cyan-500/10 text-cyan-500",
    outros: "bg-gray-500/10 text-gray-500",
  };
  return colors[categoria] || colors.outros;
};

const getPrioridadeColor = (prioridade: string) => {
  const colors: Record<string, string> = {
    baixa: "bg-gray-500/10 text-gray-500",
    media: "bg-blue-500/10 text-blue-500",
    alta: "bg-orange-500/10 text-orange-500",
    urgente: "bg-red-500/10 text-red-500",
  };
  return colors[prioridade] || colors.media;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    a_fazer: "bg-slate-500/10 text-slate-500",
    em_andamento: "bg-blue-500/10 text-blue-500",
    concluida: "bg-green-500/10 text-green-500",
    cancelada: "bg-red-500/10 text-red-500",
  };
  return colors[status] || colors.a_fazer;
};

export const TasksView = ({ onPageChange }: { onPageChange: (page: string) => void }) => {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "outros",
    status: "a_fazer",
    prioridade: "media",
    prazo: "",
  });

  const { data: tasks = [], isLoading } = useTasks();
  const { profile } = useUserProfile();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      empresa_id: profile?.empresa_id,
      prazo: formData.prazo ? new Date(formData.prazo).toISOString() : null,
    };

    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, ...taskData });
    } else {
      await createTask.mutateAsync(taskData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "outros",
      status: "a_fazer",
      prioridade: "media",
      prazo: "",
    });
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      titulo: task.titulo,
      descricao: task.descricao || "",
      categoria: task.categoria,
      status: task.status,
      prioridade: task.prioridade,
      prazo: task.prazo ? format(new Date(task.prazo), "yyyy-MM-dd'T'HH:mm") : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta task?")) {
      await deleteTask.mutateAsync(id);
    }
  };

  const handleViewConversas = (clienteId: number) => {
    onPageChange("conversas");
  };

  const tasksByStatus = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Se não há destino, cancela
    if (!destination) return;
    
    // Se não mudou de coluna, não faz nada
    if (source.droppableId === destination.droppableId) return;
    
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    try {
      await updateTask.mutateAsync({
        id: taskId,
        status: newStatus
      });
    } catch (error) {
      console.error("Erro ao atualizar status da task:", error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === "board" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("board")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Board
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Editar Task" : "Nova Task"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map(cat => (
                        <SelectItem key={cat} value={cat}>{capitalize(cat)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(st => (
                        <SelectItem key={st} value={st}>{capitalize(st)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(v) => setFormData({ ...formData, prioridade: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORIDADES.map(pri => (
                        <SelectItem key={pri} value={pri}>{capitalize(pri)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prazo</Label>
                  <Input
                    type="datetime-local"
                    value={formData.prazo}
                    onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTask ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {viewMode === "list" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-300px)] lg:max-h-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-onyx font-semibold">Título</TableHead>
                  <TableHead className="text-onyx font-semibold">Categoria</TableHead>
                  <TableHead className="text-onyx font-semibold">Status</TableHead>
                  <TableHead className="text-onyx font-semibold">Prioridade</TableHead>
                  <TableHead className="text-onyx font-semibold">Cliente</TableHead>
                  <TableHead className="text-onyx font-semibold">Prazo</TableHead>
                  <TableHead className="text-right text-onyx font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.titulo}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getCategoriaColor(task.categoria)}>
                      {capitalize(task.categoria)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {capitalize(task.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPrioridadeColor(task.prioridade)}>
                      {capitalize(task.prioridade)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.cliente_nome ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <User className="w-3 h-3" />
                          {task.cliente_nome}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {task.cliente_telefone}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => task.cliente_id && handleViewConversas(task.cliente_id)}
                        >
                          Ver conversas
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.prazo ? format(new Date(task.prazo), "dd/MM/yyyy HH:mm") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {STATUS_OPTIONS.map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <div
                    className={cn(
                      "flex-shrink-0 w-[85vw] sm:w-80 flex flex-col rounded-lg transition-colors p-2 snap-center",
                      snapshot.isDraggingOver && "bg-accent/50"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between px-1">
                      <h3 className="font-semibold">{capitalize(status)}</h3>
                      <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
                    </div>
                    
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 flex-1 min-h-[200px]"
                    >
                        {tasksByStatus[status].map((task, index) => (
                          <Draggable 
                            key={task.id} 
                            draggableId={task.id.toString()} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "p-4 space-y-2 cursor-grab active:cursor-grabbing transition-all",
                                  snapshot.isDragging && "shadow-lg rotate-2 opacity-80"
                                )}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-medium text-sm">{task.titulo}</h4>
                                  <Badge variant="secondary" className={getPrioridadeColor(task.prioridade)}>
                                    {capitalize(task.prioridade)}
                                  </Badge>
                                </div>
                                {task.descricao && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">{task.descricao}</p>
                                )}
                                <Badge variant="secondary" className={getCategoriaColor(task.categoria)}>
                                  {capitalize(task.categoria)}
                                </Badge>
                                {task.cliente_nome && (
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {task.cliente_nome}
                                    </div>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="p-0 h-auto text-xs"
                                      onClick={() => task.cliente_id && handleViewConversas(task.cliente_id)}
                                    >
                                      Ver conversas
                                    </Button>
                                  </div>
                                )}
                                {task.prazo && (
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(task.prazo), "dd/MM HH:mm")}
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};
