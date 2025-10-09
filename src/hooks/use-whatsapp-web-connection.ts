import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WebhookPayload {
  empresa_id: number;
  channel: "whatsapp-web";
  telefone: string;
}

interface WebhookResponse {
  success: boolean;
  qr_code: string;
  session_id: string;
  message?: string;
}

export const useWhatsAppWebConnection = (funcionariaId: number, empresaId: number) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(120);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const connectWhatsAppWeb = async (telefone: string) => {
    try {
      setIsConnecting(true);

      // Atualizar status no banco para "conectando"
      const { error: updateError } = await supabase
        .from('config_configuracoes_canais')
        .update({ 
          whatsapp_web_status: 'conectando',
          whatsapp_web_telefone: telefone
        })
        .eq('funcionaria_id', funcionariaId);

      if (updateError) throw updateError;

      // Chamar webhook
      const payload: WebhookPayload = {
        empresa_id: empresaId,
        channel: "whatsapp-web",
        telefone: telefone
      };

      const response = await fetch('https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_conexao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erro ao conectar com o webhook');
      }

      const data: WebhookResponse = await response.json();

      if (data.success && data.qr_code) {
        setQrCode(data.qr_code);
        setSessionId(data.session_id);

        // Atualizar status no banco para "aguardando_qr"
        await supabase
          .from('config_configuracoes_canais')
          .update({ 
            whatsapp_web_status: 'aguardando_qr',
            whatsapp_web_session_id: data.session_id
          })
          .eq('funcionaria_id', funcionariaId);

        // Iniciar timer de 120 segundos
        startTimer();

        toast({
          title: "QR Code gerado",
          description: "Escaneie o QR Code com seu WhatsApp em até 2 minutos."
        });
      } else {
        throw new Error(data.message || 'Erro ao gerar QR Code');
      }
    } catch (error) {
      console.error('Erro ao conectar WhatsApp Web:', error);
      
      // Atualizar status para erro
      await supabase
        .from('config_configuracoes_canais')
        .update({ whatsapp_web_status: 'erro' })
        .eq('funcionaria_id', funcionariaId);

      toast({
        title: "Erro ao conectar",
        description: error instanceof Error ? error.message : "Não foi possível conectar ao WhatsApp Web",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const startTimer = () => {
    setRemainingTime(120);
    
    const id = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          cancelConnection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerId(id);
  };

  const cancelConnection = async () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }

    setQrCode(null);
    setSessionId(null);
    setRemainingTime(120);

    // Atualizar status no banco para desconectado
    await supabase
      .from('config_configuracoes_canais')
      .update({ 
        whatsapp_web_status: 'desconectado',
        whatsapp_web_session_id: null
      })
      .eq('funcionaria_id', funcionariaId);

    toast({
      title: "Conexão cancelada",
      description: "O processo de conexão foi cancelado."
    });
  };

  const disconnect = async () => {
    await supabase
      .from('config_configuracoes_canais')
      .update({ 
        whatsapp_web_status: 'desconectado',
        whatsapp_web_telefone: null,
        whatsapp_web_session_id: null,
        whatsapp_web_conectado_em: null
      })
      .eq('funcionaria_id', funcionariaId);

    toast({
      title: "WhatsApp desconectado",
      description: "O WhatsApp Web foi desconectado com sucesso."
    });
  };

  return {
    isConnecting,
    qrCode,
    sessionId,
    remainingTime,
    connectWhatsAppWeb,
    cancelConnection,
    disconnect
  };
};
