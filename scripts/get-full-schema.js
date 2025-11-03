const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    process.env[key.trim()] = values.join('=').trim();
  }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
  }
);

async function getFullSchema() {
  console.log('📋 Fetching FULL database schema with service_role access...\n');

  try {
    // Use rpc to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT
          c.table_name,
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          c.ordinal_position,
          tc.constraint_type,
          kcu.referenced_table_name,
          kcu.referenced_column_name
        FROM information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
          ON c.table_name = kcu.table_name
          AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name
        WHERE c.table_schema = 'public'
        ORDER BY c.table_name, c.ordinal_position;
      `
    });

    if (error) {
      console.log('⚠️  RPC method not available. Using alternative approach...\n');

      // Alternative: Use PostgREST direct query
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            query: `
              SELECT
                table_name,
                column_name,
                data_type,
                is_nullable,
                column_default
              FROM information_schema.columns
              WHERE table_schema = 'public'
              ORDER BY table_name, ordinal_position;
            `
          })
        }
      );

      if (!response.ok) {
        console.log('⚠️  Direct SQL not available. Using REST API metadata...\n');

        // Get list of all tables first
        const tablesResp = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
          {
            headers: {
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            }
          }
        );

        const tablesData = await tablesResp.json();
        console.log('📊 Available endpoints/tables:', Object.keys(tablesData.definitions || {}));
        console.log('\nFull API schema:');
        console.log(JSON.stringify(tablesData, null, 2));
      } else {
        const sqlData = await response.json();
        console.log('✅ Schema data:', JSON.stringify(sqlData, null, 2));
      }
    } else {
      console.log('✅ Schema data:', JSON.stringify(data, null, 2));
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📝 Trying basic table inspection...\n');

    // Last resort: just try common table names
    const commonTables = ['users', 'workspaces', 'workspace_members', 'projects', 'sources', 'tickets', 'invitations'];

    for (const table of commonTables) {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (!error) {
        console.log(`✅ Table exists: ${table}`);
      }
    }
  }
}

getFullSchema();
