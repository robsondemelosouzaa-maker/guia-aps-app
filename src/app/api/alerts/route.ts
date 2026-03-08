import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function svc() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

/**
 * GET /api/alerts
 * Retorna pacientes com alerta preenchido (de todas as tabelas reais).
 * Evita duplicação: cada tabela é consultada separadamente e vem com `source`.
 */
export async function GET() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ alerts: [], total: 0 });
    }

    const supabase = svc();
    const tables = [
        { table: 'patients', label: 'Geral', nameField: 'name' },
        { table: 'pregnant_women', label: 'Gestante', nameField: 'name' },
        { table: 'children', label: 'Criança', nameField: 'name' },
        { table: 'chronic_patients', label: 'Crônico', nameField: 'name' },
    ];

    const all: { id: string; name: string; alert: string; source: string }[] = [];

    for (const t of tables) {
        const { data } = await supabase
            .from(t.table)
            .select('id, name, alert')
            .not('alert', 'is', null)
            .neq('alert', '');

        if (data) {
            for (const row of data) {
                all.push({
                    id: row.id,
                    name: row.name ?? 'Paciente',
                    alert: row.alert ?? '',
                    source: t.label,
                });
            }
        }
    }

    return NextResponse.json({ alerts: all, total: all.length });
}
