const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
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
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDBStructure() {
  console.log('🔍 Checking Supabase database structure...\n');

  try {
    // Get all tables
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables');

    if (tablesError) {
      // Alternative method - query information_schema
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) {
        console.log('⚠️  Cannot query tables directly. Checking known tables...\n');

        // Check known tables
        const knownTables = ['workspaces', 'workspace_members', 'projects', 'sources', 'tickets'];

        for (const tableName of knownTables) {
          console.log(`📊 Table: ${tableName}`);
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (error) {
            console.log(`   ❌ Error: ${error.message}`);
          } else {
            console.log(`   ✅ Exists (${count || 0} rows)`);

            // Get first row to see structure
            const { data: sampleData } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);

            if (sampleData && sampleData[0]) {
              console.log(`   📝 Columns:`, Object.keys(sampleData[0]).join(', '));
            }
          }
          console.log('');
        }
      }
    }

    console.log('\n✅ Database structure check complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDBStructure();
