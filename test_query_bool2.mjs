import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

async function testQuery() {
    console.log("--- TESTANDO STRING 'false' ---");
    let res1 = await fetch(`${url}/rest/v1/pregnant_women?is_pregnant=eq.false&select=id`, { headers: { apikey: key, Authorization: 'Bearer ' + key } });
    let data1 = await res1.json();
    console.log("String false result:", data1?.length || data1);

    console.log("--- TESTANDO BOOLEAN false (mas na API rest tudo vira URL param, o problema é a SDK) ---");
    // let's do with true
    let res2 = await fetch(`${url}/rest/v1/pregnant_women?is_pregnant=eq.true&select=id`, { headers: { apikey: key, Authorization: 'Bearer ' + key } });
    let data2 = await res2.json();
    console.log("True result:", data2?.length || data2);
}
testQuery();
