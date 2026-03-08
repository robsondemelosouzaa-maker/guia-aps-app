import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function testQuery() {
    console.log("--- TESTANDO STRING 'false' NA SDK SUPABASE ---");
    let { data: d1, error: e1 } = await supabase.from('pregnant_women').select('id').eq('is_pregnant', 'false');
    console.log("String 'false':", d1?.length, e1);

    console.log("--- TESTANDO BOOLEAN false ---");
    let { data: d2, error: e2 } = await supabase.from('pregnant_women').select('id').eq('is_pregnant', false);
    console.log("Boolean false:", d2?.length, e2);
}
testQuery();
