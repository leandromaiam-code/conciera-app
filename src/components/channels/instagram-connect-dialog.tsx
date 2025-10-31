import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InstagramConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramConnectDialog = ({ isOpen, onClose }: InstagramConnectDialogProps) => {
  const { toast } = useToast();

  const handleInstagramConnect = () => {
    try {
      // Configurações do seu App Meta
      const APP_ID = "1487078672559424";
      const REDIRECT_URI = `${window.location.origin}/instagram/callback`;

      // Gera um código aleatório para segurança (state)
      const state = generateRandomState();

      // Salva o state no localStorage temporariamente
      localStorage.setItem("instagram_oauth_state", state);
      localStorage.setItem("instagram_oauth_timestamp", Date.now().toString());

      // Constrói a URL do OAuth
      const params = new URLSearchParams({
        force_reauth: "true",
        client_id: APP_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope:
          "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_manage_insights",
        state: state,
      });

      const oauthUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

      // Redireciona para o Instagram OAuth
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Erro ao iniciar conexão com Instagram:", error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível iniciar a conexão com Instagram. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Função para gerar código aleatório seguro
  const generateRandomState = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DialogTitle>Conectar Instagram</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
              <Instagram className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg text-foreground">Conecte seu Instagram</h3>
            <p className="text-sm text-foreground/80">
              Autorize o Conciera a gerenciar suas mensagens diretas do Instagram para automatizar respostas e melhorar
              o atendimento aos seus clientes.
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg space-y-3 border-2 border-primary/20 shadow-sm">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary">🔐</span>
              Permissões necessárias
            </p>
            <ul className="text-sm text-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Ler e enviar mensagens diretas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Acessar informações básicas da conta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Gerenciar conversas</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleInstagramConnect}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Conectar com Instagram
          </Button>

          <div className="text-center">
            <Button onClick={onClose} variant="ghost" className="text-sm">
              Voltar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
