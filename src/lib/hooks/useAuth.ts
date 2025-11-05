import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { User } from '@supabase/supabase-js';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo_url: string | null;
  settings: any;
  is_active: boolean;
  subscription_plan: string;
}

interface AuthState {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    workspaces: [],
    currentWorkspace: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, user: session.user }));
        fetchUserWorkspaces(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, user: session.user }));
        fetchUserWorkspaces(session.user.id);
      } else {
        setAuthState({
          user: null,
          workspaces: [],
          currentWorkspace: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserWorkspaces = async (userId: string) => {
    try {
      // Get workspaces where user is owner or member
      const { data: ownedWorkspaces, error: ownedError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_active', true);

      if (ownedError) throw ownedError;

      const { data: memberWorkspaces, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace:workspaces(*)')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (memberError) throw memberError;

      const allWorkspaces = [
        ...(ownedWorkspaces || []),
        ...(memberWorkspaces?.map(m => m.workspace).filter(Boolean) || [])
      ];

      // Remove duplicates
      const uniqueWorkspaces = Array.from(
        new Map(allWorkspaces.map(w => [w.id, w])).values()
      );

      setAuthState(prev => ({
        ...prev,
        workspaces: uniqueWorkspaces,
        currentWorkspace: uniqueWorkspaces[0] || null,
        loading: false,
      }));
    } catch (error: any) {
      console.error('Error fetching workspaces:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    }
  };

  const switchWorkspace = (workspaceId: string) => {
    const workspace = authState.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setAuthState(prev => ({ ...prev, currentWorkspace: workspace }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ ...prev, error: error.message }));
    }
  };

  return {
    ...authState,
    switchWorkspace,
    signIn,
    signOut,
  };
}