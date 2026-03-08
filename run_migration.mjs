import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function migrate() {
    // Use RPC to run raw SQL via Supabase
    const sql = `
        ALTER TABLE children ADD COLUMN IF NOT EXISTS autocuidado TEXT;
        ALTER TABLE children ADD COLUMN IF NOT EXISTS medications TEXT;
        ALTER TABLE chronic_patients ADD COLUMN IF NOT EXISTS autocuidado TEXT;
    `;

    const { error } = await supabase.rpc('exec_sql', { sql_text: sql });
    if (error) {
        console.log('RPC exec_sql not available, trying direct REST...');
        console.log('Error:', error.message);

        // Fallback: Try adding columns one-by-one by attempting to update
        // If the column doesn't exist, it will error
        // Let's just try to select each column to confirm status

        for (const [table, col] of [['children', 'autocuidado'], ['children', 'medications'], ['chronic_patients', 'autocuidado']]) {
            const { error: checkErr } = await supabase.from(table).select(col).limit(1);
            if (checkErr) {
                console.log(`❌ ${table}.${col}: STILL MISSING - ${checkErr.message}`);
            } else {
                console.log(`✅ ${table}.${col}: EXISTS`);
            }
        }

        console.log('\n⚠️  The RPC method is not available.');
        console.log('You need to run the following SQL in Supabase SQL Editor:');
        console.log('---');
        console.log(sql);
        console.log('---');
    } else {
        console.log('✅ Migration completed successfully!');
    }
}
migrate();
