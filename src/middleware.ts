import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL || 'valeriaassessoria1@gmail.com';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rotas sempre liberadas
    if (pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/auth')) {
        return NextResponse.next();
    }

    // Verificar cookie simples de sessão
    const session = request.cookies.get('aps_session')?.value;
    const email = session ? decodeURIComponent(session) : '';

    if (!email || email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
