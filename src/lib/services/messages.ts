import { supabase } from '../supabase/client';

// Types for messages
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
  // Relations
  sender?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface MessageWithSender extends Message {
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

/**
 * Get all messages for a specific ticket
 */
export async function getTicketMessages(ticketId: string): Promise<MessageWithSender[]> {
  try {
    // First, get the messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw messagesError;
    }

    if (!messages || messages.length === 0) {
      return [];
    }

    // Collect unique sender IDs by type
    const customerIds = messages
      .filter(m => m.sender_type === 'customer')
      .map(m => m.sender_id)
      .filter((v, i, a) => a.indexOf(v) === i);

    const userIds = messages
      .filter(m => m.sender_type === 'agent' || m.sender_type === 'system')
      .map(m => m.sender_id)
      .filter((v, i, a) => a.indexOf(v) === i);

    // Fetch customers
    const customers: Record<string, any> = {};
    if (customerIds.length > 0) {
      const { data: customersData } = await supabase
        .from('customers')
        .select('id, name, email')
        .in('id', customerIds);

      if (customersData) {
        customersData.forEach(c => {
          customers[c.id] = c;
        });
      }
    }

    // Fetch users
    const users: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);

      if (usersData) {
        usersData.forEach(u => {
          users[u.id] = u;
        });
      }
    }

    // Combine messages with sender data
    const enrichedMessages = messages.map(msg => ({
      ...msg,
      customer: msg.sender_type === 'customer' ? customers[msg.sender_id] : undefined,
      user: msg.sender_type !== 'customer' ? users[msg.sender_id] : undefined,
    }));

    return enrichedMessages;
  } catch (error) {
    console.error('Failed to get ticket messages:', error);
    throw error;
  }
}

/**
 * Send a new message in a ticket
 */
export async function sendMessage(
  ticketId: string,
  content: string,
  senderId: string,
  senderType: 'customer' | 'agent' = 'agent',
  isInternalNote: boolean = false
): Promise<Message> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        ticket_id: ticketId,
        sender_type: senderType,
        sender_id: senderId,
        content,
        attachments: [],
        is_internal_note: isInternalNote,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(messageIds: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
}