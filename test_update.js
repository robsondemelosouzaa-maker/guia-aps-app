import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSave() {
    let { data } = await supabase.from('pregnant_women').select('id, observations').limit(1).single();
    if (!data) return console.log("No data");

    console.log("Before:", data);

    const { error } = await supabase.from('pregnant_women').update({ observations: 'Test Observation ' + Date.now() }).eq('id', data.id);
    if (error) console.log("Update error", error);

    let result = await supabase.from('pregnant_women').select('id, observations').eq('id', data.id).single();
    console.log("After:", result.data);
}
testSave();
