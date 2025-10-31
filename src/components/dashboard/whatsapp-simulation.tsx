import { X, Phone, MoreVertical, Mic, Image as ImageIcon, Loader2, StopCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface WhatsAppSimulationProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId?: number;
}


export const WhatsAppSimulation = ({ isOpen, onClose, empresaId }: WhatsAppSimulationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>(`simulacao_${Date.now()}`);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Reset state when closing and show welcome message
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInputMessage("");
      setSelectedFile(null);
      setFilePreview(null);
      sessionIdRef.current = `simulacao_${Date.now()}`;
      return;
    }

    // Show welcome message only when opening
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Envie uma mensagem para testar a sua nova Concierge.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Convert file to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'imagem') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (type === 'imagem') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
        setSelectedFile(audioFile);
        setFilePreview(null);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setAudioChunks(chunks);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Erro ao acessar microfone",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  // Send message to webhook
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    setIsSending(true);

    try {
      let messageContent = inputMessage;
      let messageType: 'texto' | 'audio' | 'imagem' = 'texto';

      // Convert file to base64 if present
      if (selectedFile) {
        messageContent = await convertFileToBase64(selectedFile);
        messageType = selectedFile.type.startsWith('audio/') ? 'audio' : 'imagem';
      }

      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        text: selectedFile 
          ? `[${messageType === 'audio' ? '🎤 Áudio enviado' : '🖼️ Imagem enviada'}]` 
          : messageContent,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Clear input immediately for better UX
      const currentInput = inputMessage;
      setInputMessage("");
      clearFile();

      // Send to N8N webhook
      const response = await fetch(
        "https://n8n-n8n.ajpgd7.easypanel.host/webhook/conciera_ai_simulacao",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mensagem: messageContent,
            tipo: messageType,
            session_id: sessionIdRef.current,
            funcionaria_id: empresaId,
            empresa_id: empresaId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Resposta do webhook:', data);

      // Parse response - support multiple formats
      let resposta = '';
      if (Array.isArray(data) && data.length > 0) {
        resposta = data[0].mensagem || data[0].text || '';
      } else if (data.resposta) {
        resposta = data.resposta;
      } else if (data.mensagem) {
        resposta = data.mensagem;
      }

      // Show typing indicator
      setIsTyping(true);

      // Simulate natural delay before showing AI response
      setTimeout(() => {
        if (resposta) {
          const botMessage: Message = {
            id: `bot_${Date.now()}`,
            text: resposta,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          console.warn('⚠️ Nenhuma resposta encontrada no webhook');
        }
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
      console.error("Stack:", error instanceof Error ? error.stack : error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível se comunicar com o assistente. Tente novamente.",
        variant: "destructive",
      });
      
      // Restore message on error
      setInputMessage(inputMessage);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 animate-slide-in-right border-l border-cinza-borda">
      {/* Header */}
      <div className="bg-esmeralda text-white p-sm flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-semibold">
            C
          </div>
          <div>
            <p className="font-semibold">Concierge CONCIERA</p>
            <p className="text-xs opacity-90">● online</p>
          </div>
        </div>
        <div className="flex items-center gap-xs">
          <Phone size={20} />
          <MoreVertical size={20} />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Messages - Adjusted to account for input area */}
      <div className="flex-1 p-sm space-y-sm overflow-y-auto" style={{ height: 'calc(100vh - 80px - 140px)' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
          >
            <div
              className={`max-w-xs px-sm py-xxs rounded-lg text-sm ${
                message.isBot
                  ? 'bg-cinza-fundo-hover text-onyx'
                  : 'bg-esmeralda text-white'
              }`}
            >
              {message.text}
              <div className={`text-xs mt-xxs opacity-70 ${
                message.isBot ? 'text-grafite' : 'text-white/70'
              }`}>
                {message.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-cinza-fundo-hover text-onyx px-sm py-xxs rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-grafite rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-grafite rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-grafite rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - FIXED HEIGHT 140px total */}
      <div className="absolute bottom-0 left-0 right-0 h-[140px] border-t border-cinza-borda bg-white flex flex-col">
        {/* Scrollable area for previews and indicators - max 90px */}
        <div className="flex-1 overflow-y-auto p-sm pb-0 space-y-xs">
          {/* File Preview - Compact */}
          {selectedFile && (
            <div className="p-xs bg-[hsl(var(--cinza-fundo-hover))] rounded-lg flex items-center justify-between min-h-[48px]">
              <div className="flex items-center gap-xs flex-1 min-w-0">
                {filePreview && (
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                )}
                <span className="text-xs text-[hsl(var(--grafite))] truncate">
                  {selectedFile.type.startsWith('audio/') ? '🎤' : '🖼️'} 
                  {' '}{selectedFile.name}
                </span>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={clearFile}
                className="h-6 w-6 flex-shrink-0"
              >
                <X size={14} />
              </Button>
            </div>
          )}

          {/* Recording Indicator - Compact */}
          {isRecording && (
            <div className="flex items-center gap-xs px-xs py-1 bg-red-50 border border-red-200 rounded-md">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-700 font-medium">Gravando...</span>
            </div>
          )}
        </div>

        {/* Fixed Input bar - Always visible at bottom - 50px */}
        <div className="h-[50px] p-sm flex items-center gap-xs flex-shrink-0 border-t border-cinza-borda/50">
          {/* Audio Input - Record or Upload */}
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'audio')}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isSending}
            className={`h-10 w-10 mobile-touch-target ${isRecording ? 'bg-red-100 hover:bg-red-200' : ''}`}
            title={isRecording ? "Parar gravação" : "Gravar áudio"}
          >
            {isRecording ? (
              <StopCircle size={20} className="text-red-600" />
            ) : (
              <Mic size={20} className="text-[hsl(var(--grafite))]" />
            )}
          </Button>

          {/* Image Input */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'imagem')}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => imageInputRef.current?.click()}
            disabled={isSending}
            className="h-10 w-10 mobile-touch-target"
            title="Enviar imagem"
          >
            <ImageIcon size={20} className="text-[hsl(var(--grafite))]" />
          </Button>

          {/* Text Input - Single row */}
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem..."
            disabled={isSending}
            className="flex-1 h-[34px] min-h-[34px] max-h-[34px] resize-none bg-white border-[hsl(var(--cinza-borda))] focus:ring-[hsl(var(--dourado))] focus:border-[hsl(var(--dourado))] py-2"
            rows={1}
          />

          {/* Send Button - Fixed size */}
          <Button
            onClick={handleSendMessage}
            disabled={isSending || (!inputMessage.trim() && !selectedFile)}
            className="rounded-full h-[34px] w-[34px] bg-[hsl(var(--esmeralda))] hover:bg-[hsl(var(--esmeralda))]/90 text-white flex-shrink-0"
            size="icon"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <span className="text-lg">➤</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};