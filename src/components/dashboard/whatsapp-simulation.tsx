import { X, Phone, MoreVertical, Mic, Image as ImageIcon, Loader2 } from "lucide-react";
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

const simulationMessages: Omit<Message, 'id' | 'timestamp'>[] = [
  { text: "Olá! 👋 Bem-vindo(a) à Clínica Exemplo! Sou o assistente CONCIERA e estou aqui para ajudar você.", isBot: true },
  { text: "Preciso agendar uma consulta", isBot: false },
  { text: "Perfeito! Posso te ajudar com o agendamento. Qual especialidade você precisa?", isBot: true },
  { text: "Dermatologia", isBot: false },
  { text: "Ótima escolha! Temos horários disponíveis com nossos dermatologistas. Prefere manhã ou tarde?", isBot: true },
];

const quickReplies = [
  "Manhã",
  "Tarde", 
  "Não tenho preferência"
];

export const WhatsAppSimulation = ({ isOpen, onClose, empresaId }: WhatsAppSimulationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>(`simulacao_${Date.now()}`);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setCurrentMessageIndex(0);
      setInputMessage("");
      setSelectedFile(null);
      setFilePreview(null);
      sessionIdRef.current = `simulacao_${Date.now()}`;
      return;
    }

    // Initial welcome message
    const timer = setTimeout(() => {
      if (currentMessageIndex < simulationMessages.length) {
        setIsTyping(true);
        
        setTimeout(() => {
          const newMessage: Message = {
            id: Date.now().toString(),
            ...simulationMessages[currentMessageIndex],
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, newMessage]);
          setIsTyping(false);
          setCurrentMessageIndex(prev => prev + 1);
        }, simulationMessages[currentMessageIndex].isBot ? 2000 : 500);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, currentMessageIndex]);

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
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const data = await response.json();

      // Show typing indicator
      setIsTyping(true);

      // Simulate natural delay before showing AI response
      setTimeout(() => {
        if (data.resposta) {
          const botMessage: Message = {
            id: `bot_${Date.now()}`,
            text: data.resposta,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error("Error sending message:", error);
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

      {/* Messages */}
      <div className="flex-1 p-sm space-y-sm overflow-y-auto h-[calc(100vh-140px)]">
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

      {/* Input Area - Functional */}
      <div className="p-sm border-t border-cinza-borda bg-white">
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-xs p-xs bg-[hsl(var(--cinza-fundo-hover))] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-xs">
              {filePreview && (
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <span className="text-xs text-[hsl(var(--grafite))]">
                {selectedFile.type.startsWith('audio/') ? '🎤' : '🖼️'} 
                {' '}{selectedFile.name}
              </span>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={clearFile}
              className="h-6 w-6"
            >
              <X size={14} />
            </Button>
          </div>
        )}

        <div className="flex items-end gap-xs">
          {/* Audio Input */}
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
            onClick={() => audioInputRef.current?.click()}
            disabled={isSending}
            className="h-10 w-10 mobile-touch-target"
            title="Enviar áudio"
          >
            <Mic size={20} className="text-[hsl(var(--grafite))]" />
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

          {/* Text Input */}
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem..."
            disabled={isSending}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none bg-white border-[hsl(var(--cinza-borda))] focus:ring-[hsl(var(--dourado))] focus:border-[hsl(var(--dourado))]"
            rows={1}
          />

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={isSending || (!inputMessage.trim() && !selectedFile)}
            className="rounded-full h-10 w-10 bg-[hsl(var(--esmeralda))] hover:bg-[hsl(var(--esmeralda))]/90 text-white"
            size="icon"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <span className="text-xl">➤</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};