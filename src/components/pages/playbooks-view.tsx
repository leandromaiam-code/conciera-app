import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Play, Copy, Plus, MessageSquare, Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import { usePlaybooksReal, type Playbook } from "@/hooks/use-playbooks-real";
import { Skeleton } from "@/components/ui/skeleton";

const getCategoriaColor = (categoria: string) => {
  switch (categoria) {
    case 'captacao': return 'bg-blue-500 text-white';
    case 'qualificacao': return 'bg-purple-500 text-white';
    case 'agendamento': return 'bg-esmeralda text-white';
    case 'nutricao': return 'bg-orange-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo': return 'bg-esmeralda text-white';
    case 'inativo': return 'bg-red-500 text-white';
    case 'teste': return 'bg-dourado text-onyx';
    default: return 'bg-gray-500 text-white';
  }
};

export const PlaybooksView = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const { data: playbooks, isLoading } = usePlaybooksReal();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!playbooks) return null;

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-onyx">Processos Personalizados</h1>
        <Button className="bg-dourado text-onyx hover:bg-dourado/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-dourado" />
              <div>
                <p className="text-2xl font-bold text-onyx">{playbooks.length}</p>
                <p className="text-sm text-grafite">Total Processos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="w-8 h-8 text-esmeralda" />
              <div>
                <p className="text-2xl font-bold text-onyx">
                  {playbooks.filter(p => p.status === 'ativo').length}
                </p>
                <p className="text-sm text-grafite">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-onyx">
                  {playbooks.reduce((acc, p) => acc + p.conversas_utilizadas, 0)}
                </p>
                <p className="text-sm text-grafite">Conversas Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-onyx">
                  {Math.round(playbooks.reduce((acc, p) => acc + p.taxa_sucesso, 0) / playbooks.length)}%
                </p>
                <p className="text-sm text-grafite">Taxa Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(playbooks || []).map((playbook) => (
          <Card 
            key={playbook.id} 
            className={`cursor-pointer hover:shadow-md transition-all ${
              selectedPlaybook?.id === playbook.id ? 'ring-2 ring-dourado' : ''
            }`}
            onClick={() => setSelectedPlaybook(playbook)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {playbook.nome_agente}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getCategoriaColor(playbook.categoria)}>
                      {playbook.categoria.charAt(0).toUpperCase() + playbook.categoria.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(playbook.status)}>
                      {playbook.status.charAt(0).toUpperCase() + playbook.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-grafite text-sm">{playbook.descricao}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-cinza-borda">
                <div className="text-center">
                  <p className="text-lg font-bold text-onyx">{playbook.conversas_utilizadas}</p>
                  <p className="text-xs text-grafite">Conversas</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    playbook.taxa_sucesso >= 70 ? 'text-esmeralda' : 
                    playbook.taxa_sucesso >= 50 ? 'text-dourado' : 'text-red-500'
                  }`}>
                    {playbook.taxa_sucesso}%
                  </p>
                  <p className="text-xs text-grafite">Taxa de Sucesso</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicar
                </Button>
                <Button 
                  size="sm" 
                  className={playbook.status === 'ativo' ? 'bg-red-500 hover:bg-red-600' : 'bg-esmeralda hover:bg-esmeralda/90'}
                >
                  {playbook.status === 'ativo' ? 'Pausar' : 'Ativar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedPlaybook && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Processo: {selectedPlaybook.nome_agente}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-onyx mb-2">Informações Gerais</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-grafite">Categoria:</span> {selectedPlaybook.categoria}</p>
                    <p><span className="text-grafite">Status:</span> {selectedPlaybook.status}</p>
                    <p><span className="text-grafite">Criado em:</span> {new Date(selectedPlaybook.criado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-onyx mb-2">Performance</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-grafite">Conversas utilizadas:</span> {selectedPlaybook.conversas_utilizadas}</p>
                    <p><span className="text-grafite">Taxa de sucesso:</span> 
                      <span className={`ml-1 font-semibold ${
                        selectedPlaybook.taxa_sucesso >= 70 ? 'text-esmeralda' : 
                        selectedPlaybook.taxa_sucesso >= 50 ? 'text-dourado' : 'text-red-500'
                      }`}>
                        {selectedPlaybook.taxa_sucesso}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-onyx mb-2">Prompt Personalizado</h4>
                <div className="p-3 bg-cinza-claro/20 rounded-lg">
                  <p className="text-sm text-grafite">
                    {selectedPlaybook.prompt_personalizado || "Nenhum prompt personalizado configurado."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-cinza-borda">
              <Button className="bg-dourado text-onyx hover:bg-dourado/90">
                <Edit className="w-4 h-4 mr-2" />
                Editar Processo
              </Button>
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Testar IA
              </Button>
              <Button variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};