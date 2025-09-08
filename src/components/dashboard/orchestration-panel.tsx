import { MessageCircle, Phone, Mail, Users } from "lucide-react";
import { useState } from "react";
import concieraLogo from "@/assets/conciera-logo.png";

interface ChannelNodeProps {
  icon: React.ElementType;
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ChannelNode = ({ icon: Icon, name, isActive = false, onClick }: ChannelNodeProps) => (
  <div 
    className={`flex flex-col items-center gap-xxs cursor-pointer transition-elegant hover:scale-110 ${
      onClick ? 'hover-elevate' : ''
    }`}
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-elegant ${
      isActive ? 'bg-esmeralda text-branco-puro' : 'bg-branco-puro text-grafite border border-cinza-borda'
    }`}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-medium text-grafite">{name}</span>
  </div>
);

interface OrchestrationPanelProps {
  onWhatsAppClick: () => void;
}

export const OrchestrationPanel = ({ onWhatsAppClick }: OrchestrationPanelProps) => {
  const [activeChannels] = useState(['whatsapp', 'phone']);

  return (
    <div className="col-span-2 bg-white/50 rounded-xl p-lg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-dourado rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-esmeralda rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-lg">
          <h2 className="text-onyx mb-xxs">Centro de Orquestração</h2>
          <p className="text-secondary text-grafite">
            Visualização em tempo real dos canais conectados à sua IA
          </p>
        </div>

        {/* Orchestration Visualization */}
        <div className="flex items-center justify-center min-h-64 relative">
          {/* Central AI Node */}
          <div className="absolute z-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-onyx rounded-full flex items-center justify-center animate-pulse-ring">
              <img 
                src={concieraLogo} 
                alt="CONCIERA AI" 
                className="w-8 h-8 object-contain filter brightness-0 invert" 
              />
            </div>
            <span className="mt-xxs text-sm font-semibold text-onyx">CONCIERA AI</span>
            <span className="text-xs text-esmeralda">● Online</span>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 300">
            {/* Animated connection lines */}
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--dourado))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--dourado))" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(var(--dourado))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Lines to each channel */}
            <line x1="200" y1="150" x2="100" y2="100" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line x1="200" y1="150" x2="300" y2="100" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line x1="200" y1="150" x2="100" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
            <line x1="200" y1="150" x2="300" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" />
          </svg>

          {/* Channel Nodes */}
          <div className="absolute top-8 left-16">
            <ChannelNode 
              icon={MessageCircle} 
              name="WhatsApp" 
              isActive={activeChannels.includes('whatsapp')}
              onClick={onWhatsAppClick}
            />
          </div>
          
          <div className="absolute top-8 right-16">
            <ChannelNode 
              icon={Phone} 
              name="Telefone" 
              isActive={activeChannels.includes('phone')}
            />
          </div>
          
          <div className="absolute bottom-8 left-16">
            <ChannelNode 
              icon={Mail} 
              name="Email" 
              isActive={false}
            />
          </div>
          
          <div className="absolute bottom-8 right-16">
            <ChannelNode 
              icon={Users} 
              name="Portal" 
              isActive={false}
            />
          </div>
        </div>

        {/* Status Info */}
        <div className="flex justify-center gap-lg text-sm">
          <div className="flex items-center gap-xxs">
            <div className="w-2 h-2 bg-esmeralda rounded-full"></div>
            <span className="text-grafite">2 Canais Ativos</span>
          </div>
          <div className="flex items-center gap-xxs">
            <div className="w-2 h-2 bg-dourado rounded-full"></div>
            <span className="text-grafite">Processando 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};