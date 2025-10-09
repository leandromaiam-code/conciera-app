import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

interface WhatsAppConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId: number | undefined;
}

export const WhatsAppConnect<p className="text-sm text-gray-900 leading-relaxed font-medium">Dialog = ({ isOpen, onClose, empresaId }: WhatsAppConnectDialogProps) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isConnecting, setIsConnecting] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPhone("");
      setQrCode("");
      setTimeLeft(120);
      setIsConnecting(false);
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (qrCode && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [qrCode, timeLeft]);

  const handleConnect = async () => {
    if (!phone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de telefone.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{13}$/.test(phone)) {
      toast({
        title: "Erro",
        description: "Telefone deve ter 13 dígitos (ex: 553199885544)",
        variant: "destructive",
      });
      return;
    }

    if (!empresaId) {
      toast({
        title: "Erro",
        description: "ID da empresa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
      
      try {
        const response = await fetch(
          'https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_conexao',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empresa_id: empresaId,
              channel: 'whatsapp-web',
              telefone: phone
            })
          }
        );
      
        if (!response.ok) {
          throw new Error('Falha na conexão com o servidor');
        }
      
        const data = await response.json();
        
        // V--- ALTERAÇÃO PRINCIPAL APLICADA AQUI ---V
        // Agora, verificamos se a resposta contém o objeto 'body'
        // e se 'body' contém a chave 'qrcode'.
        if (data && typeof data.body === 'object' && data.body.qrcode) {
          setQrCode(data.body.qrcode); // Acessamos a propriedade aninhada
          setTimeLeft(120);
          toast({
            title: "QR Code gerado",
            description: "Escaneie o código com seu WhatsApp",
          });
        } else {
          console.error('Formato recebido:', typeof data, data);
          throw new Error('QR Code não recebido no formato esperado');
        }
      
      } catch (error) {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao conectar ao WhatsApp",
          variant: "destructive",
        });
      } finally {
        setIsConnecting(false);
      }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!qrCode && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (formato: 553199885544)</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="553199885544"
                  maxLength={13}
                  disabled={isConnecting}
                />
                <p className="text-xs text-muted-foreground">
                  Digite o número no formato: 55 + DDD + Número (13 dígitos)
                </p>
              </div>
              <Button
                onClick={handleConnect}
                className="w-full bg-esmeralda text-white hover:bg-esmeralda/90"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            </>
          )}

          {qrCode && timeLeft > 0 && (
            <>
              <div className="text-center space-y-4">
              <p className="text-sm text-gray-900">
                  Acesse o WhatsApp e vá em <strong className="text-gray-900 font-semibold">Configurações &gt; Dispositivos Conectados</strong> e aponte o
                  celular para o QR Code abaixo:
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-cinza-borda">
                  <img src={`data:image/png;base64,${qrCode}`} alt="QR Code WhatsApp" className="w-full h-auto" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-lg font-semibold text-esmeralda">{formatTime(timeLeft)}</div>
                  <span className="text-sm text-muted-foreground">restantes</span>
                </div>
              </div>
            </>
          )}

          {qrCode && timeLeft === 0 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">O QR Code expirou. Tente novamente.</p>
              <Button onClick={onClose} variant="outline" className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
