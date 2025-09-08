import { MessageCircle, Phone, Mail, Users, Instagram, FileText, Settings, Zap, Loader2 } from "lucide-react";
import { ConcieraLogo } from "@/components/ui/logo";
import { ChannelConfigModal } from "./channel-config-modal";
import { useChannelControl } from "@/hooks/use-channel-control";
import { ChannelKey, ChannelStatus } from "@/types/channel";
import React from "react";

interface ChannelNodeProps {
  icon: React.ElementType;
  name: string;
  status: ChannelStatus;
  onClick?: () => void;
  onConfigure?: () => void;
}

const ChannelNode = ({ icon: Icon, name, status, onClick, onConfigure }: ChannelNodeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-esmeralda text-white shadow-lg border-4 border-esmeralda animate-pulse-ring scale-110';
      case 'connected': 
        return 'bg-dourado text-onyx border-4 border-dourado shadow-md';
      case 'connecting':
        return 'bg-yellow-300 text-yellow-800 border-4 border-yellow-500 animate-pulse shadow-lg';
      case 'disconnected':
      default:
        return 'bg-white text-gray-600 border-2 border-gray-300 hover:border-dourado hover:text-dourado hover:shadow-md';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'active':
        return <Zap size={12} className="absolute -top-1 -right-1 bg-esmeralda text-branco-puro rounded-full p-0.5" />;
      case 'connecting':
        return <Loader2 size={12} className="absolute -top-1 -right-1 bg-dourado text-onyx rounded-full p-0.5 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative group">
      <div 
        className={`flex flex-col items-center gap-1 cursor-pointer transition-elegant hover:scale-110 hover:-translate-y-1`}
        onClick={onClick}
      >
        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-elegant border-2 ${getStatusStyles()}`}>
          <Icon size={20} />
          {getStatusIndicator()}
        </div>
        <span className="text-xs font-medium text-grafite">{name}</span>
      </div>
      
      {/* Configuration button - shown on hover */}
      {onConfigure && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfigure();
          }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-onyx text-branco-puro rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-elegant hover:scale-110"
        >
          <Settings size={12} />
        </button>
      )}
    </div>
  );
};

interface OrchestrationPanelProps {
  onWhatsAppClick?: () => void;
}

export const OrchestrationPanel = ({ onWhatsAppClick }: OrchestrationPanelProps) => {
  const [animateConnections, setAnimateConnections] = React.useState(false);
  const [configModal, setConfigModal] = React.useState<{ isOpen: boolean; channelKey?: ChannelKey }>({ 
    isOpen: false 
  });
  
  const { channels, toggleChannel, getActiveChannelsCount } = useChannelControl();

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimateConnections(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChannelClick = (channelKey: ChannelKey) => {
    console.log(`Channel clicked: ${channelKey}, status: ${channels[channelKey].status}`);
    
    if (channels[channelKey].status === 'connecting') {
      console.log('Channel is connecting, ignoring click');
      return;
    }
    
    if (channelKey === 'whatsapp' && onWhatsAppClick) {
      onWhatsAppClick();
    }
    
    toggleChannel(channelKey);
  };

  const handleConfigure = (channelKey: ChannelKey) => {
    setConfigModal({ isOpen: true, channelKey });
  };

  const activeCount = getActiveChannelsCount();

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
              icon={channels.whatsapp.icon} 
              name={channels.whatsapp.name} 
              status={channels.whatsapp.status}
              onClick={() => handleChannelClick('whatsapp')}
              onConfigure={() => handleConfigure('whatsapp')}
            />
          </div>
          
          <div className="absolute top-4 right-28">
            <ChannelNode 
              icon={channels.telefone.icon} 
              name={channels.telefone.name} 
              status={channels.telefone.status}
              onClick={() => handleChannelClick('telefone')}
              onConfigure={() => handleConfigure('telefone')}
            />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-4">
            <ChannelNode 
              icon={channels.instagram.icon} 
              name={channels.instagram.name} 
              status={channels.instagram.status}
              onClick={() => handleChannelClick('instagram')}
              onConfigure={() => handleConfigure('instagram')}
            />
          </div>
          
          <div className="absolute bottom-4 right-28">
            <ChannelNode 
              icon={channels.email.icon} 
              name={channels.email.name} 
              status={channels.email.status}
              onClick={() => handleChannelClick('email')}
              onConfigure={() => handleConfigure('email')}
            />
          </div>
          
          <div className="absolute bottom-4 left-28">
            <ChannelNode 
              icon={channels.formularios.icon} 
              name={channels.formularios.name} 
              status={channels.formularios.status}
              onClick={() => handleChannelClick('formularios')}
              onConfigure={() => handleConfigure('formularios')}
            />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-4">
            <ChannelNode 
              icon={channels.portal.icon} 
              name={channels.portal.name} 
              status={channels.portal.status}
              onClick={() => handleChannelClick('portal')}
              onConfigure={() => handleConfigure('portal')}
            />
          </div>
        </div>

        {/* Status Info */}
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-esmeralda rounded-full animate-pulse"></div>
            <span className="text-grafite">{activeCount} Canais Ativos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-dourado rounded-full"></div>
            <span className="text-grafite">Processando 24/7</span>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {configModal.isOpen && configModal.channelKey && (
        <ChannelConfigModal
          isOpen={configModal.isOpen}
          onClose={() => setConfigModal({ isOpen: false })}
          channelKey={configModal.channelKey}
          channel={channels[configModal.channelKey]}
          onConnect={toggleChannel}
        />
      )}
    </div>
  );
};