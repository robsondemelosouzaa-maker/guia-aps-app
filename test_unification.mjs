import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function inspect() {
    // Pegar uma linha de cada tabela para ver as colunas
    const tables = ['patients', 'pregnant_women', 'children', 'chronic_patients'];
    for (const t of tables) {
        console.log(`\n--- TABELA: ${t} ---`);
        let { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) console.log("Erro:", error.message);
        else if (data && data.length > 0) {
            console.log("Colunas:", Object.keys(data[0]).join(', '));
            console.log("Exemplo de linha:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("Tabela vazia.");
        }
    }
}
inspect();
