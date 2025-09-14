import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Activity, Settings, Wifi, WifiOff } from "lucide-react";
import { useChannelControl } from "@/hooks/use-channel-control";
import { ChannelConfigModal } from "./channel-config-modal";
import { ChannelKey } from "@/types/channel";

export const ChannelStatusIndicator = () => {
  const { channels, toggleChannel, getActiveChannelsCount } = useChannelControl();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedChannelKey, setSelectedChannelKey] = useState<ChannelKey | null>(null);
  
  const activeChannels = getActiveChannelsCount();
  const totalChannels = Object.keys(channels).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'connected': return 'bg-yellow-600';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'disconnected' ? WifiOff : Wifi;
  };

  const handleConfigure = (channelKey: ChannelKey) => {
    setSelectedChannelKey(channelKey);
    setConfigModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Activity size={18} />
            <span className="text-sm font-medium">Status dos Canais</span>
            <Badge variant="secondary" className="text-xs">
              {activeChannels}/{totalChannels}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="text-xs text-gray-600 font-medium">
            Canais de Comunicação
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {Object.entries(channels).map(([key, channel]) => {
            const StatusIcon = getStatusIcon(channel.status);
            return (
              <DropdownMenuItem
                key={key}
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleChannel(key as ChannelKey)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <channel.icon size={18} className="text-gray-600" />
                    <div 
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(channel.status)}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{channel.name}</p>
                    <p className="text-xs text-gray-600 capitalize">{channel.status}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfigure(key as ChannelKey);
                  }}
                  className="p-1 h-auto text-gray-600 hover:text-gray-900"
                >
                  <Settings size={14} />
                </Button>
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs text-gray-600 cursor-default"
            onSelect={(e) => e.preventDefault()}
          >
            Clique para alternar • Gear para configurar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

        {configModalOpen && selectedChannelKey && (
          <ChannelConfigModal
            isOpen={configModalOpen}
            onClose={() => setConfigModalOpen(false)}
            channelKey={selectedChannelKey}
            channel={channels[selectedChannelKey]}
            onConnect={toggleChannel}
          />
        )}
    </>
  );
};