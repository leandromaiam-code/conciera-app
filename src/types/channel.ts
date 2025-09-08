// Channel status types for orchestration control
export type ChannelStatus = 'disconnected' | 'connecting' | 'connected' | 'active';

export interface ChannelState {
  status: ChannelStatus;
  name: string;
  icon: React.ElementType;
  lastConnected?: Date;
  config?: Record<string, unknown>;
}

export interface ChannelConfig {
  whatsapp: ChannelState;
  telefone: ChannelState;
  email: ChannelState;
  portal: ChannelState;
  instagram: ChannelState;
  formularios: ChannelState;
}

export type ChannelKey = keyof ChannelConfig;