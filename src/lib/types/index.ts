/**
 * Central types export file
 * Re-exports all types from different modules
 */

// Database types
export type { Database, Json } from './database';

// Enum types and constants
export {
  TICKET_STATUS,
  TICKET_PRIORITY,
  CONNECTOR_TYPE,
  SENDER_TYPE,
  MEMBER_ROLE,
  STATUS_COLORS,
  PRIORITY_COLORS,
  type TicketStatus,
  type TicketPriority,
  type ConnectorType,
  type SenderType,
  type MemberRole
} from './enums';

// Helper type to extract table types
import { Database } from './database';

export type Tables = Database['public']['Tables'];
export type User = Tables['users']['Row'];
export type Workspace = Tables['workspaces']['Row'];
export type WorkspaceMember = Tables['workspace_members']['Row'];
export type Customer = Tables['customers']['Row'];
export type Project = Tables['projects']['Row'];
export type Connector = Tables['connectors']['Row'];
export type Ticket = Tables['tickets']['Row'];
export type Message = Tables['messages']['Row'];
export type Invitation = Tables['invitations']['Row'];

// Insert types
export type InsertUser = Tables['users']['Insert'];
export type InsertWorkspace = Tables['workspaces']['Insert'];
export type InsertCustomer = Tables['customers']['Insert'];
export type InsertProject = Tables['projects']['Insert'];
export type InsertConnector = Tables['connectors']['Insert'];
export type InsertTicket = Tables['tickets']['Insert'];
export type InsertMessage = Tables['messages']['Insert'];

// Update types
export type UpdateUser = Tables['users']['Update'];
export type UpdateWorkspace = Tables['workspaces']['Update'];
export type UpdateCustomer = Tables['customers']['Update'];
export type UpdateProject = Tables['projects']['Update'];
export type UpdateConnector = Tables['connectors']['Update'];
export type UpdateTicket = Tables['tickets']['Update'];
export type UpdateMessage = Tables['messages']['Update'];