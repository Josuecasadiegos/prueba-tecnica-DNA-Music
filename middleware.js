// middleware.js
import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://tu-frontend.vercel.app',           // producción
  'http://localhost:3000',                     // desarrollo
  // agrega previews si usas vercel.preview → pero mejor usar dominio fijo
];

export function middleware(request) {
  const origin = request.headers.get('origin');
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);

  const response = NextResponse.next();

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    // Opcional: no setear nada o setear solo para OPTIONS
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};