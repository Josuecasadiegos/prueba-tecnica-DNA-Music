// middleware.js  (en la raíz del backend)

import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Obtiene el origen del request (frontend local o deployado)
  const origin = request.headers.get('origin') || '*';

  // Headers CORS obligatorios
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Maneja preflight (OPTIONS) para CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

// Aplica solo a rutas API (evita afectar páginas estáticas si las tienes)
export const config = {
  matcher: '/api/:path*',
};