import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MODULES, type ModuleSlug } from '@/lib/db/schemaMap';
import modulesData from '@/data/modules.json';

export const dynamic = 'force-dynamic';

// Service client — bypassa RLS
function svc() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET /api/patients/[module]?search=&risk_level=
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

    // ── FALLBACK LOCAL (Modo Demonstração) se não houver Supabase configurado ──
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const mod = (modulesData as any[]).find(m => m.slug === moduleSlug);
        let pts = mod?.patients || [];
        if (search) pts = pts.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
        return NextResponse.json(pts);
    }

    const supabase = svc();
    // TODOS os módulos agora consultam a tabela `patients`
    let query = supabase
        .from(config.tableName)  // sempre 'patients'
        .select('*')
        .order(config.defaultOrder.column, { ascending: config.defaultOrder.ascending });

    // Aplica filtros do módulo (baseFilter)
    if (moduleSlug === 'idosos') {
        // Idosos: age >= 60 — usa filtro especial (não vai em baseFilter)
        query = query.gte('age', 60);
    } else if (config.baseFilter) {
        for (const [k, v] of Object.entries(config.baseFilter)) {
            // Passamos o valor nativo (boolean, string) — sem converter para String()
            query = (query as any).eq(k, v);
        }
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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ ...payload, id: 'virtual-' + Date.now() }, { status: 201 });
    }

    const supabase = svc();
    const { data, error } = await supabase
        .from(config.tableName)  // sempre 'patients'
        .insert(payload)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
