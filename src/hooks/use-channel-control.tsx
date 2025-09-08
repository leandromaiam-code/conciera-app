import { useState } from 'react';
import { MessageCircle, Phone, Mail, Users, Instagram, FileText } from "lucide-react";
import { ChannelConfig, ChannelKey, ChannelStatus } from '@/types/channel';
import { useToast } from '@/hooks/use-toast';

export const useChannelControl = () => {
  const { toast } = useToast();
  
  const [channels, setChannels] = useState<ChannelConfig>({
    whatsapp: { 
      status: 'active', 
      name: 'WhatsApp', 
      icon: MessageCircle,
      lastConnected: new Date() 
    },
    telefone: { 
      status: 'connected', 
      name: 'Telefone', 
      icon: Phone,
      lastConnected: new Date() 
    },
    email: { 
      status: 'disconnected', 
      name: 'Email', 
      icon: Mail 
    },
    portal: { 
      status: 'disconnected', 
      name: 'Portal', 
      icon: Users 
    },
    instagram: { 
      status: 'disconnected', 
      name: 'Instagram', 
      icon: Instagram 
    },
    formularios: { 
      status: 'disconnected', 
      name: 'Formulários', 
      icon: FileText 
    },
  });

  const updateChannelStatus = (channelKey: ChannelKey, status: ChannelStatus) => {
    console.log(`Updating channel ${channelKey} to status: ${status}`);
    
    setChannels(prev => ({
      ...prev,
      [channelKey]: {
        ...prev[channelKey],
        status,
        lastConnected: status === 'connected' || status === 'active' ? new Date() : prev[channelKey].lastConnected
      }
    }));

    // Toast feedback
    const channel = channels[channelKey];
    const statusMessages = {
      connected: `${channel.name} conectado com sucesso!`,
      active: `${channel.name} ativado!`,
      disconnected: `${channel.name} desconectado`,
      connecting: `Conectando ${channel.name}...`
    };

    const toastMessage = statusMessages[status];
    console.log(`Showing toast: ${toastMessage}`);
    
    toast({
      title: toastMessage,
      variant: status === 'disconnected' ? 'destructive' : 'default'
    });
  };

  const toggleChannel = (channelKey: ChannelKey) => {
    const currentStatus = channels[channelKey].status;
    console.log(`Toggle channel ${channelKey}, current status: ${currentStatus}`);
    
    let newStatus: ChannelStatus;

    switch (currentStatus) {
      case 'disconnected':
        newStatus = 'connecting';
        console.log(`Starting connection for ${channelKey}`);
        // Simulate connection process - increased timeout for better visibility
        setTimeout(() => {
          console.log(`Connection completed for ${channelKey}`);
          updateChannelStatus(channelKey, 'connected');
        }, 3000);
        break;
      case 'connected':
        newStatus = 'active';
        console.log(`Activating ${channelKey}`);
        break;
      case 'active':
        newStatus = 'disconnected';
        console.log(`Disconnecting ${channelKey}`);
        break;
      default:
        console.log(`Unknown status for ${channelKey}: ${currentStatus}`);
        return;
    }

    updateChannelStatus(channelKey, newStatus);
  };

  const getActiveChannelsCount = () => {
    return Object.values(channels).filter(channel => channel.status === 'active').length;
  };

  return {
    channels,
    updateChannelStatus,
    toggleChannel,
    getActiveChannelsCount
  };
};