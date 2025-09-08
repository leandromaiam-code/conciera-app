import { useState } from "react";
import { Settings, Save, RefreshCw, Shield, Bot, Users, Bell, Instagram, FileText, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ConfiguracoesView = () => {
  const [configuracoes, setConfiguracoes] = useState({
    nomeClinica: "Clínica Exemplo",
    emailContato: "contato@clinica.com",
    telefone: "(11) 9999-9999",
    whatsappAtivo: true,
    telefoneAtivo: true,
    emailAtivo: false,
    portalAtivo: false,
    instagramAtivo: false,
    formulariosAtivo: false,
    horarioAtendimento: "08:00 - 18:00",
    // AI Settings
    iaAtiva: true,
    nomeAgente: "CONCIERA AI",
    vozAgente: "feminina-brasileira",
    personalidade: "amigavel",
    idioma: "pt-BR",
    velocidadeResposta: "normal",
    mensagemBoasVindas: "Olá! Bem-vindo à nossa clínica. Como posso ajudá-lo hoje?",
    limiteTentativas: 3,
    tempoEsperaMax: 30,
    // System Settings
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
                    <Users className="w-5 h-5 text-purple-600" />
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

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Instagram</h4>
                    <p className="text-sm text-gray-600">Direct messages e comentários</p>
                  </div>
                </div>
                <Switch
                  checked={configuracoes.instagramAtivo}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, instagramAtivo: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Formulários</h4>
                    <p className="text-sm text-gray-600">Captura de leads e agendamentos</p>
                  </div>
                </div>
                <Switch
                  checked={configuracoes.formulariosAtivo}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, formulariosAtivo: checked})}
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
              Configurações do Agente IA
            </h3>
            
            {/* Status Principal */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Status do Agente</h4>
                  <p className="text-sm text-gray-600">Ativar ou desativar completamente a IA</p>
                </div>
                <Switch
                  checked={configuracoes.iaAtiva}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, iaAtiva: checked})}
                />
              </div>
            </div>

            {configuracoes.iaAtiva && (
              <div className="space-y-6">
                {/* Informações do Agente */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Identidade do Agente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeAgente">Nome do Agente</Label>
                      <Input
                        id="nomeAgente"
                        value={configuracoes.nomeAgente}
                        onChange={(e) => setConfiguracoes({...configuracoes, nomeAgente: e.target.value})}
                        placeholder="Ex: Dr. Silva, Ana, CONCIERA AI"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vozAgente">Voz do Agente</Label>
                      <Select 
                        value={configuracoes.vozAgente} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, vozAgente: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feminina-brasileira">Feminina Brasileira</SelectItem>
                          <SelectItem value="masculina-brasileira">Masculina Brasileira</SelectItem>
                          <SelectItem value="feminina-jovem">Feminina Jovem</SelectItem>
                          <SelectItem value="masculina-profissional">Masculina Profissional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Personalidade */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Personalidade</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personalidade">Estilo de Comunicação</Label>
                      <Select 
                        value={configuracoes.personalidade} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, personalidade: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amigavel">Amigável e Calorosa</SelectItem>
                          <SelectItem value="formal">Formal e Profissional</SelectItem>
                          <SelectItem value="tecnico">Técnica e Precisa</SelectItem>
                          <SelectItem value="empatica">Empática e Cuidadosa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idioma">Idioma Principal</Label>
                      <Select 
                        value={configuracoes.idioma} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, idioma: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="velocidade">Velocidade de Resposta</Label>
                      <Select 
                        value={configuracoes.velocidadeResposta} 
                        onValueChange={(value) => setConfiguracoes({...configuracoes, velocidadeResposta: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rapida">Rápida</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="reflexiva">Reflexiva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Mensagens</h4>
                  <div className="space-y-2">
                    <Label htmlFor="mensagemBoasVindas">Mensagem de Boas-vindas</Label>
                    <Textarea
                      id="mensagemBoasVindas"
                      value={configuracoes.mensagemBoasVindas}
                      onChange={(e) => setConfiguracoes({...configuracoes, mensagemBoasVindas: e.target.value})}
                      rows={3}
                      placeholder="Ex: Olá! Sou a {nomeAgente} e estou aqui para ajudá-lo..."
                    />
                  </div>
                </div>

                {/* Configurações Avançadas */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Configurações Avançadas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="limiteTentativas">Limite de Tentativas</Label>
                      <Input
                        id="limiteTentativas"
                        type="number"
                        value={configuracoes.limiteTentativas}
                        onChange={(e) => setConfiguracoes({...configuracoes, limiteTentativas: parseInt(e.target.value)})}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempoEspera">Tempo Máximo de Espera (min)</Label>
                      <Input
                        id="tempoEspera"
                        type="number"
                        value={configuracoes.tempoEsperaMax}
                        onChange={(e) => setConfiguracoes({...configuracoes, tempoEsperaMax: parseInt(e.target.value)})}
                        min="5"
                        max="120"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
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