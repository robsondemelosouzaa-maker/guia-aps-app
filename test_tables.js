const { createClient } = require('@supabase/supabase-js');

const url = 'https://qedzzyzbaeuedvwuticd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZHp6eXpiYWV1ZWR2d3V0aWNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NDAzNiwiZXhwIjoyMDg2ODUwMDM2fQ.eZxUqPRsne4iKo_unBx1idctguggXXoiYIAp8qiPVlU';

// REST endpoint to get tables
async function listTables() {
    try {
        const res = await fetch(`${url}/rest/v1/`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
listTables();
