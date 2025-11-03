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
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getTableSchemas() {
  console.log('📋 Getting detailed table schemas from Supabase...\n');

  const tables = ['workspaces', 'workspace_members', 'projects', 'sources', 'tickets'];

  for (const tableName of tables) {
    console.log(`\n📊 TABLE: ${tableName.toUpperCase()}`);
    console.log('─'.repeat(60));

    // Try to insert and catch the error to see column names
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('Columns:', columns.join(', '));
      console.log('\nSample data:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      // Try to get columns from empty table
      const { data: emptyData, error: emptyError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);

      console.log('No data in table yet. Attempting to get schema...');

      // Try inserting empty object to get error with column names
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({})
        .select();

      if (insertError) {
        console.log('Error message (reveals structure):', insertError.message);
      }
    }
  }

  console.log('\n\n✅ Schema check complete!');
}

getTableSchemas();
