import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function inspect() {
    const tables = ['children', 'chronic_patients', 'pregnant_women', 'patients'];
    for (const t of tables) {
        const { data, error, count } = await supabase.from(t).select('*', { count: 'exact' }).limit(1);
        const cols = data?.[0] ? Object.keys(data[0]) : [];
        console.log(`\n=== ${t} (${count} rows) ===`);
        console.log(`Columns: ${cols.join(', ')}`);

        // Check specific columns
        for (const col of ['observations', 'autocuidado', 'medications']) {
            const has = cols.includes(col);
            console.log(`  ${col}: ${has ? '✅ EXISTS' : '❌ MISSING'}`);
        }
    }
}
inspect();
