import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Get user's workspace and redirect there
    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();

    if (member) {
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('slug')
        .eq('id', member.workspace_id)
        .single();

      if (workspace) {
        redirect(`/workspaces/${workspace.slug}/inbox`);
      }
    }
  }

  // Redirect to login if not authenticated
  redirect('/login');
}
