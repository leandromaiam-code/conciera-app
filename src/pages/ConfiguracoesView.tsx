import { useState } from "react";
import { Settings, Save, RefreshCw, Shield, Bot, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const ConfiguracoesView = () => {
  const [configuracoes, setConfiguracoes] = useState({
    nomeClinica: "Clínica Exemplo",
    emailContato: "contato@clinica.com",
    telefone: "(11) 9999-9999",
    whatsappAtivo: true,
    telefoneAtivo: true,
    emailAtivo: false,
    portalAtivo: true,
    horarioAtendimento: "08:00 - 18:00",
    mensagemBoasVindas: "Olá! Bem-vindo à nossa clínica. Como posso ajudá-lo hoje?",
    limiteTentativas: 3,
    tempoEsperaMax: 30,
    notificacoesPush: true,
    notificacoesEmail: true,
    backup: true,
    logs: true
  });

  const handleSave = () => {
    console.log("Salvando configurações:", configuracoes);
    // Here you would save the configurations
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
          <p className="text-gray-600">Gerencie as configurações da sua clínica e do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="canais">Canais</TabsTrigger>
          <TabsTrigger value="ia">Inteligência Artificial</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="geral" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Informações da Clínica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeClinica">Nome da Clínica</Label>
                <Input
                  id="nomeClinica"
                  value={configuracoes.nomeClinica}
                  onChange={(e) => setConfiguracoes({...configuracoes, nomeClinica: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailContato">E-mail de Contato</Label>
                <Input
                  id="emailContato"
                  type="email"
                  value={configuracoes.emailContato}
                  onChange={(e) => setConfiguracoes({...configuracoes, emailContato: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone Principal</Label>
                <Input
                  id="telefone"
                  value={configuracoes.telefone}
                  onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario">Horário de Atendimento</Label>
                <Input
                  id="horario"
                  value={configuracoes.horarioAtendimento}
                  onChange={(e) => setConfiguracoes({...configuracoes, horarioAtendimento: e.target.value})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Channels Settings */}
        <TabsContent value="canais" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Canais de Atendimento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">WhatsApp Business</h4>
                    <p className="text-sm text-gray-600">Atendimento via WhatsApp com IA</p>
                  </div>
                </div>
                <Switch
                  checked={configuracoes.whatsappAtivo}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, whatsappAtivo: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <p className="text-sm text-gray-600">Atendimento telefônico tradicional</p>
                  </div>
                </div>
                <Switch
                  checked={configuracoes.telefoneAtivo}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, telefoneAtivo: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Bot className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">E-mail</h4>
                    <p className="text-sm text-gray-600">Suporte via e-mail automatizado</p>
                  </div>
                </div>
                <Switch
                  checked={configuracoes.emailAtivo}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, emailAtivo: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Portal do Paciente</h4>
                    <p className="text-sm text-gray-600">Chat integrado no site</p>
                  </div>
                </div>
                <Switch
                  checked={configuracoes.portalAtivo}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, portalAtivo: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ia" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Configurações da CONCIERA AI
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mensagemBoasVindas">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="mensagemBoasVindas"
                  value={configuracoes.mensagemBoasVindas}
                  onChange={(e) => setConfiguracoes({...configuracoes, mensagemBoasVindas: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="limiteTentativas">Limite de Tentativas</Label>
                  <Input
                    id="limiteTentativas"
                    type="number"
                    value={configuracoes.limiteTentativas}
                    onChange={(e) => setConfiguracoes({...configuracoes, limiteTentativas: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempoEspera">Tempo Máximo de Espera (min)</Label>
                  <Input
                    id="tempoEspera"
                    type="number"
                    value={configuracoes.tempoEsperaMax}
                    onChange={(e) => setConfiguracoes({...configuracoes, tempoEsperaMax: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gerenciamento de Usuários
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Dr. Silva</h4>
                  <p className="text-sm text-gray-600">Administrador</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Desativar</Button>
                </div>
              </div>
              
              <Button className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Adicionar Novo Usuário
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="sistema" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Configurações do Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notificacoesPush">Notificações Push</Label>
                  <p className="text-sm text-gray-600">Receber notificações em tempo real</p>
                </div>
                <Switch
                  id="notificacoesPush"
                  checked={configuracoes.notificacoesPush}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, notificacoesPush: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notificacoesEmail">Notificações por E-mail</Label>
                  <p className="text-sm text-gray-600">Receber relatórios por e-mail</p>
                </div>
                <Switch
                  id="notificacoesEmail"
                  checked={configuracoes.notificacoesEmail}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, notificacoesEmail: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backup">Backup Automático</Label>
                  <p className="text-sm text-gray-600">Backup diário dos dados</p>
                </div>
                <Switch
                  id="backup"
                  checked={configuracoes.backup}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, backup: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="logs">Logs Detalhados</Label>
                  <p className="text-sm text-gray-600">Manter logs detalhados do sistema</p>
                </div>
                <Switch
                  id="logs"
                  checked={configuracoes.logs}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, logs: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};