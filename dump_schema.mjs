import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function dump() {
    const tables = ['patients', 'pregnant_women', 'children', 'chronic_patients'];
    const result = {};
    for (const t of tables) {
        let { data } = await supabase.from(t).select('*').limit(1);
        if (data && data.length > 0) {
            result[t] = Object.keys(data[0]);
            result[t + "_data"] = data[0];
        } else {
            result[t] = "EMPTY";
        }
    }
    fs.writeFileSync('schema_dump.json', JSON.stringify(result, null, 2));
}
dump();
