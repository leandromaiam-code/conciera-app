import { useState } from "react";
import { Book, Settings, Play, Pause, Plus, Edit, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const playbooks = [
  {
    id: 1,
    nome: "Agendamento de Consultas",
    descricao: "Fluxo automatizado para captura e confirmação de agendamentos médicos",
    categoria: "Agendamento",
    ativo: true,
    utilizacoes: 1247,
    sucesso: 92,
    icon: "📅"
  },
  {
    id: 2,
    nome: "Confirmação de Exames",
    descricao: "Confirmação automática de exames com lembretes e instruções",
    categoria: "Exames",
    ativo: true,
    utilizacoes: 856,
    sucesso: 89,
    icon: "🔬"
  },
  {
    id: 3,
    nome: "Atendimento Pós-Consulta",
    descricao: "Seguimento após consultas com coleta de feedback",
    categoria: "Follow-up",
    ativo: false,
    utilizacoes: 432,
    sucesso: 85,
    icon: "💬"
  },
  {
    id: 4,
    nome: "Emergência e Urgência",
    descricao: "Triagem inicial para casos de emergência médica",
    categoria: "Emergência",
    ativo: true,
    utilizacoes: 234,
    sucesso: 96,
    icon: "🚨"
  },
  {
    id: 5,
    nome: "Informações sobre Planos",
    descricao: "Esclarecimentos sobre planos de saúde e cobertura",
    categoria: "Comercial",
    ativo: true,
    utilizacoes: 678,
    sucesso: 78,
    icon: "💼"
  },
  {
    id: 6,
    nome: "Cancelamento de Consultas",
    descricao: "Processo de cancelamento com reagendamento automático",
    categoria: "Agendamento",
    ativo: false,
    utilizacoes: 345,
    sucesso: 88,
    icon: "❌"
  }
];

const categorias = ["Todos", "Agendamento", "Exames", "Follow-up", "Emergência", "Comercial"];

export const PlaybooksView = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  const playbooksFiltered = categoriaAtiva === "Todos" 
    ? playbooks 
    : playbooks.filter(p => p.categoria === categoriaAtiva);

  const handleTogglePlaybook = (id: number) => {
    // Here you would update the playbook status
    console.log(`Toggle playbook ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Playbooks</h2>
          <p className="text-gray-600">Configure e monitore os fluxos de automação da IA</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Playbook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-sm text-gray-600">Total de Playbooks</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">8</div>
          <p className="text-sm text-gray-600">Ativos</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">3,792</div>
          <p className="text-sm text-gray-600">Execuções este mês</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">88%</div>
          <p className="text-sm text-gray-600">Taxa de sucesso média</p>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categorias.map((categoria) => (
          <Button
            key={categoria}
            variant={categoriaAtiva === categoria ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoriaAtiva(categoria)}
            className="whitespace-nowrap"
          >
            {categoria}
          </Button>
        ))}
      </div>

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playbooksFiltered.map((playbook) => (
          <Card key={playbook.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{playbook.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{playbook.nome}</h3>
                  <Badge variant="outline" className="text-xs">
                    {playbook.categoria}
                  </Badge>
                </div>
              </div>
              <Switch
                checked={playbook.ativo}
                onCheckedChange={() => handleTogglePlaybook(playbook.id)}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              {playbook.descricao}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {playbook.utilizacoes.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600">Utilizações</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {playbook.sucesso}%
                </div>
                <p className="text-xs text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Copy className="w-4 h-4 mr-1" />
                Duplicar
              </Button>
            </div>

            {/* Status Indicator */}
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                {playbook.ativo ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Ativo</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Inativo</span>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};