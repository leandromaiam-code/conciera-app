import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Brain, Shield, DollarSign, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useCoreEmpresa } from "@/hooks/use-core-empresa";
import { useConfigConfiguracaoCanais } from "@/hooks/use-config-configuracoes-canais";
import { useConfigConfiguracoesSistema } from "@/hooks/use-config-configuracoes-sistema";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { WhatsAppWebConnect } from "./channels/WhatsAppWebConnect";
import { WhatsAppBusinessConnect } from "./channels/WhatsAppBusinessConnect";
import { InstagramConnect } from "./channels/InstagramConnect";


export const ConfiguracoesView = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Database hooks
  const { profile } = useUserProfile();
  const { empresa, loading: empresaLoading, updateEmpresa, saving: empresaSaving } = useCoreEmpresa();
  const { canais, loading: canaisLoading, updateCanal, saving: canaisSaving, refetch: refetchCanais } = useConfigConfiguracaoCanais(undefined, profile?.empresa_id);
  const { sistema, loading: sistemaLoading, updateSistema, saving: sistemaSaving } = useConfigConfiguracoesSistema();

  // Local state for form inputs
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [valorMedioConsulta, setValorMedioConsulta] = useState("");
  const [specialistname, setSpecialistName] = useState("");
  const [services, setServices] = useState("");
  const [autoAgendamento, setAutoAgendamento] = useState(true);
  const [autoPagamento, setAutoPagamento] = useState(false);
  const [notificacoesPush, setNotificacoesPush] = useState(true);

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
      setAutoAgendamento(sistema.ui_auto_agendamento);
      setAutoPagamento(sistema.ui_auto_pagamento);
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
        core_empresa_servicos: services
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
    try {
      await updateCanal(canalTipo, ativo);
      toast({
        title: "Sucesso",
        description: `Canal ${canalTipo} ${ativo ? 'ativado' : 'desativado'} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${ativo ? 'ativar' : 'desativar'} canal.`,
        variant: "destructive",
      });
    }
  };

  const handleSaveSistema = async () => {
    if (!sistema) return;
    
    try {
      await updateSistema({
        ui_auto_agendamento: autoAgendamento,
        ui_auto_pagamento: autoPagamento,
        config_configuracoes_sistema_notificacoes_push: notificacoesPush
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

  if (empresaLoading || canaisLoading || sistemaLoading) {
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
              <Input
                id="services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="mt-1"
              />
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
          <WhatsAppWebConnect
            funcionariaId={canais?.funcionaria_id || 0}
            empresaId={profile?.empresa_id || 0}
            status={canais?.whatsapp_web_status || "desconectado"}
            telefone={canais?.whatsapp_web_telefone || null}
            conectadoEm={canais?.whatsapp_web_conectado_em || null}
            ativo={canais?.whatsapp_ativo || false}
            onToggleAtivo={(ativo) => handleToggleCanal('whatsapp', ativo)}
          />

          <WhatsAppBusinessConnect
            status={canais?.whatsapp_business_status || "desconectado"}
          />

          <InstagramConnect
            status={canais?.instagram_status || "desconectado"}
          />
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