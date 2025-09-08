import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChannelKey, ChannelState } from "@/types/channel";
import { useState } from "react";
import { CheckCircle, Loader2, Settings } from "lucide-react";

interface ChannelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelKey: ChannelKey;
  channel: ChannelState;
  onConnect: (channelKey: ChannelKey) => void;
}

export const ChannelConfigModal = ({ 
  isOpen, 
  onClose, 
  channelKey, 
  channel, 
  onConnect 
}: ChannelConfigModalProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [config, setConfig] = useState({
    autoReply: true,
    notifications: true,
    businessHours: true,
    apiKey: '',
    webhook: ''
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onConnect(channelKey);
    setIsConnecting(false);
    onClose();
  };

  const getChannelSpecificFields = () => {
    switch (channelKey) {
      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Número do WhatsApp Business</Label>
              <Input id="phone" placeholder="+55 11 9999-9999" />
            </div>
            <div>
              <Label htmlFor="token">Token da API</Label>
              <Input id="token" type="password" placeholder="Seu token do WhatsApp Business API" />
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smtp">Servidor SMTP</Label>
              <Input id="smtp" placeholder="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="email-user">Email</Label>
              <Input id="email-user" type="email" placeholder="seu-email@exemplo.com" />
            </div>
          </div>
        );
      case 'instagram':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram-user">Username do Instagram</Label>
              <Input id="instagram-user" placeholder="@seuusuario" />
            </div>
            <div>
              <Label htmlFor="access-token">Access Token</Label>
              <Input id="access-token" type="password" placeholder="Seu Instagram Access Token" />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-endpoint">Endpoint da API</Label>
              <Input id="api-endpoint" placeholder="https://api.exemplo.com" />
            </div>
          </div>
        );
    }
  };

  const Icon = channel.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <Icon size={20} className="text-foreground" />
            </div>
            <div>
              <div>Configurar {channel.name}</div>
              <div className="text-sm text-muted-foreground font-normal">
                Status: {channel.status === 'disconnected' ? 'Desconectado' : 'Conectado'}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Channel-specific configuration */}
          {getChannelSpecificFields()}

          {/* Common settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-reply">Respostas automáticas</Label>
              <Switch 
                id="auto-reply"
                checked={config.autoReply}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoReply: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações</Label>
              <Switch 
                id="notifications"
                checked={config.notifications}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="business-hours">Apenas horário comercial</Label>
              <Switch 
                id="business-hours"
                checked={config.businessHours}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, businessHours: checked }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="flex-1"
          >
            {isConnecting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                {channel.status === 'disconnected' ? 'Conectar' : 'Salvar'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};