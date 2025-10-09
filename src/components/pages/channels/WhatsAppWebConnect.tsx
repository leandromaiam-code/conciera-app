import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useWhatsAppWebConnection } from '@/hooks/use-whatsapp-web-connection';
import { Smartphone, QrCode, Clock } from 'lucide-react';

interface WhatsAppWebConnectProps {
  funcionariaId: number;
  empresaId: number;
  status: string;
  telefone?: string;
  conectadoEm?: string;
  ativo: boolean;
  onToggleAtivo: (ativo: boolean) => void;
}

export const WhatsAppWebConnect = ({
  funcionariaId,
  empresaId,
  status,
  telefone: currentTelefone,
  conectadoEm,
  ativo,
  onToggleAtivo
}: WhatsAppWebConnectProps) => {
  const [telefone, setTelefone] = useState(currentTelefone || '');
  const {
    isConnecting,
    qrCode,
    remainingTime,
    connectWhatsAppWeb,
    cancelConnection,
    disconnect
  } = useWhatsAppWebConnection(funcionariaId, empresaId);

  const handleConnect = () => {
    if (telefone) {
      connectWhatsAppWeb(telefone);
    }
  };

  const formatTelefone = (tel: string) => {
    const cleaned = tel.replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    return tel;
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      conectado: { label: 'Conectado', variant: 'default' },
      desconectado: { label: 'Desconectado', variant: 'secondary' },
      conectando: { label: 'Conectando...', variant: 'outline' },
      aguardando_qr: { label: 'Aguardando QR', variant: 'outline' },
      erro: { label: 'Erro', variant: 'destructive' }
    };
    
    const statusInfo = statusMap[status] || statusMap.desconectado;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>WhatsApp Web</CardTitle>
              <CardDescription>Conecte seu WhatsApp via QR Code</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'desconectado' && !qrCode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (formato: 553199885544)</Label>
              <Input
                id="telefone"
                placeholder="553199885544"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ''))}
                maxLength={13}
              />
            </div>
            <Button 
              onClick={handleConnect} 
              disabled={!telefone || isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </Button>
          </div>
        )}

        {qrCode && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-background border rounded-lg">
              <QrCode className="h-6 w-6 mb-4 text-muted-foreground" />
              <img 
                src={`data:image/png;base64,${qrCode}`} 
                alt="QR Code WhatsApp" 
                className="w-64 h-64 border-4 border-primary rounded-lg"
              />
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expira em: {remainingTime} segundos</span>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Como conectar:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Abra o WhatsApp no seu celular</li>
                <li>Vá em Configurações {'>'} Dispositivos Conectados</li>
                <li>Toque em "Conectar Dispositivo"</li>
                <li>Aponte o celular para o QR Code acima</li>
              </ol>
            </div>

            <Button 
              onClick={cancelConnection} 
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        )}

        {status === 'conectado' && (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
              <p className="text-sm font-medium text-primary">✅ WhatsApp Conectado</p>
              <p className="text-sm text-muted-foreground">
                Telefone: {formatTelefone(currentTelefone || '')}
              </p>
              {conectadoEm && (
                <p className="text-sm text-muted-foreground">
                  Conectado em: {new Date(conectadoEm).toLocaleString('pt-BR')}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Status do Canal</Label>
                <p className="text-sm text-muted-foreground">
                  {ativo ? 'Canal ativo e recebendo mensagens' : 'Canal pausado'}
                </p>
              </div>
              <Switch
                checked={ativo}
                onCheckedChange={onToggleAtivo}
              />
            </div>

            <Button 
              onClick={disconnect} 
              variant="destructive"
              className="w-full"
            >
              Desconectar
            </Button>
          </div>
        )}

        {status === 'erro' && (
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium text-destructive">Erro na Conexão</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ocorreu um erro ao tentar conectar. Tente novamente.
              </p>
            </div>
            <Button 
              onClick={() => setTelefone(currentTelefone || '')} 
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
