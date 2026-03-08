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
    // ── FALLBACK LOCAL se não houver Supabase ──
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const getPts = (slug: string) => (modulesData as any[]).find(m => m.slug === slug)?.patients?.length || 0;
        return NextResponse.json({
            pregnantTotal: getPts('gestante'),
            pregnantRisk: 1,
            pregnantHabitual: getPts('gestante') - 1,
            pregnantHighRisk: 1,
            puerpTotal: 0,
            childrenTotal: getPts('crianca'),
            chronicTotal: getPts('cronicos'),
            hipertensos: getPts('cronicos'),
            diabeticos: 1,
            chronicRisk: 2,
            womenTotal: getPts('mulher'),
            elderlyTotal: getPts('idosos'),
            totalUnique: 0,
        });
    }

    const supabase = svc();

    // Todas as contagens agora são da tabela ÚNICA `patients`
    // — Isso elimina a duplicidade de cadastros nos totais!
    const [
        { count: pregnantTotal },
        { count: pregnantRisk },
        { count: pregnantHighRisk },
        { count: puerpTotal },
        { count: childrenTotal },
        { count: chronicTotal },
        { count: hipertensos },
        { count: diabeticos },
        { count: chronicRisk },
        { count: womenTotal },
        { count: elderlyTotal },
        { count: totalUnique },
    ] = await Promise.all([
        // Gestantes
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_pregnant', true),
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_pregnant', true).eq('risk_level', 'Risco'),
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_pregnant', true).eq('risk_level', 'Alto Risco'),
        // Puerpério
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_puerperio', true),
        // Crianças
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_child', true),
        // Crônicos
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_chronic', true),
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_chronic', true).ilike('condition', '%HAS%'),
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_chronic', true).ilike('condition', '%DM%'),
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_chronic', true).neq('risk_level', 'Habitual'),
        // Saúde da Mulher — inclui gestantes e puérperas automaticamente (mesma linha, sem duplicar)
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('gender', 'Feminino'),
        // Idosos (age >= 60)
        supabase.from('patients').select('*', { count: 'exact', head: true }).gte('age', 60),
        // Total único de pacientes no sistema
        supabase.from('patients').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
        pregnantTotal: pregnantTotal ?? 0,
        pregnantRisk: (pregnantRisk ?? 0) + (pregnantHighRisk ?? 0),
        pregnantHabitual: (pregnantTotal ?? 0) - (pregnantRisk ?? 0) - (pregnantHighRisk ?? 0),
        pregnantHighRisk: pregnantHighRisk ?? 0,
        puerpTotal: puerpTotal ?? 0,
        childrenTotal: childrenTotal ?? 0,
        chronicTotal: chronicTotal ?? 0,
        hipertensos: hipertensos ?? 0,
        diabeticos: diabeticos ?? 0,
        chronicRisk: chronicRisk ?? 0,
        womenTotal: womenTotal ?? 0,
        elderlyTotal: elderlyTotal ?? 0,
        totalUnique: totalUnique ?? 0,
    });
}
