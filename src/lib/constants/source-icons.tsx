import { Mail, Send, Phone } from 'lucide-react';

export const SOURCE_ICONS = {
  email: Mail,
  telegram: Send,
  whatsapp: Phone,
} as const;

export type SourceType = keyof typeof SOURCE_ICONS;

// Helper function to get icon component
export function getSourceIcon(type: string) {
  return SOURCE_ICONS[type as SourceType] || Mail;
}

// Status icons
export const STATUS_ICONS = {
  open: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="currentColor" className="text-green-500" />
    </svg>
  ),
  pending: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="currentColor" className="text-yellow-500" />
    </svg>
  ),
  resolved: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="currentColor" className="text-blue-500" />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  closed: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="currentColor" className="text-gray-500" />
    </svg>
  ),
  unread: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="currentColor" className="text-orange-500" />
      <circle cx="8" cy="8" r="2" fill="white" />
    </svg>
  ),
} as const;

export type StatusType = keyof typeof STATUS_ICONS;

export function getStatusIcon(status: string) {
  const Icon = STATUS_ICONS[status as StatusType];
  return Icon ? <Icon /> : null;
}
