const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse env vars
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    process.env[key.trim()] = values.join('=').trim();
  }
});

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestUser() {
  const email = 'daniel@marke.tel';
  const password = '123456789';
  const workspaceName = 'Marketel';

  console.log('Creating test user...');
  console.log('Email:', email);
  console.log('Password:', password);

  // 1. Delete existing user if exists
  console.log('\n1. Checking for existing user...');
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);

  if (existingUser) {
    console.log('Found existing user, deleting...');

    // Get user's workspaces
    const { data: workspaces } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', existingUser.id);

    if (workspaces && workspaces.length > 0) {
      const workspaceIds = workspaces.map(w => w.id);

      // Delete workspace_members for these workspaces
      await supabase
        .from('workspace_members')
        .delete()
        .in('workspace_id', workspaceIds);

      // Delete workspaces
      await supabase
        .from('workspaces')
        .delete()
        .in('id', workspaceIds);
    }

    // Delete any remaining workspace_members by user_id
    await supabase
      .from('workspace_members')
      .delete()
      .eq('user_id', existingUser.id);

    // Delete auth user
    await supabase.auth.admin.deleteUser(existingUser.id);
    console.log('Deleted existing user and all related data');
  }

  // 2. Create new user
  console.log('\n2. Creating new user...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm email
  });

  if (authError) {
    console.error('Error creating user:', authError);
    return;
  }

  console.log('✓ User created:', authData.user.id);

  // 3. Create workspace
  console.log('\n3. Creating workspace...');
  const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      owner_id: authData.user.id,
      name: workspaceName,
      slug: slug,
      is_active: true,
    })
    .select()
    .single();

  if (workspaceError) {
    console.error('Error creating workspace:', workspaceError);
    return;
  }

  console.log('✓ Workspace created:', workspace.slug);

  // 4. Create workspace member (or check if exists)
  console.log('\n4. Adding user to workspace...');

  // Check if already exists
  const { data: existingMember } = await supabase
    .from('workspace_members')
    .select('*')
    .eq('workspace_id', workspace.id)
    .eq('user_id', authData.user.id)
    .single();

  if (existingMember) {
    console.log('✓ User already in workspace (auto-created)');
  } else {
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: authData.user.id,
        role: 'owner',
        is_active: true,
      });

    if (memberError) {
      console.error('Error creating workspace member:', memberError);
      return;
    }

    console.log('✓ User added to workspace');
  }

  console.log('\n✅ Test user created successfully!');
  console.log('\nLogin credentials:');
  console.log('  Email:', email);
  console.log('  Password:', password);
  console.log('  Workspace:', workspaceName);
  console.log('  URL: http://localhost:3001/login');
}

createTestUser().catch(console.error);
