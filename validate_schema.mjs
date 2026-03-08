import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

async function introspect() {
    console.log("--- SCHEMA VALIDATION ---");
    try {
        // Query pregnant_women columns
        const res = await fetch(`${url}/rest/v1/pregnant_women?limit=1`, {
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
        });
        const data = await res.json();
        const pwCols = data.length > 0 ? Object.keys(data[0]) : [];
        console.log("pregnant_women tem 'observations'?", pwCols.includes('observations'));
        console.log("pregnant_women colunas:", pwCols.join(', '));

        // Query patient_checklists columns
        const clRes = await fetch(`${url}/rest/v1/patient_checklists?limit=1`, {
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
        });
        const clData = await clRes.json();
        console.log("patient_checklists existe e responde array?", Array.isArray(clData));
        if (Array.isArray(clData) && clData.length > 0) {
            console.log("Checklist colunas:", Object.keys(clData[0]).join(', '));
        }

    } catch (e) {
        console.error("Erro na validacao:", e);
    }
}
introspect();
