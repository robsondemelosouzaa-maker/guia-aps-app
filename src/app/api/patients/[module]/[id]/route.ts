import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MODULES, type ModuleSlug } from '@/lib/db/schemaMap';

function svc() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// PATCH /api/patients/[module]/[id]
export async function PATCH(
    req: NextRequest,
    { params }: { params: { module: string; id: string } }
) {
    const config = MODULES[params.module as ModuleSlug];
    if (!config) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 });

    const patch = await req.json();
    // Nunca atualizar campos técnicos
    delete patch.id; delete patch.user_id; delete patch.created_at;

    const supabase = svc();
    const { error } = await supabase
        .from(config.tableName)
        .update(patch)
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}

// DELETE /api/patients/[module]/[id]
export async function DELETE(
    _req: NextRequest,
    { params }: { params: { module: string; id: string } }
) {
    const config = MODULES[params.module as ModuleSlug];
    if (!config) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 });

    const supabase = svc();
    const { error } = await supabase
        .from(config.tableName)
        .delete()
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
