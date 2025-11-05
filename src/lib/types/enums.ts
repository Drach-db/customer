/**
 * Database enums and constants
 * This file contains all the enum types used in the database
 */

// Ticket statuses
export const TICKET_STATUS = {
  OPEN: 'open',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export type TicketStatus = typeof TICKET_STATUS[keyof typeof TICKET_STATUS];

// Ticket priorities
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export type TicketPriority = typeof TICKET_PRIORITY[keyof typeof TICKET_PRIORITY];

// Connector types
export const CONNECTOR_TYPE = {
  EMAIL: 'email',
  TELEGRAM: 'telegram',
  WHATSAPP: 'whatsapp'
} as const;

export type ConnectorType = typeof CONNECTOR_TYPE[keyof typeof CONNECTOR_TYPE];

// Message sender types
export const SENDER_TYPE = {
  CUSTOMER: 'customer',
  AGENT: 'agent',
  SYSTEM: 'system'
} as const;

export type SenderType = typeof SENDER_TYPE[keyof typeof SENDER_TYPE];

// Workspace member roles
export const MEMBER_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const;

export type MemberRole = typeof MEMBER_ROLE[keyof typeof MEMBER_ROLE];

// Status badge colors
export const STATUS_COLORS: Record<TicketStatus, string> = {
  [TICKET_STATUS.OPEN]: 'badge-open',
  [TICKET_STATUS.PENDING]: 'badge-pending',
  [TICKET_STATUS.RESOLVED]: 'badge-closed',
  [TICKET_STATUS.CLOSED]: 'badge-closed'
};

// Priority colors
export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  [TICKET_PRIORITY.LOW]: 'text-gray-500',
  [TICKET_PRIORITY.MEDIUM]: 'text-blue-600',
  [TICKET_PRIORITY.HIGH]: 'text-orange-600',
  [TICKET_PRIORITY.URGENT]: 'text-red-600'
};