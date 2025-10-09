import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface WhatsAppBusinessConnectProps {
  status: string;
}

export const WhatsAppBusinessConnect = ({ status }: WhatsAppBusinessConnectProps) => {
  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      conectado: { label: 'Conectado', variant: 'default' },
      desconectado: { label: 'Desconectado', variant: 'secondary' },
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
            <MessageSquare className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>WhatsApp Business API</CardTitle>
              <CardDescription>Conecte sua conta do WhatsApp Business</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Conecte sua conta do WhatsApp Business para gerenciar conversas profissionalmente.
            </p>
          </div>
          
          <Button className="w-full" disabled>
            Login with WhatsApp Business
            <span className="ml-2 text-xs">(Em breve)</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
