import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

async function introspect() {
    try {
        const res = await fetch(`${url}/rest/v1/pregnant_women?limit=1`, {
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
        });
        const data = await res.json();
        console.log("Pregnant Women Columns:", data.length ? Object.keys(data[0]) : "Empty table");

        const clRes = await fetch(`${url}/rest/v1/patient_checklists?limit=1`, {
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
        });
        const clData = await clRes.json();
        console.log("Patient Checklists:", clData);
    } catch (e) {
        console.error(e);
    }
}
introspect();
