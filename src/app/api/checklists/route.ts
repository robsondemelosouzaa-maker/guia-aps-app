import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function svc() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET /api/checklists?patientId=&patientTable=&periodKey=
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const patientId = url.searchParams.get('patientId') ?? '';
    const patientTable = url.searchParams.get('patientTable') ?? '';
    const periodKey = url.searchParams.get('periodKey') ?? '';

    if (!patientId || !patientTable) {
        return NextResponse.json({ error: 'patientId e patientTable são obrigatórios' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json([]); // Fallback local
    }

    const supabase = svc();
    let query = supabase
        .from('patient_checklists')
        .select('*')
        .eq('patient_id', patientId)
        .eq('patient_table', patientTable);

    if (periodKey) query = query.eq('period_key', periodKey);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
}

// POST /api/checklists
export async function POST(req: NextRequest) {
    const item = await req.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ ok: true, demo: true }); // Fallback local
    }

    const supabase = svc();
    const { error } = await supabase
        .from('patient_checklists')
        .upsert({
            patient_id: item.patient_id,
            patient_table: item.patient_table,
            period_key: item.period_key,
            item_key: item.item_key,
            item_label: item.item_label,
            checked: item.checked,
            checked_at: item.checked ? new Date().toISOString() : null,
        }, { onConflict: 'patient_id,patient_table,period_key,item_key' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
