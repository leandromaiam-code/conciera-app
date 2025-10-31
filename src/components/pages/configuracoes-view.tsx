import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Instagram, MessageSquare, Mail, Phone, Zap, Brain, Shield, DollarSign, Globe, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCoreEmpresa } from "@/hooks/use-core-empresa";
import { useConfigConfiguracaoCanais } from "@/hooks/use-config-configuracoes-canais";
import { useConfigConfiguracoesSistema } from "@/hooks/use-config-configuracoes-sistema";
import { useConfigInstance } from "@/hooks/use-config-instance";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/use-user-profile";
import { WhatsAppConnectDialog } from "@/components/channels/whatsapp-connect-dialog";
import { InstagramConnectDialog } from "@/components/channels/instagram-connect-dialog";
import { ScriptGenerationDialog } from "@/components/configuracoes/script-generation-dialog";
import { PixConfigDialogDialog } from "@/components/configuracoes/pix-config-dialog";
import { AgendaConfigDialog } from "@/components/configuracoes/agenda-config-dialog";
import { AlterarSenhaDialog } from "@/components/configuracoes/alterar-senha-dialog";
import { PersonalizarConcieraDialog } from "@/components/configuracoes/personalizar-conciera-dialog";

interface ChannelConfig {
  id: string;
  nome: string;
  tipo: "instagram" | "whatsapp" | "email" | "site";
  status: "conectado" | "desconectado" | "erro";
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
    icon: MessageSquare,
  },
  {
    id: "2",
    nome: "Instagram",
    tipo: "instagram",
    status: "desconectado",
    ativo: false,
    icon: Instagram,
  },
  {
    id: "3",
    nome: "Email",
    tipo: "email",
    status: "desconectado",
    ativo: false,
    icon: Mail,
  },
  {
    id: "4",
    nome: "Site",
    tipo: "site",
    status: "desconectado",
    ativo: false,
    icon: Globe,
  },
];

