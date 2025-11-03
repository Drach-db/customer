export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          settings: Json | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          subscription_plan: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          subscription_plan?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          subscription_plan?: string | null;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: string;
          joined_at: string;
          invited_by: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role: string;
          joined_at?: string;
          invited_by?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
          invited_by?: string | null;
          is_active?: boolean;
        };
      };
      customers: {
        Row: {
          id: string;
          workspace_id: string;
          email: string | null;
          phone: string | null;
          name: string | null;
          avatar_url: string | null;
          external_id: string | null;
          source_type: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          email?: string | null;
          phone?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          external_id?: string | null;
          source_type?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          email?: string | null;
          phone?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          external_id?: string | null;
          source_type?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          settings: Json | null;
          created_at: string;
          created_by: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          settings?: Json | null;
          created_at?: string;
          created_by?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          description?: string | null;
          settings?: Json | null;
          created_at?: string;
          created_by?: string | null;
          is_active?: boolean;
        };
      };
      connectors: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          type: string;
          config: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          type: string;
          config?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          type?: string;
          config?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          project_id: string;
          customer_id: string | null;
          connector_id: string | null;
          assigned_to: string | null;
          number: number;
          subject: string;
          status: string;
          priority: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          customer_id?: string | null;
          connector_id?: string | null;
          assigned_to?: string | null;
          number?: number;
          subject: string;
          status?: string;
          priority?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          customer_id?: string | null;
          connector_id?: string | null;
          assigned_to?: string | null;
          number?: number;
          subject?: string;
          status?: string;
          priority?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_type: string;
          sender_id: string | null;
          content: string;
          attachments: Json | null;
          is_internal_note: boolean;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_type: string;
          sender_id?: string | null;
          content: string;
          attachments?: Json | null;
          is_internal_note?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          sender_type?: string;
          sender_id?: string | null;
          content?: string;
          attachments?: Json | null;
          is_internal_note?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
      };
      invitations: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          role: string;
          token: string;
          invited_by: string;
          expires_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          email: string;
          role: string;
          token: string;
          invited_by: string;
          expires_at: string;
          accepted_at?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          email?: string;
          role?: string;
          token?: string;
          invited_by?: string;
          expires_at?: string;
          accepted_at?: string | null;
        };
      };
    };
  };
}
