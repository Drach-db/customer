import { Mail, MessageCircle, Instagram, Send } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type TicketSource = 'email' | 'chat' | 'instagram' | 'telegram';

interface SourceConfig {
  icon: LucideIcon;
  label: string;
}

export const TICKET_SOURCES: Record<TicketSource, SourceConfig> = {
  email: {
    icon: Mail,
    label: 'Email',
  },
  chat: {
    icon: MessageCircle,
    label: 'Chat',
  },
  instagram: {
    icon: Instagram,
    label: 'Instagram',
  },
  telegram: {
    icon: Send,
    label: 'Telegram',
  },
};

// Helper component for rendering source icon
interface SourceIconProps {
  source: TicketSource;
  className?: string;
}

export function SourceIcon({ source, className = 'w-3.5 h-3.5' }: SourceIconProps) {
  const config = TICKET_SOURCES[source];
  const Icon = config.icon;
  return <Icon className={className} />;
}
