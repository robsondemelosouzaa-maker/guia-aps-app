import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function inspect() {
    const tables = ['children', 'chronic_patients', 'pregnant_women', 'patients'];
    const result = {};
    for (const t of tables) {
        const { data, count } = await supabase.from(t).select('*', { count: 'exact' }).limit(1);
        const cols = data?.[0] ? Object.keys(data[0]) : [];
        result[t] = {
            count,
            columns: cols,
            has_observations: cols.includes('observations'),
            has_autocuidado: cols.includes('autocuidado'),
            has_medications: cols.includes('medications'),
        };
    }
    fs.writeFileSync('cols_report.json', JSON.stringify(result, null, 2));
    console.log('Done. See cols_report.json');
}
inspect();
