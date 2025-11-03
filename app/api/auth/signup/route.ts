import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password, workspaceName } = await request.json();

    if (!email || !password || !workspaceName) {
      return NextResponse.json(
        { error: 'Email, password, and workspace name are required' },
        { status: 400 }
      );
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    const userId = authData.user.id;

    // 2. Create workspace with slug
    const slug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data: workspace, error: workspaceError } = await supabaseAdmin
      .from('workspaces')
      .insert({
        owner_id: userId,
        name: workspaceName,
        slug: slug,
        is_active: true,
      })
      .select()
      .single();

    if (workspaceError) {
      // Cleanup: delete the auth user if workspace creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: `Failed to create workspace: ${workspaceError.message}` },
        { status: 500 }
      );
    }

    // Note: workspace_member entry is created automatically by database trigger

    return NextResponse.json({ workspace });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
