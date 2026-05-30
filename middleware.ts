import { NextRequest, NextResponse } from 'next/server';

const ROTAS_PUBLICAS = [
  '/',
  '/login',
  '/api/v1/usuarios/cadastrar',
  '/api/v1/usuarios/login',
];

const ROTAS_ESTATICAS = [
  '/_next/',
  '/favicon.ico',
  '/images/',
  '/fonts/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ROTAS_ESTATICAS.some(rota => pathname.startsWith(rota))) {
    return NextResponse.next();
  }

  if (ROTAS_PUBLICAS.includes(pathname)) {
    return NextResponse.next();
  }

  const usuarioLogado = request.cookies.get('usuario_logado');

  if (!usuarioLogado) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Nao autenticado' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
