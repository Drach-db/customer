import { supabase } from '../supabase/client';

// Types based on your database structure
export interface Ticket {
  id: string;
  project_id: string;
  customer_id: string;
  connector_id: string;
  assigned_to: string | null;
  number: number;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  // Relations
  customer?: Customer;
  project?: Project;
  connector?: Connector;
  messages?: Message[];
  last_message?: Message;
}

export interface Customer {
  id: string;
  workspace_id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar_url: string | null;
  external_id: string | null;
  source_type: string | null;
  metadata: any;
  created_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  settings: any;
  created_at: string;
  created_by: string;
  is_active: boolean;
}

export interface Connector {
  id: string;
  project_id: string;
  type: string;
  name: string;
  config: any;
  status: 'active' | 'inactive' | 'error';
  last_sync_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  sender_type: 'customer' | 'agent' | 'system';
  sender_id: string;
  content: string;
  attachments: any[];
  is_internal_note: boolean;
  created_at: string;
  read_at: string | null;
}

export interface TicketWithRelations extends Ticket {
  customer: Customer;
  project: Project;
  connector: Connector;
  last_message?: Message;
}

/**
 * Get tickets for a specific workspace
 */
export async function getTickets(workspaceId: string): Promise<TicketWithRelations[]> {
  try {
    // First get the projects for this workspace
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true);

    if (projectsError) throw projectsError;
    if (!projects || projects.length === 0) return [];

    const projectIds = projects.map(p => p.id);

    // Get tickets with relations
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        project:projects(*),
        connector:connectors(*)
      `)
      .in('project_id', projectIds)
      .order('created_at', { ascending: false });

    if (ticketsError) throw ticketsError;
    if (!tickets) return [];

    // Get last message for each ticket
    const ticketIds = tickets.map(t => t.id);
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .in('ticket_id', ticketIds)
      .order('created_at', { ascending: false });

    if (messagesError) throw messagesError;

    // Map last message to each ticket
    const ticketsWithLastMessage = tickets.map(ticket => {
      const ticketMessages = messages?.filter(m => m.ticket_id === ticket.id) || [];
      return {
        ...ticket,
        last_message: ticketMessages[0] || null,
      };
    });

    return ticketsWithLastMessage as TicketWithRelations[];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

/**
 * Get a single ticket with all relations
 */
export async function getTicket(ticketId: string): Promise<TicketWithRelations | null> {
  try {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        project:projects(*),
        connector:connectors(*),
        messages(*)
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    return ticket as TicketWithRelations;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  ticketId: string,
  status: Ticket['status']
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
}

/**
 * Update ticket assignment
 */
export async function assignTicket(
  ticketId: string,
  userId: string | null
): Promise<void> {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        assigned_to: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    if (error) throw error;
  } catch (error) {
    console.error('Error assigning ticket:', error);
    throw error;
  }
}

/**
 * Add tags to a ticket
 */
export async function updateTicketTags(
  ticketId: string,
  tags: string[]
): Promise<void> {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating ticket tags:', error);
    throw error;
  }
}

/**
 * Get tickets statistics for a workspace
 */
export async function getTicketsStats(workspaceId: string) {
  try {
    // Get projects for this workspace
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true);

    if (projectsError) throw projectsError;
    if (!projects || projects.length === 0) {
      return {
        total: 0,
        open: 0,
        in_progress: 0,
        pending: 0,
        resolved: 0,
        closed: 0,
      };
    }

    const projectIds = projects.map(p => p.id);

    // Get tickets count by status
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('status')
      .in('project_id', projectIds);

    if (ticketsError) throw ticketsError;
    if (!tickets) {
      return {
        total: 0,
        open: 0,
        in_progress: 0,
        pending: 0,
        resolved: 0,
        closed: 0,
      };
    }

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      pending: tickets.filter(t => t.status === 'pending').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching tickets statistics:', error);
    throw error;
  }
}