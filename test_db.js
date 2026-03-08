const { createClient } = require('@supabase/supabase-js');

const url = 'https://qedzzyzbaeuedvwuticd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZHp6eXpiYWV1ZWR2d3V0aWNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI3NDAzNiwiZXhwIjoyMDg2ODUwMDM2fQ.eZxUqPRsne4iKo_unBx1idctguggXXoiYIAp8qiPVlU';
const supabase = createClient(url, key);

async function test() {
    const { data, error } = await supabase.from('pregnant_women').select('*').limit(5);
    if (error) {
        console.error('Erro ao consultar Supabase:', error);
    } else {
        console.log('Resultados de gestantes:', data);
    }
}
test();
