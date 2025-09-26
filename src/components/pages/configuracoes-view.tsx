import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Instagram, MessageSquare, Mail, Phone, Zap, Brain, Shield, DollarSign, Bot } from "lucide-react";
import { useState } from "react";

interface ChannelConfig {
  id: string;
  nome: string;
  tipo: 'instagram' | 'whatsapp' | 'email' | 'site';
  status: 'conectado' | 'desconectado' | 'erro';
  ativo: boolean;
  icon: any;
}

const channelsConfig: ChannelConfig[] = [
  {
 
    id: "1", 
    nome: "WhatsApp Business",
    tipo: "whatsapp",
    status: "conectado",
    ativo: true,
    icon: MessageSquare
  },
  { 
    id: "2",
    nome: "Instagram @clinicaexemplo",
    tipo: "instagram",
    status: "desconectado",
    ativo: false,
    icon: Instagram
  },
  {
    id: "3",
    nome: "Email contato@clinica.com",
    tipo: "email", 
    status: "desconectado",
    ativo: false,
    icon: Mail
  },
  {
    id: "4",
    nome: "Site wwww.clinica.com.br",
    tipo: "site",
    status: "desconectado", 
    ativo: false,
    icon: Bot
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'conectado': return 'bg-esmeralda text-white';
    case 'desconectado': return 'bg-gray-500 text-white';
    case 'erro': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const ConfiguracoesView = () => {
  const [clinicName, setClinicName] = useState("Clínica Exemplo");
  const [address, setAddress] = useState("Av. Principal da Cidade, nº 350 - Bairro Nobre");
  const [valorMedioConsulta, setValorMedioConsulta] = useState("350");
  const [specialistname, setSpecialistName] = useState("Dr. Carlos Castro, Dra. Patrícia Prates");
  const [services, setServices] = useState("Harmonização Facial, Botox, procedimentos e cirugiais faciais");
  const [autoAgendamento, setAutoAgendamento] = useState(true);
  const [autoPagamento, setAutoPagamento] = useState(false);
  const [notificacoesPush, setNotificacoesPush] = useState(true);

  return (
    <div className="space-y-md lg:space-y-lg">

      {/* Informações da Clínica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informações da Clínica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinic-name">Nome da Clínica</Label>
              <Input
                id="clinic-name"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço da Clínica</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor-medio">Valor Médio da Consulta</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grafite">R$</span>
                <Input
                  id="valor-medio"
                  value={valorMedioConsulta}
                  onChange={(e) => setValorMedioConsulta(e.target.value)}
                  className="pl-10"
                />
              </div>
              </div>
            <div>
              <Label htmlFor="specialist-name">Nome dos Profissionais</Label>
              <div>
              <Input
                id="specialist-name"
                value={specialistname}
                onChange={(e) => setSpecialistName(e.target.value)}
                className="mt-1"
              />
             <div>
              <Label htmlFor="services">Procedimentos</Label>
              <div>
              <Input
                id="services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="mt-1"
              />
             </div>
             </div>
            </div>
            </div>
          </div>
          </div>
          
          <Button className="bg-dourado text-onyx hover:bg-dourado/90 w-full sm:w-auto">
            Salvar Informações
          </Button>
        </CardContent>
      </Card>

      {/* Canais de Comunicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Canais de Comunicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channelsConfig.map((channel) => {
            const IconComponent = channel.icon;
            
            return (
              <div key={channel.id} className="flex items-center justify-between p-4 border border-cinza-borda rounded-lg">
                <div className="flex items-center gap-4">
                  <IconComponent className="w-6 h-6 text-grafite" />
                  <div>
                    <p className="font-medium text-onyx">{channel.nome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(channel.status)}>
                        {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={channel.ativo}
                    disabled={channel.status === 'desconectado'}
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={channel.status === 'conectado' ? '' : 'bg-esmeralda text-white hover:bg-esmeralda/90'}
                  >
                    {channel.status === 'conectado' ? 'Configurar' : 'Conectar'}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Configurações da IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Configurações da IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto-agendamento</Label>
                <p className="text-sm text-grafite">Permitir que a IA agende consultas automaticamente</p>
              </div>
              <Switch
                checked={autoAgendamento}
                onCheckedChange={setAutoAgendamento}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Cobrança Automática</Label>
                <p className="text-sm text-grafite">Permitir que a IA receba e confirme pagamentos</p>
              </div>
              <Switch
                checked={autoPagamento}
                onCheckedChange={setAutoPagamento}
              />
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Notificações Push</Label>
                <p className="text-sm text-grafite">Receber notificações de novas conversas</p>
              </div>
              <Switch
                checked={notificacoesPush}
                onCheckedChange={setNotificacoesPush}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-base mb-2 block">Personalização da IA</Label>
              <textarea
                className="w-full h-24 p-3 border border-cinza-borda rounded-lg text-sm"
                placeholder="Instruções personalizadas para a IA (ex: Tom de voz, especialidades da clínica, etc.)"
              />
            </div>
          </div>

          <Button className="bg-dourado text-onyx hover:bg-dourado/90">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Segurança e Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança e Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Button variant="outline">
              Alterar Senha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plano e Faturamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Plano e Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dourado/10 rounded-lg">
            <div>
              <h3 className="font-semibold text-onyx">Plano Profissional</h3>
              <p className="text-sm text-grafite">Conversas ilimitadas • IA avançada • Suporte prioritário</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-dourado">R$ 297</p>
              <p className="text-sm text-grafite">/mês</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              Alterar Plano
            </Button>
            <Button variant="outline">
              Histórico de Faturas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};