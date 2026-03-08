import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function fullInspect() {
    const tables = ['patients', 'pregnant_women', 'children', 'chronic_patients', 'patient_checklists'];
    const report = {};

    for (const t of tables) {
        console.log(`\n========== ${t} ==========`);
        const { data, error, count } = await supabase.from(t).select('*', { count: 'exact' }).limit(1);
        if (error) {
            console.log(`  ERROR: ${error.message}`);
            report[t] = { error: error.message };
            continue;
        }
        const cols = data && data.length > 0 ? Object.keys(data[0]) : [];
        console.log(`  Rows: ${count}`);
        console.log(`  Columns: ${cols.join(', ')}`);
        report[t] = { count, columns: cols };
    }

    // Check if is_puerperio exists in pregnant_women
    console.log('\n========== COLUMN CHECK ==========');
    const { data: pw, error: pwErr } = await supabase.from('pregnant_women').select('is_pregnant').limit(1);
    console.log('pregnant_women.is_pregnant:', pwErr ? `ERROR: ${pwErr.message}` : 'EXISTS');

    const { data: puerp, error: puerpErr } = await supabase.from('pregnant_women').select('is_puerperio').limit(1);
    console.log('pregnant_women.is_puerperio:', puerpErr ? `ERROR: ${puerpErr.message}` : 'EXISTS');

    const { data: patPuerp, error: patPuerpErr } = await supabase.from('patients').select('is_puerperio').limit(1);
    console.log('patients.is_puerperio:', patPuerpErr ? `ERROR: ${patPuerpErr.message}` : 'EXISTS');

    const { data: patObs, error: patObsErr } = await supabase.from('patients').select('observations').limit(1);
    console.log('patients.observations:', patObsErr ? `ERROR: ${patObsErr.message}` : 'EXISTS');

    const { data: childObs, error: childObsErr } = await supabase.from('children').select('observations').limit(1);
    console.log('children.observations:', childObsErr ? `ERROR: ${childObsErr.message}` : 'EXISTS');

    const { data: chronObs, error: chronObsErr } = await supabase.from('chronic_patients').select('observations').limit(1);
    console.log('chronic_patients.observations:', chronObsErr ? `ERROR: ${chronObsErr.message}` : 'EXISTS');

    const { data: childAuto, error: childAutoErr } = await supabase.from('children').select('autocuidado').limit(1);
    console.log('children.autocuidado:', childAutoErr ? `ERROR: ${childAutoErr.message}` : 'EXISTS');

    const { data: chronAuto, error: chronAutoErr } = await supabase.from('chronic_patients').select('autocuidado').limit(1);
    console.log('chronic_patients.autocuidado:', chronAutoErr ? `ERROR: ${chronAutoErr.message}` : 'EXISTS');

    fs.writeFileSync('schema_report.json', JSON.stringify(report, null, 2));
    console.log('\nReport saved to schema_report.json');
}
fullInspect();
