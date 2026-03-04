import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createServiceClient();

    const [
        { count: pregnantTotal, error: e1 },
        { count: pregnantRisk, error: e2 },
        { count: pregnantHighRisk, error: e3 },
        { count: pregnantBorn, error: e4 },
        { count: childrenTotal, error: e5 },
        { count: chronicTotal, error: e6 },
        { count: hipertensos, error: e7 },
        { count: diabeticos, error: e8 },
        { count: chronicRisk, error: e9 },
        { count: womenTotal, error: e10 },
        { count: elderlyTotal, error: e11 },
    ] = await Promise.all([
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }),
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('risk_level', 'Risco'),
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('risk_level', 'Alto Risco'),
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('is_pregnant', false),
        supabase.from('children').select('*', { count: 'exact', head: true }),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).ilike('condition', '%HAS%'),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).ilike('condition', '%DM%'),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).neq('risk_level', 'Habitual'),
        // Novas tabelas:
        supabase.from('womens_health').select('*', { count: 'exact', head: true }),
        supabase.from('elderly').select('*', { count: 'exact', head: true }),
    ]);

    const anyError = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11].find(Boolean);
    if (anyError) {
        return NextResponse.json({ error: anyError.message }, { status: 500 });
    }

    return NextResponse.json({
        pregnantTotal: pregnantTotal ?? 0,
        pregnantRisk: (pregnantRisk ?? 0) + (pregnantHighRisk ?? 0),
        pregnantHabitual: (pregnantTotal ?? 0) - (pregnantRisk ?? 0) - (pregnantHighRisk ?? 0),
        pregnantHighRisk: pregnantHighRisk ?? 0,
        pregnantBorn: pregnantBorn ?? 0,
        childrenTotal: childrenTotal ?? 0,
        chronicTotal: chronicTotal ?? 0,
        hipertensos: hipertensos ?? 0,
        diabeticos: diabeticos ?? 0,
        chronicRisk: chronicRisk ?? 0,
        womenTotal: womenTotal ?? 0,
        elderlyTotal: elderlyTotal ?? 0,
    });
}
