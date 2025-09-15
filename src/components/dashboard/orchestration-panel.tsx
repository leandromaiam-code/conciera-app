import { MessageCircle, Phone, Mail, Users, Instagram, FileText } from "lucide-react";
import { ConcieraLogo } from "@/components/ui/logo";
import React from "react";

interface ChannelNodeProps {
  icon: React.ElementType;
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ChannelNode = ({ icon: Icon, name, isActive = false, onClick }: ChannelNodeProps) => (
  <div 
    className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-110 ${
      onClick ? 'hover:-translate-y-1 hover:shadow-sm' : ''
    }`}
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
      isActive ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-300'
    }`}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-medium text-gray-600">{name}</span>
  </div>
);

interface OrchestrationPanelProps {
  onWhatsAppClick: () => void;
  activeChannels?: {
    whatsappAtivo: boolean;
    telefoneAtivo: boolean;
    emailAtivo: boolean;
    portalAtivo: boolean;
    instagramAtivo: boolean;
    formulariosAtivo: boolean;
  };
}

export const OrchestrationPanel = ({ onWhatsAppClick, activeChannels }: OrchestrationPanelProps) => {
  const [animateConnections, setAnimateConnections] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimateConnections(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const defaultChannels = {
    whatsappAtivo: true,
    telefoneAtivo: true,
    emailAtivo: false,
    portalAtivo: false,
    instagramAtivo: false,
    formulariosAtivo: false
  };
  
  const channels = activeChannels || defaultChannels;
  const activeCount = Object.values(channels).filter(Boolean).length;

  return (
    <div className="col-span-2 bg-white/50 rounded-xl p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-yellow-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-green-600 rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <h2 className="text-gray-900 text-2xl font-semibold font-serif mb-1">Centro de Orquestração</h2>
          <p className="text-gray-600 text-sm">
            Visualização em tempo real dos canais conectados à sua IA
          </p>
        </div>

        {/* Orchestration Visualization */}
        <div className="flex items-center justify-center min-h-64 relative">
          {/* Central AI Node */}
          <div className="absolute z-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center animate-pulse">
              <ConcieraLogo className="w-8 h-8 text-white" />
            </div>
            <span className="mt-1 text-sm font-semibold text-gray-900">CONCIERA AI</span>
            <span className="text-xs text-green-600">● Online</span>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 300">
            {/* Animated connection lines */}
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="rgb(234, 179, 8)" stopOpacity="1" />
                <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Lines to each channel - arranged in circle */}
            <line x1="200" y1="150" x2="120" y2="80" 
              stroke="url(#connectionGradient)" 
              strokeWidth="2"
              opacity={animateConnections ? "0.8" : "0"}
              className="transition-opacity duration-1000"
            />
            <line x1="200" y1="150" x2="280" y2="80" 
              stroke="url(#connectionGradient)" 
              strokeWidth="2"
              opacity={animateConnections ? "0.8" : "0"}
              className="transition-opacity duration-1000 delay-200"
            />
            <line x1="200" y1="150" x2="320" y2="150" 
              stroke="url(#connectionGradient)" 
              strokeWidth="2"
              opacity={animateConnections ? "0.8" : "0"}
              className="transition-opacity duration-1000 delay-300"
            />
            <line x1="200" y1="150" x2="280" y2="220" 
              stroke="url(#connectionGradient)" 
              strokeWidth="2"
              opacity={animateConnections ? "0.8" : "0"}
              className="transition-opacity duration-1000 delay-400"
            />
            <line x1="200" y1="150" x2="120" y2="220" 
              stroke="url(#connectionGradient)" 
              strokeWidth="2"
              opacity={animateConnections ? "0.8" : "0"}
              className="transition-opacity duration-1000 delay-500"
            />
            <line x1="200" y1="150" x2="80" y2="150" 
              stroke="url(#connectionGradient)" 
              strokeWidth="2"
              opacity={animateConnections ? "0.8" : "0"}
              className="transition-opacity duration-1000 delay-600"
            />
          </svg>

          {/* Channel Nodes - arranged in circle */}
          <div className="absolute top-4 left-28">
            <ChannelNode 
              icon={MessageCircle} 
              name="WhatsApp" 
              isActive={channels.whatsappAtivo}
              onClick={onWhatsAppClick}
            />
          </div>
          
          <div className="absolute top-4 right-28">
            <ChannelNode 
              icon={Phone} 
              name="Telefone" 
              isActive={channels.telefoneAtivo}
            />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-4">
            <ChannelNode 
              icon={Instagram} 
              name="Instagram" 
              isActive={channels.instagramAtivo}
            />
          </div>
          
          <div className="absolute bottom-4 right-28">
            <ChannelNode 
              icon={Mail} 
              name="Email" 
              isActive={channels.emailAtivo}
            />
          </div>
          
          <div className="absolute bottom-4 left-28">
            <ChannelNode 
              icon={FileText} 
              name="Formulários" 
              isActive={channels.formulariosAtivo}
            />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-4">
            <ChannelNode 
              icon={Users} 
              name="Portal" 
              isActive={channels.portalAtivo}
            />
          </div>
        </div>

        {/* Status Info */}
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-gray-600">{activeCount} Canais Ativos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Processando 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};