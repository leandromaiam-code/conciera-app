import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

interface WhatsAppConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId: number | undefined;
  onConnectionSuccess?: () => void;
}

export const WhatsAppConnectDialog = ({ isOpen, onClose, empresaId, onConnectionSuccess }: WhatsAppConnectDialogProps) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPhone("");
      setQrCode("");
      setPairingCode("");
      setTimeLeft(120);
      setIsConnecting(false);
      setIsConfirming(false);
      setIsConnected(false);
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (qrCode && timeLeft > 0 && !isConnected) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [qrCode, timeLeft, isConnected]);

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
      const response = await fetch("https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_conexao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa_id: empresaId,
          action: "conectar",
          channel: "whatsapp-web",
          telefone: phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha na conexão com o servidor");
      }

      const data = await response.json();

      // Parse do body se for string
      const bodyData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

      if (bodyData?.qrcode) {
        setQrCode(bodyData.qrcode);
        setPairingCode(bodyData.pairingCode || "");
        setTimeLeft(120);
        toast({
          title: "QR Code gerado",
          description: "Escaneie o código com seu WhatsApp",
        });
      } else {
        console.error("Estrutura recebida:", data);
        throw new Error("QR Code não encontrado");
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
  };

  const handleConfirmConnection = async () => {
    setIsConfirming(true);

    try {
      const response = await fetch("https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_conexao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa_id: empresaId,
          channel: "whatsapp-web",
          telefone: phone,
          action: "connected",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao confirmar conexão");
      }

      setIsConnected(true);
      
      onConnectionSuccess?.();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao confirmar conexão",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

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
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-0 h-auto hover:bg-transparent"
              disabled={isConnecting || isConfirming}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DialogTitle className="text-xl font-semibold">Conectar WhatsApp</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!qrCode && !isConnected && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Número do WhatsApp
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="553199885544"
                  maxLength={13}
                  disabled={isConnecting}
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">Digite no formato: 55 + DDD + Número (13 dígitos)</p>
              </div>
              <Button
                onClick={handleConnect}
                className="w-full h-11 bg-esmeralda text-white hover:bg-esmeralda/90 font-medium"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando QR Code...
                  </>
                ) : (
                  "Gerar QR Code"
                )}
              </Button>
            </>
          )}

          {qrCode && timeLeft > 0 && !isConnected && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Conecte seu WhatsApp</h3>
                <p className="text-sm text-gray-900 leading-relaxed">
                  <strong className="text-gray-900">Opção 1 - QR Code:</strong>
                  <br />
                  1. Abra o <strong className="text-gray-900">WhatsApp</strong> no seu celular
                  <br />
                  2. Toque em <strong className="text-gray-900">Configurações</strong> →{" "}
                  <strong className="text-gray-900">Dispositivos conectados</strong>
                  <br />
                  3. Toque em <strong className="text-gray-900">Conectar dispositivo</strong>
                  <br />
                  4. Aponte a câmera para o QR Code abaixo
                </p>
                {pairingCode && (
                  <p className="text-sm text-gray-900 leading-relaxed mt-4 pt-4 border-t">
                    <strong className="text-gray-900">Opção 2 - Código de Pareamento:</strong>
                    <br />
                    Ou digite este código de 8 dígitos no WhatsApp:
                    <br />
                    <span className="text-2xl font-bold text-esmeralda tracking-widest block mt-2">
                      {pairingCode}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-6 rounded-2xl border-2 border-cinza-borda shadow-sm">
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QR Code WhatsApp"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                {pairingCode && (
                  <p className="text-xs text-muted-foreground">
                    Código de Pareamento: <span className="font-mono font-semibold">{pairingCode}</span>
                  </p>
                )}
              </div>

              <div className="bg-esmeralda/10 border border-esmeralda/30 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">Código expira em:</span>
                  <div className="text-2xl font-bold text-esmeralda tabular-nums">{formatTime(timeLeft)}</div>
                </div>
              </div>

              <Button
                onClick={handleConfirmConnection}
                className="w-full h-11 bg-esmeralda text-white hover:bg-esmeralda/90 font-medium"
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar Conexão
                  </>
                )}
              </Button>
            </div>
          )}

          {qrCode && timeLeft === 0 && !isConnected && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">⏱️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Expirado</h3>
                <p className="text-sm text-gray-700">O código expirou. Por favor, gere um novo QR Code.</p>
              </div>
              <Button
                onClick={() => {
                  setQrCode("");
                  setTimeLeft(120);
                }}
                variant="outline"
                className="w-full h-11"
              >
                Gerar Novo QR Code
              </Button>
            </div>
          )}

          {isConnected && (
            <div className="text-center space-y-4 py-6">
              <div className="w-20 h-20 bg-esmeralda/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-esmeralda" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-esmeralda mb-2">Conectado com Sucesso!</h3>
                <p className="text-sm text-gray-700">Seu WhatsApp foi conectado e está pronto para uso.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
