import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MODULES, type ModuleSlug } from '@/lib/db/schemaMap';

// Service client — bypassa RLS
function svc() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET /api/patients/[module]?search=&risk_level=&babyBorn=
export async function GET(
    _req: NextRequest,
    { params }: { params: { module: string } }
) {
    const moduleSlug = params.module as ModuleSlug;
    const config = MODULES[moduleSlug];
    if (!config) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 });

    const url = new URL(_req.url);
    const search = url.searchParams.get('search') ?? '';
    const risk = url.searchParams.get('risk_level') ?? '';
    const babyBorn = url.searchParams.get('babyBorn');

    const supabase = svc();
    let query = supabase
        .from(config.tableName)
        .select('*')
        .order(config.defaultOrder.column, { ascending: config.defaultOrder.ascending });

    // Filtros de módulo
    if (moduleSlug === 'idosos') {
        query = query.gte('age', 60);
    } else if (config.baseFilter) {
        for (const [k, v] of Object.entries(config.baseFilter)) {
            query = query.eq(k, String(v));
        }
    }

    // baby_born
    if (config.hasBabyBorn && babyBorn !== null) {
        query = query.eq('is_pregnant', babyBorn !== 'true');
    }

    if (risk) query = query.eq('risk_level', risk);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
}

// POST /api/patients/[module]
export async function POST(
    req: NextRequest,
    { params }: { params: { module: string } }
) {
    const moduleSlug = params.module as ModuleSlug;
    const config = MODULES[moduleSlug];
    if (!config) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 });

    const payload = await req.json();
    const supabase = svc();
    const { data, error } = await supabase
        .from(config.tableName)
        .insert(payload)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
