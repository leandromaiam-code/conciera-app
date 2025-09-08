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

    toast({
      title: statusMessages[status],
      variant: status === 'disconnected' ? 'destructive' : 'default'
    });
  };

  const toggleChannel = (channelKey: ChannelKey) => {
    const currentStatus = channels[channelKey].status;
    let newStatus: ChannelStatus;

    switch (currentStatus) {
      case 'disconnected':
        newStatus = 'connecting';
        // Simulate connection process
        setTimeout(() => updateChannelStatus(channelKey, 'connected'), 1500);
        break;
      case 'connected':
        newStatus = 'active';
        break;
      case 'active':
        newStatus = 'disconnected';
        break;
      default:
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