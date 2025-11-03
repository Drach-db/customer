import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/types/database';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export interface SignupData {
  email: string;
  password: string;
  workspaceName: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  workspace?: Workspace;
}

/**
 * Sign up a new user and create their workspace
 */
export async function signUp(data: SignupData): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error };
    }

    return { success: true, workspace: result.workspace };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Failed to sign in' };
    }

    // Get user's workspace
    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .single();

    if (!member) {
      return { success: false, error: 'No active workspace found' };
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', member.workspace_id)
      .single();

    return { success: true, workspace: workspace || undefined };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user's workspace
 */
export async function getCurrentWorkspace(): Promise<Workspace | null> {
  const session = await getSession();
  if (!session?.user) return null;

  const { data: member } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single();

  if (!member) return null;

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', member.workspace_id)
    .single();

  return workspace;
}

/**
 * Get current user data
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
