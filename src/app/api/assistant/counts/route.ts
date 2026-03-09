import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import modulesData from '@/data/modules.json';

export const dynamic = 'force-dynamic';

function svc() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const getPts = (slug: string) => (modulesData as any[]).find(m => m.slug === slug)?.patients?.length || 0;
        return NextResponse.json({
            pregnantTotal: getPts('gestante'),
            pregnantRisk: 1,
            pregnantHabitual: getPts('gestante') - 1,
            pregnantHighRisk: 1,
            pregnantBorn: 0,
            childrenTotal: getPts('crianca'),
            chronicTotal: getPts('cronicos'),
            hipertensos: getPts('cronicos'),
            diabeticos: 1,
            chronicRisk: 2,
            womenTotal: getPts('mulher'),
            elderlyTotal: getPts('idosos'),
        });
    }

    const supabase = svc();

    // Cada contagem usa a TABELA REAL onde os dados existem
    const [
        { count: pregnantTotal },
        { count: pregnantRisk },
        { count: pregnantHighRisk },
        { count: pregnantBorn },
        { count: childrenTotal },
        { count: chronicTotal },
        { count: hipertensos },
        { count: diabeticos },
        { count: chronicRisk },
        // Mulheres — 3 tabelas separadas (sem duplicação, pois são registros distintos)
        { count: womenPatients },
        { count: womenPregnant },
        // Idosos — 2 tabelas
        { count: elderlyPatients },
        { count: elderlyChronic },
    ] = await Promise.all([
        // Gestantes — tabela pregnant_women
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('is_pregnant', true),
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('is_pregnant', true).eq('risk_level', 'Risco'),
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('is_pregnant', true).eq('risk_level', 'Alto Risco'),
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }).eq('is_pregnant', false),
        // Crianças — tabela children
        supabase.from('children').select('*', { count: 'exact', head: true }),
        // Crônicos — tabela chronic_patients
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).ilike('condition', '%HAS%'),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).ilike('condition', '%DM%'),
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).neq('risk_level', 'Habitual'),
        // Mulheres — patients femininas
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('gender', 'Feminino'),
        // Mulheres — pregnant_women (todas são mulheres)
        supabase.from('pregnant_women').select('*', { count: 'exact', head: true }),
        // Idosos — patients com age >= 60
        supabase.from('patients').select('*', { count: 'exact', head: true }).gte('age', 60),
        // Idosos — chronic_patients com age >= 60
        supabase.from('chronic_patients').select('*', { count: 'exact', head: true }).gte('age', 60),
    ]);

    const womenTotal = (womenPatients ?? 0) + (womenPregnant ?? 0);
    const elderlyTotal = (elderlyPatients ?? 0) + (elderlyChronic ?? 0);

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
