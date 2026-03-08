const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
    let { data, error } = await supabase.from('pregnant_women').select('*').limit(1).single();
    if (error) { console.error("Error fetching pregnant_women:", error); return; }

    console.log("Checklist Upsert...");
    const res = await supabase.from('patient_checklists').upsert({
        patient_id: data.id,
        patient_table: 'pregnant_women',
        period_key: 'mes_1',
        item_key: 'tipagem',
        item_label: 'Tipagem',
        checked: true,
        checked_at: new Date().toISOString(),
    }, { onConflict: 'patient_id,patient_table,period_key,item_key' });
    console.log('Checklist Upsert Result:', res.error ? res.error.message : 'OK');

    console.log("Observation Update...");
    const obsRes = await supabase.from('pregnant_women').update({
        observations: 'Test'
    }).eq('id', data.id);
    console.log('Observation Update Result:', obsRes.error ? obsRes.error.message : 'OK');
}
test();
