import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Bot, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  role: string;
  content_text: string;
  created_at: string;
}

interface ConversaHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversaId: bigint;
  sessionId: string;
  clienteNome: string;
  status?: string;
  onStatusChange?: (newStatus: string) => void;
}

export const ConversaHistoryDialog = ({
  open,
  onOpenChange,
  conversaId,
  sessionId,
  clienteNome,
}: ConversaHistoryDialogProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && sessionId) {
      fetchMessages();
    }
  }, [open, sessionId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ingestion_memoria_clientes_historico_01')
        .select('id, role, content_text, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico da conversa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversa com {clienteNome}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 [&>[data-radix-scroll-area-viewport]]:max-h-[50vh]">
          {loading ? (
            <div className="text-center py-8 text-grafite">
              Carregando mensagens...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-grafite">
              Nenhuma mensagem encontrada
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'ai' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {message.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-dourado/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-dourado" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'ai'
                        ? 'bg-cinza-claro/30 text-onyx'
                        : 'bg-dourado text-onyx'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content_text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-esmeralda/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-esmeralda" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};