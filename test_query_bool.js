import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testQuery() {
    console.log("--- TESTANDO STRING 'false' ---");
    let { data: d1, error: e1 } = await supabase.from('pregnant_women').select('id, name').eq('is_pregnant', 'false');
    console.log("String false result:", d1?.length, "Error:", e1);

    console.log("--- TESTANDO BOOLEAN false ---");
    let { data: d2, error: e2 } = await supabase.from('pregnant_women').select('id, name').eq('is_pregnant', false);
    console.log("Boolean false result:", d2?.length, "Error:", e2);
}
testQuery();
