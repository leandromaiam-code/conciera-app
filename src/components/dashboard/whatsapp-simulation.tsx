import { X, Phone, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface WhatsAppSimulationProps {
  isOpen: boolean;
  onClose: () => void;
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

export const WhatsAppSimulation = ({ isOpen, onClose }: WhatsAppSimulationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setCurrentMessageIndex(0);
      return;
    }

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
      </div>

      {/* Quick Replies */}
      {currentMessageIndex >= simulationMessages.length && (
        <div className="p-sm border-t border-cinza-borda">
          <p className="text-xs text-grafite mb-xxs">Respostas rápidas:</p>
          <div className="flex flex-wrap gap-xxs">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                className="btn-quick-reply text-xs"
                onClick={() => {
                  // Simulate user selection in demo
                  const userMessage: Message = {
                    id: Date.now().toString(),
                    text: reply,
                    isBot: false,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, userMessage]);
                }}
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area (Disabled in Demo) */}
      <div className="p-sm border-t border-cinza-borda bg-gray-50">
        <div className="flex items-center gap-xs">
          <div className="flex-1 bg-white border border-cinza-borda rounded-full px-sm py-xxs text-sm text-grafite">
            Digite uma mensagem... (Demo)
          </div>
          <Button size="sm" disabled className="rounded-full">
            ➤
          </Button>
        </div>
      </div>
    </div>
  );
};