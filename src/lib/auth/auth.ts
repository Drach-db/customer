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
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.workspaceName,
        }
      }
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Create workspace
    const workspaceSlug = data.workspaceName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name: data.workspaceName,
        slug: workspaceSlug,
      })
      .select()
      .single();

    if (workspaceError) {
      console.error('Workspace creation error:', workspaceError);
      // User is created but workspace failed - they can still use the app
    }

    return { success: true, workspace: workspace || undefined };
  } catch (error) {
    console.error('Signup error:', error);
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