export const ConfiguracoesView = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { profile } = useUserProfile();

  // Database hooks
  const { empresa, loading: empresaLoading, updateEmpresa, saving: empresaSaving } = useCoreEmpresa();
  const { canais, loading: canaisLoading, updateCanal, saving: canaisSaving } = useConfigConfiguracaoCanais();
  const { sistema, loading: sistemaLoading, updateSistema, saving: sistemaSaving } = useConfigConfiguracoesSistema(profile?.empresa_id);
  const {
    instance,
    loading: instanceLoading,
    disconnectWhatsApp,
    disconnecting,
    refetch,
  } = useConfigInstance(profile?.empresa_id);

  // Local state for form inputs
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [valorMedioConsulta, setValorMedioConsulta] = useState("");
  const [specialistname, setSpecialistName] = useState("");
  const [services, setServices] = useState("");
  const [notificacoesPush, setNotificacoesPush] = useState(true);

  // Modal states
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [instagramOpen, setInstagramOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [alterarSenhaOpen, setAlterarSenhaOpen] = useState(false);
  const [personalizarConcieraOpen, setPersonalizarConcieraOpen] = useState(false);

  // Update local state when database data loads
  useEffect(() => {
    if (empresa) {
      setClinicName(empresa.core_empresa_nome || "");
      setAddress(empresa.core_empresa_endereco_empresa || "");
      setValorMedioConsulta(empresa.core_empresa_preco_consulta || "");
      setSpecialistName(empresa.core_empresa_profissionais_empresa || "");
      setServices(empresa.core_empresa_servicos || "");
    }
  }, [empresa]);

  useEffect(() => {
    if (sistema) {
      setNotificacoesPush(sistema.config_configuracoes_sistema_notificacoes_push);
    }
  }, [sistema]);

  const handleSaveEmpresa = async () => {
    if (!empresa) return;

    try {
      await updateEmpresa({
        core_empresa_nome: clinicName,
        core_empresa_endereco_empresa: address,
        core_empresa_preco_consulta: valorMedioConsulta,
        core_empresa_profissionais_empresa: specialistname,
        core_empresa_servicos: services,
      });

      toast({
        title: "Sucesso",
        description: "Informações da clínica atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar informações da clínica.",
        variant: "destructive",
      });
    }
  };

  const handleToggleCanal = async (canalTipo: string, ativo: boolean) => {
    // WhatsApp tem lógica especial
    if (canalTipo === "whatsapp") {
      if (ativo) {
        // Ativando - abrir modal
        setWhatsappOpen(true);
      } else {
        // Desativando - desconectar
        if (instance?.instance_name) {
          try {
            await disconnectWhatsApp(instance.instance_name);
            await updateCanal(canalTipo, ativo);
            toast({
              title: "Sucesso",
              description: "WhatsApp desconectado com sucesso!",
            });
          } catch (error) {
            toast({
              title: "Erro",
              description: "Erro ao desconectar WhatsApp.",
              variant: "destructive",
            });
          }
        }
      }
      return;
    }

    try {
      await updateCanal(canalTipo, ativo);
      toast({
        title: "Sucesso",
        description: `Canal ${canalTipo} ${ativo ? "ativado" : "desativado"} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${ativo ? "ativar" : "desativar"} canal.`,
        variant: "destructive",
      });
    }
  };

  const handleSaveSistema = async () => {
    if (!sistema) return;

    try {
      await updateSistema({
        config_configuracoes_sistema_notificacoes_push: notificacoesPush,
      });

      toast({
        title: "Sucesso",
        description: "Configurações da IA atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações da IA.",
        variant: "destructive",
      });
    }
  };

  const handleSavePixKey = async (pixKey: string) => {
    if (!sistema) return;
    
    try {
      await updateSistema({ 
        chave_pix: pixKey,
        ui_auto_pagamento: true 
      });
      toast({
        title: "Sucesso",
        description: "Chave PIX salva com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar chave PIX:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a chave PIX",
        variant: "destructive",
      });
    }
  };

  const handleSaveAgendaType = async (type: 'conciera' | 'google') => {
    await updateSistema({ tipo_agenda_base: type });
  };

  const handleGoogleCalendarConnect = () => {
    // Redirecionar para o OAuth do Google Calendar
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // TODO: Adicionar client ID via secret
    const redirectUri = `${window.location.origin}/google-calendar/callback`;
    const scope = 'https://www.googleapis.com/auth/calendar';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
    
    window.location.href = authUrl;
  };

  if (empresaLoading || canaisLoading || sistemaLoading || instanceLoading) {
    return (
      <div className="space-y-md lg:space-y-lg">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-md lg:space-y-lg mt-4">
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
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialist-name">Nome dos Profissionais</Label>
              <Input
                id="specialist-name"
                value={specialistname}
                onChange={(e) => setSpecialistName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="services">Procedimentos</Label>
              <Input id="services" value={services} onChange={(e) => setServices(e.target.value)} className="mt-1" />
            </div>
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
          </div>

          <Button
            className="bg-dourado text-onyx hover:bg-dourado/90 w-full sm:w-auto"
            onClick={handleSaveEmpresa}
            disabled={empresaSaving}
          >
            {empresaSaving ? "Salvando..." : "Salvar Informações"}
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
            const isChannelActive = canais
              ? canais[`config_configuracoes_canais_${channel.tipo}_ativo` as keyof typeof canais]
              : false;

            // Determine if the switch should be active based on status
            const isSwitchActive =
              channel.tipo === "whatsapp" && instance ? instance.status === "Ativado" : Boolean(isChannelActive);

            // Determine status for button text
            const isConnected =
              channel.tipo === "whatsapp" && instance ? instance.status === "Ativado" : Boolean(isChannelActive);

            return (
              <div
                key={channel.id}
                className={`p-4 border border-cinza-borda rounded-lg ${isMobile ? "space-y-3" : "flex items-center justify-between"}`}
              >
                {/* First line: Icon + Name */}
                <div className="flex items-center gap-4">
                  <IconComponent className="w-6 h-6 text-grafite" />
                  <div className="flex-1">
                    <p className="font-medium text-onyx">{channel.nome}</p>
                  </div>
                </div>

                {/* Second line (mobile) or right side (desktop): Controls */}
                <div
                  className={`${isMobile ? "bg-marfim/30 border border-cinza-borda/50 rounded-lg p-3" : ""} flex items-center gap-3 ${isMobile ? "justify-center" : ""}`}
                >
                  <Switch
                    checked={isSwitchActive}
                    disabled={!isConnected || canaisSaving || disconnecting}
                    onCheckedChange={(checked) => handleToggleCanal(channel.tipo, checked)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (channel.tipo === "whatsapp") setWhatsappOpen(true);
                      if (channel.tipo === "instagram") setInstagramOpen(true);
                    }}
                    className={isConnected ? "" : "bg-esmeralda text-white hover:bg-esmeralda/90"}
                    disabled={disconnecting}
                  >
                    {isConnected ? "Configurar" : "Conectar"}
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
            <div className={`flex ${isMobile ? "flex-col gap-3" : "items-center justify-between"}`}>
              <div className="flex-1">
                <Label className="text-base">Auto-agendamento</Label>
                <p className="text-sm text-grafite">Permitir que a IA agende consultas automaticamente</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setAgendaModalOpen(true)}
                  disabled={!sistema?.ui_auto_agendamento}
                  className="w-[120px]"
                >
                  <Settings2 className="w-4 h-4 mr-1" />
                  Configurar
                </Button>
                <Switch 
                  checked={sistema?.ui_auto_agendamento || false}
                  disabled={!sistema || sistemaSaving}
                  onCheckedChange={async (checked) => {
                    if (!sistema) return;
                    try {
                      await updateSistema({ ui_auto_agendamento: checked });
                      toast({
                        title: "Sucesso",
                        description: `Auto-agendamento ${checked ? 'ativado' : 'desativado'}`,
                      });
                    } catch (error) {
                      console.error("Erro ao atualizar auto-agendamento:", error);
                      toast({
                        title: "Erro",
                        description: "Não foi possível atualizar a configuração",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </div>
            </div>

            <Separator />

            <div className={`flex ${isMobile ? "flex-col gap-3" : "items-center justify-between"}`}>
              <div className="flex-1">
                <Label className="text-base">Cobrança Automática</Label>
                <p className="text-sm text-grafite">Permitir que a IA receba e confirme pagamentos</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setPixModalOpen(true)}
                  disabled={!sistema?.ui_auto_pagamento}
                  className="w-[120px]"
                >
                  <Settings2 className="w-4 h-4 mr-1" />
                  Configurar
                </Button>
                <Switch 
                  checked={sistema?.ui_auto_pagamento || false}
                  disabled={!sistema || sistemaSaving}
                  onCheckedChange={async (checked) => {
                    if (!sistema) return;
                    
                    // Se ativar, verificar se tem chave PIX
                    if (checked && !sistema.chave_pix) {
                      setPixModalOpen(true);
                      return;
                    }
                    
                    try {
                      await updateSistema({ ui_auto_pagamento: checked });
                      toast({
                        title: "Sucesso",
                        description: `Cobrança automática ${checked ? 'ativada' : 'desativada'}`,
                      });
                    } catch (error) {
                      console.error("Erro ao atualizar cobrança automática:", error);
                      toast({
                        title: "Erro",
                        description: "Não foi possível atualizar a configuração",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </div>
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Notificações Push</Label>
                <p className="text-sm text-grafite">Receber notificações de novas conversas</p>
              </div>
              <Switch checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Geração de Script</Label>
                <p className="text-sm text-grafite">Configure o script de atendimento personalizado</p>
              </div>
              <Button
                className="bg-dourado text-onyx hover:bg-dourado/90"
                onClick={() => setScriptModalOpen(true)}
              >
                Configurar
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Personalizar Conciera</Label>
                <p className="text-sm text-grafite">Configure o nome e comportamento da assistente virtual</p>
              </div>
              <Button
                className="bg-dourado text-onyx hover:bg-dourado/90"
                onClick={() => setPersonalizarConcieraOpen(true)}
              >
                Configurar
              </Button>
            </div>
          </div>

          <Button
            className="bg-dourado text-onyx hover:bg-dourado/90"
            onClick={handleSaveSistema}
            disabled={sistemaSaving}
          >
            {sistemaSaving ? "Salvando..." : "Salvar Configurações"}
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
            <Button variant="outline" onClick={() => setAlterarSenhaOpen(true)}>
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
              <h3 className="font-semibold text-onyx">Plano Conciera Pro</h3>
              <p className="text-sm text-grafite">Sistema de Receita Recorrente - Conversas ilimitadas • IA avançada • Suporte</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-dourado">R$ 2.497</p>
              <p className="text-sm text-grafite">/mês</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Alterar Plano</Button>
            <Button variant="outline">Histórico de Faturas</Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Dialogs */}
      <WhatsAppConnectDialog
        isOpen={whatsappOpen}
        onClose={() => setWhatsappOpen(false)}
        empresaId={profile?.empresa_id}
        onConnectionSuccess={() => refetch()}
      />

      <InstagramConnectDialog isOpen={instagramOpen} onClose={() => setInstagramOpen(false)} />

      <ScriptGenerationDialog
        isOpen={scriptModalOpen}
        onClose={() => setScriptModalOpen(false)}
        empresaId={profile?.empresa_id}
        funcionariaId={1}
      />

      <PixConfigDialogDialog
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
        currentPixKey={sistema?.chave_pix || ""}
        onSave={handleSavePixKey}
      />

      <AgendaConfigDialog
        isOpen={agendaModalOpen}
        onClose={() => setAgendaModalOpen(false)}
        currentType={sistema?.tipo_agenda_base || 'conciera'}
        isGoogleConnected={sistema?.google_calendar_connected || false}
        onSave={handleSaveAgendaType}
        onGoogleConnect={handleGoogleCalendarConnect}
      />

      <AlterarSenhaDialog
        open={alterarSenhaOpen}
        onOpenChange={setAlterarSenhaOpen}
      />

      <PersonalizarConcieraDialog
        isOpen={personalizarConcieraOpen}
        onClose={() => setPersonalizarConcieraOpen(false)}
        empresaId={profile?.empresa_id}
      />
    </div>
  );
};
